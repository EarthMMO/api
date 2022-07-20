import { Schema, model } from "mongoose";
import { IUser } from "./user.schema";

export interface Friend {
  id: string;
  requester: IUser,
  recipient: IUser,
  status: number
}


const friendsSchema = new Schema<Friend>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'Users'},
    recipient: { type: Schema.Types.ObjectId, ref: 'Users'},
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
