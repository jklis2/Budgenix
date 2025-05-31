import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token and get user ID
const getUserIdFromToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid authorization header found");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
    console.log("Token decoded successfully, user ID:", decoded.id, "email:", decoded.email);
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

// Definicja interfejsu dla konta
interface AccountData {
  id: string;
  name: string;
  balance: number;
  accountType: string;
  currency: string;
  isDefault: boolean;
  userId: string;
}

// Funkcja do pobierania ID konta dla subskrypcji
async function getAccountIdForSubscription(subscriptionId: string, accounts: AccountData[]): Promise<string | null> {
  try {
    // Pobierz metadane subskrypcji z bazy danych lub innego źródła
    // W tym przypadku możemy użyć domyślnego konta lub pierwszego dostępnego konta
    const defaultAccount = accounts.find(acc => acc.isDefault) || accounts[0];
    return defaultAccount?.id || null;
  } catch (error) {
    console.error(`Error getting account ID for subscription ${subscriptionId}:`, error);
    return null;
  }
}

// Funkcja do obliczania następnej daty płatności na podstawie cyklu
const calculateNextPaymentDate = (currentDate: Date, cycle: string): Date => {
  const nextDate = new Date(currentDate);
  
  switch (cycle) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1); // domyślnie miesięcznie
  }
  
  return nextDate;
};

// POST - Przetwarzanie płatności subskrypcji
export async function POST(request: NextRequest) {
  try {
    const userInfo = getUserIdFromToken(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Processing subscription payments for user ID:", userInfo.id);

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { id: userInfo.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    // Pobierz dzisiejszą datę i ustaw czas na początek dnia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Pobierz jutrzejszą datę (koniec zakresu)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Znajdź wszystkie aktywne subskrypcje, których data płatności przypada na dzisiaj
    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        nextBillingDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        category: true
      }
    });
    
    // Pobierz wszystkie konta użytkownika
    const userAccounts = await prisma.account.findMany({
      where: {
        userId: user.id
      }
    });

    console.log(`Found ${dueSubscriptions.length} subscriptions due today`);

    const processedPayments = [];
    const errors = [];

    // Przetwórz każdą subskrypcję
    for (const subscription of dueSubscriptions) {
      try {
        // Pobierz dane z frontendu z metadanych lub użyj domyślnego konta
        const accountId = await getAccountIdForSubscription(subscription.id, userAccounts);
        
        if (!accountId) {
          errors.push({
            subscriptionId: subscription.id,
            name: subscription.name,
            error: "No account assigned to subscription"
          });
          continue;
        }

        // Znajdź konto
        const account = await prisma.account.findUnique({
          where: { id: accountId }
        });

        if (!account) {
          errors.push({
            subscriptionId: subscription.id,
            name: subscription.name,
            error: "Account not found"
          });
          continue;
        }

        // Sprawdź, czy na koncie jest wystarczająca ilość środków
        if (account.balance < subscription.amount) {
          errors.push({
            subscriptionId: subscription.id,
            name: subscription.name,
            error: "Insufficient funds in account",
            account: account.name,
            required: subscription.amount,
            available: account.balance
          });
          continue;
        }

        // Rozpocznij transakcję bazodanową
        const result = await prisma.$transaction(async (tx) => {
          // 1. Utwórz transakcję płatności
          const transaction = await tx.transaction.create({
            data: {
              title: `Płatność subskrypcji: ${subscription.name}`,
              amount: -subscription.amount, // ujemna kwota, bo to wydatek
              date: new Date(),
              paymentMethod: "Automatic",
              isRecurring: true,
              categoryId: subscription.categoryId || "", // Używamy pustego stringa zamiast undefined
              accountId: account.id,
              userId: user.id,
              notes: `Automatyczna płatność subskrypcji ${subscription.name}`
            }
          });

          // 2. Zaktualizuj saldo konta
          const updatedAccount = await tx.account.update({
            where: { id: account.id },
            data: {
              balance: {
                decrement: subscription.amount
              }
            }
          });

          // 3. Zaktualizuj datę następnej płatności subskrypcji
          const nextBillingDate = calculateNextPaymentDate(
            new Date(subscription.nextBillingDate),
            subscription.billingCycle
          );

          const updatedSubscription = await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              nextBillingDate
            },
            include: {
              category: true
            }
          });

          return {
            transaction,
            account: updatedAccount,
            subscription: updatedSubscription
          };
        });

        processedPayments.push({
          subscriptionId: subscription.id,
          name: subscription.name,
          amount: subscription.amount,
          accountName: account.name,
          newBalance: result.account.balance,
          nextBillingDate: result.subscription.nextBillingDate,
          transactionId: result.transaction.id
        });

      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        errors.push({
          subscriptionId: subscription.id,
          name: subscription.name,
          error: `Processing error: ${error}`
        });
      }
    }

    return NextResponse.json({
      processed: processedPayments.length,
      total: dueSubscriptions.length,
      payments: processedPayments,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Error processing subscription payments:", error);
    return NextResponse.json(
      { error: `Failed to process subscription payments: ${error}` },
      { status: 500 }
    );
  }
}
