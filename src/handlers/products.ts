import { NextFunction, Request, Response } from 'express';

import ProductModel from '../models/product';

const productModel = new ProductModel();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.create(req.body);

    res.json({
      data: { ...product },
      message: 'Product created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const index = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.index();

    res.json({
      data: { ...product },
      message: 'Product retreived all successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.show(req.params.id as unknown as string);
    if (product == null) {
      res.json({ message: 'please enter valid id' });
    }
    res.json({
      data: product,
      message: 'Product retreived successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.updateOne(req.body);
    if (product == null) {
      res.json({
        status: 'Error',
        data: product,
        message: 'Please Enter Vaild id',
      });
    }
    res.json({
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.deleteOne(req.params.id as unknown as string);

    res.json({
      data: product,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

import { Router } from 'express';
import auth from '../handlers/auth';
const productRoutes = Router();

productRoutes.route('/products/').get(index).post(auth, create);
productRoutes.route('/products/:id').get(show).patch(auth, updateOne).delete(auth, deleteOne);

export default productRoutes;
