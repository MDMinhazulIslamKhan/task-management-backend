import { Model } from 'mongoose';
import { Role } from './user.constant';

export type IUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
  notification: number;
  createdTask: number;
  complectedTask: number;
};

export type UserModel = {
  isUserExist(
    email: string,
  ): Promise<Pick<IUser, 'id' | 'email' | 'password' | 'role'>>;
  isPasswordMatch(
    givenPassword: string,
    savePassword: string,
  ): Promise<boolean>;
} & Model<IUser>;

export type ILoginRequest = {
  email: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
