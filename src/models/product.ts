import db from '../database';
export type Product = {
  id?: number;
  product_name: string;
  price: number;
  category: string;
};

class ProductModel {
  async create(p: Product): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO products (product_name,price,category)
    values($1, $2,$3) returning  id,product_name,price,category`;
      //run query
      const result = await connection.query(sql, [p.product_name, p.price, p.category]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create product ${error}`);
    }
  }

  //get all products
  async index(): Promise<Product[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id,price,product_name,category from products`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at reteiving products ${error}`);
    }
  }

  //getOne
  async show(id: string): Promise<Product> {
    try {
      const sql = `SELECT id,product_name,price,category from products WHERE id=($1)`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`could not find product ${error}`);
    }
  }

  //update product
  async updateOne(p: Product): Promise<Product | null> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE products  SET product_name=$1,price=$2,category=$3
    WHERE id=$4 RETURNING id,product_name,price,category`;
      //run query
      const result = await connection.query(sql, [p.product_name, p.price, p.category, p.id]);

      connection.release();

      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`could not update product: ${error}`);
    }
  }

  // delete product
  async deleteOne(id: string): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM products WHERE id=($1) RETURNING id,price,product_name,category`;
      //run query
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`could not delete product: ${error}`);
    }
  }
}

export default ProductModel;
