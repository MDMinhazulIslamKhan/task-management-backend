import { Schema, model } from 'mongoose';
import { ITask, TaskModel } from './task.interface';
import { assignedStatus } from './task.constant';

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    assigned: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: assignedStatus,
          default: 'process',
        },
      },
    ],
    deadLine: {
      type: Date,
      required: true,
    },
    feedback: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        feedback: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Task = model<ITask, TaskModel>('Task', taskSchema);

export default Task;
