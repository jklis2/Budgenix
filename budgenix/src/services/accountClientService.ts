import { Account } from '@prisma/client';

// Get all accounts for a user
export const getAccounts = async (userId: string): Promise<Account[]> => {
  try {
    // Tymczasowe rozwiązanie - zwracamy przykładowe konta dla użytkownika
    // W przyszłości będzie to pobierane z API po implementacji uwierzytelniania
    
    // Symulacja opóźnienia sieciowego
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Przykładowe konta dla użytkownika
    return [
      {
        id: 'acc1',
        name: 'Konto osobiste',
        balance: 5000,
        accountType: 'CHECKING',
        currency: 'PLN',
        isDefault: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'acc2',
        name: 'Konto oszczędnościowe',
        balance: 10000,
        accountType: 'SAVINGS',
        currency: 'PLN',
        isDefault: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};
