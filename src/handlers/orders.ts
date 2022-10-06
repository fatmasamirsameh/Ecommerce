import { NextFunction, Request, Response } from 'express';

import OrderModel from '../models/order';
const orderModel = new OrderModel();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.create(req.body);
    res.json({
      data: { ...order },
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const index = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.index();

    res.json({
      data: { ...order },
      message: 'Order retreived all successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.show(req.params.id as unknown as string);
    if (order == null) {
      res.json({
        status: 'Error',
        data: order,
        message: 'Please Enter Vaild id',
      });
    } else {
      res.json({
        data: order,
        message: 'Order retreived successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.updateOne(req.body);
    if (order == null) {
      res.json({
        status: 'Error',
        data: order,
        message: 'Please Enter Vaild  valid id',
      });
    } else {
      res.json({
        data: order,
        message: 'Order updated successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.deleteOne(req.params.id as unknown as string);
    if (order == null) {
      res.json({
        status: 'Error',
        data: order,
        message: 'Please Enter Vaild id',
      });
    } else {
      res.json({
        data: order,
        message: 'Order deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

import { Router } from 'express';
const orderRoutes = Router();
import auth from '../handlers/auth';
orderRoutes.route('/orders/').get(auth, index).post(auth, create);
orderRoutes.route('/orders/:id').get(auth, show).patch(auth, updateOne).delete(auth, deleteOne);

export default orderRoutes;
