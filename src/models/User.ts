import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: () => {
      const now = new Date();
      const offset = -5 * 60 * 60 * 1000;
      return new Date(now.getTime() + offset);
    }},
  }
);

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);