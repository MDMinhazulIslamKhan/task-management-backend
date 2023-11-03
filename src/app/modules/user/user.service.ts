import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IChangePassword, ILoginRequest, IUser } from './user.interface';
import User from './user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { UserInfoFromToken } from '../../../interfaces/common';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const checkNumber = await User.findOne({ phoneNumber: user.phoneNumber });
  const checkEmail = await User.findOne({ email: user.email });

  if (checkEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Already used this email!!!');
  }
  if (checkNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already used this phone number!!!',
    );
  }
  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create user!');
  }
  const result = await User.findById(createdUser._id);
  return result;
};

const loginUser = async (payload: ILoginRequest): Promise<string> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  if (!(await User.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect.');
  }

  const { role, id } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, email, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return accessToken;
};

const changePassword = async (
  userInfo: UserInfoFromToken,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findById(userInfo.id).select({
    password: true,
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!(await User.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  isUserExist.password = newPassword;
  isUserExist.save();
};

export const UserService = {
  createUser,
  loginUser,
  changePassword,
};
