import { NextRequest } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const stream = await openai.chat.completions.create({ model: 'gpt-4o', stream: true, messages: [{ role: 'user', content: prompt }] });
  const enc = new TextEncoder();
  return new Response(new ReadableStream({
    async start(ctrl) { for await (const c of stream) { ctrl.enqueue(enc.encode(c.choices[0]?.delta?.content || '')); } ctrl.close(); }
  }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
