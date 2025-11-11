import type { TimeRangePatternKey, TimeRangePattern } from '../types';

export const timeRangePatterns: Record<TimeRangePatternKey, TimeRangePattern> = {
  'all-day': { label: '24時間表示', start: 0, end: 23 },
  'work1': { label: '勤怠：ノーマル', start: 8, end: 18 },
  'work2': { label: '勤怠：モダン', start: 10, end: 20 },
};

export const themes = [
  { value: 'theme-yuki', label: '雪' },
  { value: 'theme-yanagi', label: '柳' },
  { value: 'theme-uguisu', label: '鶯' },
  { value: 'theme-koori', label: '氷' },
  { value: 'theme-fuji', label: '藤' },
  { value: 'theme-sakura', label: '桜' },
  { value: 'theme-koubai', label: '紅梅' },
  { value: 'theme-moe', label: '萌黄' },
  { value: 'theme-momiji', label: '紅葉' },
  { value: 'theme-kiku', label: '菊' },
] as const;
