'use client';
import { useState, useEffect } from 'react';
import { getDailyLog, saveDailyLog, TODAY, calcTotals, getProfile } from '@/lib/storage';
import { QUICK_MEALS, MEAL_IDEAS } from '@/lib/mealData';

export default function MealsPage() {
  const [log, setLog] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: '' });
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setLog(getDailyLog(TODAY()));
    setMounted(true);
  }, []);

  if (!mounted || !log || !profile) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  const { calories, protein } = calcTotals(log);
  const calRemaining = profile.targetCalories - calories;
  const proteinRemaining = profile.targetProtein - protein;

  function addMeal(meal) {
    const newMeal = {
      ...meal,
      id: Date.now(),
      time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = { ...log, meals: [...log.meals, newMeal] };
    saveDailyLog(TODAY(), updated);
    setLog(updated);
  }

  function removeMeal(id) {
    const updated = { ...log, meals: log.meals.filter(m => m.id !== id) };
    saveDailyLog(TODAY(), updated);
    setLog(updated);
  }

  function addCustomMeal() {
    if (!customMeal.name || !customMeal.calories) return;
    addMeal({ name: customMeal.name, calories: parseInt(customMeal.calories) || 0, protein: parseInt(customMeal.protein) || 0, emoji: '🍽️' });
    setCustomMeal({ name: '', calories: '', protein: '' });
    setShowCustom(false);
  }

  async function getAISuggestion() {
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are a nutrition coach for Vredz, a 34-year-old male in Dubai (5'10", 85kg) trying to lose belly fat and get defined. 
          
Today's stats so far:
- Calories consumed: ${calories} / ${profile.targetCalories} kcal target (${calRemaining} remaining)
- Protein consumed: ${protein}g / ${profile.targetProtein}g target (${proteinRemaining}g remaining)
- Meals logged: ${log.meals.map(m => m.name).join(', ') || 'none yet'}

His preferences:
- Eats from 12pm-7pm (IF window)
- Loves: yogurt bowl, protein shake, Arabic protein bread + turkey, Indian food, sushi, Korean BBQ, Dave's Hot Chicken, hotpot
- Hates: seafood except sashimi
- Doesn't cook much — easy or order-in meals preferred
- Wants tasty, high-protein options

Based on his remaining macros (${calRemaining} kcal, ${proteinRemaining}g protein), suggest 2-3 specific meal ideas for his next meal. Be concise, practical, and specific. Mention exact items and portions. Keep it under 150 words.`
        })
      });
      const data = await res.json();
      setAiSuggestion(data.text || 'Could not get suggestion. Make sure ANTHROPIC_API_KEY is set in your Vercel environment.');
    } catch {
      setAiSuggestion('AI suggestions require ANTHROPIC_API_KEY to be set in Vercel environment variables.');
    }
    setAiLoading(false);
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      {/* Header */}
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, margin: '0 0 4px' }}>Meals</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
        {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
      </p>

      {/* Macro summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <MacroCard label="Calories" consumed={calories} target={profile.targetCalories} unit="kcal" color="var(--warn)" />
        <MacroCard label="Protein" consumed={protein} target={profile.targetProtein} unit="g" color="var(--protein)" />
      </div>

      {/* AI Suggestion */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>🤖 What should I eat next?</span>
          <button onClick={getAISuggestion} disabled={aiLoading} style={{
            background: aiLoading ? 'var(--surface)' : 'var(--accent-dim)',
            color: aiLoading ? 'var(--muted)' : 'var(--accent)',
            border: '1px solid rgba(94,255,158,0.2)', borderRadius: 8,
            padding: '6px 14px', cursor: aiLoading ? 'default' : 'pointer',
            fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
          }}>
            {aiLoading ? '...' : 'Ask AI'}
          </button>
        </div>
        {aiSuggestion && (
          <div style={{
            background: 'var(--surface)', borderRadius: 10, padding: 14,
            fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
            borderLeft: '3px solid var(--accent)',
          }}>
            {aiSuggestion}
          </div>
        )}
        {!aiSuggestion && !aiLoading && (
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Based on your remaining {calRemaining > 0 ? calRemaining : 0} kcal and {proteinRemaining > 0 ? proteinRemaining : 0}g protein
          </p>
        )}
      </div>

      {/* Today's meals */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, margin: '0 0 12px' }}>
          Today's Meals {log.meals.length > 0 && `(${log.meals.length})`}
        </h2>
        {log.meals.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14, padding: '20px 0' }}>No meals logged yet today.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {log.meals.map(meal => (
              <div key={meal.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{meal.emoji || '🍽️'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{meal.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                    <span style={{ color: 'var(--warn)' }}>{meal.calories} kcal</span>
                    {meal.protein > 0 && <span style={{ color: 'var(--protein)' }}> · {meal.protein}g protein</span>}
                    {meal.time && <span> · {meal.time}</span>}
                  </p>
                </div>
                <button onClick={() => removeMeal(meal.id)} style={{
                  background: 'none', border: 'none', color: 'var(--muted)',
                  cursor: 'pointer', fontSize: 18, padding: 4,
                }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, margin: '0 0 12px' }}>Quick Add</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {QUICK_MEALS.map(meal => (
            <button key={meal.id} onClick={() => addMeal(meal)} className="meal-quick-card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{meal.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{meal.name}</div>
              <div style={{ fontSize: 12, color: 'var(--warn)' }}>{meal.calories} kcal · <span style={{ color: 'var(--protein)' }}>{meal.protein}g pro</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{meal.note}</div>
            </button>
          ))}
          {/* Custom add */}
          <button onClick={() => setShowCustom(true)} className="meal-quick-card" style={{ textAlign: 'left', borderStyle: 'dashed' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>➕</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--muted)' }}>Custom Meal</div>
            <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 3 }}>Add anything manually</div>
          </button>
        </div>
      </div>

      {/* Custom meal modal */}
      {showCustom && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end', padding: '0',
        }}>
          <div style={{
            background: 'var(--card)', borderRadius: '20px 20px 0 0',
            padding: 24, width: '100%', maxWidth: 680, margin: '0 auto',
            border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, margin: '0 0 20px' }}>Custom Meal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Meal name" value={customMeal.name}
                onChange={e => setCustomMeal(p => ({ ...p, name: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input className="input" placeholder="Calories" type="number" value={customMeal.calories}
                  onChange={e => setCustomMeal(p => ({ ...p, calories: e.target.value }))} />
                <input className="input" placeholder="Protein (g)" type="number" value={customMeal.protein}
                  onChange={e => setCustomMeal(p => ({ ...p, protein: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={addCustomMeal}>Add Meal</button>
                <button className="btn-ghost" onClick={() => setShowCustom(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroCard({ label, consumed, target, unit, color }) {
  const pct = Math.min((consumed / Math.max(target, 1)) * 100, 100);
  const over = consumed > target;
  return (
    <div className="card" style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>{label}</p>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: over ? 'var(--danger)' : color }}>{consumed}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}> / {target} {unit}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: over ? 'var(--danger)' : color }} />
      </div>
      <p style={{ fontSize: 11, color: over ? 'var(--danger)' : 'var(--muted)', margin: '6px 0 0' }}>
        {over ? `${consumed - target} ${unit} over` : `${target - consumed} ${unit} remaining`}
      </p>
    </div>
  );
}
