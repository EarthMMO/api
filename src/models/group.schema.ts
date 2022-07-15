import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IGroup {
  _id: string;
  adminId?: string;
  name: string;
  description?: string;
  memberIds: string[];
  maxGroupSize: number;
}

const GroupSchema = new Schema<IGroup>(
  {
    _id: {
      type: String,
      default: () => uuidv4().replaceAll("-", ""),
    },
    adminId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    memberIds: Array,
    maxGroupSize: Number,
  },
  {
    timestamps: true,
  }
);

GroupSchema.statics.getAllGroups = async function () {
  try {
    return this.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "memberIds",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          _id: 1,
          adminId: 1,
          name: 1,
          description: 1,
          "members._id": 1,
          "members.profileImagePath": 1,
        },
      },
    ]);
  } catch (error) {
    throw error;
  }
};

GroupSchema.statics.getGroupById = async function (groupId) {
  try {
    const aggregate = await this.aggregate([
      { $match: { _id: groupId } },
      {
        $lookup: {
          from: "users",
          localField: "memberIds",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          _id: 1,
          adminId: 1,
          name: 1,
          description: 1,
          "members._id": 1,
          "members.profileImagePath": 1,
        },
      },
    ]);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
};

export default model<IGroup>("group", GroupSchema);
