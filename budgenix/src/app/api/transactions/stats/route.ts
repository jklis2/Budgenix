import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../../lib/jwt';

const prisma = new PrismaClient();

// Interfejs dla filtrów transakcji
interface TransactionFilters {
  userId: string;
  categoryId?: string;
  accountId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
}

// GET /api/transactions/stats - Pobieranie statystyk transakcji
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja tokenu JWT
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 });
    }

    const userId = payload.id;

    // Parametry filtrowania
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || 'month'; // day, week, month, year
    const categoryId = searchParams.get('categoryId');
    const accountId = searchParams.get('accountId');

    // Budowanie filtrów
    const filters: TransactionFilters = {
      userId
    };

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (accountId) {
      filters.accountId = accountId;
    }

    if (startDate && endDate) {
      filters.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      filters.date = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      filters.date = {
        lte: new Date(endDate)
      };
    } else {
      // Domyślnie ostatnie 30 dni
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() - 30);
      
      filters.date = {
        gte: defaultStartDate
      };
    }

    // 1. Statystyki ogólne
    const totalStats = await prisma.$transaction([
      // Całkowity przychód
      prisma.transaction.aggregate({
        where: {
          ...filters,
          category: {
            isIncome: true
          }
        },
        _sum: {
          amount: true
        },
        _count: true
      }),
      // Całkowity wydatek
      prisma.transaction.aggregate({
        where: {
          ...filters,
          category: {
            isIncome: false
          }
        },
        _sum: {
          amount: true
        },
        _count: true
      }),
      // Najwyższa transakcja (przychód)
      prisma.transaction.findFirst({
        where: {
          ...filters,
          category: {
            isIncome: true
          }
        },
        orderBy: {
          amount: 'desc'
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              color: true
            }
          }
        }
      }),
      // Najwyższa transakcja (wydatek)
      prisma.transaction.findFirst({
        where: {
          ...filters,
          category: {
            isIncome: false
          }
        },
        orderBy: {
          amount: 'desc'
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              color: true
            }
          }
        }
      }),
      // Ostatnia transakcja
      prisma.transaction.findFirst({
        where: filters,
        orderBy: {
          date: 'desc'
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              color: true,
              isIncome: true
            }
          }
        }
      })
    ]);

    // 2. Statystyki według kategorii
    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: filters,
      _sum: {
        amount: true
      },
      _count: true
    });

    // Pobieranie informacji o kategoriach
    const categoryIds = categoryStats.map(stat => stat.categoryId);
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        isIncome: true
      }
    });

    // Łączenie statystyk z informacjami o kategoriach
    const categoryStatsWithInfo = categoryStats.map(stat => {
      const category = categories.find(c => c.id === stat.categoryId);
      // POPRAWKA: Używamy Math.abs() dla wydatków aby zapewnić spójność
      const amount = stat._sum.amount || 0;
      const totalAmount = category?.isIncome === false ? Math.abs(amount) : amount;
      
      return {
        categoryId: stat.categoryId,
        name: category?.name,
        icon: category?.icon,
        color: category?.color,
        isIncome: category?.isIncome,
        totalAmount: totalAmount,
        count: stat._count
      };
    });

    // 3. Statystyki według czasu (trend)
    let dateFormat;

    switch (period) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-W%W';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      case 'month':
      default:
        dateFormat = '%Y-%m';
        break;
    }

    // Niestety, Prisma nie obsługuje bezpośrednio zaawansowanych agregacji według dat
    // Dlatego używamy surowego SQL dla tej części
    const rawQuery = `
      SELECT 
        FORMAT(date, '${dateFormat}') as timePeriod,
        SUM(CASE WHEN c.isIncome = 1 THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN c.isIncome = 0 THEN amount ELSE 0 END) as expense,
        COUNT(*) as count
      FROM [Transaction] t
      JOIN [Category] c ON t.categoryId = c.id
      WHERE t.userId = '${userId}'
        ${startDate ? `AND t.date >= '${startDate}'` : ''}
        ${endDate ? `AND t.date <= '${endDate}'` : ''}
        ${categoryId ? `AND t.categoryId = '${categoryId}'` : ''}
        ${accountId ? `AND t.accountId = '${accountId}'` : ''}
      GROUP BY FORMAT(date, '${dateFormat}')
      ORDER BY timePeriod
    `;

    const timeStats = await prisma.$queryRawUnsafe(rawQuery);

    // POPRAWKA: Używamy Math.abs() dla wydatków aby zapewnić spójność
    const totalIncome = totalStats[0]._sum.amount || 0;
    const totalExpenseRaw = totalStats[1]._sum.amount || 0;
    const totalExpense = Math.abs(totalExpenseRaw);
    
    return NextResponse.json({
      overview: {
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        balance: totalIncome - totalExpense,
        incomeCount: totalStats[0]._count,
        expenseCount: totalStats[1]._count,
        highestIncome: totalStats[2],
        highestExpense: totalStats[3],
        lastTransaction: totalStats[4]
      },
      categoryStats: categoryStatsWithInfo,
      timeStats
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas pobierania statystyk transakcji' }, { status: 500 });
  }
}
