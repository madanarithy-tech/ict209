'use client';
import { useState } from 'react';
import Link from 'next/link';
import { EQUIP } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { buretteReading, fmtTime, useLab } from '@/lib/lab';
import { Badge, Btn, Card, Icon, Seg, Title } from './ui';

export function Procedure(){
 const {ex,latch,ans,setAns}=useLab();const T=useT();
 const [v,setV]=useState('');
 if(!ex)return <Card><Title>{T('Procedure')}</Title><div className="p-4 text-sm text-stone-600">{T('Free practice: nothing is checked. Choose an experiment for a guided procedure.')}
  <Link href="/dashboard" className="mt-3 flex items-center gap-1 font-medium text-brand-700 hover:underline">{T('Browse experiments')}<Icon n="arrow"/></Link></div></Card>;
 const n=latch.filter(Boolean).length,next=ex.steps.findIndex((_,i)=>!latch[i]);
 return <Card><Title right={<span className="font-mono text-xs text-stone-500">{n}/{ex.steps.length}</span>}>{T('Procedure')}</Title>
  <div className="p-4"><div className="font-semibold text-stone-900">{T(ex.name)}</div><div className="mt-1 font-mono text-xs text-stone-600">{ex.eq}</div>
   <div className="mt-3 h-1 rounded bg-stone-100"><div className="h-full rounded bg-gold-500 transition-all" style={{width:n/ex.steps.length*100+'%'}}/></div>
   <ol className="mt-3 space-y-2 text-sm">{ex.steps.map((s,i)=><li key={i} className={'flex gap-2.5 '+(latch[i]?'text-stone-400':i===next?'text-stone-900':'text-stone-600')}>
    <span className={'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold '+(latch[i]?'bg-emerald-600 text-white':i===next?'bg-brand-700 text-white':'bg-stone-100 text-stone-500')}>{latch[i]?<Icon n="check" className="h-3 w-3" sw={2.5}/>:i+1}</span>
    <div className="min-w-0 flex-1"><span className={latch[i]?'line-through decoration-stone-300':''}>{T(s[0])}</span>
     {s[2]&&i===next&&<form className="mt-2" onSubmit={e=>{e.preventDefault();const x=parseFloat(v);if(!isNaN(x))setAns(a=>({...a,[ex.id]:x}))}}>
      <div className="mb-1 font-mono text-xs text-stone-500">c(NaOH) = 0.100 × V(HCl) ÷ 25.0</div>
      <div className="flex gap-1.5"><input value={v} onChange={e=>setV(e.target.value)} inputMode="decimal" placeholder="0.000" className="w-24 rounded-md border border-stone-300 px-2 py-1 font-mono text-sm outline-none focus:border-brand-600"/><span className="self-center text-xs text-stone-500">mol/L</span><Btn kind="primary" className="!py-1">{T('Check')}</Btn></div>
      {ans[ex.id]!=null&&<p className="mt-1 text-xs text-rose-700">{T('Not quite. Check your burette reading and your calculation.')}</p>}</form>}</div></li>)}</ol>
   <div className="mt-4 flex gap-2 rounded-md bg-amber-50 p-2.5 text-xs text-amber-900 ring-1 ring-inset ring-amber-200"><Icon n="alert" className="h-4 w-4 shrink-0"/>{T(ex.note)}</div></div></Card>;
}

// Line chart of one logged reading against lab time, with a hover crosshair.
export function LogChart({pts,unit,dp}){
 const [hv,setHv]=useState(null);
 const W=288,H=132,l=36,r=8,t=8,b=20;
 if(pts.length<2)return <div className="grid h-[132px] place-items-center rounded-md bg-stone-50 text-xs text-stone-400">…</div>;
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=xs[0],x1=Math.max(xs[xs.length-1],x0+10);
 let y0=Math.min(...ys),y1=Math.max(...ys);const pad=Math.max((y1-y0)*.12,unit==='g'?.05:unit==='°C'?.5:.1);y0-=pad;y1+=pad;
 const X=x=>l+(x-x0)/(x1-x0)*(W-l-r),Y=y=>t+(1-(y-y0)/(y1-y0))*(H-t-b);
 const ticks=[y0+pad,(y0+y1)/2,y1-pad];
 const move=e=>{const bx=e.currentTarget.getBoundingClientRect(),x=(e.clientX-bx.left)/bx.width*W;let k=0,dmin=1e9;pts.forEach((p,i)=>{const d=Math.abs(X(p[0])-x);if(d<dmin){dmin=d;k=i}});setHv(k)};
 const p=hv!=null&&pts[hv];
 return <svg viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" onPointerMove={move} onPointerLeave={()=>setHv(null)} role="img">
  {ticks.map((v,i)=><g key={i}><line x1={l} x2={W-r} y1={Y(v)} y2={Y(v)} stroke="#ece5d6" strokeWidth="1"/><text x={l-4} y={Y(v)+3} fontSize="9" textAnchor="end" fill="#78716c" className="font-mono">{v.toFixed(dp)}</text></g>)}
  <text x={l} y={H-5} fontSize="9" fill="#78716c" className="font-mono">{fmtTime(x0)}</text><text x={W-r} y={H-5} fontSize="9" textAnchor="end" fill="#78716c" className="font-mono">{fmtTime(x1)}</text>
  <polyline fill="none" stroke="#0f766e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts.map(q=>X(q[0])+','+Y(q[1])).join(' ')}/>
  {p&&<g><line x1={X(p[0])} x2={X(p[0])} y1={t} y2={H-b} stroke="#94a3b8" strokeDasharray="2 2"/><circle cx={X(p[0])} cy={Y(p[1])} r="4" fill="#0f766e" stroke="#fffdf9" strokeWidth="2"/>
   <g transform={`translate(${Math.min(X(p[0])+6,W-r-84)},${t})`}><rect width="84" height="30" rx="4" fill="#292524"/><text x="6" y="12" fontSize="9" fill="#d6d3d1" className="font-mono">{fmtTime(p[0])}</text><text x="6" y="24" fontSize="10" fill="#fff" fontWeight="600" className="font-mono">{p[1].toFixed(dp)} {unit}</text></g></g>}
 </svg>;
}

export function Readings(){
 const {cs,items,sel}=useLab();const T=useT();
 const [ser,setSer]=useState('T');
 const c=cs.find(i=>i.id===sel)||cs[0];
 const bal=c&&items.find(i=>i.id===c.at&&i.kind==='balance'),burs=items.filter(i=>i.kind==='burette'&&i.ch);
 const avail=c?[c.therm&&['T',T('Temperature')],c.probe&&['pH','pH'],bal&&['m',T('Mass')]].filter(Boolean):[];
 const s=avail.find(a=>a[0]===ser)?ser:avail[0]&&avail[0][0];
 const pts=!c||!s?[]:c.log.map(([t,TT,pH,m])=>[t,s==='T'?Math.min(TT,110):s==='pH'?pH:m-bal.tare]).filter(p=>p[1]!=null);
 const Row=({l,v,hint})=><div className="flex items-baseline justify-between gap-2 py-1.5"><span className="text-stone-600">{l}</span>{v!=null?<b className="font-mono text-base text-stone-900">{v}</b>:<span className="text-right text-xs text-stone-400">{hint}</span>}</div>;
 return <Card><Title right={c&&<span className="text-xs text-stone-500">{T(EQUIP[c.kind].n)} {c.label}</span>}>{T('Instruments')}</Title>
  <div className="px-4 pb-4 pt-1 text-sm">{!c?<p className="py-3 text-stone-500">{T('Add a container to take readings.')}</p>:<>
   <div className="divide-y divide-line/70">
    <Row l={T('Thermometer')} v={c.therm?Math.min(c.T,110).toFixed(1)+' °C':null} hint={T('Not inserted')}/>
    <Row l={T('pH meter')} v={c.probe&&c.d.pH!=null?c.d.pH.toFixed(2):null} hint={c.probe?T('Probe is not in liquid'):T('Not inserted')}/>
    <Row l={T('Balance')} v={bal?(c.glass+c.mass-bal.tare).toFixed(2)+' g':null} hint={T('Not on a balance')}/>
    {burs.map((b,i)=><Row key={b.id} l={T('Burette')+(burs.length>1?' '+(i+1):'')} v={buretteReading(b).toFixed(2)+' mL'}/>)}</div>
   {avail.length?<div className="mt-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-stone-500">{avail.find(a=>a[0]===s)[1]} · {T('logged every 2 s')}</span>{avail.length>1&&<Seg val={s} onChange={setSer} opts={avail}/>}</div>
    <LogChart key={c.id+s} pts={pts} unit={s==='T'?'°C':s==='m'?'g':''} dp={s==='m'?2:s==='pH'?2:1}/></div>
   :<p className="mt-3 rounded-md bg-stone-50 p-3 text-xs text-stone-500">{T('Insert a thermometer or pH meter, or stand the container on a balance, to log data.')}</p>}</>}</div></Card>;
}

export function Notebook(){
 const {notes,setNotes,record}=useLab();const T=useT();
 const f=(v,d)=>v==null?'—':v.toFixed(d);
 return <Card><Title right={<div className="flex gap-1">{notes.length>0&&<button onClick={()=>setNotes([])} className="rounded px-1.5 text-xs text-stone-500 hover:bg-stone-100">{T('Clear')}</button>}<Btn onClick={record} className="!px-2 !py-1 !text-xs"><Icon n="record" className="h-3.5 w-3.5"/>{T('Record reading')}</Btn></div>}>{T('Notebook')}</Title>
  {notes.length?<div className="max-h-56 overflow-auto"><table className="w-full text-right font-mono text-xs"><thead className="sticky top-0 bg-paper text-[11px] text-stone-500"><tr>
   <th className="py-1.5 pl-4 text-left font-medium">{T('Time')}</th><th className="text-left font-medium"> </th><th className="font-medium">°C</th><th className="font-medium">pH</th><th className="font-medium">g</th><th className="pr-4 font-medium">{T('Burette')}</th></tr></thead>
   <tbody>{notes.map(n=><tr key={n.k} className="border-t border-line/70 text-stone-800"><td className="py-1 pl-4 text-left">{fmtTime(n.t)}</td><td className="text-left">{n.label}</td><td>{f(n.T,1)}</td><td>{f(n.pH,2)}</td><td>{f(n.m,2)}</td><td className="pr-4">{f(n.bur,2)}</td></tr>)}</tbody></table></div>
  :<p className="px-4 py-3 text-xs text-stone-500">{T('Readings you record appear here, the way you would write them in your exercise book.')}</p>}</Card>;
}

export function Alerts(){
 const {alerts}=useLab();const T=useT();
 const S={danger:['bg-rose-50 text-rose-800 ring-rose-200','alert'],warn:['bg-amber-50 text-amber-900 ring-amber-200','alert'],info:['bg-sky-50 text-sky-900 ring-sky-200','info']};
 return <Card><Title right={alerts.length>0&&<Badge tone="amber">{alerts.length}</Badge>}>{T('Safety')}</Title>
  <div className="space-y-2 p-3 text-sm">{alerts.length?alerts.map(a=><div key={a.k} className={'flex gap-2 rounded-md p-2.5 ring-1 ring-inset '+S[a.l][0]}><Icon n={S[a.l][1]} className="mt-0.5 h-4 w-4 shrink-0"/>{T(a.msg)}</div>)
   :<div className="flex items-center gap-2 px-1 text-emerald-700"><Icon n="check"/>{T('No warnings. Goggles on.')}</div>}</div></Card>;
}
