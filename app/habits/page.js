'use client';
import { useState, useEffect } from 'react';
import { getDailyLog, saveDailyLog, TODAY } from '@/lib/storage';
import { SUPPLEMENT_STACKS } from '@/lib/supplements';

const WATER_GLASS = 250; // ml
const WATER_TARGET = 3000;

export default function HabitsPage() {
  const [log, setLog] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLog(getDailyLog(TODAY()));
    setMounted(true);
  }, []);

  if (!mounted || !log) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  function update(updater) {
    const updated = updater(log);
    saveDailyLog(TODAY(), updated);
    setLog(updated);
  }

  function setVaping(n) {
    update(l => ({ ...l, vaping: Math.max(0, n) }));
  }

  function addWater(ml) {
    update(l => ({ ...l, water: Math.max(0, (l.water || 0) + ml) }));
  }

  function toggleSupp(id) {
    update(l => ({ ...l, supplements: { ...l.supplements, [id]: !l.supplements[id] } }));
  }

  function setSleep(field, val) {
    update(l => ({ ...l, sleep: { ...l.sleep, [field]: val } }));
  }

  const waterGlasses = Math.floor((log.water || 0) / WATER_GLASS);
  const waterPct = Math.min(((log.water || 0) / WATER_TARGET) * 100, 100);
  const totalSupps = SUPPLEMENT_STACKS.flatMap(s => s.items).length;
  const doneSupps = Object.values(log.supplements || {}).filter(Boolean).length;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, margin: '0 0 4px' }}>Habits</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
        {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
      </p>

      {/* Water */}
      <section className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>Water</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, color: 'var(--water)' }}>
                {Math.round((log.water || 0) / 100) / 10}L
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>/ {WATER_TARGET / 1000}L goal</span>
            </div>
          </div>
          <div style={{ fontSize: 40 }}>💧</div>
        </div>

        {/* Water bar */}
        <div className="progress-bar" style={{ height: 8, marginBottom: 14 }}>
          <div className="progress-fill" style={{ width: `${waterPct}%`, background: 'var(--water)' }} />
        </div>

        {/* Glass visualization */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: 6,
              background: i < waterGlasses ? 'var(--water)' : 'var(--surface)',
              border: `1px solid ${i < waterGlasses ? 'var(--water)' : 'var(--border)'}`,
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[250, 500].map(ml => (
            <button key={ml} onClick={() => addWater(ml)} style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              background: 'var(--water-dim)', color: 'var(--water)',
              border: '1px solid rgba(56,189,248,0.2)',
              fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15,
              cursor: 'pointer',
            }}>+ {ml}ml</button>
          ))}
          <button onClick={() => addWater(-250)} style={{
            padding: '10px 16px', borderRadius: 8, background: 'var(--surface)',
            border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--muted)', fontSize: 18,
          }}>−</button>
        </div>
      </section>

      {/* Vaping Tracker */}
      <section className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>Vaping</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Track it to quit it. Every day counts.</p>
          </div>
          <div style={{
            fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 44,
            color: log.vaping === 0 ? 'var(--accent)' : log.vaping <= 3 ? 'var(--warn)' : 'var(--danger)',
          }}>
            {log.vaping}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => setVaping(log.vaping + 1)} style={{
            flex: 2, padding: 12, borderRadius: 8, cursor: 'pointer',
            background: log.vaping > 5 ? 'rgba(255,68,102,0.12)' : 'var(--surface)',
            border: `1px solid ${log.vaping > 5 ? 'rgba(255,68,102,0.3)' : 'var(--border)'}`,
            color: log.vaping > 5 ? 'var(--danger)' : 'var(--muted)',
            fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16,
          }}>+ Add vape</button>
          <button onClick={() => setVaping(log.vaping - 1)} style={{
            flex: 1, padding: 12, borderRadius: 8, cursor: 'pointer',
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--muted)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16,
          }}>− Undo</button>
        </div>

        {log.vaping === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--accent)', fontSize: 13, marginTop: 10, fontWeight: 600 }}>
            🎉 Vape-free today — keep it going
          </p>
        )}
      </section>

      {/* Supplements */}
      <section style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 20, margin: 0 }}>💊 Supplements</h2>
          <span style={{
            fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18,
            color: doneSupps === totalSupps ? 'var(--accent)' : 'var(--muted)',
          }}>
            {doneSupps}/{totalSupps}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SUPPLEMENT_STACKS.map(stack => (
            <div key={stack.timing} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 16, color: stack.color, margin: 0 }}>
                    {stack.label}
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{stack.note}</p>
                </div>
                <span style={{ fontSize: 20 }}>
                  {stack.timing === 'morning' ? '☀️' : stack.timing === 'preworkout' ? '⚡' : stack.timing === 'postworkout' ? '💪' : '🌙'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {stack.items.map(supp => (
                  <div key={supp.id} className="supp-check" onClick={() => toggleSupp(supp.id)}>
                    <div className={`toggle ${log.supplements[supp.id] ? 'on' : ''}`} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: log.supplements[supp.id] ? 'var(--text)' : 'var(--muted)' }}>
                        {supp.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, marginTop: 2 }}>{supp.note}</p>
                    </div>
                    {log.supplements[supp.id] && (
                      <span style={{ color: 'var(--accent)', fontSize: 18 }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sleep */}
      <section className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 20, margin: '0 0 16px' }}>😴 Sleep</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Bedtime
            </label>
            <input type="time" className="input" value={log.sleep?.bedtime || ''}
              onChange={e => setSleep('bedtime', e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Wake up
            </label>
            <input type="time" className="input" value={log.sleep?.wakeup || ''}
              onChange={e => setSleep('wakeup', e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
        {log.sleep?.bedtime && log.sleep?.wakeup && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
            Sleep duration: <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {calcSleepHours(log.sleep.bedtime, log.sleep.wakeup)}
            </span>
          </p>
        )}
      </section>
    </div>
  );
}

function calcSleepHours(bedtime, wakeup) {
  try {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeup.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
  } catch {
    return '—';
  }
}
