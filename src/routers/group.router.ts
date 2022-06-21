import express, { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import CustomError from '../exceptions/custom_error';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
} from '../controller/group.controller';
import {
  validateJWT,
  UserRequest,
} from '../middleware/validate_jwt.middleware';

const groupRouter = express.Router();
export { groupRouter as default };

groupRouter.post(
  '/',
  validateJWT,
  [check('name').isString().withMessage('Invalid name')],
  async (
    request: UserRequest & { file?: any },
    response: Response,
    next: NextFunction
  ) => {
    console.log('WE ARE IN THE GROUP ROUTER');
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      const userDetails = await createGroup({
        adminId: request.userDetails?.id as string,
        name: request.body.name,
        description: request.body.description,
        maxGroupSize: request.body.maxGroupSize,
      });
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.patch(
  '/',
  validateJWT,
  [check('groupId').isString().withMessage('Invalid groupId')],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      await updateGroup(request.body.userId, request.body.groupId, response);
      response.status(200).send({});
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.get(
  '/',
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const groups = await getAllGroups();
      return response.status(200).send(groups);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.get(
  '/:groupId',
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.params.groupId) {
        return response.status(400).send({ message: 'Invalid groupId' });
      }
      const group = await getGroupById(request.params.groupId);
      return group;
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);
