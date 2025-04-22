// Importujemy jwt-decode do dekodowania tokenów JWT
import { jwtDecode } from 'jwt-decode';

// Interfejs dla zdekodowanego tokenu JWT
interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// Funkcja do pobierania tokenu JWT z localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Funkcja do zapisywania tokenu JWT w localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Funkcja do usuwania tokenu JWT z localStorage (wylogowanie)
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Funkcja do sprawdzania, czy użytkownik jest zalogowany
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Funkcja do pobierania ID użytkownika z tokenu JWT
export const getUserId = (): string | null => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch (error) {
    console.error('Błąd dekodowania tokenu JWT:', error);
    return null;
  }
};

// Funkcja do pobierania danych użytkownika z tokenu JWT
export const getUserData = (): { id: string; email: string } | null => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedToken>(token);
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    console.error('Błąd dekodowania tokenu JWT:', error);
    return null;
  }
};
