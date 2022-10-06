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
process.env.NODE_ENV = 'test';
const database_1 = __importDefault(require("../database"));
const order_1 = __importDefault(require("../models/order"));
const supertest_1 = __importDefault(require("supertest"));
const server_js_1 = __importDefault(require("../server.js"));
const user_1 = __importDefault(require("../models/user"));
const userModel = new user_1.default();
const request = (0, supertest_1.default)(server_js_1.default);
const orderModel = new order_1.default();
describe('Test methods', () => {
    it('Get All Orders ', () => {
        expect(orderModel.index).toBeDefined();
    });
    it(' Get Specific Order', () => {
        expect(orderModel.show).toBeDefined();
    });
    it('create Order', () => {
        expect(orderModel.create).toBeDefined();
    });
    it('Update Order', () => {
        expect(orderModel.updateOne).toBeDefined();
    });
    it('Delete Order', () => {
        expect(orderModel.deleteOne).toBeDefined();
    });
});
/////////////////////////////////////
describe('Create user to create order', () => {
    const user = {
        email: 'dina@gmail.com',
        user_name: 'dinaSamir',
        first_name: 'dina',
        last_name: 'samir',
        password: '123456',
    };
    let userToke = ' ';
    it('user created', () => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield userModel.create(user);
        user.id = createUser.id;
        expect(createUser.email).toEqual('dina@gmail.com');
        expect(createUser.user_name).toEqual('dinaSamir');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        const sql = 'DELETE FROM users';
        yield connection.query(sql);
        connection.release();
    }));
    it('create order to authenticate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const authUser = yield request.post('/api/users/authenticate').set('content-type', 'application/json').send({
            email: 'dina@gmail.com',
            password: '123456',
        });
        const textParse = JSON.parse(authUser.text);
        userToke = textParse.userToken;
        const createOrder = yield request
            .post('/api/orders/')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            status: 'complete',
        });
        expect(createOrder.status).toBe(200);
        const { status, user_id } = createOrder.body.data;
        expect(status).toBe('complete');
        expect(user_id).toBe(user.id);
    }));
    it('create order2 to authenticate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const createOrder2 = yield request
            .post('/api/orders/')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            status: 'active',
        });
        expect(createOrder2.status).toBe(200);
        const { status, user_id } = createOrder2.body.data;
        expect(status).toBe('active');
        expect(user_id).toBe(user.id);
    }));
    it('Get All orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const getAllOrders = yield request
            .get(`/api/orders/`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        expect(Object.keys(getAllOrders.body.data).length).toBe(2);
    }));
    it('Show order', () => __awaiter(void 0, void 0, void 0, function* () {
        const showOrder = yield request
            .get(`/api/orders/2`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        const { id } = showOrder.body.data;
        expect(id).toBe(2);
    }));
    it('Update Order method', () => __awaiter(void 0, void 0, void 0, function* () {
        const update = yield request
            .patch('/api/orders/2')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            id: 2,
            status: 'complete',
        });
        const { status, user_id, id } = update.body.data;
        expect(id).toEqual(2);
        expect(status).toBe('complete');
        expect(user_id).toBe(user.id);
    }));
    it('Delete One Order method', () => __awaiter(void 0, void 0, void 0, function* () {
        const DeleteOne = yield request
            .get(`/api/orders/2`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        const { id } = DeleteOne.body.data;
        expect(id).toBe(2);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        const sql3 = `ALTER SEQUENCE orders_id_seq RESTART WITH 1`;
        yield connection.query(sql3);
        const sql2 = 'DELETE FROM orders';
        yield connection.query(sql2);
        connection.release();
    }));
});
