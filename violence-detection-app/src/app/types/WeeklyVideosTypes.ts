export interface WeeklyViodeosData {
    _id: number;
    videoName: string;
    date: string;
    videoPath: string;
    camera: number,
    fileSize: number,
}

export interface FilterWeeklyViodeos {
  camera: number[];
  date: string;
}