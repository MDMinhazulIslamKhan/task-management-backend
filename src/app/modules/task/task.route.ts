import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { TaskValidation } from './task.validation';
import { TaskController } from './task.controller';

const router = express.Router();

router.post(
  '/create',
  auth(),
  validateRequest(TaskValidation.createTaskZodSchema),
  TaskController.createTask,
);

router.get('/get-all-tasks', auth(), TaskController.getAllTasks);

export const TaskRouters = router;
