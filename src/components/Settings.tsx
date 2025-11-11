import type { DisplayMode, TimeRangePatternKey } from '../types';

interface SettingsProps {
  displayMode: DisplayMode;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  timeRangePattern: TimeRangePatternKey;
  setTimeRangePattern: (pattern: TimeRangePatternKey) => void;
  timeInterval: number;
  setTimeInterval: (interval: number) => void;
  showWeekday: boolean;
  setShowWeekday: (show: boolean) => void;
  useTemplate: boolean;
  setUseTemplate: (use: boolean) => void;
  isTimeRangeLocked: boolean;
  isTimeIntervalLocked: boolean;
}

export function Settings({
  displayMode,
  selectedDate,
  setSelectedDate,
  timeRangePattern,
  setTimeRangePattern,
  timeInterval,
  setTimeInterval,
  showWeekday,
  setShowWeekday,
  useTemplate,
  setUseTemplate,
  isTimeRangeLocked,
  isTimeIntervalLocked,
}: SettingsProps) {
  return (
    <div className="kd-settings-grid">
      {displayMode === 'daily' && (
        <div>
          <label className="kd-label">日付を選択</label>
          <input
            className="kd-control"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="kd-label">時間レンジ</label>
        <select
          className="kd-control"
          value={timeRangePattern}
          onChange={(e) =>
            !isTimeRangeLocked &&
            setTimeRangePattern(e.target.value as TimeRangePatternKey)
          }
          disabled={isTimeRangeLocked}
        >
          <option value="all-day">24時間表示</option>
          <option value="work1">勤怠：ノーマル</option>
          <option value="work2">勤怠：モダン</option>
        </select>
      </div>

      <div>
        <label className="kd-label">時間刻み</label>
        <select
          className="kd-control"
          value={String(timeInterval)}
          onChange={(e) =>
            !isTimeIntervalLocked && setTimeInterval(Number(e.target.value))
          }
          disabled={isTimeIntervalLocked}
        >
          <option value="60">60分刻み</option>
          <option value="30">30分刻み</option>
          <option value="15">15分刻み</option>
        </select>
      </div>

      <div>
        <label className="kd-label">出力オプション</label>
        <div className="kd-row" style={{ alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={showWeekday}
              onChange={(e) => setShowWeekday(e.target.checked)}
            />
            曜日を表示
          </label>
          <label>
            <input
              type="checkbox"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
            />
            ビジネステンプレート
          </label>
        </div>
      </div>
    </div>
  );
}
