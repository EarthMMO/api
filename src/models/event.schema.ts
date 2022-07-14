import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IEvent {
  _id: string;
  name: string;
  website?: string;
  description?: string;
  numberOfMember: number;
  itemEventId?: string;
  itemName?: string;
  itemDescription?: string;
  fileName?: string;
  ItemNFTImageHash?: string;
  adminUserId?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    _id: {
      type: String,
      default: () => uuidv4().replaceAll("-", ""),
    },
    name: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    numberOfMember: {
      type: Number,
      required: true,
    },
    ItemNFTImageHash: {
      type: String,
      required: true,
    },
    itemEventId: {
      type: String,
    },
    itemName: {
      type: String,
    },
    itemDescription: {
      type: String,
    },
    fileName: {
      type: String,
    },
    adminUserId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = model<IEvent>("event", EventSchema);

export default EventModel;
