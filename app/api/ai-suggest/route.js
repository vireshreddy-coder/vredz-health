import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: 'AI suggestions require ANTHROPIC_API_KEY to be set in your Vercel environment variables.' }, { status: 200 });
  }

  try {
    const { prompt } = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ text: 'AI request failed. Check your API key.' }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.content?.[0]?.text || 'No response.' });
  } catch (err) {
    return NextResponse.json({ text: 'Error connecting to AI service.' }, { status: 200 });
  }
}
