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
class OrderModel {
    create(o) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `INSERT INTO orders (status,user_id)
    values($1, $2) returning *`;
                //run query
                const result = yield connection.query(sql, [o.status, o.user_id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to create order ${error}`);
            }
        });
    }
    //get all orders
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `SELECT id,user_id,status from orders`;
                const result = yield connection.query(sql);
                connection.release();
                return result.rows;
            }
            catch (error) {
                throw new Error(`Error at reteiving orders ${error.message}`);
            }
        });
    }
    //getOne
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT id,status,user_id from orders WHERE id=($1)`;
                const connection = yield database_1.default.connect();
                const result = yield connection.query(sql, [id]);
                connection.release();
                if (result.rows.length) {
                    return result.rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not find order ${error}`);
            }
        });
    }
    //update order
    updateOne(o) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `UPDATE orders  SET status=$1,user_id=$2
    WHERE id=$3 RETURNING id,status,user_id`;
                //run query
                const result = yield connection.query(sql, [o.status, o.user_id, o.id]);
                connection.release();
                if (result.rows.length) {
                    return result.rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not update order ${error}`);
            }
        });
    }
    // delete order
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `DELETE FROM orders WHERE id=($1) RETURNING id,user_id,status`;
                //run query
                const result = yield connection.query(sql, [id]);
                connection.release();
                if (result.rows.length) {
                    return result.rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not delete order${error}`);
            }
        });
    }
}
exports.default = OrderModel;
