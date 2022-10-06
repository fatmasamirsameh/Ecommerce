import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

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

const client = new Pool(Client);

export default client;
