'use client';
import { useEffect, useRef, useState } from 'react';
import { KB, KBD } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';

export default function Chat(){
 const {ctx,lang}=useLab();
 const T=useT();
 const [open,setOpen]=useState(false),[msgs,setMsgs]=useState([]),[txt,setTxt]=useState(''),[busy,setBusy]=useState(false),end=useRef();
 useEffect(()=>{end.current&&end.current.scrollIntoView({block:'nearest'})},[msgs,open,busy]);
 const ask=async(q0)=>{const q=(q0||txt).trim();if(!q||busy)return;setTxt('');const h=[...msgs,{r:'u',t:q}];setMsgs(h);setBusy(true);let a;
  try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:h,lang,bench:ctx()})});
   if(!res.ok)throw 0;a=(await res.json()).text}
  catch(e){const f=KB.find(k=>k[0].test(q.toLowerCase()));a=f?(lang==='km'?f[2]:f[1]):KBD[lang==='km'?1:0]}
  setMsgs([...h,{r:'b',t:a}]);setBusy(false)};
 return <div className="fixed right-4 z-40" style={{bottom:'calc(1rem + env(safe-area-inset-bottom,0px))'}}>
  {open&&<div className="wc mb-3 flex h-[26rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-[#e4d8bd]">
   <div className="serif border-b border-[#e4d8bd] px-4 py-3 text-lg text-stone-800">{T('Ask the Lab Assistant')}</div>
   <div className="flex-1 space-y-2 overflow-auto p-3 text-sm">
    <div className="rounded-2xl bg-white/80 p-3 text-stone-600">{T('Hi! I can explain reactions, safety, or what is happening on your bench.')}</div>
    {!msgs.length&&['Why did my solution turn pink?','How do I dilute acid safely?','What is happening in my beaker?'].map(c=><button key={c} onClick={()=>ask(T(c))} className="block w-full rounded-xl border border-[#e4d8bd] px-3 py-2 text-left text-teal-700 hover:bg-teal-50">{T(c)}</button>)}
    {msgs.map((m,i)=><div key={i} className={'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 '+(m.r==='u'?'ml-auto bg-teal-700 text-white':'bg-white/90 text-stone-700')}>{m.t}</div>)}
    {busy&&<div className="text-stone-500">{T('Thinking…')}</div>}<div ref={end}/></div>
   <div className="flex gap-2 border-t border-[#e4d8bd] p-2"><input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} placeholder={T('Ask about any reaction or experiment…')} className="min-w-0 flex-1 rounded-xl border border-[#e4d8bd] bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"/>
    <button onClick={()=>ask()} className="rounded-xl bg-teal-700 px-3 text-sm font-semibold text-white">{T('Send')}</button></div></div>}
  <button onClick={()=>setOpen(!open)} aria-label="Lab Assistant" className="ml-auto flex items-center gap-2 rounded-full border border-[#e4d8bd] bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-teal-600"><span>💬</span><span className="hidden sm:inline">{T('Ask the Lab Assistant')}</span></button></div>;
}
