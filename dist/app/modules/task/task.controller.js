"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("./task.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const task_constant_1 = require("./task.constant");
const constant_1 = require("../../../constant");
const createTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.TaskService.createTask(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: 'Task created Successfully!!!',
    });
}));
const getAllTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, task_constant_1.taskFilterableField);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationFields);
    const result = yield task_service_1.TaskService.getAllTasks(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getAllMyTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, task_constant_1.taskFilterableField);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationFields);
    const result = yield task_service_1.TaskService.getAllMyTasks(req.user, filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Your created task retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getMyAssignedTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.TaskService.getMyAssignedTasks(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Your task retrieved Successfully',
        data: result,
    });
}));
const getSingleTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.getSingleTask(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task retrieved Successfully.',
        data: result,
    });
}));
const updateTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.updateTask(id, req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Updated Successfully.',
        data: result,
    });
}));
const deleteTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.deleteTask(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Deleted Successfully.',
        data: result,
    });
}));
const postFeedback = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.postFeedback(id, req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feedback Post Successfully.',
        data: result,
    });
}));
const deleteFeedback = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.deleteFeedback(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feedback Deleted Successfully.',
        data: result,
    });
}));
const acceptTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.acceptTask(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Accepted Successfully.',
        data: result,
    });
}));
const cancelTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.cancelTask(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Canceled Successfully.',
        data: result,
    });
}));
const completeTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield task_service_1.TaskService.completeTask(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Completed Successfully.',
        data: result,
    });
}));
exports.TaskController = {
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
