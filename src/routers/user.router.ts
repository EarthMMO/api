import express, { NextFunction, Request, Response } from 'express';
import {} from '../controller/users.controller';

const userRouter = express.Router();
export { userRouter as default };

userRouter.post(
  '/',
  (request: Request, response: Response, next: NextFunction) => {}
);
