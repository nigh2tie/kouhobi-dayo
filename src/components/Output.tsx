import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';

interface OutputProps {
  text: string;
  onCopy: () => Promise<boolean>;
}

export function Output({ text, onCopy }: OutputProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [text]);

  if (!text) return null;

  return (
    <div className="kd-output">
      <div className="kd-row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontWeight: 600, color: '#374151' }}>生成されたテキスト</div>
        <div className="kd-row" style={{ marginLeft: 'auto' }}>
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
        </div>
      </div>
      <div className="kd-output-box" style={{ marginTop: 8 }}>
        {text}
      </div>
    </div>
  );
}
