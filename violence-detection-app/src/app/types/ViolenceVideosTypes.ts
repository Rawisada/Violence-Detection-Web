export interface ViolenceData {
    createdAt(createdAt: any): unknown;
    _id: number;
    videoName: string;
    type: number; 
    date: string;
    time: string;
    videoPath: string;
    camera: number,
    fileSize: number,
}

export interface FilterViolenceVideos {
  camera: number[];
  date: string;
  type: string[];
}