import { z } from 'zod';

export const updateSafeModeSchema = z.object({
  body: z.object({
    safeMode: z.boolean(),
  }),
}); 