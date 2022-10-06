"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { NODE_ENV, DB_HOST, DB, DB_USER, DB_PASS, DB_TEST } = process.env;
let Client;
if (NODE_ENV === 'test') {
    Client = {
        host: DB_HOST,
        database: DB_TEST,
        user: DB_USER,
        password: DB_PASS,
    };
}
if (NODE_ENV === 'dev') {
    Client = {
        host: DB_HOST,
        database: DB,
        user: DB_USER,
        password: DB_PASS,
    };
}
const client = new pg_1.Pool(Client);
exports.default = client;
