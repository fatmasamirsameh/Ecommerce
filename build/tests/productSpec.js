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
const product_1 = __importDefault(require("../models/product"));
const database_1 = __importDefault(require("../database"));
const supertest_1 = __importDefault(require("supertest"));
const server_js_1 = __importDefault(require("../server.js"));
const user_1 = __importDefault(require("../models/user"));
const userModel = new user_1.default();
const request = (0, supertest_1.default)(server_js_1.default);
const productModel = new product_1.default();
describe('Test Product  methods', () => {
    it('Get All Products ', () => {
        expect(productModel.index).toBeDefined();
    });
    it(' Get Specific Product', () => {
        expect(productModel.show).toBeDefined();
    });
    it('create Product', () => {
        expect(productModel.create).toBeDefined();
    });
    it('Update Product', () => {
        expect(productModel.updateOne).toBeDefined();
    });
    it('Delete Product', () => {
        expect(productModel.deleteOne).toBeDefined();
    });
});
describe('Test Create product methods', () => {
    const user = {
        email: 'ahmed@gmail.com',
        user_name: 'ahmedSamir',
        first_name: 'ahmed',
        last_name: 'samir',
        password: '123456',
    };
    let userToke = ' ';
    it('user created', () => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield userModel.create(user);
        user.id = createUser.id;
        expect(createUser.email).toEqual('ahmed@gmail.com');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        const sql = 'DELETE FROM users';
        yield connection.query(sql);
        connection.release();
    }));
    it('create product to authenticate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const authUser = yield request.post('/api/users/authenticate').set('content-type', 'application/json').send({
            email: 'ahmed@gmail.com',
            password: '123456',
        });
        const textParse = JSON.parse(authUser.text);
        userToke = textParse.userToken;
        const productCreated = yield request
            .post('/api/products/')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            product_name: 'mobile',
            price: 3000,
            category: 'electronics',
        });
        expect(productCreated.status).toBe(200);
        const { product_name, price, category } = productCreated.body.data;
        expect(product_name).toEqual('mobile');
        expect(price).toEqual(3000);
        expect(category).toEqual('electronics');
    }));
    it('create product2 to authenticate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const createProduct2 = yield request
            .post('/api/products/')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            product_name: 'Blouse',
            price: 200,
            category: 'clothes',
        });
        expect(createProduct2.status).toBe(200);
        const { product_name, price, category } = createProduct2.body.data;
        expect(product_name).toEqual('Blouse');
        expect(price).toEqual(200);
        expect(category).toEqual('clothes');
    }));
    it('index method', () => __awaiter(void 0, void 0, void 0, function* () {
        const getProducts = yield productModel.index();
        expect(getProducts.length).toBe(2);
    }));
    it('Show One Product method', () => __awaiter(void 0, void 0, void 0, function* () {
        const showOne = yield productModel.show('2');
        expect(showOne === null || showOne === void 0 ? void 0 : showOne.id).toBe(2);
    }));
    it('Update Product method', () => __awaiter(void 0, void 0, void 0, function* () {
        const update = yield request
            .patch('/api/products/2')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            id: 2,
            product_name: 'TV',
            price: 2000,
            category: 'electro',
        });
        const { id, product_name, price, category } = update.body.data;
        expect(id).toBe(2);
        expect(product_name).toBe('TV');
        expect(price).toBe(2000);
        expect(category).toBe('electro');
    }));
    it('Delete One Product method', () => __awaiter(void 0, void 0, void 0, function* () {
        const DeleteOne = yield request
            .get(`/api/products/2`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        const { id } = DeleteOne.body.data;
        expect(id).toBe(2);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        const sql = `ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
        yield connection.query(sql);
        const sql2 = 'DELETE FROM products';
        yield connection.query(sql2);
        connection.release();
    }));
});
