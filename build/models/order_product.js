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
const database_1 = __importDefault(require("../database"));
class orderProductModel {
    orderUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                //  const sql = `SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id`;
                const sql = `SELECT id,status,user_id from orders WHERE user_id=($1)`;
                //run query
                const result = yield connection.query(sql, [user_id]);
                connection.release();
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to get order for user: ${error.message}`);
            }
        });
    }
    addProduct(op) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `INSERT INTO orderProduct (quantity,order_id,product_id)
    values($1, $2,$3) returning *`;
                //run query
                const result = yield connection.query(sql, [op.quantity, op.order_id, op.product_id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to add product (${op.product_id}): ${error.message}`);
            }
        });
    }
}
exports.default = orderProductModel;
