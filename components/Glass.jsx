'use client';
import { useState } from 'react';
import { CHEMS } from '@/lib/chem';
import { useT } from '@/lib/i18n';

function Pour({pr}){const c=CHEMS[pr.ch],f=c.f,col=c.pc;
 return <div className="pointer-events-none absolute inset-x-0 -top-24 z-20 h-28">
  <div className="absolute -left-10 top-0 flex flex-col items-center" style={{opacity:0,animation:'tilt 1.5s ease-in-out forwards'}}><div className="h-3 w-3 rounded-t bg-stone-400"/><div className="h-12 w-9 rounded-lg border border-stone-400" style={{background:`linear-gradient(transparent 22%,${col} 22%)`}}/></div>
  {f==='liquid'?<div className="absolute left-1/2 top-4 rounded-b" style={{width:pr.drop?3:6,height:'100%',marginLeft:-3,background:col,border:'1px solid rgba(100,116,139,.35)',transformOrigin:'top',opacity:0,animation:`stream ${pr.drop?.9:1.1}s .25s ease-in forwards`}}/>
  :Array.from({length:f==='ribbon'?5:12}).map((_,i)=><span key={i} className="absolute top-4" style={{left:`${42+(i%5)*4}%`,width:f==='ribbon'?2:f==='powder'?3:6,height:f==='ribbon'?14:f==='powder'?3:6,background:col,border:'1px solid rgba(100,116,139,.45)',borderRadius:f==='pellet'||f==='granule'?'50%':1,opacity:0,animation:`pf .7s ${.3+i*.06}s ease-in forwards`}}/>)}</div>}

export default function Glass({it,d,sel,stir,pr,onSel,onPour,onDel}){
 const T=useT();
 const [over,setOver]=useState(false);
 const pct=Math.min(100,d.vol/250*100),fl=it.kind==='flask';
 return <div className="flex flex-col items-center w-32">
  <div onClick={()=>onSel(it.id)} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
   onDrop={e=>{e.preventDefault();e.stopPropagation();setOver(false);try{const x=JSON.parse(e.dataTransfer.getData('text/plain'));if(x.k==='chem')onPour(it.id,x.id)}catch(_){}}}
   className={'relative cursor-pointer h-44 w-28 overflow-visible transition '+(over?'scale-105 ':'')}>
   {pr&&<Pour key={pr.k} pr={pr}/>}
   {it.t>70&&[0,1,2].map(i=><span key={i} className="vap" style={{left:10+i*28,animationDelay:i*.7+'s'}}/>)}
   <div className={'absolute inset-0 overflow-hidden border-2 border-t-0 bg-white/60 '+(fl?'rounded-b-[50%] ':'rounded-b-2xl ')+(sel?'border-teal-400 shadow-[0_0_24px_#14b8a666]':over?'border-emerald-400':'border-stone-400')}>
    <div className="absolute bottom-0 w-full transition-all duration-700" style={{height:pct+'%',background:d.color}}>
     {d.gas&&[0,1,2,3,4,5,6,7].map(i=><span key={i} className="bub" style={{left:8+i*11+'%',animationDelay:i*.22+'s'}}/>)}
     {d.ppt&&[0,1,2,3,4,5].map(i=><span key={i} className="absolute bottom-1 w-3 h-2 rounded-full bg-teal-200/80" style={{left:12+i*14+'%'}}/>)}
     {d.cuso4>5&&d.vol<25&&[0,1,2,3,4].map(i=><span key={i} className="absolute bottom-1 text-teal-600 text-sm" style={{left:8+i*18+'%'}}>◆</span>)}
    </div>
    {((it.m.zn||0)+(it.m.mg||0))>0&&<div className="absolute bottom-1 left-0 flex w-full justify-center gap-1">{Array.from({length:Math.min(5,Math.ceil(((it.m.zn||0)+(it.m.mg||0))/5))}).map((_,i)=><span key={i} style={{width:it.m.mg?3:7,height:it.m.mg?16:6,background:it.m.mg?'#e2e8f0':'#94a3b8',border:'1px solid #64748b',borderRadius:it.m.mg?2:'50%',transform:`rotate(${i*30-50}deg)`}}/>)}</div>}
    {stir&&d.vol>0&&<div className="absolute left-1/2 top-2 h-32 w-1 origin-top rounded bg-stone-500" style={{animation:'rod .5s infinite'}}/>}
   </div>
   <button onClick={e=>{e.stopPropagation();onDel(it.id)}} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-stone-200 text-xs hover:bg-rose-600" aria-label="Remove">×</button>
  </div>
  <div className="mt-2 text-center text-xs text-stone-600">{T(fl?'Flask':'Beaker')} · {Math.round(d.vol)} mL · {it.t.toFixed(0)}°C
   <div className={'mt-1 inline-block rounded px-1.5 '+(d.pH<6?'bg-amber-500/20 text-amber-700':d.pH>8?'bg-violet-500/20 text-violet-700':'bg-emerald-500/20 text-emerald-700')}>pH {d.pH.toFixed(1)}</div></div></div>;
}
