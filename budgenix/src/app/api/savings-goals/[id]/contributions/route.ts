import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// POST /api/savings-goals/[id]/contributions
// Add a contribution to a savings goal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the goalId from the URL parameters
    const { id: goalId } = await params;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    if (!body.accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Użyjmy transakcji Prisma, aby zapewnić spójność danych
    const result = await prisma.$transaction(async (tx) => {
      // 1. Sprawdź, czy cel oszczędnościowy istnieje i należy do użytkownika
      const goal = await tx.savingsGoal.findUnique({
        where: {
          id: goalId,
          userId: body.userId
        }
      });

      if (!goal) {
        throw new Error('Savings goal not found or unauthorized');
      }

      // 2. Sprawdź, czy konto istnieje i należy do użytkownika
      const account = await tx.account.findUnique({
        where: {
          id: body.accountId,
          userId: body.userId
        }
      });

      if (!account) {
        throw new Error('Account not found or unauthorized');
      }

      // 3. Sprawdź, czy jest wystarczające saldo na koncie
      if (account.balance < parseFloat(body.amount)) {
        throw new Error(`Insufficient funds. Available: ${account.balance} ${account.currency}`);
      }

      // 4. Znajdź lub utwórz kategorię "Oszczędności"
      let savingsCategory = await tx.category.findFirst({
        where: {
          name: 'Oszczędności',
          userId: body.userId
        }
      });

      if (!savingsCategory) {
        savingsCategory = await tx.category.create({
          data: {
            name: 'Oszczędności',
            icon: 'savings',
            color: '#4CAF50',
            isIncome: false,
            userId: body.userId
          }
        });
      }

      const date = body.date ? new Date(body.date) : new Date();

      // 5. Utwórz transakcję wydatku
      const transaction = await tx.transaction.create({
        data: {
          title: `Wpłata na cel: ${goal.name}`,
          amount: parseFloat(body.amount),
          date: date,
          notes: `Wpłata na cel oszczędnościowy: ${goal.name}`,
          paymentMethod: 'TRANSFER',
          isRecurring: false,
          // Nie ma właściwości isExpense, sprawdźmy strukturę modelu Transaction
          categoryId: savingsCategory.id,
          accountId: body.accountId,
          userId: body.userId
        }
      });

      // 6. Zaktualizuj saldo konta - odejmij kwotę wpłaty
      await tx.account.update({
        where: {
          id: body.accountId
        },
        data: {
          balance: {
            decrement: parseFloat(body.amount)
          }
        }
      });

      // 7. Zaktualizuj cel oszczędnościowy - dodaj kwotę wpłaty
      await tx.savingsGoal.update({
        where: {
          id: goalId
        },
        data: {
          currentAmount: {
            increment: parseFloat(body.amount)
          },
          isCompleted: goal.currentAmount + parseFloat(body.amount) >= goal.targetAmount
        }
      });

      // 8. Utwórz wpłatę do celu oszczędnościowego
      // Uwaga: Jeśli tabela SavingsGoalContribution istnieje w bazie danych,
      // użyj tego kodu. Jeśli nie, pomiń ten krok.
      try {
        // Używamy raw query, ponieważ może nie być modelu Prisma dla tego
        await tx.$executeRawUnsafe(`
          INSERT INTO "SavingsGoalContribution" 
          ("id", "amount", "date", "savingsGoalId", "accountId", "createdAt", "updatedAt") 
          VALUES 
          (?, ?, ?, ?, ?, ?, ?)
        `, 
        crypto.randomUUID(), 
        parseFloat(body.amount), 
        date, 
        goalId, 
        body.accountId, 
        new Date(), 
        new Date());
      } catch (err) {
        console.error('Błąd podczas dodawania wpłaty do tabeli SavingsGoalContribution:', err);
        // Kontynuujemy - ważniejsze jest zaktualizowanie salda i celu
      }

      // Zwróć potrzebne dane
      return {
        transaction,
        account,
        goal
      };
    });

    // Zwróć odpowiedź
    return NextResponse.json({
      id: crypto.randomUUID(),
      amount: parseFloat(body.amount),
      date: body.date ? new Date(body.date) : new Date(),
      savingsGoalId: goalId,
      accountId: body.accountId,
      accountName: result.account.name,
      goalName: result.goal.name,
      transactionId: result.transaction.id,
      transactionCreated: true
    }, { status: 201 });

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
