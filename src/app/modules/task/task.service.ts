import { ITask, ITaskFilters } from './task.interface';
import Task from './task.model';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import mongoose, { SortOrder, Types } from 'mongoose';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { taskFilterableField } from './task.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';

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

const getAllTasks = async (
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ITask[]>> => {
  const { searchTerm, deadLine = '2050', ...filtersData } = filters;

  const andConditions = [];

  // for filter deadLine
  andConditions.push({
    $and: [{ deadLine: { $lte: deadLine } }],
  });

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: taskFilterableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // for exact match user and condition
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // if no condition is given
  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Task.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
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
    })
    .populate({
      path: 'feedback',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
          },
        },
      ],
    });

  const count = await Task.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const TaskService = {
  createTask,
  getAllTasks,
};
