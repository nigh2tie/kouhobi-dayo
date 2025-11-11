import React from 'react';
import type { TimeRangePattern, RangeSelection } from '../types';
import { getSlotKey, sameDay } from '../utils/slotUtils';

interface DailyGridProps {
  selectedDate: string;
  timeSlots: string[];
  timeInterval: number;
  pattern: TimeRangePattern;
  isMobile: boolean;
  isSelecting: boolean;
  setIsSelecting: (selecting: boolean) => void;
  lastSelectedSlot: React.MutableRefObject<string | null>;
  selectedSlots: Set<string>;
  toggleSlot: (date: string | Date, time: string, forceSelect?: boolean) => void;
  rangeSelectionStart: RangeSelection | null;
  setRangeSelectionStart: (selection: RangeSelection | null) => void;
  isRangeSelecting: boolean;
  setIsRangeSelecting: (selecting: boolean) => void;
  setShowRangeHint: (show: boolean) => void;
  selectTimeRange: (start: RangeSelection, end: RangeSelection) => void;
}

export function DailyGrid({
  selectedDate,
  timeSlots,
  timeInterval,
  pattern,
  isMobile,
  isSelecting,
  setIsSelecting,
  lastSelectedSlot,
  selectedSlots,
  toggleSlot,
  rangeSelectionStart,
  setRangeSelectionStart,
  isRangeSelecting,
  setIsRangeSelecting,
  setShowRangeHint,
  selectTimeRange,
}: DailyGridProps) {
  const cols =
    timeInterval === 15 ? 'cols-8' : timeInterval === 30 ? 'cols-6' : 'cols-4';

  function onMouseDown(e: React.MouseEvent<HTMLButtonElement>, time: string) {
    if (isMobile) return;
    if (e.button !== 0) return; // left click only
    e.preventDefault();
    setIsSelecting(true);
    toggleSlot(selectedDate, time);
    lastSelectedSlot.current = getSlotKey(selectedDate, time);
  }

  function onMouseEnter(time: string) {
    if (isMobile) return;
    if (!isSelecting) return;
    const key = getSlotKey(selectedDate, time);
    if (key !== lastSelectedSlot.current) {
      toggleSlot(selectedDate, time);
      lastSelectedSlot.current = key;
    }
  }

  function onClickMobile(time: string) {
    if (!isMobile) return;
    const start = rangeSelectionStart;
    if (!isRangeSelecting) {
      const key = getSlotKey(selectedDate, time);
      if (selectedSlots.has(key)) {
        toggleSlot(selectedDate, time);
      } else {
        setRangeSelectionStart({ date: selectedDate, time });
        setIsRangeSelecting(true);
        setShowRangeHint(true);
      }
    } else if (start) {
      selectTimeRange(start, { date: selectedDate, time });
      setRangeSelectionStart(null);
      setIsRangeSelecting(false);
      setShowRangeHint(false);
    }
  }

  return (
    <div>
      <div
        className={`kd-time-grid ${cols}`}
        onContextMenu={(e) => isSelecting && e.preventDefault()}
        onMouseLeave={() => {
          setIsSelecting(false);
          lastSelectedSlot.current = null;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {timeSlots.map((time) => {
          const selected = selectedSlots.has(getSlotKey(selectedDate, time));
          const isStart =
            isRangeSelecting &&
            rangeSelectionStart &&
            rangeSelectionStart.time === time &&
            sameDay(rangeSelectionStart.date, selectedDate);
          return (
            <button
              key={time}
              className={`kd-slot ${selected ? 'selected' : ''} ${
                isStart ? 'range-start' : ''
              }`}
              data-time={time}
              onMouseDown={(e) => onMouseDown(e, time)}
              onMouseEnter={() => onMouseEnter(time)}
              onClick={() => onClickMobile(time)}
              type="button"
              role="button"
              aria-pressed={selected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  isMobile ? onClickMobile(time) : toggleSlot(selectedDate, time);
                }
              }}
            >
              {time}
            </button>
          );
        })}
      </div>
      <div className="kd-help">
        クリックまたはドラッグして時間帯を選択してください（{pattern.label}:{' '}
        {String(pattern.start).padStart(2, '0')}:00-
        {String(pattern.end).padStart(2, '0')}:00、{timeInterval}分刻み）
        {isMobile && (
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>
            📱 スマホ：1回目のタップで開始、2回目のタップで終了時間を選択
          </div>
        )}
      </div>
    </div>
  );
}
