import { ITask } from './task.interface';
import Task from './task.model';
import { UserInfoFromToken } from '../../../interfaces/common';
import mongoose, { Types } from 'mongoose';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createTask = async (
  task: Partial<ITask>,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (task.assigned) {
    const assigned = await User.findById(task.assigned);
    if (!assigned) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Assigned user does not exist!!!',
      );
    }

    task.assigned = {
      userId: task.assigned as unknown as Types.ObjectId,
      status: 'process',
    };
  }
  task.creatorId = userInfo.id;
  const session = await mongoose.startSession();

  let result;
  try {
    session.startTransaction();

    await User.findOneAndUpdate(
      { _id: userInfo.id },
      { $inc: { createdTask: 1 } },
      {
        session,
      },
    );
    result = await Task.create([task], { session });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create task!');
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  const results = await Task.findById(result[0].id)
    .populate({
      path: 'completedBy',
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
      },
    })
    .populate({
      path: 'creatorId',
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        createdTask: true,
      },
    })
    .populate({
      path: 'assigned',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
            complectedTask: true,
          },
        },
      ],
    });
  return results;
};

export const TaskService = {
  createTask,
};
