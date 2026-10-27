# Digital Researching Lab

Virtual chemistry lab built with Next.js (App Router) and Tailwind CSS.

```bash
npm install
npm run dev     # http://localhost:3000
```

Routes: `/` lab bench, `/dashboard`, `/reactions` (reaction demonstrations, each at `/reactions/<id>` with an atomic view),
`/inventory`, `/safety`, `/achievements`.

The lab assistant chat goes through `app/api/chat/route.js`: it asks the n8n RAG webhook in `RAG_WEBHOOK_URL` first
(GET, question in `chatInput`, conversation id in `sessionId`), then Claude if `ANTHROPIC_API_KEY` is set, then the
built-in answers. Copy `.env.example` to `.env.local` to configure it.
