process.env.NODE_ENV = 'test';
import db from '../database';
import UserModel from '../models/user';
import supertest from 'supertest';
import app from '../server.js';
const userModel = new UserModel();
const request = supertest(app);

export type User = {
  id?: number;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
};

describe('Test methods', () => {
  it('Get All Users ', () => {
    expect(userModel.index).toBeDefined();
  });

  it(' Get Specific User', () => {
    expect(userModel.show).toBeDefined();
  });
  it('create User', () => {
    expect(userModel.create).toBeDefined();
  });
  it('Update user', () => {
    expect(userModel.updateOne).toBeDefined();
  });
  it('Delete user', () => {
    expect(userModel.deleteOne).toBeDefined();
  });
  it(' Authenticate user', () => {
    expect(userModel.authenticate).toBeDefined();
  });
});

describe('Create user', () => {
  const user = {
    email: 'xx@gmail.com',
    user_name: 'xxSamir',
    first_name: 'xx',
    last_name: 'samir',
    password: '123456',
  } as User;
  let userToke = '';
  afterAll(async () => {
    const connection = await db.connect();
    const sql2 = `ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    await connection.query(sql2);
    const sql = 'DELETE FROM users';
    await connection.query(sql);
    connection.release();
  });
  it('user created', async () => {
    const createUser = await userModel.create(user);
    user.id = createUser.id;
    expect(createUser.email).toEqual('xx@gmail.com');
    expect(createUser.user_name).toEqual('xxSamir');
  });

  it('should return the authenticated user', async () => {
    const authUser = await userModel.authenticate(user.email, user.password as string);
    expect(authUser?.email).toBe(user.email);
    expect(authUser?.user_name).toBe(user.user_name);
  });
  it('should return null for wrong data', async () => {
    const WrongUser = await userModel.authenticate('kk', '11');
    expect(WrongUser).toBe(null);
  });

  it('show user by authenticate user', async () => {
    const authUser = await request.post('/api/users/authenticate').set('content-type', 'application/json').send({
      email: 'xx@gmail.com',
      password: '123456',
    });

    const textParse = JSON.parse(authUser.text);

    userToke = textParse.userToken;

    const user2 = {
      email: 'yy@gmail.com',
      user_name: 'yySamir',
      first_name: 'yy',
      last_name: 'samir',
      password: '123456',
    } as User;
    const createUser2 = await userModel.create(user2);
    user.id = createUser2.id;
  });

  it('Show One User', async () => {
    const showUser = await request
      .get(`/api/users/3`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);
    const { id } = showUser.body.data;
    expect(id).toBe(3);
  });

  it('Get All Users', async () => {
    const getAllUsers = await request
      .get(`/api/users/`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);

    expect(Object.keys(getAllUsers.body).length).toBe(2);
  });

  it('Update User', async () => {
    const updateUser = await request
      .patch('/api/users/4')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`)
      .send({
        id: 4,
        email: 'gg@gmail.com',
        user_name: 'ggSamir',
        first_name: 'gg',
        last_name: 'samir',
        password: '123456',
      } as User);
    expect(updateUser.status).toBe(200);
    const { email, user_name } = updateUser.body.data;
    expect(email).toBe('gg@gmail.com');
    expect(user_name).toBe('ggSamir');
  });

  it('Delete One User method', async () => {
    const DeleteOne = await request
      .get(`/api/users/4`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${userToke}`);
    const { id } = DeleteOne.body.data;
    expect(id).toBe(4);
  });
});
