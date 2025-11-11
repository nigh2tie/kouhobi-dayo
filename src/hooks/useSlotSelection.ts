import { useRef, useState } from 'react';
import { getSlotKey, sameDay } from '../utils/slotUtils';
import type { RangeSelection } from '../types';

export function useSlotSelection(timeSlots: string[]) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const lastSelectedSlot = useRef<string | null>(null);
  const [rangeSelectionStart, setRangeSelectionStart] = useState<RangeSelection | null>(null);
  const [isRangeSelecting, setIsRangeSelecting] = useState(false);
  const [showRangeHint, setShowRangeHint] = useState(false);

  function isSlotSelected(date: string | Date, time: string): boolean {
    return selectedSlots.has(getSlotKey(date, time));
  }

  function toggleSlot(date: string | Date, time: string, forceSelect = false) {
    const key = getSlotKey(date, time);
    setSelectedSlots(prev => {
      const next = new Set(prev);
      if (forceSelect || !next.has(key)) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedSlots(new Set());
    setRangeSelectionStart(null);
    setIsRangeSelecting(false);
    setShowRangeHint(false);
  }

  function selectTimeRange(start: RangeSelection, end: RangeSelection) {
    if (!sameDay(start.date, end.date)) {
      toggleSlot(end.date, end.time);
      return;
    }
    const startIndex = timeSlots.indexOf(start.time);
    const endIndex = timeSlots.indexOf(end.time);
    if (startIndex === -1 || endIndex === -1) return;
    const min = Math.min(startIndex, endIndex);
    const max = Math.max(startIndex, endIndex);
    for (let i = min; i <= max; i++) {
      toggleSlot(start.date, timeSlots[i]!, true);
    }
  }

  return {
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
    isSlotSelected,
    toggleSlot,
    clearSelection,
    selectTimeRange,
  };
}
