import { Schema, model } from 'mongoose';

export interface IGroup {
  id?: string;
  created: Date;
  adminUserId?: string;
  name: string;
  description?: string;
  members: string[];
  minGroupSize: number;
  maxGroupSize: number;
}

const GroupSchema = new Schema<IGroup>({
  id: {
    type: String,
    unique: true,
  },
  created: { type: Date, default: Date.now },
  adminUserId: {
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
  members: [String],
  minGroupSize: Number,
  maxGroupSize: Number,
});

const GroupModel = model<IGroup>('group', GroupSchema);

export default GroupModel;
