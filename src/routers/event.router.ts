const multer = require('multer');
import express, { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import CustomError from '../exceptions/custom_error';
import {
  createEvent,
  getAllEvent,
  getEventById,
  updateEvent,
} from '../controller/event.controller';
import {
  validateJWT,
  UserRequest,
} from '../middleware/validate_jwt.middleware';

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, 'static/');
  },
  filename: (req: Request, file: any, cb: any) => {
    let parts = file.originalname.split('.');
    let ext = parts.pop();
    let name = parts.join('.');
    parts = name.split(' ').join('.');
    cb(null, +Date.now() + '.' + ext);
  },
});

const upload = multer({ storage: storage });

const userRouter = express.Router();
export { userRouter as default };

userRouter.post(
  '/',
  validateJWT,
  upload.single('eventImage'),
  [
    check('name').isString().withMessage('Invalid numberOfMember'),
    check('numberOfMember').isInt().withMessage('Invalid numberOfMember'),
  ],

  async (
    request: UserRequest & { file?: any },
    response: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      const userDetails = await createEvent({
        name: request.body.name,
        description: request.body.description,
        itemName: request.body.itemName,
        itemDescription: request.body.itemDescription,
        website: request.body.website,
        numberOfMember: request.body.numberOfMember,
        fileName: request?.file?.filename,
        adminUserId: request.userDetails?.id as string,
      });
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
  validateJWT,
  [
    check('eventId').isString().withMessage('Invalid eventId'),
    check('itemEventId').isString().withMessage('Invalid itemEventId'),
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError('Invalid fields', 400, '00002', errors.array())
        );
      }
      await updateEvent(request.body.eventId, request.body.itemEventId);
      response.status(200).send({});
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.get(
  '/:eventId',
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.params.eventId)
        return response.status(400).send({ message: 'Invalid eventId' });
      const event = await getEventById(request.params.eventId);
      return event;
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);
userRouter.get(
  '/',
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const event = await getAllEvent();
      return response.status(200).send(event);
    } catch (e: any) {
      console.error('Error');
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);
