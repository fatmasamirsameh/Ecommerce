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
const product_1 = __importDefault(require("../models/product"));
const productModel = new product_1.default();
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel.create(req.body);
        res.json({
            data: Object.assign({}, product),
            message: 'Product created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.create = create;
const index = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel.index();
        res.json({
            data: Object.assign({}, product),
            message: 'Product retreived all successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.index = index;
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel.show(req.params.id);
        if (product == null) {
            res.json({ message: 'please enter valid id' });
        }
        res.json({
            data: product,
            message: 'Product retreived successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.show = show;
const updateOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel.updateOne(req.body);
        if (product == null) {
            res.json({
                status: 'Error',
                data: product,
                message: 'Please Enter Vaild id',
            });
        }
        res.json({
            data: product,
            message: 'Product updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel.deleteOne(req.params.id);
        res.json({
            data: product,
            message: 'Product deleted successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteOne = deleteOne;
const express_1 = require("express");
const auth_1 = __importDefault(require("../handlers/auth"));
const productRoutes = (0, express_1.Router)();
productRoutes.route('/products/').get(exports.index).post(auth_1.default, exports.create);
productRoutes.route('/products/:id').get(exports.show).patch(auth_1.default, exports.updateOne).delete(auth_1.default, exports.deleteOne);
exports.default = productRoutes;
