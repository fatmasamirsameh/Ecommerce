import bcrypt from 'bcrypt';
import db from '../database';

const { SALT } = process.env;
const { BECREPT_PASS } = process.env;

export type User = {
  id?: number;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
};

class UserModel {
  async create(u: User): Promise<User> {
    try {
      const sql = `INSERT INTO users (email,user_name,first_name,last_name,password) 
        values($1, $2, $3, $4, $5) returning *`;
      const connection = await db.connect();

      const hash = bcrypt.hashSync(u.password + BECREPT_PASS, parseInt(SALT as string));

      const result = await connection.query(sql, [u.email, u.user_name, u.first_name, u.last_name, hash]);

      connection.release();
      const row = result.rows[0];
      return row;
    } catch (error) {
      throw new Error(`Could not create a new user ${error}`);
    }
  }

  //get all users
  async index(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * from users`;
      const result = await connection.query(sql);
      connection.release();
      const row = result.rows;
      return row;
    } catch (error) {
      throw new Error(`Could not return users ${error}`);
    }
  }
  //get specific user
  async show(id: string): Promise<User | null> {
    try {
      const sql = `SELECT * from users WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length) {
        const row = result.rows[0];
        return row;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not find user ${error}`);
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM users WHERE id=$1 RETURNING *`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();

      const row = result.rows[0];
      return row;
    } catch (err) {
      throw new Error(`could not delete user:${err}`);
    }
  }

  //update user
  async updateOne(u: User, id: string): Promise<User | null> {
    try {
      const sql = `UPDATE users  SET email=$1,user_name=$2,first_name=$3,last_name=$4,password=$5
    WHERE id=$6 RETURNING *`;
      const connection = await db.connect();
      const hash = bcrypt.hashSync(u.password + BECREPT_PASS, parseInt(SALT as string));
      const result = await connection.query(sql, [u.email, u.user_name, u.first_name, u.last_name, hash, id]);
      connection.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not update user: ${error}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT password FROM users WHERE email=$1';
      const sql2 = 'SELECT * FROM users WHERE email=$1';
      const result = await connection.query(sql, [email]);
      const user = await connection.query(sql2, [email]);
      if (result.rows.length) {
        const { password: hash } = result.rows[0];
        if (bcrypt.compareSync(`${password}${BECREPT_PASS}`, hash)) {
          return user.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${error} `);
    }
  }
}

export default UserModel;
