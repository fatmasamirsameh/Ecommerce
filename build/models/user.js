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
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const { SALT } = process.env;
const { BECREPT_PASS } = process.env;
class UserModel {
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `INSERT INTO users (email,user_name,first_name,last_name,password) 
        values($1, $2, $3, $4, $5) returning *`;
                const connection = yield database_1.default.connect();
                const hash = bcrypt_1.default.hashSync(u.password + BECREPT_PASS, parseInt(SALT));
                const result = yield connection.query(sql, [u.email, u.user_name, u.first_name, u.last_name, hash]);
                connection.release();
                const row = result.rows[0];
                return row;
            }
            catch (error) {
                throw new Error(`Could not create a new user ${error}`);
            }
        });
    }
    //get all users
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `SELECT * from users`;
                const result = yield connection.query(sql);
                connection.release();
                const row = result.rows;
                return row;
            }
            catch (error) {
                throw new Error(`Could not return users ${error}`);
            }
        });
    }
    //get specific user
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT * from users WHERE id=$1`;
                const connection = yield database_1.default.connect();
                const result = yield connection.query(sql, [id]);
                connection.release();
                if (result.rows.length) {
                    const row = result.rows[0];
                    return row;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not find user ${error}`);
            }
        });
    }
    // delete user
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `DELETE FROM users WHERE id=$1 RETURNING *`;
                const connection = yield database_1.default.connect();
                const result = yield connection.query(sql, [id]);
                connection.release();
                const row = result.rows[0];
                return row;
            }
            catch (err) {
                throw new Error(`could not delete user:${err}`);
            }
        });
    }
    //update user
    updateOne(u, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `UPDATE users  SET email=$1,user_name=$2,first_name=$3,last_name=$4,password=$5
    WHERE id=$6 RETURNING *`;
                const connection = yield database_1.default.connect();
                const hash = bcrypt_1.default.hashSync(u.password + BECREPT_PASS, parseInt(SALT));
                const result = yield connection.query(sql, [u.email, u.user_name, u.first_name, u.last_name, hash, id]);
                connection.release();
                if (result.rows.length) {
                    return result.rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`could not update user: ${error}`);
            }
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'SELECT password FROM users WHERE email=$1';
                const sql2 = 'SELECT * FROM users WHERE email=$1';
                const result = yield connection.query(sql, [email]);
                const user = yield connection.query(sql2, [email]);
                if (result.rows.length) {
                    const { password: hash } = result.rows[0];
                    if (bcrypt_1.default.compareSync(`${password}${BECREPT_PASS}`, hash)) {
                        return user.rows[0];
                    }
                }
                connection.release();
                return null;
            }
            catch (error) {
                throw new Error(`Unable to login: ${error} `);
            }
        });
    }
}
exports.default = UserModel;
