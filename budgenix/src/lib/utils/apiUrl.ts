/**
 * Pomocnicza funkcja do budowania URL API z uwzględnieniem basePath
 * Automatycznie dodaje basePath z konfiguracji Next.js
 */

// Pobierz basePath z konfiguracji środowiska lub użyj domyślnej wartości
const BASE_PATH = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH 
  ? process.env.NEXT_PUBLIC_BASE_PATH 
  : '/budgenix';

/**
 * Buduje pełny URL API z uwzględnieniem basePath
 * @param path - Ścieżka API, np. '/api/transactions'
 * @returns Pełny URL z basePath
 */
export const buildApiUrl = (path: string): string => {
  // Jeśli ścieżka już zawiera basePath, zwróć ją bez zmian
  if (path.startsWith(BASE_PATH)) {
    return path;
  }
  
  // Dodaj basePath do ścieżki
  return `${BASE_PATH}${path}`;
};

/**
 * Buduje URL z parametrami zapytania
 * @param path - Ścieżka API
 * @param params - Parametry zapytania
 * @returns Pełny URL z basePath i parametrami
 */
export const buildApiUrlWithParams = (
  path: string, 
  params: Record<string, string | number | boolean | undefined>
): string => {
  const baseUrl = buildApiUrl(path);
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
