import React from 'react';
import { getLocalDateString, getWeekdayLabel } from '../utils/dateUtils';
import { getSlotKey, sameDay } from '../utils/slotUtils';
import type { RangeSelection } from '../types';

interface WeeklyCalendarProps {
  weekDates: Date[];
  timeSlots: string[];
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

export function WeeklyCalendar({
  weekDates,
  timeSlots,
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
}: WeeklyCalendarProps) {
  return (
    <div className="kd-weekly">
      <div className="kd-calendar-header">
        <div className="kd-time-label">時間</div>
        {weekDates.map((d) => (
          <div className="kd-date-header" key={d.toISOString()}>
            <div className="kd-date-weekday">{getWeekdayLabel(d)}</div>
            <div className="kd-date-day">
              {d.getMonth() + 1}/{d.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div
        className="kd-calendar-grid"
        onContextMenu={(e) => isSelecting && e.preventDefault()}
        onMouseLeave={() => {
          setIsSelecting(false);
          lastSelectedSlot.current = null;
        }}
      >
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="kd-week-time-label">{time.slice(0, 5)}</div>
            {weekDates.map((d) => {
              const dateStr = getLocalDateString(d);
              const selected = selectedSlots.has(getSlotKey(dateStr, time));
              const isStart =
                isRangeSelecting &&
                rangeSelectionStart &&
                rangeSelectionStart.time === time &&
                sameDay(rangeSelectionStart.date, dateStr);
              return (
                <button
                  key={`${dateStr}-${time}`}
                  className={`kd-week-slot ${selected ? 'selected' : ''} ${
                    isStart ? 'range-start' : ''
                  }`}
                  data-date={dateStr}
                  data-time={time}
                  onMouseDown={(e) => {
                    if (isMobile) return;
                    if (e.button !== 0) return;
                    e.preventDefault();
                    setIsSelecting(true);
                    toggleSlot(dateStr, time);
                    lastSelectedSlot.current = getSlotKey(dateStr, time);
                  }}
                  onMouseEnter={() => {
                    if (isMobile || !isSelecting) return;
                    const key = getSlotKey(dateStr, time);
                    if (key !== lastSelectedSlot.current) {
                      toggleSlot(dateStr, time);
                      lastSelectedSlot.current = key;
                    }
                  }}
                  onClick={() => {
                    if (!isMobile) return;
                    const start = rangeSelectionStart;
                    if (!isRangeSelecting) {
                      const key = getSlotKey(dateStr, time);
                      if (selectedSlots.has(key)) toggleSlot(dateStr, time);
                      else {
                        setRangeSelectionStart({ date: dateStr, time });
                        setIsRangeSelecting(true);
                        setShowRangeHint(true);
                      }
                    } else if (start) {
                      selectTimeRange(start, { date: dateStr, time });
                      setRangeSelectionStart(null);
                      setIsRangeSelecting(false);
                      setShowRangeHint(false);
                    }
                  }}
                  type="button"
                  role="button"
                  aria-pressed={selected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isMobile) {
                        const start = rangeSelectionStart;
                        if (!isRangeSelecting) {
                          const key = getSlotKey(dateStr, time);
                          if (selectedSlots.has(key)) toggleSlot(dateStr, time);
                          else {
                            setRangeSelectionStart({ date: dateStr, time });
                            setIsRangeSelecting(true);
                            setShowRangeHint(true);
                          }
                        } else if (start) {
                          selectTimeRange(start, { date: dateStr, time });
                          setRangeSelectionStart(null);
                          setIsRangeSelecting(false);
                          setShowRangeHint(false);
                        }
                      } else {
                        toggleSlot(dateStr, time);
                      }
                    }
                  }}
                >
                  {selected ? '選択中' : ''}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
