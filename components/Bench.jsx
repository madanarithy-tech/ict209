'use client';
import { useMemo, useState } from 'react';
import { AMTS, EQUIP, HAZ, REAG, TABS, TAPLBL, fullName, isC } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { buretteReading, fmtTime, useLab } from '@/lib/lab';
import { Badge, Btn, Card, Icon, Seg } from './ui';
import { BurnerSVG, BuretteSVG, Pour, ShelfIcon, Vessel, surfaceY } from './Apparatus';
import { Alerts, Notebook, Procedure, Readings } from './Panels';

const payload=e=>{try{return JSON.parse(e.dataTransfer.getData('text/plain'))}catch(_){return null}};
const drag=x=>e=>{e.stopPropagation();e.dataTransfer.setData('text/plain',JSON.stringify(x))};
export const stationName=(items,s,T)=>T(EQUIP[s.kind].n)+' '+(items.filter(i=>i.kind===s.kind).indexOf(s)+1);

function Container({c}){
 const {sel,setSel,dispense,toggle,pours}=useLab();const T=useT();
 const [over,setOver]=useState(false);
 const onDrop=e=>{e.preventDefault();e.stopPropagation();setOver(false);const x=payload(e);if(!x)return;
  if(x.k==='reag')dispense(c.id,x.id);else if(x.k==='equip'&&['therm','probe','rod'].includes(x.id))toggle(c.id,x.id==='rod'?'stir':x.id)};
 return <div draggable onDragStart={drag({k:'move',id:c.id})} onClick={e=>{e.stopPropagation();setSel(c.id)}} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={onDrop}
  className={'relative h-[190px] w-[120px] shrink-0 cursor-pointer rounded-md transition '+(sel===c.id?'bg-brand-50/50 ring-2 ring-brand-600/50':over?'ring-2 ring-emerald-500/60':'hover:bg-white/40')}>
  {pours[c.id]&&<Pour key={pours[c.id].k} pr={pours[c.id]} c={c}/>}
  {c.T>75&&c.water>0&&[0,1,2].map(i=><span key={i} className="vap" style={{left:22+i*26,top:28,animationDelay:i*.7+'s'}}/>)}
  <Vessel c={c} d={c.d}/>
  <div className="absolute left-1 top-1 rounded bg-stone-900/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">{c.label}</div>
  <div className="absolute right-1 top-1 flex flex-col items-end gap-0.5 font-mono text-[11px]">
   {c.therm&&<span className="rounded bg-white/90 px-1 text-rose-700 ring-1 ring-stone-200">{Math.min(c.T,110).toFixed(1)} °C</span>}
   {c.probe&&<span className="rounded bg-white/90 px-1 text-stone-800 ring-1 ring-stone-200">pH {c.d.pH!=null?c.d.pH.toFixed(2):'—'}</span>}</div>
 </div>;
}

function Slot({at}){
 const {cs,sel,place}=useLab();const T=useT();const cur=cs.find(c=>c.id===sel);
 return <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();e.stopPropagation();const x=payload(e);if(x&&x.k==='move')place(x.id,at)}}
  className="flex h-[190px] w-[120px] shrink-0 flex-col items-center justify-end pb-2">
  <div className="flex h-[120px] w-[100px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-stone-400/70 p-2 text-center text-[11px] leading-tight text-stone-500">
   {T('Place a beaker or flask here')}{cur&&cur.at!==at&&<button onClick={e=>{e.stopPropagation();place(cur.id,at)}} className="rounded bg-brand-700 px-2 py-1 font-medium text-white hover:bg-brand-600">{T('Move')} {cur.label}</button>}</div></div>;
}

function Controls({s,children}){
 const {items,remove}=useLab();const T=useT();
 return <div className="w-full rounded-md border border-line bg-paper p-2 text-xs shadow-sm">
  <div className="mb-1.5 flex items-center justify-between"><b className="text-stone-700">{stationName(items,s,T)}</b><button onClick={()=>remove(s.id)} aria-label={T('Remove')} className="rounded p-0.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Icon n="x" className="h-3.5 w-3.5"/></button></div>
  {children}</div>;
}

function Burner({b,held,part}){
 const {patch}=useLab();const T=useT();
 if(part==='app')return <div className="flex flex-col items-center">{held?<Container c={held}/>:<Slot at={b.id}/>}<div style={{marginTop:-9}}><BurnerSVG gas={b.gas} air={b.air}/></div></div>;
 return <Controls s={b}><div className="space-y-1.5">
   <label className="flex items-center gap-2 text-stone-600">{T('Gas')}<input type="range" min="0" max="10" value={b.gas} onChange={e=>patch(b.id,{gas:+e.target.value})} className="min-w-0 flex-1 accent-brand-700"/><span className="w-10 text-right font-mono">{b.gas?b.gas+'/10':T('off')}</span></label>
   <div className="flex items-center justify-between text-stone-600">{T('Air hole')}<Seg val={b.air} onChange={v=>patch(b.id,{air:v})} opts={[[false,T('Closed')],[true,T('Open')]]}/></div></div></Controls>;
}

function Burette({b,held,part}){
 const {patch,fill,drop,place}=useLab();const T=useT();
 const [ch,setCh]=useState(b.ch||'hcl01');
 if(part==='app')return <div className="relative h-[360px] w-[140px]" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();e.stopPropagation();const x=payload(e);if(!x)return;if(x.k==='move')place(x.id,b.id);else if(x.k==='reag'&&REAG[x.id].f==='sol')fill(b.id,x.id)}}>
   <BuretteSVG b={b} land={held?202+surfaceY(held):346}/><div className="absolute left-2" style={{top:162}}>{held?<Container c={held}/>:<Slot at={b.id}/>}</div></div>;
 return <Controls s={b}><div className="space-y-1.5">
   <div className="flex gap-1"><select value={ch} onChange={e=>setCh(e.target.value)} className="min-w-0 flex-1 rounded border border-line bg-paper px-1 py-1 text-xs">{Object.entries(REAG).filter(([,r])=>r.f==='sol').map(([k,r])=><option key={k} value={k}>{fullName(r,T)}</option>)}</select>
    <button onClick={()=>fill(b.id,ch)} className="rounded border border-line px-2 hover:bg-stone-50">{T('Fill')}</button></div>
   <div className="flex items-center justify-between"><span className="text-stone-600">{T('Reading')}</span><b className="font-mono text-sm">{b.ch?buretteReading(b).toFixed(2)+' mL':'—'}</b></div>
   <div className="grid grid-cols-4 gap-0.5 rounded-md border border-line bg-sand p-0.5">{TAPLBL.map((l,i)=><button key={l} onClick={()=>patch(b.id,{tap:i})} className={'truncate rounded px-0.5 py-1 text-[11px] font-medium '+(b.tap===i?'bg-paper text-stone-900 shadow-sm ring-1 ring-stone-200':'text-stone-500 hover:text-stone-800')}>{T(l)}</button>)}</div>
   <button onClick={()=>drop(b.id)} disabled={!b.ch} className="w-full rounded border border-line py-1 hover:bg-stone-50 disabled:opacity-40">{T('Add one drop')} (0.05 mL)</button></div></Controls>;
}

function Balance({b,held,part}){
 const {tare}=useLab();const T=useT();
 const g=(held?held.glass+held.mass:0)-b.tare;
 if(part!=='app')return <Controls s={b}><p className="text-stone-500">{T('Press Tare to set the reading to zero with the container on the pan.')}</p></Controls>;
 return <div className="flex flex-col items-center">
  {held?<Container c={held}/>:<Slot at={b.id}/>}
  <div className="-mt-1.5 h-2 w-[132px] rounded-sm bg-gradient-to-b from-stone-200 to-stone-400 shadow-sm"/>
  <div className="h-3 w-4 bg-stone-500"/>
  <div className="w-[164px] rounded-md border border-stone-400 bg-gradient-to-b from-stone-100 to-stone-300 p-2 shadow">
   <div className="rounded bg-[#1d2b24] px-2 py-1 text-right font-mono text-base text-[#a7f3c0]">{g.toFixed(2)} g</div>
   <div className="mt-1.5 flex justify-between"><button onClick={()=>tare(b.id)} className="rounded bg-stone-700 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-stone-600">{T('Tare')}</button><span className="text-[10px] text-stone-500">max 600 g · d=0.01 g</span></div></div></div>;
}

function Inspector(){
 const {cs,items,sel,toggle,place,empty,remove}=useLab();const T=useT();
 const c=cs.find(i=>i.id===sel);if(!c)return null;
 const stations=items.filter(i=>!isC(i));
 const tog=(f,icon,l)=><Btn onClick={()=>toggle(c.id,f)} className={c[f]?'!border-brand-600 !bg-brand-50 !text-brand-800':''}><Icon n={icon}/>{T(l)}</Btn>;
 const contents=Object.entries(c.src).map(([k,v])=>{const r=REAG[k];return fullName(r,T)+' · '+(r.f==='sol'?(+v.toFixed(2))+' mL':r.f==='ind'?v+' '+T('drops'):v+' '+T(r.sp==='NH4Cls'?'spatulas':'pieces'))});
 return <Card className="p-3">
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><b className="text-stone-900">{T(EQUIP[c.kind].n)} {c.label}</b><span className="font-mono text-sm text-stone-600">≈ {c.water.toFixed(c.water<10?1:0)} mL</span>
   {c.d.xtal>.05&&<Badge tone="brand">{T('Crystals')} {c.d.xtal.toFixed(2)} g</Badge>}{c.d.ppt&&<Badge tone="brand">{T('Precipitate')}</Badge>}{c.d.gr>1e-7&&<Badge>{T('Gas bubbling')}</Badge>}{c.d.boiling&&<Badge tone="rose">{T('Boiling')}</Badge>}</div>
  <p className="mt-1 text-xs text-stone-500">{contents.length?contents.join('  ·  '):T('Empty')}</p>
  <div className="mt-2 flex flex-wrap items-center gap-1.5">
   {tog('therm','thermo','Thermometer')}{tog('probe','drop','pH meter')}{tog('stir','flask','Stir')}
   <select value={c.at||''} onChange={e=>place(c.id,e.target.value||null)} className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm" aria-label={T('Position')}>
    <option value="">{T('On the bench')}</option>{stations.map(s=><option key={s.id} value={s.id}>{stationName(items,s,T)}</option>)}</select>
   <Btn onClick={()=>empty(c.id)}>{T('Empty and rinse')}</Btn><Btn kind="danger" onClick={()=>remove(c.id)}><Icon n="trash"/>{T('Remove')}</Btn></div></Card>;
}

export default function Bench(){
 const {items,cs,sel,setSel,amt,setAmt,speed,setSpeed,t,toast,setToast,addEquip,dispense,place,clear,ex}=useLab();
 const T=useT();
 const [tab,setTab]=useState(TABS[0]),[q,setQ]=useState('');
 const cur=cs.find(c=>c.id===sel);
 const tapShelf=(k,id)=>{if(k==='equip'){addEquip(id);return}const c=cur||cs[0];c?dispense(c.id,id):setToast('Place a beaker or flask on the bench first')};
 const list=useMemo(()=>{const all=[...Object.entries(REAG).map(([id,r])=>({id,k:'reag',...r})),...Object.entries(EQUIP).map(([id,r])=>({id,k:'equip',cat:'Apparatus',...r}))];
  const s=q.trim().toLowerCase();return all.filter(x=>s?(x.n+' '+x.c+' '+(x.fm||'')).toLowerCase().includes(s)||T(x.n).includes(q.trim()):x.cat===tab)},[tab,q,T]);
 const free=items.filter(i=>!isC(i)||!items.some(s=>s.id===i.at));
 const held=s=>cs.find(c=>c.at===s.id);
 const W=i=>isC(i)?128:i.kind==='burette'?224:184;
 const part=(i,p)=>isC(i)?<Container c={cs.find(c=>c.id===i.id)}/>:i.kind==='bunsen'?<Burner b={i} held={held(i)} part={p}/>:i.kind==='burette'?<Burette b={i} held={held(i)} part={p}/>:<Balance b={i} held={held(i)} part={p}/>;
 return <div className="grid min-h-full grid-cols-1 gap-3 p-3 xl:h-full xl:grid-cols-[272px_minmax(0,1fr)_320px]">
  <Card className="flex min-h-0 flex-col">
   <div className="border-b border-line/70 p-3"><div className="relative"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={T('Search chemicals and apparatus')} className="w-full rounded-md border border-line bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-brand-600 focus:bg-paper"/></div>
    <div className="mt-2 flex flex-wrap gap-1">{TABS.map(x=><button key={x} onClick={()=>{setTab(x);setQ('')}} className={'rounded px-2 py-1 text-xs font-medium '+(tab===x&&!q?'bg-brand-700 text-white':'text-stone-600 hover:bg-sand')}>{T(x)}</button>)}</div></div>
   {(tab==='Solutions'||tab==='Household')&&!q&&<div className="border-b border-line/70 px-3 py-2"><div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-stone-500">{T('Amount to add')}</div>
    <Seg val={amt} onChange={setAmt} opts={AMTS.map(([v,l])=>[v,T(l)])} className="flex-wrap"/></div>}
   <div className="min-h-0 flex-1 overflow-auto p-1.5">{list.map(x=><div key={x.id} role="button" tabIndex={0} draggable onDragStart={drag({k:x.k,id:x.id})} onClick={()=>tapShelf(x.k,x.id)} onKeyDown={e=>e.key==='Enter'&&tapShelf(x.k,x.id)}
     className="flex cursor-grab items-center gap-3 rounded-md px-2 py-1.5 hover:bg-stone-50 active:cursor-grabbing">
     <ShelfIcon k={x.k} id={x.id} className="h-11 w-9 shrink-0"/>
     <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-stone-800">{T(x.n)}</div><div className="truncate text-xs text-stone-500">{x.k==='reag'&&x.id==='naohx'?T('unknown concentration'):T(x.c)}</div></div>
     {x.haz&&x.haz!=='None'&&<Badge tone={HAZ[x.haz]}>{T(x.haz)}</Badge>}</div>)}
    {!list.length&&<p className="p-3 text-sm text-stone-500">{T('Nothing matches that search.')}</p>}</div>
   <p className="border-t border-line/70 p-3 text-xs leading-relaxed text-stone-500">{T('Tap a reagent to add it to the selected container, or drag it onto one. Indicators add one drop and solids add one piece at a time.')}</p></Card>

  <div className="flex min-w-0 flex-col gap-3">
   <Card className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 text-sm">
    <b className="text-stone-800">{T(ex?ex.name:'Free practice')}</b>
    <span className="flex items-center gap-1.5 text-stone-500"><Icon n="clock"/>{T('Lab time')} <span className="font-mono text-stone-900">{fmtTime(t)}</span></span>
    <Seg val={speed} onChange={setSpeed} opts={[[0,<Icon key="p" n="pause" className="h-3.5 w-3.5"/>],[1,'×1'],[10,'×10'],[30,'×30']]}/>
    <Btn kind="danger" onClick={clear} className="ml-auto"><Icon n="trash"/>{T('Clear bench')}</Btn></Card>
   <div className="bench relative flex min-h-[460px] flex-1 flex-col overflow-x-auto rounded-lg border border-line" onClick={()=>setSel(null)}
    onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const x=payload(e);if(!x)return;
     if(x.k==='move')place(x.id,null);else if(x.k==='equip')['therm','probe','rod'].includes(x.id)?setToast('Drop it onto a beaker or flask'):addEquip(x.id);else setToast('Drop chemicals onto a beaker or flask')}}>
    {!items.length?<div className="flex min-h-[460px] items-center justify-center p-6"><div className="max-w-sm text-center text-sm text-stone-500"><ShelfIcon k="equip" id="beaker" className="mx-auto mb-2 h-14 w-12 opacity-60"/>{T('Open the Apparatus tab and add a beaker or conical flask to start.')}</div></div>
    :<div className="flex min-h-full min-w-max flex-col">
     <div className="flex flex-1 items-end gap-6 px-6 pt-6">{free.map(i=><div key={i.id} className="flex shrink-0 justify-center" style={{width:W(i)}}>{part(i,'app')}</div>)}</div>
     <div className="h-3 border-t-2 border-[#5a524a] bg-[#403a34]"/>
     <div onClick={e=>e.stopPropagation()} className="flex min-h-[64px] items-start gap-6 bg-[#332e29] px-6 pb-4 pt-1">{free.map(i=><div key={i.id} className="shrink-0" style={{width:W(i)}}>{!isC(i)&&part(i,'ctl')}</div>)}</div></div>}
    {toast&&<div className="absolute left-1/2 top-3 z-30 -transtone-x-1/2 rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white shadow-lg">{T(toast)}</div>}</div>
   <Inspector/></div>

  <div className="flex min-h-0 flex-col gap-3 xl:overflow-auto"><Procedure/><Readings/><Notebook/><Alerts/></div></div>;
}
