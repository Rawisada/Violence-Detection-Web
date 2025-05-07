import dayjs from "dayjs";

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("DD/MM/YYYY");
};

export const formatFileSize = (sizeInMB: number): string => {
  if (sizeInMB >= 1000) {
      const sizeInGB = sizeInMB / 1000;
      return `${sizeInGB.toFixed(2)} GB`;
  }
  return `${sizeInMB} MB`;
};


export const formatTime = (timeString: string): string => {
  return timeString.replace(/-/g, ":");
};