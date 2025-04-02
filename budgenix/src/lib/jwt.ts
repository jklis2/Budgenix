import jwt from 'jsonwebtoken';

// Sekret do weryfikacji tokenów JWT - powinien być zgodny z tym używanym do generowania tokenów
const JWT_SECRET = process.env.JWT_SECRET || 'twoj-sekretny-klucz';

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Funkcja do weryfikacji tokenu JWT
export const verifyJWT = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Błąd weryfikacji tokenu JWT:', error);
    return null;
  }
};
