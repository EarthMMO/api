import { v4 as uuidv4 } from "uuid";

import CustomError from "exceptions/custom_error";
import GroupModel, { IGroup } from "models/group.schema";
import UserModel from "models/user.schema";
import { logger } from "utils/logger";

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

export const createGroup = async (request: any) => {
  try {
    const id = uuidv4();
    const { adminId, description, maxGroupSize, name } = request;
    const admin = await UserModel.findOne({ id: adminId });

    logger.debug({
      adminId,
      description,
      id,
      maxGroupSize,
      members: [
        {
          id: adminId,
          profileImagePath: admin?.profileImagePath,
        },
      ],
      name,
    });

    await GroupModel.create({
      adminId,
      description,
      id,
      maxGroupSize,
      members: [
        {
          id: adminId,
          profileImagePath: admin?.profileImagePath,
        },
      ],
      name,
    });

    return { id };
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error("Error in logging the group: ", error);
    throw new CustomError("Oops! something went wrong", 500, undefined, error);
  }
};

export const getGroupById = async (groupId: string) => {
  try {
    const group = await GroupModel.findOne({ id: groupId });
    if (!group) throw new CustomError("Group not found", 404, undefined);
    return sanitizeGroupResponse(group);
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error("Error in logging the group: ", error);
    throw new CustomError("Oops! something went wrong", 500, undefined, error);
  }
};

export const getAllGroups = async () => {
  try {
    const groups = await GroupModel.find({});
    const sanitizedGroups = groups.map((group: any) =>
      sanitizeGroupResponse(group)
    );
    return sanitizedGroups;
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error("Error in logging the group: ", error);
    throw new CustomError("Oops! something went wrong", 500, undefined, error);
  }
};
