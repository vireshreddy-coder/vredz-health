'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', icon: HomeIcon, label: 'Home' },
  { href: '/meals', icon: MealIcon, label: 'Meals' },
  { href: '/workout', icon: WorkoutIcon, label: 'Train' },
  { href: '/habits', icon: HabitsIcon, label: 'Habits' },
  { href: '/progress', icon: ProgressIcon, label: 'Progress' },
  { href: '/ideas', icon: IdeasIcon, label: 'Ideas' },
];

export default function Nav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50,
        gap: 2,
      }} className="hidden lg:flex">
        {/* Logo */}
        <div style={{ padding: '0 20px 28px' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, color: 'var(--accent)', letterSpacing: 1 }}>
            VREDZ
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
            Health Hub
          </div>
        </div>

        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 20px', margin: '0 8px',
              borderRadius: 10, textDecoration: 'none',
              color: active ? 'var(--bg)' : 'var(--muted)',
              background: active ? 'var(--accent)' : 'transparent',
              fontWeight: active ? 600 : 400,
              fontSize: 14,
              transition: 'all 0.15s',
            }}>
              <Icon size={18} color={active ? 'var(--bg)' : 'var(--muted)'} />
              {label}
            </Link>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 20px', fontSize: 12, color: 'var(--muted)' }}>
          2026 · For personal use
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="lg:hidden">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '10px 4px', textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--muted)',
              transition: 'color 0.15s',
            }}>
              <Icon size={20} color={active ? 'var(--accent)' : 'var(--muted)'} />
              <span style={{ fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Icon components
function HomeIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function MealIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  );
}
function WorkoutIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5h18"/><path d="M3 14.5h18"/>
      <rect x="2" y="7" width="2" height="10" rx="1"/><rect x="20" y="7" width="2" height="10" rx="1"/>
    </svg>
  );
}
function HabitsIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2c5.5 0 10 4.5 10 10"/>
      <polyline points="12 6 12 12 16 14"/><path d="m16 16 5 3-3 5"/>
    </svg>
  );
}
function ProgressIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}
function IdeasIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
  );
}
