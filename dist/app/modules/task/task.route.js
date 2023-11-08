"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const task_validation_1 = require("./task.validation");
const task_controller_1 = require("./task.controller");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(), (0, validateRequest_1.default)(task_validation_1.TaskValidation.createTaskZodSchema), task_controller_1.TaskController.createTask);
router.get('/get-all-tasks', (0, auth_1.default)(), task_controller_1.TaskController.getAllTasks);
router.get('/get-all-my-tasks', (0, auth_1.default)(), task_controller_1.TaskController.getAllMyTasks);
router.get('/get-my-task', (0, auth_1.default)(), task_controller_1.TaskController.getMyAssignedTasks);
router.get('/:id', (0, auth_1.default)(), task_controller_1.TaskController.getSingleTask);
router.patch('/:id', (0, auth_1.default)(), (0, validateRequest_1.default)(task_validation_1.TaskValidation.updateTaskZodSchema), task_controller_1.TaskController.updateTask);
router.delete('/:id', (0, auth_1.default)(), task_controller_1.TaskController.deleteTask);
router.post('/feedback/:id', (0, validateRequest_1.default)(task_validation_1.TaskValidation.postFeedbackSchema), (0, auth_1.default)(), task_controller_1.TaskController.postFeedback);
router.delete('/feedback/:id', (0, auth_1.default)(), task_controller_1.TaskController.deleteFeedback);
router.patch('/accept-assigned-task/:id', (0, auth_1.default)(), task_controller_1.TaskController.acceptTask);
router.patch('/cancel-assigned-task/:id', (0, auth_1.default)(), task_controller_1.TaskController.cancelTask);
router.patch('/complete-task/:id', (0, auth_1.default)(), task_controller_1.TaskController.completeTask);
exports.TaskRouters = router;
