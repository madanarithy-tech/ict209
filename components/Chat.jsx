'use client';
import { useEffect, useRef, useState } from 'react';
import { KB, KBD, uid } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Icon } from './ui';

export default function Chat(){
 const {ctx,lang}=useLab();
 const T=useT();
 const [open,setOpen]=useState(false),[msgs,setMsgs]=useState([]),[txt,setTxt]=useState(''),[busy,setBusy]=useState(false),end=useRef(),sid=useRef(uid()+uid());
 useEffect(()=>{end.current&&end.current.scrollIntoView({block:'nearest'})},[msgs,open,busy]);
 const ask=async(q0)=>{const q=(q0||txt).trim();if(!q||busy)return;setTxt('');const h=[...msgs,{r:'u',t:q}];setMsgs(h);setBusy(true);let a;
  try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:h,lang,bench:ctx(),sessionId:sid.current})});
   if(!res.ok)throw 0;a=(await res.json()).text}
  catch(e){const f=KB.find(k=>k[0].test(q.toLowerCase()));a=f?(lang==='km'?f[2]:f[1]):KBD[lang==='km'?1:0]}
  setMsgs([...h,{r:'b',t:a}]);setBusy(false)};
 return <div className="fixed right-4 z-40" style={{bottom:'calc(1rem + env(safe-area-inset-bottom,0px))'}}>
  {open&&<div className="mb-3 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-xl">
   <div className="flex items-center justify-between border-b border-line px-4 py-2.5"><b className="text-sm text-stone-900">{T('Lab assistant')}</b><button onClick={()=>setOpen(false)} aria-label={T('Close')} className="rounded p-1 text-stone-400 hover:bg-stone-100"><Icon n="x"/></button></div>
   <div className="flex-1 space-y-2 overflow-auto bg-cream p-3 text-sm">
    <div className="rounded-md bg-paper p-3 text-stone-600 ring-1 ring-stone-200">{T('I can explain reactions, safety, or what is happening on your bench.')}</div>
    {!msgs.length&&['Why did my solution turn pink?','Why is my beaker not heating up?','What is happening in my beaker?'].map(c=><button key={c} onClick={()=>ask(T(c))} className="block w-full rounded-md border border-line bg-paper px-3 py-2 text-left text-brand-700 hover:border-brand-600">{T(c)}</button>)}
    {msgs.map((m,i)=><div key={i} className={'max-w-[85%] whitespace-pre-wrap rounded-md px-3 py-2 '+(m.r==='u'?'ml-auto bg-brand-700 text-white':'bg-paper text-stone-700 ring-1 ring-stone-200')}>{m.t}</div>)}
    {busy&&<div className="text-stone-500">{T('Thinking…')}</div>}<div ref={end}/></div>
   <form onSubmit={e=>{e.preventDefault();ask()}} className="flex gap-2 border-t border-line p-2"><input value={txt} onChange={e=>setTxt(e.target.value)} placeholder={T('Ask about any reaction or experiment…')} className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-600"/>
    <button aria-label={T('Send')} className="rounded-md bg-brand-700 px-3 text-white hover:bg-brand-600"><Icon n="send"/></button></form></div>}
  <button onClick={()=>setOpen(!open)} aria-label={T('Lab assistant')} className="ml-auto flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-brand-600"><Icon n="chat"/><span className="hidden sm:inline">{T('Lab assistant')}</span></button></div>;
}
