import { generateToken, verifyToken, JWTPayload } from '../../src/utils/jwt';

describe('JWT Utils', () => {
  const mockPayload: JWTPayload = {
    userId: 1,
    email: 'test@example.com'
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const payload1 = { userId: 1, email: 'test1@example.com' };
      const payload2 = { userId: 2, email: 'test2@example.com' };
      
      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);
      
      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens for same payload (due to timestamp)', async () => {
      const token1 = generateToken(mockPayload);
      await new Promise(resolve => setTimeout(resolve, 1100)); // Espera 1.1s para garantir iat diferente
      const token2 = generateToken(mockPayload);
      expect(token1).not.toBe(token2);
    }, 3000);
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Token inválido');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow('Token inválido');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not.a.valid.jwt.token';
      
      expect(() => {
        verifyToken(malformedToken);
      }).toThrow('Token inválido');
    });
  });
}); 