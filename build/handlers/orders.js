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
exports.deleteOne = exports.updateOne = exports.show = exports.index = exports.create = void 0;
const order_1 = __importDefault(require("../models/order"));
const orderModel = new order_1.default();
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel.create(req.body);
        res.json({
            data: Object.assign({}, order),
            message: 'Order created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.create = create;
const index = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel.index();
        res.json({
            data: Object.assign({}, order),
            message: 'Order retreived all successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.index = index;
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel.show(req.params.id);
        if (order == null) {
            res.json({
                status: 'Error',
                data: order,
                message: 'Please Enter Vaild id',
            });
        }
        else {
            res.json({
                data: order,
                message: 'Order retreived successfully',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.show = show;
const updateOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel.updateOne(req.body);
        if (order == null) {
            res.json({
                status: 'Error',
                data: order,
                message: 'Please Enter Vaild  valid id',
            });
        }
        else {
            res.json({
                data: order,
                message: 'Order updated successfully',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel.deleteOne(req.params.id);
        if (order == null) {
            res.json({
                status: 'Error',
                data: order,
                message: 'Please Enter Vaild id',
            });
        }
        else {
            res.json({
                data: order,
                message: 'Order deleted successfully',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOne = deleteOne;
const express_1 = require("express");
const orderRoutes = (0, express_1.Router)();
const auth_1 = __importDefault(require("../handlers/auth"));
orderRoutes.route('/orders/').get(auth_1.default, exports.index).post(auth_1.default, exports.create);
orderRoutes.route('/orders/:id').get(auth_1.default, exports.show).patch(auth_1.default, exports.updateOne).delete(auth_1.default, exports.deleteOne);
exports.default = orderRoutes;
