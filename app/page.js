'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RingProgress from '@/components/RingProgress';
import { getDailyLog, saveDailyLog, TODAY, calcTotals, getProfile, getWorkoutCycleDay } from '@/lib/storage';
import { getWorkoutByDay } from '@/lib/workoutPlan';
import { QUICK_MEALS } from '@/lib/mealData';
import { SUPPLEMENT_STACKS } from '@/lib/supplements';

export default function Dashboard() {
  const [log, setLog] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cycleDay, setCycleDay] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = getProfile();
    const l = getDailyLog(TODAY());
    const c = getWorkoutCycleDay();
    setProfile(p);
    setLog(l);
    setCycleDay(c);
    setMounted(true);
  }, []);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = today.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!mounted || !log || !profile) {
    return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;
  }

  const { calories, protein, water } = calcTotals(log);
  const workout = getWorkoutByDay(cycleDay);
  const calPct = Math.round((calories / profile.targetCalories) * 100);
  const proteinPct = Math.round((protein / profile.targetProtein) * 100);
  const waterPct = Math.round((water / profile.targetWater) * 100);
  const suppDone = Object.values(log.supplements).filter(Boolean).length;
  const totalSupps = Object.keys(log.supplements).length;

  function quickAddMeal(meal) {
    const updated = {
      ...log,
      meals: [...log.meals, { ...meal, id: Date.now(), time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }],
    };
    saveDailyLog(TODAY(), updated);
    setLog(updated);
  }

  function addWater(ml) {
    const updated = { ...log, water: Math.max(0, (log.water || 0) + ml) };
    saveDailyLog(TODAY(), updated);
    setLog(updated);
  }

  const daysToAbs = Math.max(0, Math.round(((profile.weight - 78) / 0.5) * 7)); // rough estimate

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>{dateStr}</p>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, color: 'var(--text)', margin: 0 }}>
          {greeting}, <span style={{ color: 'var(--accent)' }}>Vredz</span> 👊
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
          {calories < profile.targetCalories
            ? `${profile.targetCalories - calories} kcal remaining today`
            : `You've hit your calorie target`}
        </p>
      </div>

      {/* Main rings */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <RingProgress value={calories} max={profile.targetCalories} size={110} strokeWidth={11} color="var(--warn)" label="Calories" sublabel={`/ ${profile.targetCalories}`} />
          <RingProgress value={protein} max={profile.targetProtein} size={110} strokeWidth={11} color="var(--protein)" label="Protein" sublabel={`/ ${profile.targetProtein}g`} />
          <RingProgress value={Math.round(water / 1000 * 10) / 10} max={profile.targetWater / 1000} size={110} strokeWidth={11} color="var(--water)" label="Water" sublabel={`/ ${profile.targetWater / 1000}L`} />
        </div>

        {/* Macro bars */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MacroRow label="Calories" value={calories} max={profile.targetCalories} unit="kcal" color="var(--warn)" />
          <MacroRow label="Protein" value={protein} max={profile.targetProtein} unit="g" color="var(--protein)" />
          <MacroRow label="Water" value={Math.round(water / 100) / 10} max={profile.targetWater / 1000} unit="L" color="var(--water)" />
        </div>
      </div>

      {/* Quick add water */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--water)' }}>💧 Water</span>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 20, color: 'var(--water)' }}>
            {Math.round(water / 100) / 10}L / {profile.targetWater / 1000}L
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[250, 500, 750].map(ml => (
            <button key={ml} onClick={() => addWater(ml)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              background: 'var(--water-dim)', color: 'var(--water)',
              border: '1px solid rgba(56,189,248,0.2)',
              fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              +{ml}ml
            </button>
          ))}
          <button onClick={() => addWater(-250)} style={{
            padding: '8px 12px', borderRadius: 8,
            background: 'var(--surface)', color: 'var(--muted)',
            border: '1px solid var(--border)', cursor: 'pointer', fontSize: 16,
          }}>−</button>
        </div>
      </div>

      {/* Today's workout */}
      <Link href="/workout" style={{ textDecoration: 'none' }}>
        <div className="card" style={{
          padding: 20, marginBottom: 16, cursor: 'pointer',
          borderColor: log.workoutDone ? 'var(--accent)' : 'var(--border)',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                Today's workout
              </p>
              <h3 style={{
                fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 24,
                color: workout.color, margin: '4px 0 2px',
              }}>
                {workout.icon} {workout.name}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>{workout.subtitle} · {workout.duration}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              {log.workoutDone ? (
                <span style={{ color: 'var(--accent)', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 16 }}>✓ Done</span>
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>→ Start</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick add meals */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, margin: 0 }}>Quick Add Meal</h2>
          <Link href="/meals" style={{ color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>See all →</Link>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {QUICK_MEALS.map(meal => (
            <button key={meal.id} onClick={() => quickAddMeal(meal)} style={{
              flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '10px 14px', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{meal.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap' }}>{meal.name}</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'var(--warn)', marginTop: 2 }}>
                {meal.calories} kcal
              </div>
              <div style={{ fontSize: 11, color: 'var(--protein)' }}>{meal.protein}g protein</div>
            </button>
          ))}
        </div>
      </div>

      {/* Supplements summary */}
      <Link href="/habits" style={{ textDecoration: 'none' }}>
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>💊 Supplements</span>
            <span style={{
              fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18,
              color: suppDone === totalSupps ? 'var(--accent)' : 'var(--muted)',
            }}>
              {suppDone} / {totalSupps}
            </span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {SUPPLEMENT_STACKS.flatMap(s => s.items).map(supp => (
              <span key={supp.id} style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 6,
                background: log.supplements[supp.id] ? 'var(--accent-dim)' : 'var(--surface)',
                color: log.supplements[supp.id] ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${log.supplements[supp.id] ? 'rgba(94,255,158,0.2)' : 'var(--border)'}`,
              }}>
                {supp.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatCard label="Vaping Today" value={log.vaping} unit="times" accent={log.vaping === 0 ? 'var(--accent)' : log.vaping > 5 ? 'var(--danger)' : 'var(--warn)'} />
        <StatCard label="Meals Logged" value={log.meals.length} unit="meals" accent="var(--water)" />
      </div>

      {/* Motivation */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(94,255,158,0.06) 0%, rgba(192,132,252,0.06) 100%)',
        border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px',
        marginBottom: 24, textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
          The goal
        </p>
        <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: 'var(--accent)', margin: '4px 0' }}>
          Abs. Defined. Strong.
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Consistency over perfection. Every tracked day counts.
        </p>
      </div>
    </div>
  );
}

function MacroRow({ label, value, max, unit, color }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  const over = value > max;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontSize: 12, color: over ? 'var(--danger)' : 'var(--text)' }}>
          {value} / {max} {unit}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: over ? 'var(--danger)' : color }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, accent }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, color: accent }}>{value}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{unit}</span>
      </div>
    </div>
  );
}
