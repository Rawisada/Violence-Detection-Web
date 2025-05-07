import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ViolenceData } from "@/app/types/ViolenceVideosTypes"; // ปรับ path ตามโปรเจกต์ของคุณ

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

// Helper แปลง typeId เป็นชื่อ
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
