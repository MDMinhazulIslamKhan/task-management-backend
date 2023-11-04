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

router.get('/get-all-my-tasks', auth(), TaskController.getAllMyTasks);

router.get('/get-all-my-task', auth(), TaskController.getMyAssignedTasks);

router.get('/:id', auth(), TaskController.getSingleTasks);

router.patch(
  '/:id',
  auth(),
  validateRequest(TaskValidation.updateTaskZodSchema),
  TaskController.updateTasks,
);

router.delete('/:id', auth(), TaskController.deleteTasks);

export const TaskRouters = router;
