import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';

// Lab assistant. Any failure returns a non-2xx so the client falls back to its built-in answers.
export async function POST(req) {
  const { messages, lang, bench } = await req.json().catch(() => ({}));
  if (!Array.isArray(messages) || !messages.length) return Response.json({ error: 'bad_request' }, { status: 400 });

  const system = `You are the friendly lab assistant inside "Digital Researching Lab", a virtual chemistry lab website. Help with experiments, reactions, safety and how to use the site (shelf on the left, bench in the middle, guide and meters on the right; drag or tap chemicals onto beakers; dropper mode; Bunsen burner with flame slider; chat). Be accurate and concise (max 120 words) and encourage safe lab practice. Reply in ${lang === 'km' ? 'Khmer' : 'English'}. Current bench: ${String(bench || '').slice(0, 2000)}`;

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system,
      messages: messages.slice(-20).map((m) => ({ role: m.r === 'u' ? 'user' : 'assistant', content: String(m.t).slice(0, 4000) })),
    });
    if (response.stop_reason === 'refusal') return Response.json({ error: 'refusal' }, { status: 502 });
    const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    if (!text) return Response.json({ error: 'empty' }, { status: 502 });
    return Response.json({ text });
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`Lab assistant API error ${error.status}:`, error.message);
    else console.error('Lab assistant unavailable:', error?.message || error);
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
