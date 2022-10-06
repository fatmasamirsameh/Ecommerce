import { NextFunction, Request, Response } from 'express';
import OrderProductModel from '../models/order_product';
const orderProModel = new OrderProductModel();

export const orderUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order_user = await orderProModel.orderUser(req.body.user_id);

    res.json({
      status: 'success',
      data: { ...order_user },
      message: 'Get orders for login user returned successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order_user = await orderProModel.orderUser(req.body.user_id);
    const order_product = await orderProModel.addProduct(req.body);

    const url = req.path.split('/');
    console.log(url);
    for (let i = 0; i < order_user.length; i++) {
      const searchId = order_user[i].id as unknown as string;
      

      if (searchId == url[2]) {
       
        if (order_user[i].status == 'active') {
         
          order_product.order_id = order_user[i].id as unknown as string;
          return res.json({
            status: 'success',
            data: { ...order_product },
            message: 'add Product created successfully',
          });
        }
      }
    }

    return res.json({
      status: 'Error',
      data: {},
      message: 'Please Enter Active order',
    });
  } catch (error) {
    res.json({
      status: 'Error',
      data: {},
      message: 'Product not found please enter valid product_id',
    });
    next();
  }
};

import { Router } from 'express';
import auth from './auth';
const orderProductRoute = Router();

orderProductRoute.route('/orders/:id/products').post(auth, addProduct);

export default orderProductRoute;
