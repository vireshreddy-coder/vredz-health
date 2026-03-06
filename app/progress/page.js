'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getProgressEntries, saveProgressEntries, getProfile, saveProfile, getRecentLogs } from '@/lib/storage';

export default function ProgressPage() {
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [newEntry, setNewEntry] = useState({ weight: '', waist: '', energy: '3', mood: '3', notes: '' });
  const [mounted, setMounted] = useState(false);
  const [activeChart, setActiveChart] = useState('weight');

  useEffect(() => {
    setEntries(getProgressEntries());
    setProfile(getProfile());
    setRecentLogs(getRecentLogs(7));
    setMounted(true);
  }, []);

  if (!mounted || !profile) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  function addEntry() {
    if (!newEntry.weight) return;
    const entry = {
      ...newEntry,
      date: new Date().toISOString().split('T')[0],
      id: Date.now(),
      weight: parseFloat(newEntry.weight),
      waist: parseFloat(newEntry.waist) || null,
      energy: parseInt(newEntry.energy),
      mood: parseInt(newEntry.mood),
    };
    const updated = [...entries, entry].sort((a, b) => a.date.localeCompare(b.date));
    saveProgressEntries(updated);
    // Update current weight in profile
    const updatedProfile = { ...profile, weight: entry.weight };
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setEntries(updated);
    setNewEntry({ weight: '', waist: '', energy: '3', mood: '3', notes: '' });
  }

  const startWeight = profile.startWeight || (entries[0]?.weight) || 85;
  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : profile.weight;
  const weightChange = currentWeight - startWeight;
  const weightToGoal = currentWeight - 78; // abs goal ~78kg estimated

  const chartData = entries.length > 0 ? entries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    weight: e.weight,
    waist: e.waist,
  })) : [{ date: 'Start', weight: startWeight, waist: null }];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip">
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 11 }}>{label}</p>
          {payload.map(p => (
            <p key={p.key} style={{ margin: '2px 0 0', color: p.color, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16 }}>
              {p.value}{p.dataKey === 'weight' ? 'kg' : 'cm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }} className="page-enter">
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, margin: '0 0 24px' }}>Progress</h1>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        <StatTile label="Start" value={`${startWeight}kg`} accent="var(--muted)" />
        <StatTile label="Now" value={`${currentWeight}kg`} accent="var(--accent)" />
        <StatTile
          label="Change"
          value={`${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)}kg`}
          accent={weightChange < 0 ? 'var(--accent)' : weightChange > 0 ? 'var(--danger)' : 'var(--muted)'}
        />
      </div>

      {/* Goal bar */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Goal: abs at ~78kg</span>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: weightToGoal <= 0 ? 'var(--accent)' : 'var(--text)' }}>
            {weightToGoal <= 0 ? '🎯 Goal reached!' : `${weightToGoal.toFixed(1)}kg to go`}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{
            width: `${Math.min(((startWeight - currentWeight) / (startWeight - 78)) * 100, 100)}%`,
            background: 'var(--accent)',
          }} />
        </div>
      </div>

      {/* Chart */}
      {entries.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['weight', 'waist'].map(k => (
              <button key={k} onClick={() => setActiveChart(k)} style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeChart === k ? 'var(--accent-dim)' : 'var(--surface)',
                color: activeChart === k ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${activeChart === k ? 'rgba(94,255,158,0.3)' : 'var(--border)'}`,
              }}>
                {k === 'weight' ? 'Weight' : 'Waist'}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey={activeChart}
                stroke={activeChart === 'weight' ? 'var(--accent)' : 'var(--water)'}
                strokeWidth={2} dot={{ fill: activeChart === 'weight' ? 'var(--accent)' : 'var(--water)', r: 4 }}
                activeDot={{ r: 6 }} connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 7-day calorie chart */}
      {recentLogs.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 16, margin: '0 0 12px', color: 'var(--warn)' }}>
            7-Day Calories
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={recentLogs}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} labelStyle={{ color: 'var(--muted)' }} itemStyle={{ color: 'var(--warn)' }} />
              <Line type="monotone" dataKey="calories" stroke="var(--warn)" strokeWidth={2} dot={{ fill: 'var(--warn)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log new entry */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 20, margin: '0 0 16px' }}>📊 Log Progress</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                Weight (kg)
              </label>
              <input type="number" step="0.1" className="input" placeholder={currentWeight}
                value={newEntry.weight} onChange={e => setNewEntry(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                Waist (cm)
              </label>
              <input type="number" step="0.5" className="input" placeholder="—"
                value={newEntry.waist} onChange={e => setNewEntry(p => ({ ...p, waist: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                Energy (1–5)
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setNewEntry(p => ({ ...p, energy: n.toString() })) } style={{
                    flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: parseInt(newEntry.energy) >= n ? 'var(--warn)' : 'var(--surface)',
                    color: parseInt(newEntry.energy) >= n ? 'var(--bg)' : 'var(--muted)',
                    fontWeight: 700, fontSize: 13,
                  }}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                Mood (1–5)
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setNewEntry(p => ({ ...p, mood: n.toString() })) } style={{
                    flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: parseInt(newEntry.mood) >= n ? 'var(--protein)' : 'var(--surface)',
                    color: parseInt(newEntry.mood) >= n ? 'var(--bg)' : 'var(--muted)',
                    fontWeight: 700, fontSize: 13,
                  }}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <input type="text" className="input" placeholder="Notes (optional)"
            value={newEntry.notes} onChange={e => setNewEntry(p => ({ ...p, notes: e.target.value }))} />

          <button className="btn-primary" onClick={addEntry} style={{ marginTop: 4 }}>Save Entry</button>
        </div>
      </div>

      {/* Entry history */}
      {entries.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, margin: '0 0 12px' }}>History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...entries].reverse().slice(0, 8).map(e => (
              <div key={e.id} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 2px' }}>
                    {new Date(e.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  {e.notes && <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{e.notes}</p>}
                </div>
                <div style={{ textAlign: 'right', display: 'flex', gap: 16, alignItems: 'center' }}>
                  {e.waist && <span style={{ fontSize: 13, color: 'var(--water)' }}>{e.waist}cm</span>}
                  <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, color: 'var(--accent)' }}>
                    {e.weight}kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: accent, margin: 0 }}>{value}</p>
    </div>
  );
}
