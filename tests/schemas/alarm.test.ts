import { createAlarmSchema, updateAlarmSchema } from '../../src/schemas/alarm';
import { z } from 'zod';

describe('Alarm Schemas', () => {
  describe('createAlarmSchema', () => {
    it('should validate valid create alarm data', () => {
      const validData = {
        time: '2024-01-16T07:00:00.000Z',
        repeat: 'daily',
      };

      const result = createAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate with once repeat', () => {
      const validData = {
        time: '2024-01-16T07:00:00.000Z',
        repeat: 'once',
      };

      const result = createAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with weekly repeat', () => {
      const validData = {
        time: '2024-01-16T07:00:00.000Z',
        repeat: 'weekly',
      };

      const result = createAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid time format', () => {
      const invalidData = {
        time: 'invalid-date',
        repeat: 'daily',
      };

      const result = createAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Time must be a valid ISO datetime string');
      }
    });

    it('should reject invalid repeat value', () => {
      const invalidData = {
        time: '2024-01-16T07:00:00.000Z',
        repeat: 'invalid-repeat',
      };

      const result = createAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Repeat must be once, daily, or weekly');
      }
    });

    it('should reject missing time', () => {
      const invalidData = {
        repeat: 'daily',
      };

      const result = createAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Required');
      }
    });

    it('should reject missing repeat', () => {
      const invalidData = {
        time: '2024-01-16T07:00:00.000Z',
      };

      const result = createAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Repeat must be once, daily, or weekly');
      }
    });

    it('should reject empty object', () => {
      const invalidData = {};

      const result = createAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2); // time and repeat missing
      }
    });
  });

  describe('updateAlarmSchema', () => {
    it('should validate valid update alarm data with all fields', () => {
      const validData = {
        time: '2024-01-16T07:30:00.000Z',
        repeat: 'weekly',
        active: false,
      };

      const result = updateAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate partial update with only time', () => {
      const validData = {
        time: '2024-01-16T07:30:00.000Z',
      };

      const result = updateAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate partial update with only repeat', () => {
      const validData = {
        repeat: 'once',
      };

      const result = updateAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate partial update with only active', () => {
      const validData = {
        active: false,
      };

      const result = updateAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate empty object (no updates)', () => {
      const validData = {};

      const result = updateAlarmSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid time format', () => {
      const invalidData = {
        time: 'invalid-date',
      };

      const result = updateAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Time must be a valid ISO datetime string');
      }
    });

    it('should reject invalid repeat value', () => {
      const invalidData = {
        repeat: 'invalid-repeat',
      };

      const result = updateAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid enum value');
      }
    });

    it('should reject invalid active value', () => {
      const invalidData = {
        active: 'not-boolean',
      };

      const result = updateAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Expected boolean');
      }
    });

    it('should reject invalid time and repeat combination', () => {
      const invalidData = {
        time: 'invalid-date',
        repeat: 'invalid-repeat',
      };

      const result = updateAlarmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });
  });

  describe('Schema Structure', () => {
    it('should have correct shape for createAlarmSchema', () => {
      const shape = createAlarmSchema.shape;
      
      expect(shape).toHaveProperty('time');
      expect(shape).toHaveProperty('repeat');
      expect(shape.time).toBeInstanceOf(z.ZodString);
      expect(shape.repeat).toBeInstanceOf(z.ZodEnum);
    });

    it('should have correct shape for updateAlarmSchema', () => {
      const shape = updateAlarmSchema.shape;
      
      expect(shape).toHaveProperty('time');
      expect(shape).toHaveProperty('repeat');
      expect(shape).toHaveProperty('active');
      expect(shape.time).toBeInstanceOf(z.ZodOptional);
      expect(shape.repeat).toBeInstanceOf(z.ZodOptional);
      expect(shape.active).toBeInstanceOf(z.ZodOptional);
    });

    it('should have correct enum values for repeat', () => {
      const repeatEnum = createAlarmSchema.shape.repeat;
      const enumValues = repeatEnum._def.values;
      
      expect(enumValues).toContain('once');
      expect(enumValues).toContain('daily');
      expect(enumValues).toContain('weekly');
      expect(enumValues).toHaveLength(3);
    });
  });

  describe('Date Validation', () => {
    it('should accept ISO date strings', () => {
      const validDates = [
        '2024-01-16T07:00:00.000Z',
        '2024-12-31T23:59:59.999Z',
        '2024-01-01T00:00:00.000Z',
      ];

      validDates.forEach(date => {
        const data = { time: date, repeat: 'daily' };
        const result = createAlarmSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject non-ISO date strings', () => {
      const invalidDates = [
        '2024-01-16',
        '16/01/2024',
        '2024-01-16 07:00:00',
        'invalid',
        '',
        null,
        undefined,
      ];

      invalidDates.forEach(date => {
        const data = { time: date, repeat: 'daily' };
        const result = createAlarmSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });
}); 