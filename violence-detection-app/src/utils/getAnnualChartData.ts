import { parseISO, getMonth, getYear } from "date-fns";
import { ViolenceData } from "@/app/types/ViolenceVideosTypes";

// ฟังก์ชันหลัก
export const getAnnualChartData = (data: ViolenceData[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // เตรียมโครงสร้างข้อมูล: 12 เดือน, 3 ประเภท type (0, 1, 2)
  const result = [0, 1, 2].map(typeId => ({
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

// ช่วยแปลงประเภทเป็น label
function getLabelByType(type: number) {
  switch (type) {
    case 0: return "Child - Adult";
    case 1: return "Adult - Adult";
    case 2: return "Child - Child";
    default: return "Unknown";
  }
}

// ช่วยแปลงประเภทเป็นสี
function getColorByType(type: number) {
  switch (type) {
    case 0: return "#1976d2";
    case 1: return "#4fc3f7";
    case 2: return "#90a4ae";
    default: return "#ccc";
  }
}
