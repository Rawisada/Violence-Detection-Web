import { parseISO, getMonth, getYear } from "date-fns";
import { ViolenceData } from "@/app/types/ViolenceVideosTypes";
import { COLOR_MAP, VIOLENCE_TYPES } from "@/constants/violenceType";

// ฟังก์ชันหลัก
export const getAnnualChartData = (data: ViolenceData[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // เตรียมโครงสร้างข้อมูล: 12 เดือน, 3 ประเภท type (0, 1, 2)
  const result = [1, 2, 3, 4].map(typeId => ({
    label: getLabelByType(typeId),
    color: getColorByType(typeId),
    data: Array(12).fill(0), // 12 เดือนเริ่มจาก Jan=0 ถึง Dec=11
  }));

  data.forEach((item) => {
    const date = parseISO(String(item.createdAt));
    const month = getMonth(date); // index 0-11
    const year = getYear(date);

    if (year === currentYear) {
      const type = item.type;
      const typeSeries = result.find(series => series.label === getLabelByType(type));
      if (typeSeries) {
        typeSeries.data[month]++;
      }
    }
  });

  return result;
};

export function getColorByType(type: number): string {
  return COLOR_MAP[type] || "#ccc";
}

export function getLabelByType(type: number): string {
  return VIOLENCE_TYPES[type] || "Unknown";
}