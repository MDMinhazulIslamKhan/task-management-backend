import { Request, Response, RequestHandler } from 'express';
import { TaskService } from './task.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';

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

export const TaskController = {
  createTask,
};
