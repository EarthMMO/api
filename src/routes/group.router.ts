import express, { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import CustomError from "../exceptions/custom_error";
import {
  createGroup,
  getAllGroups,
  getGroupById,
} from "../controllers/group.controller";
import {
  validateJWT,
  UserRequest,
} from "../middlewares/validate_jwt.middleware";
import GroupModel from "../models/group.schema";
import UserModel from "../models/user.schema";

const groupRouter = express.Router();
export { groupRouter as default };

groupRouter.post(
  "/",
  validateJWT,
  async (request: UserRequest, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
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
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.get(
  "/",
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const groups = await getAllGroups();
      return response.status(200).send(groups);
    } catch (e: any) {
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.get(
  "/:groupId",
  validateJWT,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.params.groupId) {
        return response.status(400).send({ message: "Invalid groupId" });
      }
      const group = await getGroupById(request.params.groupId);
      return group;
    } catch (e: any) {
      console.error("Error");
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);

groupRouter.patch(
  "/:groupId/:action",
  validateJWT,
  [check("groupId").isString().withMessage("Invalid groupId")],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
        );
      }

      const userId = request.body.userId;
      const groupId = request.params.groupId;
      const action = request.params.action;

      const user = await UserModel.findOne({ id: userId });
      let group = await GroupModel.findOne({ id: groupId });

      if (!user || !group) {
        console.log("ONE OF THEM ISN'T FOUND");
        return response.status(400).send("Invalid userId or groupId");
      }
      if (group?.members.length! + 1 > +group?.maxGroupSize!) {
        console.log("GROUP IS FULL");
        return response.status(400).send("Can not add more participants!");
      }

      console.log("USER PROFILE", user);
      if (action === "join") {
        group = await GroupModel.findOneAndUpdate(
          { id: groupId },
          {
            $push: {
              members: { id: userId, profileImagePath: user.profileImagePath },
            },
          },
          {
            new: true,
          }
        );
      } else if (action === "leave") {
        group = await GroupModel.findOneAndUpdate(
          { id: groupId },
          {
            $pull: {
              members: {
                id: userId,
              },
            },
          },
          {
            new: true,
          }
        );
      }

      console.log("GROUP", group);
      return response.status(200).send(group);
    } catch (e: any) {
      console.error("Error", e);
      if (e instanceof CustomError) return next(e);
      return next(new CustomError(undefined, undefined, undefined, e));
    }
  }
);
