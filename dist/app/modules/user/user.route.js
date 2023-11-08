"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser);
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidation.loginUserZodSchema), user_controller_1.UserController.loginUser);
router.patch('/change-password', (0, auth_1.default)(), (0, validateRequest_1.default)(user_validation_1.UserValidation.changePasswordZodSchema), user_controller_1.UserController.changePassword);
router.get('/profile', (0, auth_1.default)(), user_controller_1.UserController.getOwnProfile);
router.patch('/profile', (0, auth_1.default)(), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), user_controller_1.UserController.updateOwnProfile);
router.get('/get-all-users', (0, auth_1.default)(), user_controller_1.UserController.getAllUsers);
exports.UserRouters = router;
