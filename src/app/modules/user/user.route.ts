import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

router.post(
  '/login',
  validateRequest(UserValidation.loginUserZodSchema),
  UserController.loginUser,
);

router.patch(
  '/change-password',
  auth(),
  validateRequest(UserValidation.changePasswordZodSchema),
  UserController.changePassword,
);

router.get('/profile', auth(), UserController.getOwnProfile);

router.patch(
  '/profile',
  auth(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateOwnProfile,
);

router.get('/get-all-users', auth(), UserController.getAllUsers);

export const UserRouters = router;
