import express from 'express';
import { UserRouters } from '../modules/user/user.route';
import { TaskRouters } from '../modules/task/task.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouters,
  },
  {
    path: '/task',
    route: TaskRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
