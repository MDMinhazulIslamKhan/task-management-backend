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

export const TaskController = {
  createTask,
  getAllTasks,
};
