import mongoose, { Schema, Document } from "mongoose";

export interface IViolence extends Document {
  videoName: string;
  type: number;
  person: number[];
  date: string;
  time: string;
  videoPath: string;
  camera: number;
  fileSize: number;
}

const ViolenceSchema: Schema = new Schema(
  {
    videoName: { type: String, required: true },
    type: { type: Number, required: true },
    person: { type: [Number], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    videoPath: { type: String, required: true },
    camera: { type: Number, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Violence || mongoose.model<IViolence>("Violence", ViolenceSchema);
