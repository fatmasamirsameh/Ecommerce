import db from '../database';
export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

class OrderModel {
  async create(o: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO orders (status,user_id)
    values($1, $2) returning *`;
      //run query

      const result = await connection.query(sql, [o.status, o.user_id]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create order ${error}`);
    }
  }

  //get all orders
  async index(): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id,user_id,status from orders`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at reteiving orders ${(error as Error).message}`);
    }
  }

  //getOne
  async show(id: string): Promise<Order | null> {
    try {
      const sql = `SELECT id,status,user_id from orders WHERE id=($1)`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not find order ${error}`);
    }
  }

  //update order
  async updateOne(o: Order): Promise<Order | null> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE orders  SET status=$1,user_id=$2
    WHERE id=$3 RETURNING id,status,user_id`;
      //run query
      const result = await connection.query(sql, [o.status, o.user_id, o.id]);

      connection.release();

      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not update order ${error}`);
    }
  }

  // delete order
  async deleteOne(id: string): Promise<Order | null> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM orders WHERE id=($1) RETURNING id,user_id,status`;
      //run query
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not delete order${error}`);
    }
  }
}

export default OrderModel;
