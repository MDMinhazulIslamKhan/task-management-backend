import { z } from 'zod';
import { taskTypes } from './task.constant';

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
      category: z.enum([...taskTypes] as [string, ...string[]], {
        required_error: 'Category is required',
      }),
      deadLine: z.string({
        required_error: 'Deadline is required',
      }),
    })
    .strict(),
});

export const TaskValidation = {
  createTaskZodSchema,
};
