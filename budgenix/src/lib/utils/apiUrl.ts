/**
 * Pomocnicza funkcja do budowania URL API
 * W przeglądarce dodaje basePath, ponieważ fetch() nie korzysta automatycznie z basePath
 */

const BASE_PATH = '/budgenix';

/**
 * Buduje URL API z uwzględnieniem basePath w przeglądarce
 * @param path - Ścieżka API, np. '/api/transactions'
 * @returns Pełny URL z basePath (tylko w przeglądarce)
 */
export const buildApiUrl = (path: string): string => {
  // W przeglądarce dodaj basePath do fetch requests
  if (typeof window !== 'undefined') {
    // Jeśli ścieżka już zawiera basePath, zwróć ją bez zmian
    if (path.startsWith(BASE_PATH)) {
      return path;
    }
    return `${BASE_PATH}${path}`;
  }
  
  // Na serwerze zwróć ścieżkę bez zmian
  return path;
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
