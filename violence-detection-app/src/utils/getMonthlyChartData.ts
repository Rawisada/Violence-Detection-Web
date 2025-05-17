import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ViolenceData } from "@/app/types/ViolenceVideosTypes"; // ปรับ path ตามโปรเจกต์ของคุณ
import { COLOR_MAP, VIOLENCE_TYPES } from "@/constants/violenceType";

export const getMonthlyChartData = (data: ViolenceData[]) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  // Filter เฉพาะรายการในเดือนปัจจุบัน
  const monthlyViolence = data.filter(item => {
    const createdAt = parseISO(String(item.createdAt));
    return isWithinInterval(createdAt, { start, end });
  });
  

  // แยกตาม type (0, 1, 2)
  const chartData = [1, 2, 3, 4].map(typeId => {
    return {
      id: typeId,
      label: getLabelByType(typeId),
      value: monthlyViolence.filter(item => item.type === typeId).length,
      color: getColorByType(typeId),
    };
  });

  return chartData;
};

export function getColorByType(type: number): string {
  return COLOR_MAP[type] || "#ccc";
}

export function getLabelByType(type: number): string {
  return VIOLENCE_TYPES[type] || "Unknown";
}