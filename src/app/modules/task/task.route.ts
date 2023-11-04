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

router.get('/get-my-task', auth(), TaskController.getMyAssignedTasks);

router.get('/:id', auth(), TaskController.getSingleTask);

router.patch(
  '/:id',
  auth(),
  validateRequest(TaskValidation.updateTaskZodSchema),
  TaskController.updateTask,
);

router.delete('/:id', auth(), TaskController.deleteTask);

router.post(
  '/feedback/:id',
  validateRequest(TaskValidation.postFeedbackSchema),
  auth(),
  TaskController.postFeedback,
);

router.delete('/feedback/:id', auth(), TaskController.deleteFeedback);

router.patch('/accept-assigned-task/:id', auth(), TaskController.acceptTask);

router.patch('/cancel-assigned-task/:id', auth(), TaskController.cancelTask);

router.patch('/complete-task/:id', auth(), TaskController.completeTask);

export const TaskRouters = router;
