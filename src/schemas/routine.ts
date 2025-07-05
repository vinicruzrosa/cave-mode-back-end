import { z } from 'zod';

export const createRoutineSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    startTime: z.string().datetime('Invalid start time format'),
    endTime: z.string().datetime('Invalid end time format'),
  }).refine((data) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    return endTime > startTime;
  }, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const updateRoutineSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid routine ID',
    }),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
    startTime: z.string().datetime('Invalid start time format').optional(),
    endTime: z.string().datetime('Invalid end time format').optional(),
  }).refine((data) => {
    if (data.startTime && data.endTime) {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      return endTime > startTime;
    }
    return true;
  }, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const getRoutineSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid routine ID',
    }),
  }),
});

export const deleteRoutineSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid routine ID',
    }),
  }),
}); 