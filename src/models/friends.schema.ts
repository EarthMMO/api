import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Friend {
  _id: string;
  requesterId: String,
  recipientId: String,
  status: number
}

const friendsSchema = new Schema<Friend>(
  {
    _id: {
      type: String,
      default: () => uuidv4().replaceAll("-", ""),
    },
    requesterId: { type: String, required: true },
    recipientId: { type: String, required: true },
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
      }
    },
      {
    timestamps: true,
  }
);

const FriendModel = model<Friend>("Friends", friendsSchema);

export default FriendModel;
