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
exports.deleteOne = exports.updateOne = exports.show = exports.index = exports.authenticate = exports.create = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const userModel = new user_1.default();
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.email == undefined ||
            req.body.user_name == undefined ||
            req.body.first_name == undefined ||
            req.body.last_name == undefined ||
            req.body.password == undefined) {
            return res.json({ message: 'please enter email ,user_name ,first_name ,last_name and password' });
        }
        const Alluser = yield userModel.index();
        for (let i = 0; i < Alluser.length; i++) {
            if (Alluser[i].email == req.body.email) {
                return res.json({ message: 'please enter  unique email' });
            }
        }
        const user = yield userModel.create(req.body);
        res.json({ user });
    }
    catch (err) {
        res.json(err);
    }
});
exports.create = create;
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email === undefined || password === undefined) {
            return res.status(401).json({
                status: 'error',
                message: 'please enter email and password',
            });
        }
        else {
            const user = yield userModel.authenticate(email, password);
            const userToken = jsonwebtoken_1.default.sign({ user }, process.env.TOKEN);
            if (user == null) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Wrong email or password please enter valid data',
                });
            }
            return res.json(Object.assign(Object.assign({}, user), { userToken }));
        }
    }
    catch (err) {
        res.json(err);
    }
});
exports.authenticate = authenticate;
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.index();
        res.json(Object.assign({}, user));
    }
    catch (err) {
        res.json(err);
    }
});
exports.index = index;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.show(req.params.id);
        if (user == null) {
            res.json({
                status: 'Error',
                data: user,
                message: 'Please Enter Vaild id',
            });
        }
        else {
            res.json({
                status: 'success',
                data: user,
                message: 'User returned successfully',
            });
        }
    }
    catch (err) {
        res.json(err);
    }
});
exports.show = show;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.updateOne(req.body, req.body.id);
        if (user == null) {
            res.json({
                status: 'Error',
                data: user,
                message: 'Please Enter Vaild id',
            });
        }
        else {
            res.json({
                status: 'success',
                data: user,
                message: 'User updated successfully',
            });
        }
    }
    catch (err) {
        res.json(err);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.deleteOne(req.body.id);
        if (user == null) {
            res.json({
                status: 'Error',
                data: user,
                message: 'Please Enter Vaild id',
            });
        }
        else {
            res.json({
                status: 'success',
                data: user,
                message: 'User deleted successfully',
            });
        }
    }
    catch (err) {
        res.json(err);
    }
});
exports.deleteOne = deleteOne;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const userRoutes = (0, express_1.Router)();
userRoutes.route('/users/').get(auth_1.default, exports.index).post(exports.create);
userRoutes.route('/users/:id').get(auth_1.default, exports.show).patch(auth_1.default, exports.updateOne).delete(auth_1.default, exports.deleteOne);
userRoutes.route('/users/authenticate').post(exports.authenticate);
exports.default = userRoutes;
