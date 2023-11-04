import { ITask } from './task.interface';
import Task from './task.model';
import { UserInfoFromToken } from '../../../interfaces/common';

const createTask = async (
  task: ITask,
  userInfo: UserInfoFromToken,
): Promise<ITask | null> => {
  console.log(userInfo);
  const result = await Task.create(task);
  return result;
};

export const TaskService = {
  createTask,
};
