import express from 'express';
import { UserRouters } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
