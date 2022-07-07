import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import CustomError from "exceptions/custom_error";
import Group, { IGroup } from "models/group.schema";
import UserModel from "models/user.schema";
import { UserRequest } from "middlewares/validate_jwt.middleware";

export interface GroupResponse {
  id?: string;
  created: Date;
  adminId?: string;
  name: string;
  description?: string;
  members: string[];
  maxGroupSize: number;
}

const sanitizeGroupResponse = (group: IGroup): GroupResponse => {
  const _group: any = group;
  delete _group._id;
  return _group;
};

export default {
  onCreateGroup: async (request: UserRequest, response: Response) => {
    try {
      const { description, maxGroupSize, name } = request.body;
      const adminId = request.userDetails?.id as string;
      const admin = await UserModel.findOne({ id: adminId });

      const group = await Group.create({
        adminId,
        description,
        id: uuidv4(),
        maxGroupSize,
        members: [
          {
            id: adminId,
            profileImagePath: admin?.profileImagePath,
          },
        ],
        name,
      });

      return response.status(200).json(group);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  },
  onGetAllGroups: async (request: Request, response: Response) => {
    try {
      const groups = await Group.find();
      const sanitizedGroups = groups.map((group: any) =>
        sanitizeGroupResponse(group)
      );
      return response.status(200).json(sanitizedGroups);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  },
  onGetGroupById: async (request: Request, response: Response) => {
    try {
      const group = await Group.findOne({ id: request.params.groupId });
      const sanitizedGroup = sanitizeGroupResponse(group!);
      return response.status(200).json(sanitizedGroup);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  },
  onJoinOrLeaveGroup: async (request: Request, response: Response) => {
    try {
      const groupId = request.params.groupId;
      const userId = request.body.userId;
      const action = request.body.action;

      const user = await UserModel.findOne({ id: userId });
      let group = await Group.findOne({ id: groupId });

      if (!user || !group) {
        throw new CustomError("Invalid userId or groupId", 400, "00003", {});
      }
      if (group?.members.length! + 1 > +group?.maxGroupSize!) {
        throw new CustomError(
          "Can not add more participants!",
          400,
          "00004",
          {}
        );
      }

      if (action === "join") {
        group = await Group.findOneAndUpdate(
          { id: groupId },
          {
            $push: {
              members: {
                id: userId,
                profileImagePath: user.profileImagePath,
              },
            },
          },
          {
            new: true,
          }
        );
      } else if (action === "leave") {
        group = await Group.findOneAndUpdate(
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

      return response.status(200).json(group);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  },
};
