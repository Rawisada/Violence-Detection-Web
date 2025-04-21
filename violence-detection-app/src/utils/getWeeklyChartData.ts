import { ViolenceData } from "@/app/types/ViolenceVideosTypes";
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
    0: Array(7).fill(0),
    1: Array(7).fill(0),
    2: Array(7).fill(0),
  };

  for (const entry of data) {
    const idx = days.indexOf(entry.date);
    if (idx !== -1) {
      countsByType[entry.type][idx]++;
    }
  }

  return {
    // days: days.map(date => format(new Date(date), 'EEE').toUpperCase()), // ['MON', 'TUE', ...]
    days: days.map(date => formatDate(date)),
    weeklyData: [
      {
        label: 'Child - Adult',
        data: countsByType[0],
        color: '#1976d2',
      },
      {
        label: 'Adult - Adult',
        data: countsByType[1],
        color: '#4fc3f7',
      },
      {
        label: 'Child - Child',
        data: countsByType[2],
        color: '#90a4ae',
      },
    ]
  };
}
