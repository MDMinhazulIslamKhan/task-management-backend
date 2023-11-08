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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_model_1 = __importDefault(require("./task.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../user/user.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const task_constant_1 = require("./task.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createTask = (task, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    if (task.assigned) {
        const assigned = yield user_model_1.default.findById(task.assigned);
        if (!assigned) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Assigned user does not exist!!!');
        }
        task.assigned = {
            userId: task.assigned,
            status: 'process',
        };
    }
    task.creatorId = userInfo.id;
    const session = yield mongoose_1.default.startSession();
    let result;
    try {
        session.startTransaction();
        if ((_a = task === null || task === void 0 ? void 0 : task.assigned) === null || _a === void 0 ? void 0 : _a.userId) {
            yield user_model_1.default.findOneAndUpdate({ _id: (_b = task === null || task === void 0 ? void 0 : task.assigned) === null || _b === void 0 ? void 0 : _b.userId }, { $inc: { notification: 1 } }, {
                session,
            });
        }
        yield user_model_1.default.findOneAndUpdate({ _id: userInfo.id }, { $inc: { createdTask: 1 } }, {
            session,
        });
        result = yield task_model_1.default.create([task], { session });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create task!');
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    const results = yield task_model_1.default.findById(result[0].id)
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
});
const getAllTasks = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, deadLine = '2050' } = filters, filtersData = __rest(filters, ["searchTerm", "deadLine"]);
    const andConditions = [];
    // for filter deadLine
    andConditions.push({
        $and: [{ deadLine: { $lte: deadLine } }],
    });
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: task_constant_1.taskSearchableField.map(field => ({
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
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // if no condition is given
    const query = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield task_model_1.default.find(query)
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
    const count = yield task_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const getAllMyTasks = (user, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield user_model_1.default.findById(user.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const { searchTerm, deadLine = '2050' } = filters, filtersData = __rest(filters, ["searchTerm", "deadLine"]);
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
            $or: task_constant_1.taskSearchableField.map(field => ({
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
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // if no condition is given
    const query = andConditions.length > 0 ? { $and: andConditions } : { creatorId: user.id };
    const result = yield task_model_1.default.find(query)
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
    const count = yield task_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const getMyAssignedTasks = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield user_model_1.default.findById(user.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield task_model_1.default.find({
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
});
const getSingleTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.default.findById(id)
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
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Task is not exist!!!');
    }
    return result;
});
const updateTask = (id, userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    if (userInfo.id.toString() !== task.creatorId.toString()) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This is not your task!!!');
    }
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, payload, {
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
});
const deleteTask = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    if (userInfo.id.toString() !== task.creatorId.toString()) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This is not your task!!!');
    }
    const session = yield mongoose_1.default.startSession();
    let result;
    try {
        session.startTransaction();
        if (((_c = task === null || task === void 0 ? void 0 : task.assigned) === null || _c === void 0 ? void 0 : _c.status) == 'process') {
            yield user_model_1.default.findOneAndUpdate({ _id: (_d = task === null || task === void 0 ? void 0 : task.assigned) === null || _d === void 0 ? void 0 : _d.userId }, { $inc: { notification: -1 } }, {
                session,
            });
        }
        result = yield task_model_1.default.findByIdAndDelete(id, { session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return result;
});
const postFeedback = (id, userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const checkFeedback = task.feedback.find(f => f.userId == userInfo.id);
    if (checkFeedback) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Your already post a feedback!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist on database!!!');
    }
    const feedback = Object.assign({ userId: userInfo.id }, payload);
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, { $push: { feedback: feedback } }, {
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
});
const deleteFeedback = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist on database!!!');
    }
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, { $pull: { feedback: { userId: userInfo.id } } }, {
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
});
const acceptTask = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    if (userInfo.id.toString() !== ((_f = (_e = task.assigned) === null || _e === void 0 ? void 0 : _e.userId) === null || _f === void 0 ? void 0 : _f.toString())) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This task has not been assigned to you!!!');
    }
    if (((_g = task === null || task === void 0 ? void 0 : task.assigned) === null || _g === void 0 ? void 0 : _g.status) != 'process') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Already ${(_h = task === null || task === void 0 ? void 0 : task.assigned) === null || _h === void 0 ? void 0 : _h.status}!!!`);
    }
    yield user_model_1.default.findOneAndUpdate({ _id: userInfo.id }, { $inc: { notification: -1 } });
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, { $set: { 'assigned.status': 'accept' } }, {
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
});
const cancelTask = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l, _m;
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    if (userInfo.id.toString() !== ((_k = (_j = task.assigned) === null || _j === void 0 ? void 0 : _j.userId) === null || _k === void 0 ? void 0 : _k.toString())) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This task has not been assigned to you!!!');
    }
    if (((_l = task === null || task === void 0 ? void 0 : task.assigned) === null || _l === void 0 ? void 0 : _l.status) != 'process') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Already ${(_m = task === null || task === void 0 ? void 0 : task.assigned) === null || _m === void 0 ? void 0 : _m.status}!!!`);
    }
    yield user_model_1.default.findOneAndUpdate({ _id: userInfo.id }, { $inc: { notification: -1 } });
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, { $set: { 'assigned.status': 'cancel' } }, {
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
});
const completeTask = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findById(id);
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no task with this id!!!');
    }
    const creator = yield user_model_1.default.findById(userInfo.id);
    if (!creator) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const a = task.completedBy.find(c => c == userInfo.id);
    if (a) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Already completed this task!!!`);
    }
    yield user_model_1.default.findOneAndUpdate({ _id: userInfo.id }, { $inc: { complectedTask: 1 } });
    const result = yield task_model_1.default.findOneAndUpdate({ _id: id }, { $push: { completedBy: userInfo.id } }, {
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
});
exports.TaskService = {
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
