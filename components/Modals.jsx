'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Btn, Card, Icon } from './ui';

const Shade=({children})=><div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/50 p-4">{children}</div>;
const PASS=4;

function Quiz({onDone,onClose}){
 const T=useT();
 const [i,setI]=useState(0),[sc,setSc]=useState(0),[res,setRes]=useState(null);
 const pick=k=>{const s=sc+(k===QUIZ[i][2]?1:0);setSc(s);if(i<QUIZ.length-1)setI(i+1);else setRes(s>=PASS)};
 return <Shade><Card className="w-full max-w-md p-6">
  {res===null?<><div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-500"><span>{T('Safety check')}</span><span className="font-mono">{i+1} / {QUIZ.length}</span></div>
   <div className="mt-2 h-1 rounded bg-stone-100"><div className="h-full rounded bg-brand-700" style={{width:i/QUIZ.length*100+'%'}}/></div>
   <h3 className="mt-4 text-lg font-semibold text-stone-900">{T(QUIZ[i][0])}</h3>
   <div className="mt-4 grid gap-2">{QUIZ[i][1].map((o,k)=><button key={k} onClick={()=>pick(k)} className="rounded-md border border-line px-4 py-3 text-left text-sm hover:border-brand-600 hover:bg-brand-50">{T(o)}</button>)}</div>
   <button onClick={onClose} className="mt-4 text-sm text-stone-500 hover:underline">{T('Cancel')}</button></>
  :<div className="text-center"><div className={'mx-auto grid h-12 w-12 place-items-center rounded-full '+(res?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700')}><Icon n={res?'check':'alert'} className="h-6 w-6"/></div>
   <h3 className="mt-3 text-lg font-semibold">{T(res?'Safety check passed':'Not yet. Read the safety rules and try again.')}</h3>
   <p className="mt-1 text-sm text-stone-500">{T('Score')}: <span className="font-mono">{sc} / {QUIZ.length}</span>. {T('You need 4 correct answers to start experiments that use flames or make flammable gas.')}</p>
   <Btn kind="primary" onClick={()=>res?onDone():onClose()} className="mt-5">{T(res?'Enter the lab':'Close')}</Btn></div>}
 </Card></Shade>;
}

function Summary({ex,secs,S,onClose}){
 const T=useT();
 const [pick,setPick]=useState(null);
 const rows=ex.res?ex.res(S):[];
 return <Shade><Card className="max-h-full w-full max-w-lg overflow-auto p-6">
  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon n="check" className="h-5 w-5" sw={2.2}/></div>
   <div><h3 className="text-lg font-semibold text-stone-900">{T('Experiment complete')}</h3><p className="text-sm text-stone-600">{T(ex.name)}</p></div></div>
  <div className="mt-5 rounded-md bg-stone-50 p-3"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Chemical equation')}</div><div className="mt-1 font-mono text-sm text-stone-900">{ex.eq}</div></div>
  <dl className="mt-3 divide-y divide-line/70 text-sm">{[[T('Time taken'),`${Math.floor(secs/60)} min ${secs%60} s`],...rows.map(([k,v])=>[T(k),v])].map(([k,v])=><div key={k} className="flex justify-between py-2"><dt className="text-stone-600">{k}</dt><dd className="font-mono text-stone-900">{v}</dd></div>)}</dl>
  <div className="mt-4"><div className="text-sm font-semibold text-stone-900">{T('Conclusion')}: {T(ex.q[0])}</div>
   <div className="mt-2 grid gap-1.5">{ex.q[1].map((o,k)=><button key={k} disabled={pick!=null} onClick={()=>setPick(k)} className={'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm '+(pick==null?'border-line hover:border-brand-600':k===ex.q[2]?'border-emerald-300 bg-emerald-50 text-emerald-900':k===pick?'border-rose-300 bg-rose-50 text-rose-900':'border-line text-stone-400')}>
    {pick!=null&&k===ex.q[2]&&<Icon n="check" className="h-4 w-4 shrink-0"/>}{T(o)}</button>)}</div></div>
  <Btn kind="primary" onClick={onClose} className="mt-5 w-full">{T('Back to experiments')}</Btn></Card></Shade>;
}

export default function Modals(){
 const {modal,setModal,setPassed,pending,go,ex,t0,S}=useLab();
 const router=useRouter();
 if(modal==='quiz')return <Quiz onClose={()=>setModal(null)} onDone={()=>{setPassed(true);setModal(null);if(pending)go(pending)}}/>;
 if(modal==='summary'&&ex)return <Summary ex={ex} S={S} secs={Math.round((Date.now()-t0.current)/1000)} onClose={()=>{setModal(null);router.push('/dashboard')}}/>;
 return null;
}
