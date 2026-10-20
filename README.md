# Digital Researching Lab

Virtual chemistry lab built with Next.js (App Router) and Tailwind CSS.

```bash
npm install
npm run dev     # http://localhost:3000
```

Routes: `/` lab bench, `/dashboard`, `/inventory`, `/safety`, `/achievements`.

The lab assistant chat calls Claude through `app/api/chat/route.js`. Copy `.env.example` to `.env.local` and set
`ANTHROPIC_API_KEY` to enable it. Without a key the chat falls back to the built-in answers.
