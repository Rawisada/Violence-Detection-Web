// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

interface IProfile {
  firstName: string;
  lastName?: string;
  image?: string;
  role?: string;
  organization?: string;
}

interface IUser extends Document {
  email: string;
  profile: IProfile;
  hash?: string;
  salt?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    hash: {
      type: String,
      trim: true,
      required: false,
    },
    salt: {
      type: String,
      trim: true,
      required: false,
    },
    profile: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        trim: true,
      },
      organization: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
