import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../../lib/jwt';

const prisma = new PrismaClient();

// Interfejs dla danych aktualizacji transakcji
interface TransactionUpdateData {
  title?: string;
  amount?: number;
  date?: Date;
  notes?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  categoryId?: string;
  accountId?: string;
}

// GET /api/transactions/[id] - Pobieranie pojedynczej transakcji
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Pobieranie transakcji z bazy danych
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
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

    if (!transaction) {
      return NextResponse.json({ error: 'Transakcja nie istnieje lub nie należy do użytkownika' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Błąd podczas pobierania transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas pobierania transakcji' }, { status: 500 });
  }
}

// PUT /api/transactions/[id] - Aktualizacja transakcji
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Sprawdzenie, czy transakcja istnieje i należy do użytkownika
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId
      },
      include: {
        category: true
      }
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transakcja nie istnieje lub nie należy do użytkownika' }, { status: 404 });
    }

    // Walidacja danych
    if (data.categoryId) {
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
    }

    if (data.accountId) {
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
    }

    // Przygotowanie danych do aktualizacji
    const updateData: TransactionUpdateData = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
    if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.accountId !== undefined) updateData.accountId = data.accountId;

    // Aktualizacja transakcji
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id
      },
      data: updateData,
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

    // Aktualizacja salda konta, jeśli zmieniła się kwota, kategoria (dochód/wydatek) lub konto
    if (
      data.amount !== undefined || 
      data.categoryId !== undefined || 
      data.accountId !== undefined
    ) {
      // Cofnięcie poprzedniej transakcji
      const oldAmountChange = existingTransaction.category.isIncome 
        ? -existingTransaction.amount 
        : existingTransaction.amount;
      
      await prisma.account.update({
        where: {
          id: existingTransaction.accountId
        },
        data: {
          balance: {
            increment: oldAmountChange
          }
        }
      });

      // Dodanie nowej transakcji
      let newCategory = existingTransaction.category;
      if (data.categoryId) {
        const categoryResult = await prisma.category.findUnique({ 
          where: { id: data.categoryId } 
        });
        if (categoryResult) {
          newCategory = categoryResult;
        }
      }
      
      const newAmount = data.amount !== undefined 
        ? parseFloat(data.amount) 
        : existingTransaction.amount;
      
      const newAmountChange = newCategory.isIncome ? newAmount : -newAmount;
      
      await prisma.account.update({
        where: {
          id: data.accountId || existingTransaction.accountId
        },
        data: {
          balance: {
            increment: newAmountChange
          }
        }
      });
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Błąd podczas aktualizacji transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas aktualizacji transakcji' }, { status: 500 });
  }
}

// DELETE /api/transactions/[id] - Usuwanie transakcji
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Sprawdzenie, czy transakcja istnieje i należy do użytkownika
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId
      },
      include: {
        category: true
      }
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transakcja nie istnieje lub nie należy do użytkownika' }, { status: 404 });
    }

    // Usuwanie transakcji
    await prisma.transaction.delete({
      where: {
        id
      }
    });

    // Aktualizacja salda konta
    const amountChange = transaction.category.isIncome ? -transaction.amount : transaction.amount;
    await prisma.account.update({
      where: {
        id: transaction.accountId
      },
      data: {
        balance: {
          increment: amountChange
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas usuwania transakcji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas usuwania transakcji' }, { status: 500 });
  }
}
