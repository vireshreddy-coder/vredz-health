'use client';
import { useState } from 'react';
import { MEAL_IDEAS, MEAL_CATEGORIES, EFFORT_LABELS, EFFORT_COLORS } from '@/lib/mealData';

export default function IdeasPage() {
  const [category, setCategory] = useState('all');
  const [effort, setEffort] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MEAL_IDEAS.filter(m => {
    const catMatch = category === 'all' || m.category === category;
    const effortMatch = effort === 'all' || m.effort === effort;
    const searchMatch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.tags?.some(t => t.includes(search.toLowerCase()));
    return catMatch && effortMatch && searchMatch;
  });

  // Sort by protein desc
  const sorted = [...filtered].sort((a, b) => b.protein - a.protein);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, margin: '0 0 4px' }}>Meal Ideas</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px' }}>
        High protein, Dubai-friendly, no cooking required
      </p>

      {/* Search */}
      <input
        className="input" placeholder="Search meals..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {MEAL_CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: 0.5, textTransform: 'capitalize',
            background: category === c ? 'var(--accent)' : 'var(--surface)',
            color: category === c ? 'var(--bg)' : 'var(--muted)',
            border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
          }}>{c}</button>
        ))}
      </div>

      {/* Effort filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        <button onClick={() => setEffort('all')} style={{
          flexShrink: 0, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          background: effort === 'all' ? 'var(--surface)' : 'transparent',
          color: effort === 'all' ? 'var(--text)' : 'var(--muted)',
          border: `1px solid ${effort === 'all' ? 'var(--border-light)' : 'transparent'}`,
        }}>All</button>
        {Object.entries(EFFORT_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setEffort(key)} style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: effort === key ? `${EFFORT_COLORS[key]}20` : 'transparent',
            color: effort === key ? EFFORT_COLORS[key] : 'var(--muted)',
            border: `1px solid ${effort === key ? EFFORT_COLORS[key] + '40' : 'transparent'}`,
          }}>{label}</button>
        ))}
      </div>

      {/* Results */}
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
        {sorted.length} meals · sorted by protein
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
        {sorted.length === 0 && (
          <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>
            No meals found for this filter.
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{
        marginTop: 24, padding: 20,
        background: 'linear-gradient(135deg, rgba(94,255,158,0.06), rgba(56,189,248,0.06))',
        border: '1px solid var(--border)', borderRadius: 16,
      }}>
        <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, margin: '0 0 12px', color: 'var(--accent)' }}>
          💡 Meal Strategy
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '12–1pm meal: aim for 700–800 kcal, 60–70g protein',
            'Post-workout shake: non-negotiable on training days',
            '7pm dinner: 800–900 kcal, 70–80g protein',
            'Dessert swap: cottage cheese or protein mug cake',
            'Social meals: hotpot, Korean BBQ, sushi are your best friends',
          ].map((tip, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--muted)', margin: 0, paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function MealCard({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const effortColor = EFFORT_COLORS[meal.effort] || 'var(--muted)';
  const effortLabel = EFFORT_LABELS[meal.effort] || meal.effort;

  return (
    <div className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 32, lineHeight: 1 }}>{meal.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: 'var(--text)' }}>{meal.name}</h3>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 6,
                background: `${effortColor}18`, color: effortColor,
                border: `1px solid ${effortColor}30`,
                fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              }}>
                {effortLabel}
              </span>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
              <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 20, color: 'var(--warn)', margin: 0 }}>
                {meal.calories}
              </p>
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>kcal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Macro bar */}
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: 'var(--protein)' }}>Protein</span>
            <span style={{ fontSize: 10, color: 'var(--protein)', fontWeight: 700 }}>{meal.protein}g</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((meal.protein / 60) * 100, 100)}%`, background: 'var(--protein)' }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: 'var(--warn)' }}>Calories</span>
            <span style={{ fontSize: 10, color: 'var(--warn)', fontWeight: 700 }}>{meal.calories}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((meal.calories / 600) * 100, 100)}%`, background: 'var(--warn)' }} />
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.5 }}>{meal.desc}</p>
          {meal.tags && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {meal.tags.map(t => (
                <span key={t} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)',
                }}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
