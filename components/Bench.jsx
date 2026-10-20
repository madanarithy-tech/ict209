'use client';
import { useMemo, useState } from 'react';
import { CHEMS, FORMLBL, GLASS, SOL, TABS, derive, isC, liquid, uid } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Card, Molecule } from './ui';
import Glass from './Glass';

export default function Bench(){
 const {items,setItems,sel,setSel,ex,latch,alerts,warn,mode,setMode,hist,stir,setStir,toast,setToast}=useLab();
 const T=useT();
 const [tab,setTab]=useState(TABS[0]),[q,setQ]=useState(''),[pours,setPours]=useState({});
 const addItem=k=>{const it={id:uid(),kind:k,m:{},t:22,on:false,flame:5};setItems(p=>[...p,it]);if(isC(it))setSel(it.id)};
 const pour=(id,ch)=>{
  const it=items.find(i=>i.id===id);if(!it)return;
  const sol=SOL.includes(ch),amt=sol?(mode==='drop'?1:5):(mode==='drop'?2:25),m={...it.m};let dT=0;
  if(!sol&&liquid(m)+amt>250){warn('warn','Overflow! A container holds 250 mL maximum.');return}
  if(ch==='water'&&(m.hcl||0)>0){warn('danger','Never add water to concentrated acid. Add acid to water slowly to avoid splashing.');dT+=6}
  if(ch==='hcl'&&(m.naoh||0)>0){dT+=Math.min(amt,m.naoh)*.4;warn('info','Neutralisation is exothermic: HCl + NaOH → NaCl + H₂O.')}
  if(ch==='naoh'&&(m.hcl||0)>0)dT+=Math.min(amt,m.hcl)*.4;
  if(sol&&(m.hcl||0)>0){dT+=ch==='mg'?16:10;warn('warn','Hydrogen gas released. Keep flames away.');if(items.some(i=>i.kind==='bunsen'&&i.on))warn('danger','Open flame near hydrogen is an explosion risk. Turn the burner off.')}
  if(ch==='cuso4'&&(m.naoh||0)>0)warn('info','Blue precipitate of Cu(OH)₂ is forming.');
  m[ch]=(m[ch]||0)+amt;
  const k=uid();setPours(p=>({...p,[id]:{ch,k,drop:mode==='drop'}}));setSel(id);
  setTimeout(()=>setItems(p=>p.map(i=>i.id===id?{...i,m:{...i.m,[ch]:(i.m[ch]||0)+amt},t:Math.min(100,i.t+dT)}:i)),650);
  setTimeout(()=>setPours(p=>p[id]&&p[id].k===k?{...p,[id]:null}:p),1500);
 };
 const tapShelf=(k,id)=>{
  if(k==='glass'){if(id==='pipette'){setMode('drop');setToast('Dropper mode on: 2 mL per drop');return}addItem(id);return}
  const c=items.find(i=>i.id===sel&&isC(i))||items.find(isC);
  c?pour(c.id,id):setToast('Place a beaker or flask first');
 };
 const list=useMemo(()=>{const all=[...Object.entries(CHEMS).map(([id,v])=>({id,k:'chem',...v})),...Object.entries(GLASS).map(([id,v])=>({id,k:'glass',cat:'Glassware',...v}))];
  return all.filter(x=>q?x.n.toLowerCase().includes(q.toLowerCase())||T(x.n).includes(q):x.cat===tab)},[tab,q,T]);
 const cs=items.filter(isC),cur=cs.find(c=>c.id===sel)||cs[0],cd=cur&&derive(cur),bun=items.find(i=>i.kind==='bunsen');
 const done=latch.filter(Boolean).length;
 const pts=hist.map((v,i)=>`${i*(160/39)},${50-(v-15)*0.5}`).join(' ');
 return <div className="grid h-full grid-cols-1 gap-3 p-3 lg:grid-cols-[250px_1fr_300px] overflow-auto">
  <Card className="flex flex-col p-3 min-h-0">
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder={T('Search chemicals and tools')} className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-teal-400"/>
   <div className="mt-2 flex flex-wrap gap-1">{TABS.map(t=><button key={t} onClick={()=>{setTab(t);setQ('')}} className={'rounded-full px-2.5 py-1 text-xs '+(tab===t&&!q?'bg-teal-700 text-white':'bg-stone-100 hover:bg-stone-200')}>{T(t)}</button>)}</div>
   <div className="mt-3 grid grid-cols-2 gap-2 overflow-auto">{list.map(x=><div key={x.id} draggable onDragStart={e=>e.dataTransfer.setData('text/plain',JSON.stringify({k:x.k,id:x.id}))}
     onClick={()=>tapShelf(x.k,x.id)} className="cursor-grab rounded-xl border border-stone-300 bg-stone-50 p-3 text-center text-xs hover:border-teal-400 active:cursor-grabbing"><div className="text-2xl">{x.e}</div>{T(x.n)}{x.f&&<div className="mt-1 text-[10px] text-teal-700">{T(FORMLBL[x.f])}</div>}</div>)}
    {!list.length&&<p className="col-span-2 text-sm text-stone-500">{T('Nothing matches that search.')}</p>}</div>
   <p className="mt-auto pt-3 text-xs text-stone-500">{T('Drag items onto the bench, or tap to add. Tap a chemical to pour into the selected container.')}</p></Card>

  <div className="flex min-h-[420px] flex-col gap-3">
   <Card className="flex flex-wrap items-center gap-3 p-3 text-sm">
    <span className="font-semibold">{T('Tools')}</span>
    <div className="flex rounded-lg bg-stone-50 p-1">{[['pour','Pour 25 mL'],['drop','Dropper 2 mL']].map(([k,l])=><button key={k} onClick={()=>setMode(k)} className={'rounded-md px-3 py-1 '+(mode===k?'bg-teal-700 text-white':'')}>{T(l)}</button>)}</div>
    <label className="flex items-center gap-2"><input type="checkbox" checked={stir} onChange={e=>setStir(e.target.checked)}/>{T('Stirrer')}</label>
    {bun&&<><label className="flex items-center gap-2"><input type="checkbox" checked={bun.on} onChange={e=>setItems(p=>p.map(i=>i.id===bun.id?{...i,on:e.target.checked}:i))}/>{T('Burner')}</label>
     <label className="flex items-center gap-2">{T('Flame')}<input type="range" min="1" max="10" value={bun.flame} onChange={e=>setItems(p=>p.map(i=>i.id===bun.id?{...i,flame:+e.target.value}:i))}/></label></>}
    <button onClick={()=>{setItems([]);setSel(null)}} className="ml-auto rounded-lg bg-stone-100 px-3 py-1 hover:bg-rose-600">{T('Clear bench')}</button></Card>
   <div className="bench relative flex flex-1 flex-wrap items-end justify-center gap-6 overflow-auto rounded-2xl border border-stone-300 p-6 pb-10"
    onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();try{const x=JSON.parse(e.dataTransfer.getData('text/plain'));x.k==='glass'?tapShelf('glass',x.id):setToast('Drop chemicals onto a beaker or flask')}catch(_){}}}>
    {!items.length&&<div className="m-auto text-center text-stone-500"><Molecule className="mx-auto h-20 w-20 opacity-70"/>{T('Drag a beaker from the Glassware tab to start.')}</div>}
    {items.map(it=>isC(it)?<Glass key={it.id} it={it} d={derive(it)} sel={it.id===sel} stir={stir} pr={pours[it.id]} onSel={setSel} onPour={pour} onDel={id=>setItems(p=>p.filter(i=>i.id!==id))}/>
     :<div key={it.id} className="relative flex w-24 flex-col items-center text-xs text-stone-600">
      {it.kind==='bunsen'&&<>{it.on&&<div className="h-12 w-6 rounded-full bg-gradient-to-t from-blue-500 via-amber-400 to-transparent origin-bottom" style={{transform:`scaleY(${.4+it.flame*.1})`,animation:'flame .3s infinite'}}/>}<div className="h-14 w-10 rounded-t bg-stone-500"/><div className="h-3 w-20 rounded bg-stone-600"/>{T('Bunsen')} {T(it.on?'on':'off')}</>}
      {it.kind==='stirrer'&&<><div className="text-4xl">🌀</div>{T('Stirrer')}<button className="mt-1 rounded bg-stone-100 px-2 py-0.5" onClick={()=>setStir(!stir)}>{T(stir?'Stop':'Start')}</button></>}
      {it.kind==='therm'&&<><div className="text-4xl">🌡️</div><b className="text-lg text-amber-700">{cur?cur.t.toFixed(1):'--'}°C</b></>}
      <button onClick={()=>setItems(p=>p.filter(i=>i.id!==it.id))} className="absolute -top-2 right-1 h-5 w-5 rounded-full bg-stone-200 hover:bg-rose-600">×</button></div>)}
    {toast&&<div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-stone-100 px-4 py-1.5 text-sm shadow">{toast}</div>}</div></div>

  <div className="flex flex-col gap-3 overflow-auto">
   <Card className="p-4"><div className="flex justify-between text-sm"><b>{T(ex?ex.name:'Free play')}</b>{ex&&<span className="text-emerald-600">{done}/{ex.steps.length}</span>}</div>
    {ex?<><div className="mt-2 h-1.5 rounded bg-stone-100"><div className="h-full rounded bg-emerald-400 transition-all" style={{width:done/ex.steps.length*100+'%'}}/></div>
     <ul className="mt-3 space-y-2 text-sm">{ex.steps.map((s,i)=><li key={i} className={'flex gap-2 '+(latch[i]?'text-emerald-700':'text-stone-600')}><span>{latch[i]?'✔':'○'}</span>{T(s[0])}</li>)}</ul></>
     :<p className="mt-2 text-sm text-stone-500">Start an experiment from the dashboard for a guided checklist.</p>}</Card>
   <Card className="p-4 text-sm"><b>{T('Live data')}</b>{cd?<div className="mt-2 space-y-3">
    <div><div className="flex justify-between"><span>{T('Temperature')}</span><b className="text-amber-700">{cur.t.toFixed(1)} °C</b></div><div className="h-2 rounded bg-stone-100"><div className="h-full rounded bg-amber-400 transition-all" style={{width:cur.t+'%'}}/></div></div>
    <div><div className="flex justify-between"><span>pH</span><b className="text-teal-700">{cd.pH.toFixed(2)}</b></div><div className="relative h-2 rounded" style={{background:'linear-gradient(90deg,#ef4444,#facc15,#22c55e,#3b82f6,#8b5cf6)'}}><span className="absolute -top-1 h-4 w-1 rounded bg-white transition-all" style={{left:cd.pH/14*100+'%'}}/></div></div>
    <div className="flex justify-between"><span>{T('Mass')}</span><b className="text-emerald-700">{cd.mass.toFixed(1)} g</b></div>
    <svg viewBox="0 0 160 50" className="w-full rounded bg-stone-50"><polyline fill="none" stroke="#b8975a" strokeWidth="1.5" points={pts}/></svg></div>
    :<p className="mt-2 text-stone-500">{T('Add a container to see meters.')}</p>}</Card>
   <Card className="!border-amber-400/60 p-4 text-sm"><b className="text-amber-600">{T('⚠ Safety alerts')}</b>
    <div className="mt-2 space-y-2">{alerts.length?alerts.map(a=><div key={a.k} className={'rounded-lg p-2 '+(a.l==='danger'?'bg-rose-500/20 text-rose-800':a.l==='warn'?'bg-amber-500/15 text-amber-800':'bg-teal-500/15 text-teal-800')}>{a.msg}</div>):<div className="text-emerald-600">{T('All clear. Goggles on.')}</div>}</div></Card></div></div>;
}
