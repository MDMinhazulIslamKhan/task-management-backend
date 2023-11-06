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
import { taskSearchableField } from './task.constant';
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

    if (task?.assigned?.userId) {
      await User.findOneAndUpdate(
        { _id: task?.assigned?.userId },
        { $inc: { notification: 1 } },
        {
          session,
        },
      );
    }

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
      $or: taskSearchableField.map(field => ({
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

const getAllMyTasks = async (
  user: UserInfoFromToken,
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ITask[]>> => {
  const creator = await User.findById(user.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const { searchTerm, deadLine = '2050', ...filtersData } = filters;

  const andConditions = [];

  // for filter creator of task
  andConditions.push({
    $and: [{ creatorId: user.id }],
  });
  // for filter deadLine
  andConditions.push({
    $and: [{ deadLine: { $lte: deadLine } }],
  });

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: taskSearchableField.map(field => ({
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
  const query =
    andConditions.length > 0 ? { $and: andConditions } : { creatorId: user.id };

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
    })
    .sort({ createdAt: 'desc' });

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

const getMyAssignedTasks = async (
  user: UserInfoFromToken,
): Promise<ITask[]> => {
  const creator = await User.findById(user.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const result = await Task.find({
    $and: [{ 'assigned.userId': user.id }, { 'assigned.status': 'process' }],
  })
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
    })
    .sort({ createdAt: 'desc' });

  return result;
};

const getSingleTask = async (id: string): Promise<ITask | null> => {
  const result = await Task.findById(id)
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

  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Task is not exist!!!');
  }
  return result;
};

const updateTask = async (
  id: string,
  userInfo: UserInfoFromToken,
  payload: Partial<ITask>,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== task.creatorId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This is not your task!!!');
  }

  const result = await Task.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
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

  return result;
};

const deleteTask = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== task.creatorId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This is not your task!!!');
  }

  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();

    if (task?.assigned?.status == 'process') {
      await User.findOneAndUpdate(
        { _id: task?.assigned?.userId },
        { $inc: { notification: 1 } },
        {
          session,
        },
      );
    }

    result = await Task.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return result;
};

const postFeedback = async (
  id: string,
  userInfo: UserInfoFromToken,
  payload: { feedback: string },
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const checkFeedback = task.feedback.find(f => f.userId == userInfo.id);
  if (checkFeedback) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your already post a feedback!!!',
    );
  }
  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Your profile does not exist on database!!!',
    );
  }

  const feedback = { userId: userInfo.id, ...payload };

  const result = await Task.findOneAndUpdate(
    { _id: id },
    { $push: { feedback: feedback } },
    {
      new: true,
    },
  )
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

  return result;
};

const deleteFeedback = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Your profile does not exist on database!!!',
    );
  }

  const result = await Task.findOneAndUpdate(
    { _id: id },
    { $pull: { feedback: { userId: userInfo.id } } },
    {
      new: true,
    },
  )
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

  return result;
};

const acceptTask = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== task.assigned?.userId?.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'This task has not been assigned to you!!!',
    );
  }
  if (task?.assigned?.status != 'process') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already ${task?.assigned?.status}!!!`,
    );
  }

  await User.findOneAndUpdate(
    { _id: userInfo.id },
    { $inc: { notification: -1 } },
  );

  const result = await Task.findOneAndUpdate(
    { _id: id },
    { $set: { 'assigned.status': 'accept' } },
    {
      new: true,
    },
  )
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

  return result;
};

const cancelTask = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== task.assigned?.userId?.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'This task has not been assigned to you!!!',
    );
  }
  if (task?.assigned?.status != 'process') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already ${task?.assigned?.status}!!!`,
    );
  }
  await User.findOneAndUpdate(
    { _id: userInfo.id },
    { $inc: { notification: -1 } },
  );

  const result = await Task.findOneAndUpdate(
    { _id: id },
    { $set: { 'assigned.status': 'cancel' } },
    {
      new: true,
    },
  )
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

  return result;
};
const completeTask = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no task with this id!!!',
    );
  }

  const creator = await User.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const a = task.completedBy.find(c => c == userInfo.id);
  if (a) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already completed this task!!!`,
    );
  }
  await User.findOneAndUpdate(
    { _id: userInfo.id },
    { $inc: { complectedTask: 1 } },
  );

  const result = await Task.findOneAndUpdate(
    { _id: id },
    { $push: { completedBy: userInfo.id } },
    {
      new: true,
    },
  )
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

  return result;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getAllMyTasks,
  getMyAssignedTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  postFeedback,
  deleteFeedback,
  acceptTask,
  cancelTask,
  completeTask,
};
