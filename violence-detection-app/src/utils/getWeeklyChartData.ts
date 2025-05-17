import { ViolenceData } from "@/app/types/ViolenceVideosTypes";
import { COLOR_MAP, VIOLENCE_TYPES } from "@/constants/violenceType";
import { formatDate } from "@/lib/formate";
import { subDays, format } from "date-fns";

export function getLast7Days(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    return format(subDays(today, 6 - i), "yyyy-MM-dd"); 
  });
}

export function getWeeklyDataByType(data: ViolenceData[]) {
  const days = getLast7Days();
  const countsByType: Record<number, number[]> = {
    1: Array(7).fill(0),
    2: Array(7).fill(0),
    3: Array(7).fill(0),
    4: Array(7).fill(0),
  };

  for (const entry of data) {
    const idx = days.indexOf(entry.date);
    if (idx !== -1) {
      countsByType[entry.type][idx]++;
    }
  }

  return {
    days: days.map(date => formatDate(date)),
    weeklyData: [1, 2, 3, 4].map((type) => ({
      label: VIOLENCE_TYPES[type],
      data: countsByType[type],
      color: COLOR_MAP[type],
    })),
  };
}
