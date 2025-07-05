import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).describe('RegisterRequest');

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).describe('LoginRequest'); 