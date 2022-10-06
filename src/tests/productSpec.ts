process.env.NODE_ENV = 'test';
import ProductModel from '../models/product';
import { Product } from '../models/product';
import db from '../database';
import supertest from 'supertest';
import app from '../server.js';
import UserModel from '../models/user';
import { User } from '../models/user';
const userModel = new UserModel();
const request = supertest(app);

const productModel = new ProductModel();

describe('Test Product  methods', () => {
  it('Get All Products ', () => {
    expect(productModel.index).toBeDefined();
  });

  it(' Get Specific Product', () => {
    expect(productModel.show).toBeDefined();
  });
  it('create Product', () => {
    expect(productModel.create).toBeDefined();
  });
  it('Update Product', () => {
    expect(productModel.updateOne).toBeDefined();
  });
  it('Delete Product', () => {
    expect(productModel.deleteOne).toBeDefined();
  });
});

describe('Test Create product methods', () => {
  const user = {
    email: 'ahmed@gmail.com',
    user_name: 'ahmedSamir',
    first_name: 'ahmed',
    last_name: 'samir',
    password: '123456',
  } as User;
  let userToke = ' ';
  it('user created', async () => {
    const createUser = await userModel.create(user);
    user.id = createUser.id;
    expect(createUser.email).toEqual('ahmed@gmail.com');
  });
  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users';
    await connection.query(sql);
    connection.release();
  });

  it('create product to authenticate user', async () => {
    const authUser = await request.post('/api/users/authenticate').set('content-type', 'application/json').send({
      email: 'ahmed@gmail.com',
      password: '123456',
    });

    const textParse = JSON.parse(authUser.text);

    userToke = textParse.userToken;
    const productCreated = await request
      .post('/api/products/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        product_name: 'mobile',
        price: 3000,
        category: 'electronics',
      } as Product);
    expect(productCreated.status).toBe(200);
    const { product_name, price, category } = productCreated.body.data;
    expect(product_name).toEqual('mobile');
    expect(price).toEqual(3000);
    expect(category).toEqual('electronics');
  });

  it('create product2 to authenticate user', async () => {
    const createProduct2 = await request
      .post('/api/products/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        product_name: 'Blouse',
        price: 200,
        category: 'clothes',
      } as Product);
    expect(createProduct2.status).toBe(200);
    const { product_name, price, category } = createProduct2.body.data;
    expect(product_name).toEqual('Blouse');
    expect(price).toEqual(200);
    expect(category).toEqual('clothes');
  });

  it('index method', async () => {
    const getProducts = await productModel.index();
    expect(getProducts.length).toBe(2);
  });

  it('Show One Product method', async () => {
    const showOne = await productModel.show('2');
    expect(showOne?.id).toBe(2);
  });

  it('Update Product method', async () => {
    const update = await request
      .patch('/api/products/2')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        id: 2,
        product_name: 'TV',
        price: 2000,
        category: 'electro',
      } as Product);

    const { id, product_name, price, category } = update.body.data;
    expect(id).toBe(2);
    expect(product_name).toBe('TV');
    expect(price).toBe(2000);
    expect(category).toBe('electro');
  });

  it('Delete One Product method', async () => {
    const DeleteOne = await request
      .get(`/api/products/2`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);
    const { id } = DeleteOne.body.data;
    expect(id).toBe(2);
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = `ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
    await connection.query(sql);
    const sql2 = 'DELETE FROM products';
    await connection.query(sql2);
    connection.release();
  });
});
