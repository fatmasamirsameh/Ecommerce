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
exports.addProduct = exports.orderUser = void 0;
const order_product_1 = __importDefault(require("../models/order_product"));
const orderProModel = new order_product_1.default();
const orderUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order_user = yield orderProModel.orderUser(req.body.user_id);
        res.json({
            status: 'success',
            data: Object.assign({}, order_user),
            message: 'Get orders for login user returned successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderUser = orderUser;
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order_user = yield orderProModel.orderUser(req.body.user_id);
        const order_product = yield orderProModel.addProduct(req.body);
        const url = req.path.split('/');
        console.log(url);
        for (let i = 0; i < order_user.length; i++) {
            const searchId = order_user[i].id;
            if (searchId == url[2]) {
                if (order_user[i].status == 'active') {
                    order_product.order_id = order_user[i].id;
                    return res.json({
                        status: 'success',
                        data: Object.assign({}, order_product),
                        message: 'add Product created successfully',
                    });
                }
            }
        }
        return res.json({
            status: 'Error',
            data: {},
            message: 'Please Enter Active order',
        });
    }
    catch (error) {
        res.json({
            status: 'Error',
            data: {},
            message: 'Product not found please enter valid product_id',
        });
        next();
    }
});
exports.addProduct = addProduct;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const orderProductRoute = (0, express_1.Router)();
orderProductRoute.route('/orders/:id/products').post(auth_1.default, exports.addProduct);
exports.default = orderProductRoute;
