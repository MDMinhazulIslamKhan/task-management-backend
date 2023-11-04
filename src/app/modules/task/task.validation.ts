import { z } from 'zod';

const createTaskZodSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: 'Task name is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
      assigned: z.string().optional(),
      deadLine: z.string({
        required_error: 'Deadline is required',
      }),
    })
    .strict(),
});

export const TaskValidation = {
  createTaskZodSchema,
};
