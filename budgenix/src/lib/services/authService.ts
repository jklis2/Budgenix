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
