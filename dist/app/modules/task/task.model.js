"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const task_constant_1 = require("./task.constant");
const taskSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: task_constant_1.taskTypes,
        required: true,
    },
    completedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
    },
    assigned: {
        userId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: task_constant_1.assignedStatus,
        },
    },
    deadLine: {
        type: Date,
        required: true,
    },
    feedback: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            feedback: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
const Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
