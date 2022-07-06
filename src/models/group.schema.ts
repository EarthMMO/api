import { Schema, model } from "mongoose";

export interface IGroup {
  id?: string;
  adminId?: string;
  name: string;
  description?: string;
  members: { id: string; profileImagePath?: string }[];
  maxGroupSize: number;
}

const GroupSchema = new Schema<IGroup>(
  {
    id: {
      type: String,
      unique: true,
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
    members: [
      {
        id: {
          type: String,
        },
        profileImagePath: {
          type: String,
        },
      },
    ],
    maxGroupSize: Number,
  },
  {
    timestamps: true,
  }
);

const GroupModel = model<IGroup>("group", GroupSchema);

export default GroupModel;
