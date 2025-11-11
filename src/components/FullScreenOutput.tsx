import { useEffect, useState } from 'react';
import { Copy, X } from 'lucide-react';

interface FullScreenOutputProps {
  text: string;
  onClose: () => void;
  onCopy: () => Promise<boolean>;
}

export function FullScreenOutput({ text, onClose, onCopy }: FullScreenOutputProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const [copied, setCopied] = useState(false);

  return (
    <div className="kd-output-full" onClick={onClose} role="dialog" aria-modal="true">
      <div className="kd-output-full__card" onClick={(e) => e.stopPropagation()}>
        <div
          className="kd-row"
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ fontWeight: 600 }}>全画面表示</div>
          <div className="kd-row">
            <button
              className={`kd-btn kd-copy-btn ${copied ? 'ok' : ''}`}
              onClick={async () => {
                const ok = await onCopy();
                if (ok) setCopied(true);
              }}
            >
              <Copy size={16} />
              <span>{copied ? 'コピー完了' : 'コピー'}</span>
            </button>
            <button className="kd-btn kd-btn-ghost" onClick={onClose} aria-label="閉じる">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="kd-output-full__content">{text}</div>
      </div>
    </div>
  );
}
