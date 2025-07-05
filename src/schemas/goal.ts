import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  }),
});

export const updateGoalSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid goal ID',
    }),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    completed: z.boolean().optional(),
  }),
});

export const getGoalSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid goal ID',
    }),
  }),
});

export const deleteGoalSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid goal ID',
    }),
  }),
});

export const completeGoalSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid goal ID',
    }),
  }),
}); 