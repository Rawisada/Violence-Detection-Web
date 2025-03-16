import mongoose, { Schema, Document } from "mongoose";

export interface ICamera extends Document {
  camera: number;
  name: string;
  ip: string;
  status: boolean;
}

const CameraSchema: Schema = new Schema(
  {
    camera: { type: Number, required: true },
    name: { type: String, required: true },
    ip: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Camera || mongoose.model<ICamera>("Camera", CameraSchema);
