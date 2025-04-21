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
  const chartData = [0, 1, 2].map(typeId => {
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
    case 0: return "Child - Adult";
    case 1: return "Adult - Adult";
    case 2: return "Child - Child";
    default: return "Unknown";
  }
}

// Helper แปลง typeId เป็นสี
function getColorByType(type: number) {
  switch (type) {
    case 0: return "#1976d2";
    case 1: return "#4fc3f7";
    case 2: return "#90a4ae";
    default: return "#ccc";
  }
}
