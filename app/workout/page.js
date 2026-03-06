'use client';
import { useState, useEffect } from 'react';
import { getDailyLog, saveDailyLog, TODAY, getWorkoutCycleDay, saveWorkoutCycleDay, getWorkoutLog, saveWorkoutLog } from '@/lib/storage';
import { WORKOUT_PLAN, getWorkoutByDay } from '@/lib/workoutPlan';

export default function WorkoutPage() {
  const [cycleDay, setCycleDay] = useState(0);
  const [dailyLog, setDailyLog] = useState(null);
  const [workoutLog, setWorkoutLog] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [expandedEx, setExpandedEx] = useState(null);

  useEffect(() => {
    const d = getWorkoutCycleDay();
    const dl = getDailyLog(TODAY());
    const wl = getWorkoutLog(TODAY());
    setCycleDay(d);
    setDailyLog(dl);
    const workout = getWorkoutByDay(d);
    if (!wl) {
      const fresh = {
        workoutId: workout.id,
        sets: {},
        startTime: null,
        complete: false,
      };
      setWorkoutLog(fresh);
    } else {
      setWorkoutLog(wl);
    }
    setMounted(true);
  }, []);

  const workout = getWorkoutByDay(cycleDay);

  function startWorkout() {
    const updated = { ...workoutLog, startTime: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) };
    saveWorkoutLog(TODAY(), updated);
    setWorkoutLog(updated);
  }

  function logSet(exName, setIdx, field, val) {
    const sets = workoutLog.sets || {};
    const exSets = sets[exName] || Array(4).fill({ weight: '', reps: '', done: false });
    const updated = { ...workoutLog, sets: {
      ...sets,
      [exName]: exSets.map((s, i) => i === setIdx ? { ...s, [field]: val } : s)
    }};
    saveWorkoutLog(TODAY(), updated);
    setWorkoutLog(updated);
  }

  function toggleSetDone(exName, setIdx) {
    const sets = workoutLog.sets || {};
    const exSets = sets[exName] || Array(4).fill({ weight: '', reps: '', done: false });
    const updated = { ...workoutLog, sets: {
      ...sets,
      [exName]: exSets.map((s, i) => i === setIdx ? { ...s, done: !s.done } : s)
    }};
    saveWorkoutLog(TODAY(), updated);
    setWorkoutLog(updated);
  }

  function completeWorkout() {
    const updatedWL = { ...workoutLog, complete: true, endTime: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) };
    saveWorkoutLog(TODAY(), updatedWL);
    setWorkoutLog(updatedWL);
    const updatedDL = { ...dailyLog, workoutDone: true, workoutId: workout.id };
    saveDailyLog(TODAY(), updatedDL);
    setDailyLog(updatedDL);
    // Advance cycle
    const next = (cycleDay + 1) % 6;
    saveWorkoutCycleDay(next);
  }

  function swapWorkout(idx) {
    setCycleDay(idx);
    saveWorkoutCycleDay(idx);
    const newWorkout = WORKOUT_PLAN[idx];
    const fresh = { workoutId: newWorkout.id, sets: {}, startTime: null, complete: false };
    saveWorkoutLog(TODAY(), fresh);
    setWorkoutLog(fresh);
    setSwapOpen(false);
  }

  if (!mounted || !workoutLog) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  const isComplete = workoutLog.complete || dailyLog?.workoutDone;
  const started = !!workoutLog.startTime;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Today's Workout</p>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 36, color: workout.color, margin: '4px 0 4px' }}>
          {workout.icon} {workout.name}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>{workout.subtitle} · {workout.duration}</p>
        {workout.note && (
          <p style={{ color: 'var(--warn)', fontSize: 12, marginTop: 6, background: 'var(--warn-dim)', padding: '6px 10px', borderRadius: 8, display: 'inline-block' }}>
            {workout.note}
          </p>
        )}
      </div>

      {/* Week schedule */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {WORKOUT_PLAN.map((w, i) => (
            <div key={w.id} style={{
              flex: '0 0 auto', textAlign: 'center', padding: '8px 10px', borderRadius: 8,
              background: i === cycleDay ? w.color : 'var(--surface)',
              border: `1px solid ${i === cycleDay ? w.color : 'var(--border)'}`,
              minWidth: 48,
            }}>
              <div style={{ fontSize: 16 }}>{w.icon}</div>
              <div style={{ fontSize: 9, color: i === cycleDay ? 'var(--bg)' : 'var(--muted)', marginTop: 2, fontWeight: i === cycleDay ? 700 : 400 }}>
                D{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {!started && !isComplete && (
          <button className="btn-primary" style={{ flex: 1 }} onClick={startWorkout}>▶ Start Workout</button>
        )}
        {started && !isComplete && (
          <button className="btn-primary" style={{ flex: 1, background: 'var(--accent)' }} onClick={completeWorkout}>✓ Mark Complete</button>
        )}
        {isComplete && (
          <div style={{ flex: 1, padding: 12, background: 'var(--accent-dim)', borderRadius: 10, textAlign: 'center', color: 'var(--accent)', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, border: '1px solid rgba(94,255,158,0.2)' }}>
            ✓ Workout Done — Great work!
          </div>
        )}
        <button className="btn-ghost" onClick={() => setSwapOpen(true)}>Swap</button>
      </div>

      {/* Exercise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {workout.exercises.map((ex, ei) => {
          const exSets = (workoutLog.sets || {})[ex.name] || [];
          const doneSets = exSets.filter(s => s.done).length;
          const isOpen = expandedEx === ei;

          return (
            <div key={ei} className="card" style={{ overflow: 'hidden' }}>
              <button onClick={() => setExpandedEx(isOpen ? null : ei)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {ex.sets} sets × {ex.reps} · Rest {ex.rest}
                    <span style={{ color: workout.color, marginLeft: 8, fontSize: 11, fontWeight: 600 }}>{ex.muscle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {doneSets > 0 && (
                    <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>
                      {doneSets}/{ex.sets}
                    </span>
                  )}
                  <span style={{ color: 'var(--muted)', fontSize: 18 }}>{isOpen ? '∧' : '∨'}</span>
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                  {ex.note && (
                    <p style={{ fontSize: 12, color: 'var(--muted)', padding: '8px 0', margin: 0, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                      💡 {ex.note}
                    </p>
                  )}

                  {/* Set headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr auto', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Set</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Weight (kg)</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Reps</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>✓</span>
                  </div>

                  {Array.from({ length: ex.sets }).map((_, si) => {
                    const s = exSets[si] || { weight: '', reps: '', done: false };
                    return (
                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr auto', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: 'var(--muted)' }}>
                          {si + 1}
                        </span>
                        <input
                          type="number" placeholder="—" value={s.weight}
                          onChange={e => logSet(ex.name, si, 'weight', e.target.value)}
                          style={{
                            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                            color: 'var(--text)', padding: '6px 10px', fontSize: 14, outline: 'none',
                            borderColor: s.done ? 'var(--accent)' : 'var(--border)',
                          }}
                        />
                        <input
                          type="number" placeholder="—" value={s.reps}
                          onChange={e => logSet(ex.name, si, 'reps', e.target.value)}
                          style={{
                            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                            color: 'var(--text)', padding: '6px 10px', fontSize: 14, outline: 'none',
                            borderColor: s.done ? 'var(--accent)' : 'var(--border)',
                          }}
                        />
                        <button onClick={() => toggleSetDone(ex.name, si)} style={{
                          width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: s.done ? 'var(--accent)' : 'var(--surface)',
                          color: s.done ? 'var(--bg)' : 'var(--muted)',
                          fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          ✓
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Swap modal */}
      {swapOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{ background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 680, margin: '0 auto' }}>
            <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, margin: '0 0 16px' }}>Swap Workout</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {WORKOUT_PLAN.map((w, i) => (
                <button key={w.id} onClick={() => swapWorkout(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12,
                  background: i === cycleDay ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${i === cycleDay ? w.color : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 24 }}>{w.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: i === cycleDay ? w.color : 'var(--text)' }}>
                      Day {i + 1}: {w.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{w.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
            <button className="btn-ghost" style={{ width: '100%', marginTop: 12 }} onClick={() => setSwapOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
