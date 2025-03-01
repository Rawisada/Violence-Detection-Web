import mongoose, { Schema, Document } from "mongoose";

export interface IWeeklyVideos extends Document {
  videoName: string;
  date: string;
  videoPath: string;
  camera: number;
  fileSize: number;
}

const WeeklyVideosSchema: Schema = new Schema(
  {
    videoName: { type: String, required: true },
    date: { type: String, required: true },
    videoPath: { type: String, required: true },
    camera: { type: Number, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.WeeklyVideos || mongoose.model<IWeeklyVideos>("WeeklyVideos", WeeklyVideosSchema);
