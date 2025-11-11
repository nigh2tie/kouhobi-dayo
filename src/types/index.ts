export type DisplayMode = 'daily' | 'weekly';
export type TimeRangePatternKey = 'all-day' | 'work1' | 'work2';

export interface TimeRangePattern {
  label: string;
  start: number;
  end: number;
}

export interface RangeSelection {
  date: string;
  time: string;
}
