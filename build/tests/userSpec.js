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
const user_1 = __importDefault(require("../models/user"));
const supertest_1 = __importDefault(require("supertest"));
const server_js_1 = __importDefault(require("../server.js"));
const userModel = new user_1.default();
const request = (0, supertest_1.default)(server_js_1.default);
describe('Test methods', () => {
    it('Get All Users ', () => {
        expect(userModel.index).toBeDefined();
    });
    it(' Get Specific User', () => {
        expect(userModel.show).toBeDefined();
    });
    it('create User', () => {
        expect(userModel.create).toBeDefined();
    });
    it('Update user', () => {
        expect(userModel.updateOne).toBeDefined();
    });
    it('Delete user', () => {
        expect(userModel.deleteOne).toBeDefined();
    });
    it(' Authenticate user', () => {
        expect(userModel.authenticate).toBeDefined();
    });
});
describe('Create user', () => {
    const user = {
        email: 'xx@gmail.com',
        user_name: 'xxSamir',
        first_name: 'xx',
        last_name: 'samir',
        password: '123456',
    };
    let userToke = '';
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        const sql2 = `ALTER SEQUENCE users_id_seq RESTART WITH 1`;
        yield connection.query(sql2);
        const sql = 'DELETE FROM users';
        yield connection.query(sql);
        connection.release();
    }));
    it('user created', () => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield userModel.create(user);
        user.id = createUser.id;
        expect(createUser.email).toEqual('xx@gmail.com');
        expect(createUser.user_name).toEqual('xxSamir');
    }));
    it('should return the authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
        const authUser = yield userModel.authenticate(user.email, user.password);
        expect(authUser === null || authUser === void 0 ? void 0 : authUser.email).toBe(user.email);
        expect(authUser === null || authUser === void 0 ? void 0 : authUser.user_name).toBe(user.user_name);
    }));
    it('should return null for wrong data', () => __awaiter(void 0, void 0, void 0, function* () {
        const WrongUser = yield userModel.authenticate('kk', '11');
        expect(WrongUser).toBe(null);
    }));
    it('show user by authenticate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const authUser = yield request.post('/api/users/authenticate').set('content-type', 'application/json').send({
            email: 'xx@gmail.com',
            password: '123456',
        });
        const textParse = JSON.parse(authUser.text);
        userToke = textParse.userToken;
        const user2 = {
            email: 'yy@gmail.com',
            user_name: 'yySamir',
            first_name: 'yy',
            last_name: 'samir',
            password: '123456',
        };
        const createUser2 = yield userModel.create(user2);
        user.id = createUser2.id;
    }));
    it('Show One User', () => __awaiter(void 0, void 0, void 0, function* () {
        const showUser = yield request
            .get(`/api/users/3`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        const { id } = showUser.body.data;
        expect(id).toBe(3);
    }));
    it('Get All Users', () => __awaiter(void 0, void 0, void 0, function* () {
        const getAllUsers = yield request
            .get(`/api/users/`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        expect(Object.keys(getAllUsers.body).length).toBe(2);
    }));
    it('Update User', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateUser = yield request
            .patch('/api/users/4')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`)
            .send({
            id: 4,
            email: 'gg@gmail.com',
            user_name: 'ggSamir',
            first_name: 'gg',
            last_name: 'samir',
            password: '123456',
        });
        expect(updateUser.status).toBe(200);
        const { email, user_name } = updateUser.body.data;
        expect(email).toBe('gg@gmail.com');
        expect(user_name).toBe('ggSamir');
    }));
    it('Delete One User method', () => __awaiter(void 0, void 0, void 0, function* () {
        const DeleteOne = yield request
            .get(`/api/users/4`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToke}`);
        const { id } = DeleteOne.body.data;
        expect(id).toBe(4);
    }));
});
