import { registerSchema, loginSchema } from '../auth/validation';
import { describe, it, expect } from 'vitest';

describe('Auth validation', () => {
  it('should validate correct register data', () => {
    const result = registerSchema.safeParse({
      username: 'usuario',
      email: 'test@mail.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should fail with invalid email', () => {
    const result = registerSchema.safeParse({
      username: 'usuario',
      email: 'badmail',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should fail with short password', () => {
    const result = registerSchema.safeParse({
      username: 'usuario',
      email: 'test@mail.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('Login validation', () => {
  it('should validate correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@mail.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should fail with invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'badmail',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });
});
