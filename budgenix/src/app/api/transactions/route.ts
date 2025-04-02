import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/jwt';

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
  title?: {
    contains: string;
    mode: 'insensitive';
  };
  category?: {
    isIncome: boolean;
  };
}

// GET /api/transactions - Pobieranie wszystkich transakcji użytkownika
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

    // Parametry filtrowania i sortowania
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const accountId = searchParams.get('accountId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const isIncome = searchParams.get('isIncome');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

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
    }

    if (search) {
      filters.title = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (isIncome !== null) {
      filters.category = {
        isIncome: isIncome === 'true'
      };
    }

    // Pobieranie transakcji z bazy danych
    const transactions = await prisma.transaction.findMany({
      where: filters,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            isIncome: true
          }
        },
        account: {
          select: {
            id: true,
            name: true,
            accountType: true,
            currency: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: offset,
      take: limit
    });

    // Pobieranie całkowitej liczby transakcji (dla paginacji)
    const totalCount = await prisma.transaction.count({
      where: filters
    });

    // Obliczanie sum
    const totalIncome = await prisma.transaction.aggregate({
      where: {
        ...filters,
        category: {
          isIncome: true
        }
      },
      _sum: {
        amount: true
      }
    });

    const totalExpense = await prisma.transaction.aggregate({
      where: {
        ...filters,
        category: {
          isIncome: false
        }
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      transactions,
      totalCount,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0,
      balance: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0)
    });
  } catch (error) {
    console.error('Błąd podczas pobierania transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas pobierania transakcji' }, { status: 500 });
  }
}

// POST /api/transactions - Tworzenie nowej transakcji
export async function POST(request: NextRequest) {
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
    const data = await request.json();

    // Walidacja danych
    if (!data.title || data.amount === undefined || !data.date || !data.categoryId || !data.accountId || !data.paymentMethod) {
      return NextResponse.json({ error: 'Brakujące wymagane pola' }, { status: 400 });
    }

    // Sprawdzenie, czy kategoria istnieje i należy do użytkownika
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId
      }
    });

    if (!category) {
      return NextResponse.json({ error: 'Kategoria nie istnieje lub nie należy do użytkownika' }, { status: 404 });
    }

    // Sprawdzenie, czy konto istnieje i należy do użytkownika
    const account = await prisma.account.findFirst({
      where: {
        id: data.accountId,
        userId
      }
    });

    if (!account) {
      return NextResponse.json({ error: 'Konto nie istnieje lub nie należy do użytkownika' }, { status: 404 });
    }

    // Tworzenie transakcji
    const transaction = await prisma.transaction.create({
      data: {
        title: data.title,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        notes: data.notes || null,
        paymentMethod: data.paymentMethod,
        isRecurring: data.isRecurring || false,
        categoryId: data.categoryId,
        accountId: data.accountId,
        userId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            isIncome: true
          }
        },
        account: {
          select: {
            id: true,
            name: true,
            accountType: true,
            currency: true
          }
        }
      }
    });

    // Aktualizacja salda konta
    const amountChange = category.isIncome ? transaction.amount : -transaction.amount;
    await prisma.account.update({
      where: {
        id: data.accountId
      },
      data: {
        balance: {
          increment: amountChange
        }
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas tworzenia transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas tworzenia transakcji' }, { status: 500 });
  }
}
