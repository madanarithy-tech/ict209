import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
const RAG_URL = process.env.RAG_WEBHOOK_URL;

// n8n RAG webhook (GET). The workflow reads the question from `chatInput` and memory from `sessionId`,
// and responds with [{ output }].
async function askRag({ question, sessionId, lang, bench }) {
  const url = new URL(RAG_URL);
  url.searchParams.set('chatInput', question);
  url.searchParams.set('sessionId', sessionId || 'anonymous');
  url.searchParams.set('lang', lang === 'km' ? 'km' : 'en');
  url.searchParams.set('bench', bench);
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000), cache: 'no-store' });
  if (!res.ok) throw new Error(`RAG webhook returned ${res.status}`);
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : data;
  const text = (typeof first === 'string' ? first : first?.output ?? first?.text ?? '').trim();
  if (!text) throw new Error('RAG webhook returned no output');
  return text;
}

async function askClaude({ messages, lang, bench }) {
  const system = `You are the lab assistant inside "Digital Researching Lab", a virtual chemistry lab for lower and upper secondary students in Cambodia. Help with experiments, reactions, calculations, safety and how to use the site. The site works like a real lab: the reagent shelf is on the left (choose the amount to add, indicators go in by the drop, solids by the piece); the bench is in the middle; a container is only heated when it stands on the tripod and gauze over a lit Bunsen burner (gas 0-10, air hole open for a hot blue flame, closed for a cooler yellow one); titrations use the burette and its tap; masses come from the electronic balance with a Tare button; temperature and pH can only be read after inserting a thermometer or pH meter into the container; lab time can be sped up (×10, ×30). pH readings come from the full acid–base equilibrium (pH = −log₁₀[H⁺], with weak acids such as citric and acetic acid) at the container's temperature: Kw changes with temperature, so neutral water reads 6.95 in the 28 °C room, and concentrated strong acid can read below 0. The procedure, instrument readings, notebook and safety warnings are on the right. Be accurate, explain the science at secondary-school level, show working for calculations, and keep answers under 150 words. Encourage safe lab practice. Reply in ${lang === 'km' ? 'Khmer' : 'English'}. Current bench: ${bench}`;
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system,
    messages: messages.map((m) => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t })),
  });
  if (response.stop_reason === 'refusal') throw new Error('Claude declined the request');
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  if (!text) throw new Error('Claude returned no text');
  return text;
}

// Lab assistant: RAG webhook first, then Claude. Any failure returns a non-2xx so the client
// falls back to its built-in answers.
export async function POST(req) {
  const { messages, lang, bench, sessionId } = await req.json().catch(() => ({}));
  if (!Array.isArray(messages) || !messages.length) return Response.json({ error: 'bad_request' }, { status: 400 });
  const history = messages.slice(-20).map((m) => ({ r: m.r, t: String(m.t).slice(0, 4000) }));
  const question = history[history.length - 1].t;
  const benchCtx = String(bench || '').slice(0, 2000);

  if (RAG_URL) {
    try {
      return Response.json({ text: await askRag({ question, sessionId: String(sessionId || ''), lang, bench: benchCtx }), source: 'rag' });
    } catch (error) {
      console.error('RAG webhook failed, falling back to Claude:', error?.message || error);
    }
  }
  try {
    return Response.json({ text: await askClaude({ messages: history, lang, bench: benchCtx }), source: 'claude' });
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`Lab assistant API error ${error.status}:`, error.message);
    else console.error('Lab assistant unavailable:', error?.message || error);
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
