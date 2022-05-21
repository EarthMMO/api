import express, { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import {
  createUser,
  loginUser,
  updateUser,
} from '../controller/users.controller';
import CustomError from '../exceptions/custom_error';
import {
  validateJWT,
  UserRequest,
} from '../middleware/validate_jwt.middleware';

const userRouter = express.Router();
export { userRouter as default };

userRouter.post(
  '/',
  [
    check('firstName')
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid firstName'),
    check('lastName')
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid lastName'),
    check('email')
      .optional()
      .isEmail()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid email'),
    // TODO validate for the ethereum address specific
    check('ethereumAddress')
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid ethereumAddress'),
    check('signature')
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage('Invalid signature'),
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      const userDetails = await createUser({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        ethereumAddress: request.body.ethereumAddress,
        signature: request.body.signature,
      });
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.post(
  '/login',
  [
    check('ethereumAddress')
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid ethereumAddress'),
    check('signature')
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage('Invalid signature'),
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      const userDetails = await loginUser(
        request.body.ethereumAddress,
        request.body.signature
      );
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.patch(
  '/',
  validateJWT, // populates req.user by validating JWT
  [
    check('NFT.name')
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid NFT.name'),
    check('NFT.contractAddress')
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid signature'),
    check('NFT.tokenId')
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage('Invalid NFT.contractAddress'),
  ],
  async (request: UserRequest, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      const userDetails = await updateUser(
        request.body.NFT,
        request.userDetails?.id as string
      );
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);
