import { getLocalDateString, getWeekdayLabel } from './dateUtils';
import { getEndTime } from './slotUtils';

export function generateOutputText(
  selectedSlots: Set<string>,
  timeInterval: number,
  showWeekday: boolean,
  useTemplate: boolean
): string {
  const map: Record<string, string[]> = {};
  Array.from(selectedSlots).forEach(slot => {
    const parts = slot.split('-');
    const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const time = parts[3] ?? '';
    if (time) {
      (map[date] ||= []).push(time);
    }
  });
  const keys = Object.keys(map).sort();
  if (keys.length === 0) return '';

  const results: string[] = [];
  for (const date of keys) {
    const times = map[date]!.sort();
    const ranges: string[] = [];
    let rangeStart = times[0]!;
    let rangeEnd = times[0]!;
    for (let i = 1; i < times.length; i++) {
      const prevParts = rangeEnd.split(':').map(Number);
      const curParts = times[i]!.split(':').map(Number);
      const ph = prevParts[0] ?? 0;
      const pm = prevParts[1] ?? 0;
      const ch = curParts[0] ?? 0;
      const cm = curParts[1] ?? 0;
      const prevTotal = ph * 60 + pm;
      const curTotal = ch * 60 + cm;
      if (curTotal === prevTotal + timeInterval) {
        rangeEnd = times[i]!;
      } else {
        ranges.push(`${rangeStart}-${getEndTime(rangeEnd, timeInterval)}`);
        rangeStart = times[i]!;
        rangeEnd = times[i]!;
      }
    }
    if (rangeStart) ranges.push(`${rangeStart}-${getEndTime(rangeEnd, timeInterval)}`);

    const formatted = date.replace(/-/g, '/');
    let dateText = formatted;
    if (showWeekday) {
      const d = new Date(`${date}T00:00:00`);
      const weekday = getWeekdayLabel(d);
      dateText = `${formatted}(${weekday})`;
    }
    results.push(`${dateText} ${ranges.join(',')}`);
  }

  const basic = results.join('\n');
  if (!useTemplate) return basic;
  return `〇〇様

お世話になっております。
▲▲です。

この度はMTGのご快諾誠にありがとうございます。

当方の候補日を以下に記載させていただきます。

\`\`\`
${basic}
\`\`\`

以上、ご確認のほどよろしくお願いいたします。`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    return true;
  } catch {
    return false;
  }
}
