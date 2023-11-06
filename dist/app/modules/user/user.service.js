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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = __importDefault(require("./user.model"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const checkNumber = yield user_model_1.default.findOne({ phoneNumber: user.phoneNumber });
    const checkEmail = yield user_model_1.default.findOne({ email: user.email });
    if (checkEmail) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this email!!!');
    }
    if (checkNumber) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this phone number!!!');
    }
    const createdUser = yield user_model_1.default.create(user);
    if (!createdUser) {
        throw new ApiError_1.default(400, 'Failed to create user!');
    }
    const result = yield user_model_1.default.findById(createdUser._id);
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.default.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist.");
    }
    if (!(yield user_model_1.default.isPasswordMatch(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect.');
    }
    const { role, id } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id, email, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return accessToken;
});
const changePassword = (userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isUserExist = yield user_model_1.default.findById(userInfo.id).select({
        password: true,
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (!(yield user_model_1.default.isPasswordMatch(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password is incorrect');
    }
    isUserExist.password = newPassword;
    isUserExist.save();
});
const getOwnProfile = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findById(userInfo.id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile is not exist!!!');
    }
    return result;
});
const updateOwnProfile = (payload, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findById(userInfo.id);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (payload.phoneNumber) {
        const checkNumber = yield user_model_1.default.findOne({
            phoneNumber: payload.phoneNumber,
        });
        if (checkNumber) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this number!!!');
        }
    }
    const result = yield user_model_1.default.findOneAndUpdate({ _id: userInfo.id }, payload, {
        new: true,
    });
    return result;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.find().select({
        fullName: true,
        phoneNumber: true,
    });
    return result;
});
exports.UserService = {
    createUser,
    loginUser,
    changePassword,
    getOwnProfile,
    updateOwnProfile,
    getAllUsers,
};
