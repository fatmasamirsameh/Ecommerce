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
class ProductModel {
    create(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `INSERT INTO products (product_name,price,category)
    values($1, $2,$3) returning  id,product_name,price,category`;
                //run query
                const result = yield connection.query(sql, [p.product_name, p.price, p.category]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to create product ${error}`);
            }
        });
    }
    //get all products
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `SELECT id,price,product_name,category from products`;
                const result = yield connection.query(sql);
                connection.release();
                return result.rows;
            }
            catch (error) {
                throw new Error(`Error at reteiving products ${error}`);
            }
        });
    }
    //getOne
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT id,product_name,price,category from products WHERE id=($1)`;
                const connection = yield database_1.default.connect();
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`could not find product ${error}`);
            }
        });
    }
    //update product
    updateOne(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `UPDATE products  SET product_name=$1,price=$2,category=$3
    WHERE id=$4 RETURNING id,product_name,price,category`;
                //run query
                const result = yield connection.query(sql, [p.product_name, p.price, p.category, p.id]);
                connection.release();
                if (result.rows.length) {
                    return result.rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not update product: ${error}`);
            }
        });
    }
    // delete product
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `DELETE FROM products WHERE id=($1) RETURNING id,price,product_name,category`;
                //run query
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`could not delete product: ${error}`);
            }
        });
    }
}
exports.default = ProductModel;
