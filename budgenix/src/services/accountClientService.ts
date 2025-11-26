import { Account } from '@prisma/client';
import { getToken } from '@/lib/services/authService';
import { buildApiUrl } from '@/lib/utils/apiUrl';

// Get all accounts for a user
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const token = getToken();
    
    // Jeśli mamy token autoryzacyjny, próbujemy pobrać dane z API
    if (token) {
      try {
        const response = await fetch(buildApiUrl('/api/accounts'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const accounts = await response.json();
          console.log('Pobrano rzeczywiste konta użytkownika:', accounts);
          return accounts;
        }
        // Jeśli API zwróci błąd, przechodzimy do danych przykładowych
        console.warn('Nie udało się pobrać kont z API, używamy danych przykładowych');
      } catch (apiError) {
        console.error('Błąd podczas pobierania kont z API:', apiError);
        // Kontynuujemy z danymi przykładowymi
      }
    }
    
    // Fallback - zwróć puste konta jeśli nie ma tokenu
    console.log('Brak tokenu - zwracanie pustej listy kont');
    return [];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};
