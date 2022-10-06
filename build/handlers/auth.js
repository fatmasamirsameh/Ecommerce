"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        const authHead = req.headers.authorization;
        const token = authHead.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN);
        const stringdecode = JSON.stringify(decoded);
        const user_id = JSON.parse(stringdecode).user.id;
        req.body.user_id = user_id;
        next();
    }
    catch (error) {
        res.json({
            status: 'error',
            message: 'please send available token',
        });
    }
};
exports.default = auth;
