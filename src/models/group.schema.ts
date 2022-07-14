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
    memberIds: [String],
    maxGroupSize: Number,
  },
  {
    timestamps: true,
  }
);

const GroupModel = model<IGroup>("group", GroupSchema);

export default GroupModel;
