import type { DisplayMode } from '../types';

interface ModeToggleProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export function ModeToggle({ displayMode, setDisplayMode }: ModeToggleProps) {
  return (
    <div>
      <label className="kd-label">表示モード</label>
      <div className="kd-mode-wrap">
        <button
          className={`kd-mode-btn ${displayMode === 'daily' ? 'active' : ''}`}
          onClick={() => setDisplayMode('daily')}
        >
          <div className="kd-mode-btn__title">1日単位指定</div>
          <div className="kd-mode-btn__desc">
            日付を選択してタイムテーブルで指定
          </div>
        </button>
        <button
          className={`kd-mode-btn ${displayMode === 'weekly' ? 'active' : ''}`}
          onClick={() => setDisplayMode('weekly')}
        >
          <div className="kd-mode-btn__title">1週間単位指定</div>
          <div className="kd-mode-btn__desc">
            週表示で複数日を一度に指定
          </div>
        </button>
      </div>
    </div>
  );
}
