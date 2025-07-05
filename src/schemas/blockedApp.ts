import { z } from 'zod';

export const createBlockedAppSchema = z.object({
  body: z.object({
    appName: z.string().min(1, 'App name is required').max(100, 'App name too long'),
    type: z.enum(['temporary', 'permanent'], {
      errorMap: () => ({ message: 'Type must be either temporary or permanent' }),
    }),
    duration: z.number().positive('Duration must be positive').optional(),
  }).refine((data) => {
    if (data.type === 'temporary' && !data.duration) {
      return false;
    }
    return true;
  }, {
    message: 'Duration is required for temporary blocks',
    path: ['duration'],
  }),
});

export const getBlockedAppSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid blocked app ID',
    }),
  }),
});

export const deleteBlockedAppSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: 'Invalid blocked app ID',
    }),
  }),
});

export const checkBlockStatusSchema = z.object({
  query: z.object({
    appName: z.string().min(1, 'App name is required'),
  }),
}); 