import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
const userModel = new UserModel();

export const create = async (req: Request, res: Response) => {
  try {
    if (
      req.body.email == undefined ||
      req.body.user_name == undefined ||
      req.body.first_name == undefined ||
      req.body.last_name == undefined ||
      req.body.password == undefined
    ) {
      return res.json({ message: 'please enter email ,user_name ,first_name ,last_name and password' });
    }
    const Alluser = await userModel.index();
    for (let i = 0; i < Alluser.length; i++) {
      if (Alluser[i].email == req.body.email) {
        return res.json({ message: 'please enter  unique email' });
      }
    }

    const user = await userModel.create(req.body);

    res.json({ user });
  } catch (err) {
    res.json(err);
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined) {
      return res.status(401).json({
        status: 'error',
        message: 'please enter email and password',
      });
    } else {
      const user = await userModel.authenticate(email, password);
      const userToken = jwt.sign({ user }, process.env.TOKEN as unknown as string);
      if (user == null) {
        return res.status(401).json({
          status: 'error',
          message: 'Wrong email or password please enter valid data',
        });
      }
      return res.json({ ...user, userToken });
    }
  } catch (err) {
    res.json(err);
  }
};

export const index = async (_req: Request, res: Response) => {
  try {
    const user = await userModel.index();

    res.json({ ...user });
  } catch (err) {
    res.json(err);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const user = await userModel.show(req.params.id as unknown as string);

    if (user == null) {
      res.json({
        status: 'Error',
        data: user,
        message: 'Please Enter Vaild id',
      });
    } else {
      res.json({
        status: 'success',
        data: user,
        message: 'User returned successfully',
      });
    }
  } catch (err) {
    res.json(err);
  }
};

export const updateOne = async (req: Request, res: Response) => {
  try {
    const user = await userModel.updateOne(req.body, req.body.id);
    if (user == null) {
      res.json({
        status: 'Error',
        data: user,
        message: 'Please Enter Vaild id',
      });
    } else {
      res.json({
        status: 'success',
        data: user,
        message: 'User updated successfully',
      });
    }
  } catch (err) {
    res.json(err);
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  try {
    const user = await userModel.deleteOne(req.body.id as unknown as string);
    if (user == null) {
      res.json({
        status: 'Error',
        data: user,
        message: 'Please Enter Vaild id',
      });
    } else {
      res.json({
        status: 'success',
        data: user,
        message: 'User deleted successfully',
      });
    }
  } catch (err) {
    res.json(err);
  }
};

import { Router } from 'express';
import auth from './auth';
const userRoutes = Router();

userRoutes.route('/users/').get(auth, index).post(create);
userRoutes.route('/users/:id').get(auth, show).patch(auth, updateOne).delete(auth, deleteOne);
userRoutes.route('/users/authenticate').post(authenticate);
export default userRoutes;
