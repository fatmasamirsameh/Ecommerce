process.env.NODE_ENV = 'test';
import db from '../database';
import { Order } from '../models/order';
import OrderModel from '../models/order';
import supertest from 'supertest';

import { User } from '../models/user';
import app from '../server.js';
import UserModel from '../models/user';
const userModel = new UserModel();
const request = supertest(app);
const orderModel = new OrderModel();

describe('Test methods', () => {
  it('Get All Orders ', () => {
    expect(orderModel.index).toBeDefined();
  });

  it(' Get Specific Order', () => {
    expect(orderModel.show).toBeDefined();
  });
  it('create Order', () => {
    expect(orderModel.create).toBeDefined();
  });
  it('Update Order', () => {
    expect(orderModel.updateOne).toBeDefined();
  });
  it('Delete Order', () => {
    expect(orderModel.deleteOne).toBeDefined();
  });
});

/////////////////////////////////////
describe('Create user to create order', () => {
  const user = {
    email: 'dina@gmail.com',
    user_name: 'dinaSamir',
    first_name: 'dina',
    last_name: 'samir',
    password: '123456',
  } as User;
  let userToke = ' ';
  it('user created', async () => {
    const createUser = await userModel.create(user);
    user.id = createUser.id;
    expect(createUser.email).toEqual('dina@gmail.com');
    expect(createUser.user_name).toEqual('dinaSamir');
  });
  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users';
    await connection.query(sql);
    connection.release();
  });

  it('create order to authenticate user', async () => {
    const authUser = await request.post('/api/users/authenticate').set('content-type', 'application/json').send({
      email: 'dina@gmail.com',
      password: '123456',
    });

    const textParse = JSON.parse(authUser.text);

    userToke = textParse.userToken;
    const createOrder = await request
      .post('/api/orders/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        status: 'complete',
      } as Order);
    expect(createOrder.status).toBe(200);
    const { status, user_id } = createOrder.body.data;
    expect(status).toBe('complete');
    expect(user_id).toBe(user.id);
  });

  it('create order2 to authenticate user', async () => {
    const createOrder2 = await request
      .post('/api/orders/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        status: 'active',
      } as Order);
    expect(createOrder2.status).toBe(200);
    const { status, user_id } = createOrder2.body.data;
    expect(status).toBe('active');
    expect(user_id).toBe(user.id);
  });

  it('Get All orders', async () => {
    const getAllOrders = await request
      .get(`/api/orders/`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);

    expect(Object.keys(getAllOrders.body.data).length).toBe(2);
  });

  it('Show order', async () => {
    const showOrder = await request
      .get(`/api/orders/2`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);
    const { id } = showOrder.body.data;
    expect(id).toBe(2);
  });

  it('Update Order method', async () => {
    const update = await request
      .patch('/api/orders/2')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        id: 2,
        status: 'complete',
      } as Order);

    const { status, user_id, id } = update.body.data;
    expect(id).toEqual(2);
    expect(status).toBe('complete');
    expect(user_id).toBe(user.id);
  });

  it('Delete One Order method', async () => {
    const DeleteOne = await request
      .get(`/api/orders/2`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);
    const { id } = DeleteOne.body.data;
    expect(id).toBe(2);
  });
  afterAll(async () => {
    const connection = await db.connect();
    const sql3 = `ALTER SEQUENCE orders_id_seq RESTART WITH 1`;
    await connection.query(sql3);
    const sql2 = 'DELETE FROM orders';
    await connection.query(sql2);
    connection.release();
  });
});
