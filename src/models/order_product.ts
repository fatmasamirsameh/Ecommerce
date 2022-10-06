import db from '../database';

export type OrderPro = {
  id?: number;
  quantity: number;
  order_id: string;
  product_id: string;
};

export type OrderUser = {
  id?: number;
  status: string;
  user_id: number;
};

class orderProductModel {
  async orderUser(user_id: string): Promise<OrderUser[]> {
    try {
      const connection = await db.connect();
      //  const sql = `SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id`;
      const sql = `SELECT id,status,user_id from orders WHERE user_id=($1)`;

      //run query
      const result = await connection.query(sql, [user_id]);

      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get order for user: ${(error as Error).message}`);
    }
  }

  async addProduct(op: OrderPro): Promise<OrderPro> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO orderProduct (quantity,order_id,product_id)
    values($1, $2,$3) returning *`;

      //run query
      const result = await connection.query(sql, [op.quantity, op.order_id, op.product_id]);

      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to add product (${op.product_id}): ${(error as Error).message}`);
    }
  }
}
export default orderProductModel;
