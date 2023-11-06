"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRouters = void 0;
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const task_route_1 = require("../modules/task/task.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRouters,
    },
    {
        path: '/task',
        route: task_route_1.TaskRouters,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.ApplicationRouters = router;
