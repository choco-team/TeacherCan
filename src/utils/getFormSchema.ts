import { z } from 'zod';

export const getFormSchema = (max: number) =>
  z.object({
    number: z.coerce
      .number()
      .min(1, {
        message: '최소 인원은 1명입니다.',
      })
      .max(max, {
        message: `남은 인원은 ${max}명입니다.`,
      }),
  });
