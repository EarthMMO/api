import CustomError from '../exceptions/custom_error';
import GroupModel, { IGroup } from '../services/mongodb/group.schema';
import UserModel from '../services/mongodb/user.schema';
import { Response } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

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
    const { adminId, name, description, maxGroupSize } = request;

    logger.debug({
      id,
      adminId,
      name,
      description,
      maxGroupSize,
    });

    await GroupModel.create({
      id,
      adminId,
      name,
      description,
      maxGroupSize,
    });

    return { id };
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the group: ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};

export const updateGroup = async (
  userId: string,
  groupId: string,
  response: Response
) => {
  try {
    const user = await UserModel.findOne({ userId });
    const group = await GroupModel.findOne({ groupId });

    if (!user || !group) {
      response.status(400).send('Invalid userId or groupId');
    }
    if (+group?.maxGroupSize! >= group?.members.length!) {
      response.status(400).send('Can not add more participants!');
    }

    await GroupModel.updateOne({ groupId }, { $push: { members: userId } });
    response.status(200).send({});
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the group: ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};

export const getGroupById = async (groupId: string) => {
  try {
    const group = await GroupModel.findOne({ id: groupId });
    if (!group) throw new CustomError('Group not found', 404, undefined);
    return sanitizeGroupResponse(group);
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the group: ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
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
    logger.error('Error in logging the group: ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};
