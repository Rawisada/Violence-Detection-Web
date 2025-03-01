export interface ViolenceData {
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