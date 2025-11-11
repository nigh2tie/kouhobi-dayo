export function getLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getInitialWeekStart(today = new Date()): Date {
  const d = new Date(today);
  const day = d.getDay() || 7; // 1..7 (Mon=1)
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1); // Monday of current week
  return d;
}

export function getWeekdayLabel(date: Date): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[date.getDay()] || '';
}
