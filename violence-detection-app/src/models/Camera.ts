import mongoose, { Schema, Document } from "mongoose";

export interface ICamera extends Document {
  camera: number;
}

const CameraSchema: Schema = new Schema(
  {
    camera: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Camera || mongoose.model<ICamera>("Camera", CameraSchema);
