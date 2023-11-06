"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = require("zod");
const task_constant_1 = require("./task.constant");
const createTaskZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string({
            required_error: 'Task name is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        assigned: zod_1.z.string().optional(),
        category: zod_1.z.enum([...task_constant_1.taskTypes], {
            required_error: 'Category is required',
        }),
        deadLine: zod_1.z.string({
            required_error: 'Deadline is required',
        }),
    })
        .strict(),
});
const updateTaskZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        category: zod_1.z.enum([...task_constant_1.taskTypes]).optional(),
        deadLine: zod_1.z.string().optional(),
    })
        .strict(),
});
const postFeedbackSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        feedback: zod_1.z.string({
            required_error: 'Feedback is required',
        }),
    })
        .strict(),
});
exports.TaskValidation = {
    createTaskZodSchema,
    updateTaskZodSchema,
    postFeedbackSchema,
};
