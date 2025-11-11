import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavProps {
  currentWeekStart: Date;
  navigateWeek: (delta: number) => void;
  isTimeRangeLocked: boolean;
  isTimeIntervalLocked: boolean;
}

export function WeekNav({
  currentWeekStart,
  navigateWeek,
  isTimeRangeLocked,
  isTimeIntervalLocked,
}: WeekNavProps) {
  return (
    <div
      className="kd-row"
      style={{ justifyContent: 'space-between', marginBottom: 12 }}
    >
      <div className="kd-row">
        <button
          className="kd-btn-ghost kd-btn"
          onClick={() => navigateWeek(-1)}
          title="前の週"
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontWeight: 600, color: '#374151' }}>
          {currentWeekStart.getFullYear()}年{currentWeekStart.getMonth() + 1}月 週間表示
        </div>
        <button
          className="kd-btn-ghost kd-btn"
          onClick={() => navigateWeek(1)}
          title="次の週"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="kd-status">
        <span
          className={`locked ${
            !(isTimeRangeLocked || isTimeIntervalLocked) ? 'hidden' : ''
          }`}
        >
          設定固定中
        </span>
      </div>
    </div>
  );
}
