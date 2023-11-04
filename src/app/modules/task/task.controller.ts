import { Request, Response, RequestHandler } from 'express';
import { TaskService } from './task.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { taskFilterableField } from './task.constant';
import { paginationFields } from '../../../constant';

const createTask: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TaskService.createTask(
      req.body,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Task created Successfully!!!',
    });
  },
);

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, taskFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TaskService.getAllTasks(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllMyTasks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, taskFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TaskService.getAllMyTasks(
    req.user as UserInfoFromToken,
    filters,
    paginationOptions,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your created task retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyAssignedTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getMyAssignedTasks(
    req.user as UserInfoFromToken,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your task retrieved Successfully',
    data: result,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.getSingleTask(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved Successfully.',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.updateTask(
    id,
    req.user as UserInfoFromToken,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Updated Successfully.',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.deleteTask(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Deleted Successfully.',
    data: result,
  });
});

const postFeedback = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.postFeedback(
    id,
    req.user as UserInfoFromToken,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback Post Successfully.',
    data: result,
  });
});

const deleteFeedback = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.deleteFeedback(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback Deleted Successfully.',
    data: result,
  });
});
const acceptTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.acceptTask(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Accepted Successfully.',
    data: result,
  });
});
const cancelTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.cancelTask(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Canceled Successfully.',
    data: result,
  });
});
const completeTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TaskService.completeTask(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Completed Successfully.',
    data: result,
  });
});

export const TaskController = {
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
