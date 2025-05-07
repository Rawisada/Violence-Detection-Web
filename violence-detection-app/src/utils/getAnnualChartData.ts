import { parseISO, getMonth, getYear } from "date-fns";
import { ViolenceData } from "@/app/types/ViolenceVideosTypes";

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

// ช่วยแปลงประเภทเป็น label
function getLabelByType(type: number) {
  switch (type) {
    case 1: return "Critical";
    case 2: return "High";
    case 3: return "Medium";
    case 4: return "Low";
    default: return "Unknown";
  }
}

// Helper แปลง typeId เป็นสี
function getColorByType(type: number) {
  switch (type) {
    case 1: return "#1976d2";
    case 2: return "#4fc3f7";
    case 3: return "#b3e5fc";
    case 4: return "#90a4ae";
    default: return "#ccc";
  }
}
