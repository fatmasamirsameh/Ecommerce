import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHead = req.headers.authorization as string;
    const token = authHead.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN as unknown as string);
    const stringdecode = JSON.stringify(decoded);
    const user_id = JSON.parse(stringdecode).user.id;
    req.body.user_id = user_id;

    next();
  } catch (error) {
    res.json({
      status: 'error',
      message: 'please send available token',
    });
  }
};
export default auth;
