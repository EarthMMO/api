import { Request, Response } from "express";

import CustomError from "exceptions/custom_error";
import Group from "models/group.schema";
import User from "models/user.schema";
import { UserRequest } from "middlewares/validate_jwt.middleware";

export interface GroupResponse {
  _id: string;
  adminId: string;
  description?: string;
  maxGroupSize: number;
  memberIds: string[];
  name: string;
}

export default {
  onCreateGroup: async (request: UserRequest, response: Response) => {
    try {
      const { description, maxGroupSize, name } = request.body;
      const adminId = request.userDetails?.id as string;

      const group = await Group.create({
        adminId,
        name,
        description,
        maxGroupSize,
        memberIds: [adminId],
      });

      return response.status(200).json(group);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetAllGroups: async (request: Request, response: Response) => {
    try {
      const groups = await Group.getAllGroups();
      return response.status(200).json(groups);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetGroupById: async (request: Request, response: Response) => {
    try {
      const group = await Group.getGroupById(request.params.groupId);
      return response.status(200).json(group);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onJoinOrLeaveGroup: async (request: Request, response: Response) => {
    try {
      const groupId = request.params.groupId;
      const userId = request.body.userId;
      const action = request.body.action;

      const user = await User.findOne({ _id: userId });
      let group = await Group.findOne({ _id: groupId });

      if (!user || !group) {
        throw new CustomError("Invalid userId or groupId", 400, "00003", {});
      }
      if (
        action === "join" &&
        group?.memberIds.length! + 1 > +group?.maxGroupSize!
      ) {
        throw new CustomError(
          "Can not add more participants!",
          400,
          "00004",
          {}
        );
      }

      if (action === "join") {
        group = await Group.findOneAndUpdate(
          { _id: groupId },
          {
            $push: {
              memberIds: userId,
            },
          },
          {
            new: true,
          }
        );
      } else if (action === "leave") {
        group = await Group.findOneAndUpdate(
          { _id: groupId },
          {
            $pull: {
              memberIds: userId,
            },
          },
          {
            new: true,
          }
        );
      }

      group = await Group.getGroupById(groupId);
      return response.status(200).json(group);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
};
