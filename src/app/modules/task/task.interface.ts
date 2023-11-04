import { Model, Types } from 'mongoose';
import { status } from './task.constant';
export type ITask = {
  name: string;
  creatorId: Types.ObjectId;
  description: string;
  completedBy: [Types.ObjectId];
  assigned: { userId: Types.ObjectId; status: status };
  deadLine: Date;
  feedback: { userId: Types.ObjectId; feedback: string };
};

export type TaskModel = Model<ITask, Record<string, unknown>>;
