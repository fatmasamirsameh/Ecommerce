"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importDefault(require("./handlers/users"));
const products_1 = __importDefault(require("./handlers/products"));
const orders_1 = __importDefault(require("./handlers/orders"));
const order_product_1 = __importDefault(require("./handlers/order_product"));
const app = (0, express_1.default)();
const address = '0.0.0.0:3000';
app.use(body_parser_1.default.json());
app.get('/', function (_req, res) {
    res.send('Hello World!');
});
app.use('/api', users_1.default, products_1.default, orders_1.default, order_product_1.default);
// usersRoute(app);
// productsRoute(app);
// ordersRoute(app);
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
