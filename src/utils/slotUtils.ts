import { getLocalDateString } from './dateUtils';

export function getSlotKey(date: string | Date, time: string): string {
  const dateStr = date instanceof Date ? getLocalDateString(date) : date;
  return `${dateStr}-${time}`;
}

export function sameDay(a: string | Date, b: string | Date): boolean {
  const as = a instanceof Date ? getLocalDateString(a) : a;
  const bs = b instanceof Date ? getLocalDateString(b) : b;
  return as === bs;
}

export function getEndTime(startTime: string, timeInterval: number): string {
  const parts = startTime.split(':').map(Number);
  const hour = parts[0] ?? 0;
  const minute = parts[1] ?? 0;
  let endMinute = minute + timeInterval;
  let endHour = hour;
  if (endMinute >= 60) {
    endMinute -= 60;
    endHour += 1;
  }
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
}
