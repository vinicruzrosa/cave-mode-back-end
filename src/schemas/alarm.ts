import { z } from 'zod';

export const createAlarmSchema = z.object({
  time: z.string().datetime('Time must be a valid ISO datetime string'),
  repeat: z.enum(['once', 'daily', 'weekly'], {
    errorMap: () => ({ message: 'Repeat must be once, daily, or weekly' })
  })
});

export const updateAlarmSchema = z.object({
  time: z.string().datetime('Time must be a valid ISO datetime string').optional(),
  repeat: z.enum(['once', 'daily', 'weekly']).optional(),
  active: z.boolean().optional()
});

export const alarmIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).refine(
    (val) => !isNaN(val) && val > 0,
    { message: 'Alarm ID must be a positive integer' }
  )
}); 