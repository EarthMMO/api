// @ts-nocheck
import * as fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { check, validationResult } from "express-validator";

import CustomError from "../exceptions/custom_error";
import UserModel from "../models/user.schema";
import {
  UserRequest,
  validateJWT,
} from "../middlewares/validate_jwt.middleware";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/user.controller";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "static/uploads");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.originalname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
}); //10MB

const userRouter = express.Router();
export { userRouter as default };

userRouter.post(
  "/",
  [
    check("firstName")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid firstName"),
    check("lastName")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid lastName"),
    check("email")
      .optional()
      .isEmail()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid email"),
    // TODO validate for the ethereum address specific
    check("ethereumAddress")
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid ethereumAddress"),
    check("signature")
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage("Invalid signature"),
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
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
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.post(
  "/login",
  [
    check("ethereumAddress")
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid ethereumAddress"),
    check("signature")
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage("Invalid signature"),
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
        );
      }
      const userDetails = await loginUser(
        request.body.ethereumAddress,
        request.body.signature
      );
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.patch(
  "/",
  validateJWT, // populates req.user by validating JWT
  [
    check("NFT.name")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid NFT.name"),
    check("NFT.contractAddress")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid signature"),
    check("NFT.tokenId")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid NFT.contractAddress"),
    check("NFT.eventId")
      .optional()
      .isString()
      .isLength({ min: 3, max: 80 })
      .withMessage("Invalid NFT.contractAddress"),
  ],
  async (request: UserRequest, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
        );
      }
      const userDetails = await updateUser(
        request.body.NFT,
        request.userDetails?.id as string
      );
      response.status(200).send(userDetails);
    } catch (e: any) {
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

userRouter.get(
  "/:userId",
  validateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const user = await getUser(userId);
    res.status(200).send(user);
  }
);

userRouter.patch(
  "/:userId/upload",
  validateJWT,
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await getUser(userId);
      await UserModel.updateOne(
        { id: userId },
        { profileImagePath: req.file.path }
      );
      res.status(200).send(user);
    } catch (error) {
      console.log("ERROR", error);
    }
  }
);

userRouter.use(function (err, req, res, next) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("404");
  }
});
