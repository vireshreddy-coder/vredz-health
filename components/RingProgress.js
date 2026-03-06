'use client';

export default function RingProgress({ value, max, size = 100, strokeWidth = 10, color = '#5eff9e', label, sublabel, children }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  const over = value > max;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={over ? 'var(--danger)' : color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {children || (
            <>
              <span style={{
                fontFamily: 'Barlow Condensed', fontWeight: 800,
                fontSize: size > 90 ? 22 : 16, color: over ? 'var(--danger)' : 'var(--text)',
                lineHeight: 1,
              }}>
                {Math.round(value)}
              </span>
              {sublabel && (
                <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {sublabel}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {label && (
        <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </span>
      )}
    </div>
  );
}
