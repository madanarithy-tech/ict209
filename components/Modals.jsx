'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Card } from './ui';

function Quiz({onDone,onClose}){
 const T=useT();
 const [i,setI]=useState(0),[sc,setSc]=useState(0),[res,setRes]=useState(null);
 const pick=k=>{const s=sc+(k===QUIZ[i][2]?1:0);if(i<2){setSc(s);setI(i+1)}else{setSc(s);setRes(s>=2)}};
 return <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/40 p-4"><Card className="w-full max-w-md p-6">
  {res===null?<><div className="text-sm text-stone-500">{T('Safety check · question')} {i+1} {T('of 3')}</div>
   <h3 className="mt-2 text-lg font-semibold">{QUIZ[i][0]}</h3>
   <div className="mt-4 grid gap-2">{QUIZ[i][1].map((o,k)=><button key={k} onClick={()=>pick(k)} className="rounded-xl border border-stone-300 px-4 py-3 text-left hover:border-teal-400 hover:bg-teal-600/10">{o}</button>)}</div></>
  :<div className="text-center"><div className="text-4xl">{res?'✅':'⚠️'}</div><h3 className="mt-2 text-lg font-semibold">{res?T('Safety check passed'):'Not quite — review the safety manual'}</h3>
   <p className="mt-1 text-sm text-stone-500">You scored {sc} of 3. You need at least 2 to enter high-risk experiments.</p>
   <button onClick={()=>res?onDone():onClose()} className="mt-4 rounded-xl bg-teal-700 px-5 py-2 font-semibold text-white">{res?T('Enter the lab'):'Close'}</button></div>}
 </Card></div>;
}

function Summary({ex,secs,onClose}){
 const T=useT();
 return <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/40 p-4">
  {Array.from({length:40}).map((_,i)=><span key={i} className="conf" style={{left:(i*2.5)+'%',background:['#2dd4bf','#a78bfa','#d4af37','#5eead4'][i%4],animationDelay:(i%8)*.15+'s'}}/>)}
  <Card className="w-full max-w-md p-6 text-center"><div className="text-4xl">🎉</div>
   <h3 className="mt-2 text-xl font-extrabold text-emerald-600">{T('Experiment complete')}</h3><p className="text-stone-600">{T(ex.name)}</p>
   <div className="mt-4 rounded-xl bg-stone-50 p-4 text-sm"><div className="text-stone-500">{T('Chemical equation')}</div><div className="mt-1 text-lg font-semibold text-teal-700">{ex.eq}</div></div>
   <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-stone-50 p-3">Steps<div className="text-xl font-bold">{ex.steps.length}/{ex.steps.length}</div></div><div className="rounded-xl bg-stone-50 p-3">Time<div className="text-xl font-bold">{Math.floor(secs/60)}m {secs%60}s</div></div></div>
   <button onClick={onClose} className="mt-5 rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white">{T('Back to dashboard')}</button></Card></div>;
}

export default function Modals(){
 const {modal,setModal,setPassed,pending,go,ex,t0}=useLab();
 const router=useRouter();
 if(modal==='quiz')return <Quiz onClose={()=>setModal(null)} onDone={()=>{setPassed(true);setModal(null);if(pending)go(pending)}}/>;
 if(modal==='summary'&&ex)return <Summary ex={ex} secs={Math.round((Date.now()-t0.current)/1000)} onClose={()=>{setModal(null);router.push('/dashboard')}}/>;
 return null;
}
