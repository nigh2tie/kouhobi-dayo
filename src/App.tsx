import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { DisplayMode, TimeRangePatternKey } from './types';
import { themes, timeRangePatterns } from './constants';
import { getInitialWeekStart, getLocalDateString } from './utils/dateUtils';
import { copyToClipboard, generateOutputText } from './utils/textUtils';
import { useIsMobile } from './hooks/useIsMobile';
import { useTheme } from './hooks/useTheme';
import { useSlotSelection } from './hooks/useSlotSelection';
import { ModeToggle } from './components/ModeToggle';
import { Settings } from './components/Settings';
import { DailyGrid } from './components/DailyGrid';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { WeekNav } from './components/WeekNav';
import { Output } from './components/Output';
import { HeaderMenu } from './components/HeaderMenu';

export default function App() {
  const isMobile = useIsMobile();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getInitialWeekStart());

  const [timeRangePattern, setTimeRangePattern] = useState<TimeRangePatternKey>('all-day');
  const [timeInterval, setTimeInterval] = useState<number>(60);
  const [showWeekday, setShowWeekday] = useState<boolean>(true);
  const [useTemplate, setUseTemplate] = useState<boolean>(false);

  const { theme, setTheme } = useTheme('theme-yuki');

  const pattern = timeRangePatterns[timeRangePattern];

  const timeSlots = useMemo(() => {
    const list: string[] = [];
    for (let hour = pattern.start; hour <= pattern.end; hour++) {
      for (let minute = 0; minute < 60; minute += timeInterval) {
        if (hour === pattern.end && minute > 0) break;
        list.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return list;
  }, [pattern.start, pattern.end, timeInterval]);

  const {
    selectedSlots,
    isSelecting,
    setIsSelecting,
    lastSelectedSlot,
    rangeSelectionStart,
    setRangeSelectionStart,
    isRangeSelecting,
    setIsRangeSelecting,
    showRangeHint,
    setShowRangeHint,
    toggleSlot,
    clearSelection,
    selectTimeRange,
  } = useSlotSelection(timeSlots);

  const isTimeRangeLocked = selectedSlots.size > 0;
  const isTimeIntervalLocked = selectedSlots.size > 0;

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [currentWeekStart]);

  useEffect(() => {
    function onUp() {
      setIsSelecting(false);
      lastSelectedSlot.current = null;
    }
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [setIsSelecting, lastSelectedSlot]);

  function navigateWeek(delta: number) {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + delta * 7);
    setCurrentWeekStart(d);
  }

  const outputText = generateOutputText(selectedSlots, timeInterval, showWeekday, useTemplate);

  async function handleCopy() {
    return await copyToClipboard(outputText);
  }

  return (
    <div className={`kd-app ${theme}`}>
      <header className="kd-site-header">
        <div className="kd-header-inner">
          <div></div>
          <div className="kd-brand">
            <Calendar size={20} />
            <span>候補日ダヨー</span>
          </div>
          <HeaderMenu theme={theme} setTheme={setTheme} themes={themes} />
        </div>
      </header>

      <main className="kd-container">
        <div className="kd-card">
          <ModeToggle displayMode={displayMode} setDisplayMode={setDisplayMode} />

          <Settings
            displayMode={displayMode}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeRangePattern={timeRangePattern}
            setTimeRangePattern={setTimeRangePattern}
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
            showWeekday={showWeekday}
            setShowWeekday={setShowWeekday}
            useTemplate={useTemplate}
            setUseTemplate={setUseTemplate}
            isTimeRangeLocked={isTimeRangeLocked}
            isTimeIntervalLocked={isTimeIntervalLocked}
          />

          <div className="kd-action-row">
            {displayMode === 'weekly' && (
              <button className="kd-btn" onClick={() => setCurrentWeekStart(getInitialWeekStart())}>
                今週を表示
              </button>
            )}
            <button className="kd-btn kd-btn-danger" onClick={clearSelection}>
              全てクリア
            </button>
            <div className="kd-status" style={{ marginLeft: 'auto' }}>
              <span
                className={`locked ${!(isTimeRangeLocked || isTimeIntervalLocked) ? 'hidden' : ''}`}
              >
                設定固定中
              </span>
            </div>
          </div>

          {displayMode === 'daily' ? (
            <section>
              <DailyGrid
                selectedDate={selectedDate}
                timeSlots={timeSlots}
                timeInterval={timeInterval}
                pattern={pattern}
                isMobile={isMobile}
                isSelecting={isSelecting}
                setIsSelecting={setIsSelecting}
                lastSelectedSlot={lastSelectedSlot}
                selectedSlots={selectedSlots}
                toggleSlot={toggleSlot}
                rangeSelectionStart={rangeSelectionStart}
                setRangeSelectionStart={setRangeSelectionStart}
                isRangeSelecting={isRangeSelecting}
                setIsRangeSelecting={setIsRangeSelecting}
                setShowRangeHint={setShowRangeHint}
                selectTimeRange={selectTimeRange}
              />
            </section>
          ) : (
            <section>
              <WeekNav
                currentWeekStart={currentWeekStart}
                navigateWeek={navigateWeek}
                isTimeRangeLocked={isTimeRangeLocked}
                isTimeIntervalLocked={isTimeIntervalLocked}
              />
              <WeeklyCalendar
                weekDates={weekDates}
                timeSlots={timeSlots}
                isMobile={isMobile}
                isSelecting={isSelecting}
                setIsSelecting={setIsSelecting}
                lastSelectedSlot={lastSelectedSlot}
                selectedSlots={selectedSlots}
                toggleSlot={toggleSlot}
                rangeSelectionStart={rangeSelectionStart}
                setRangeSelectionStart={setRangeSelectionStart}
                isRangeSelecting={isRangeSelecting}
                setIsRangeSelecting={setIsRangeSelecting}
                setShowRangeHint={setShowRangeHint}
                selectTimeRange={selectTimeRange}
              />
            </section>
          )}

          <Output text={outputText} onCopy={handleCopy} />
        </div>
      </main>

      <footer className="kd-site-footer">
        <div className="kd-footer-inner">
          <div>© {new Date().getFullYear()} Q_Q. All rights reserved.</div>
        </div>
      </footer>

      {showRangeHint && (
        <div className="kd-overlay" role="dialog" aria-live="polite">
          <div className="kd-overlay-card">
            <div>終了時間をタップしてください</div>
            <button
              className="kd-btn kd-btn-ghost"
              onClick={() => {
                if (rangeSelectionStart)
                  toggleSlot(rangeSelectionStart.date, rangeSelectionStart.time, true);
                setRangeSelectionStart(null);
                setIsRangeSelecting(false);
                setShowRangeHint(false);
              }}
            >
              キャンセル（単発選択）
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
