'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DEMOS, TYPES, ctlDefaults } from '@/lib/reactions';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Badge, Btn, Card, H1, Icon, Seg, Title } from './ui';
import { LogChart } from './Panels';
import DemoStage, { H2SOUND, observe, playPop } from './DemoStage';
import AtomView from './AtomView';

export function Gallery(){
 const {ran,seen}=useLab();const T=useT();
 const [ty,setTy]=useState('all');
 const list=DEMOS.filter(d=>ty==='all'||d.type===ty);
 return <div className="mx-auto max-w-6xl p-4 sm:p-8">
  <H1>{T('Reactions')}</H1>
  <p className="mt-3 max-w-2xl text-stone-600">{T('Classic demonstrations, one for each type of reaction. Run each one at bench scale with real amounts and measurements, then switch to the atomic view to watch the particles collide and rearrange into new molecules.')}</p>
  <div className="mt-6 grid gap-3 sm:grid-cols-2">
   <Card className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Demonstrations run')}</div><div className="mt-1 font-mono text-2xl font-semibold text-stone-900">{ran.length}<span className="text-base text-stone-400"> / {DEMOS.length}</span></div></Card>
   <Card className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Atomic views watched')}</div><div className="mt-1 font-mono text-2xl font-semibold text-stone-900">{seen.length}<span className="text-base text-stone-400"> / {DEMOS.length}</span></div></Card></div>
  <div className="mt-10 flex flex-wrap items-center gap-1.5">{['all',...TYPES].map(x=><button key={x} onClick={()=>setTy(x)} className={'rounded-md px-2.5 py-1 text-xs font-medium '+(ty===x?'bg-brand-700 text-white':'border border-line bg-paper text-stone-600 hover:bg-sand')}>{T(x==='all'?'All':x)}</button>)}</div>
  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map(d=><Card key={d.id} className="flex flex-col p-5">
   <div className="flex items-start justify-between gap-2"><div className="grid h-10 w-10 place-items-center rounded-md bg-brand-50 text-brand-700"><Icon n={d.icon} className="h-5 w-5"/></div>
    <div className="flex flex-wrap justify-end gap-1">{ran.includes(d.id)&&<Badge tone="emerald"><Icon n="check" className="h-3 w-3"/>{T('Run')}</Badge>}{seen.includes(d.id)&&<Badge tone="violet"><Icon n="atom" className="h-3 w-3"/>{T('Atomic')}</Badge>}</div></div>
   <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-gold-700">{T(d.type)}</div>
   <h3 className="mt-0.5 font-semibold text-stone-900">{T(d.name)}</h3><p className="mt-1 flex-1 text-sm text-stone-600">{T(d.desc)}</p>
   <div className="mt-3 whitespace-pre-line font-mono text-[11px] text-stone-500">{d.eq}</div>
   <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone={d.level==='Upper secondary'?'violet':'brand'}>{T(d.level)}</Badge>{d.teacher&&<Badge tone="amber"><Icon n="shield" className="h-3 w-3"/>{T('Teacher demonstration')}</Badge>}</div>
   <div className="mt-4 grid grid-cols-2 gap-2"><Link href={`/reactions/${d.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"><Icon n="flask"/>{T('Demonstration')}</Link>
    <Link href={`/reactions/${d.id}#atom`} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-sand"><Icon n="atom"/>{T('Atomic view')}</Link></div></Card>)}</div></div>;
}

const fmt=(x,dp)=>x==null||isNaN(x)?'—':x.toFixed(dp);

export function DemoView({id}){
 const d=DEMOS.find(x=>x.id===id);
 const {markRan,markSeen,setDemo}=useLab();const T=useT();
 const [tab,setTab]=useState('demo'),[p,setP]=useState(()=>ctlDefaults(d)),[s,setS]=useState(()=>d.init(ctlDefaults(d)));
 const [run,setRun]=useState(false),[speed,setSpeed]=useState(1),[log,setLog]=useState([]),[pick,setPick]=useState(null),[fin,setFin]=useState(false),[sound,setSound]=useState(true);
 const v=d.vals(s,p),[ser,setSer]=useState(d.rd[0][0]);
 const R=useRef({});R.current={s,p,speed,sound};
 useEffect(()=>{const f=()=>setTab(location.hash==='#atom'?'atom':'demo');if(location.hash)f();addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 const show=t=>{setTab(t);history.replaceState(null,'',t==='atom'?'#atom':location.pathname)};
 // The lab assistant is told what is on screen.
 useEffect(()=>{setDemo(`Reaction demonstration: ${d.name} (${d.type}). Equation: ${d.eq}. Settings: ${d.ctl.map(([k,l,o])=>`${l} = ${(o.find(x=>x[0]===p[k])||[,p[k]])[1]}`).join(', ')}. ${tab==='atom'?'Watching the atomic view. ':''}Time ${s.t.toFixed(1)} s. Readings: ${d.rd.map(([k,l,u,dp])=>`${l} ${fmt(v[k],dp)} ${u}`).join(', ')}. Observation: ${observe(d,s,p,v)}`)});
 useEffect(()=>()=>setDemo(null),[]);
 // Runs the bench model in 0.05 s steps of simulated time.
 useEffect(()=>{if(!run)return;let raf,last=performance.now(),logT=-1;
  const frame=now=>{const o=R.current;let x=o.s,dt=Math.min(.1,(now-last)/1000)*o.speed;last=now;const rows=[];
   while(dt>1e-9){const h=Math.min(.05,dt);dt-=h;const was=x.lit;x=d.step(x,h,o.p);
    if(d.id==='h2comb'&&x.lit&&!was&&o.sound&&H2SOUND[o.p.mix])playPop(H2SOUND[o.p.mix]);
    if(Math.floor(x.t/.25)>logT){logT=Math.floor(x.t/.25);rows.push([x.t,d.vals(x,o.p)])}
    if(d.done(x)){setRun(false);setFin(true);markRan(d.id);break}}
   R.current.s=x;setS(x);if(rows.length)setLog(l=>[...l,...rows].slice(-1200));
   raf=requestAnimationFrame(frame)};
  raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf)},[run]);
 const reset=(np=p)=>{setRun(false);setFin(false);setS(d.init(np));setLog([])};
 const setCtl=(k,val,live)=>{const np={...p,[k]:val};setP(np);if(!live)reset(np)};
 const go=()=>{if(fin){reset();setTimeout(()=>setRun(true),0)}else setRun(!run)};
 const started=s.t>0,ready=pick!=null,rd=d.rd.find(r=>r[0]===ser);
 return <div className="mx-auto max-w-7xl p-3 sm:p-6">
  <Link href="/reactions" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-700"><Icon n="back"/>{T('All reactions')}</Link>
  <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
   <div className="min-w-0"><div className="text-[11px] font-medium uppercase tracking-wide text-gold-700">{T(d.type)}</div><H1>{T(d.name)}</H1>
    <div className="mt-1 whitespace-pre-line font-mono text-xs text-stone-600">{d.eq}</div></div>
   <Seg val={tab} onChange={show} opts={[['demo',<span key="d" className="flex items-center gap-1.5 px-1 py-0.5 text-sm"><Icon n="flask"/>{T('Demonstration')}</span>],['atom',<span key="a" className="flex items-center gap-1.5 px-1 py-0.5 text-sm"><Icon n="atom"/>{T('Atomic view')}</span>]]}/></div>
  <p className="mt-3 max-w-3xl text-sm text-stone-600">{T(d.desc)}</p>
  <div className="mt-3 flex gap-2 rounded-md bg-amber-50 p-2.5 text-xs text-amber-900 ring-1 ring-inset ring-amber-200"><Icon n="alert" className="h-4 w-4 shrink-0"/><span>{d.teacher&&<b>{T('Teacher demonstration')}. </b>}{T(d.note)}</span></div>
  <div className="mt-4">{tab==='atom'?<AtomView key={d.id} d={d} p={p} onSeen={()=>markSeen(d.id)}/>:
   <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="flex min-w-0 flex-col gap-3">
     <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line/70 px-3 py-2 text-sm">
       <Btn kind="primary" onClick={go} disabled={!ready&&!run}><Icon n={run?'pause':fin?'reset':'play'}/>{T(run?'Pause':fin?'Run again':started?'Continue':'Run')}</Btn>
       <Btn onClick={()=>reset()} disabled={!started}><Icon n="reset"/>{T('Reset')}</Btn>
       <span className="flex items-center gap-1.5 text-stone-500"><Icon n="clock"/><span className="font-mono text-stone-900">{s.t.toFixed(1)} s</span></span>
       <Seg val={speed} onChange={setSpeed} opts={[[1,'×1'],[5,'×5'],[20,'×20']]}/>
       {d.id==='h2comb'&&<button onClick={()=>setSound(!sound)} aria-pressed={sound} title={T('Sound')} className={'rounded-md border p-1.5 '+(sound?'border-brand-600 bg-brand-50 text-brand-800':'border-line text-stone-400')}><Icon n="sound"/></button>}
       {!ready&&<span className="text-xs text-stone-500">{T('Make a prediction first.')}</span>}</div>
      <div className="bench relative h-[340px] overflow-hidden sm:h-[400px]"><DemoStage d={d} s={s} p={p} v={v} run={run}/></div>
      <div className="flex items-start gap-2 border-t border-line/70 bg-paper px-4 py-2.5 text-sm text-stone-700"><Icon n="eye" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"/>{T(observe(d,s,p,v))}</div></Card>
     {fin&&<Explain d={d} pick={pick} T={T}/>}
    </div>
    <div className="flex flex-col gap-3">
     <Card><Title>{T('Set up')}</Title><div className="space-y-3 p-4">{d.ctl.map(([k,l,opts,,live])=><div key={k}>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-stone-500"><span>{T(l)}</span>{live&&<span className="text-[10px] font-normal text-stone-400">{T('can change while running')}</span>}</div>
      <div className="flex flex-wrap gap-1">{opts.map(([val,ol])=><button key={String(val)} onClick={()=>setCtl(k,val,live)} disabled={!live&&run} className={'rounded-md px-2.5 py-1 text-xs font-medium transition disabled:opacity-40 '+(p[k]===val?'bg-brand-700 text-white':'border border-line bg-paper text-stone-600 hover:bg-sand')}>{T(ol)}</button>)}</div></div>)}</div></Card>
     <Predict d={d} pick={pick} setPick={setPick} locked={started} T={T}/>
     <Card><Title>{T('Measurements')}</Title><div className="px-4 pb-4 pt-1 text-sm">
      <div className="divide-y divide-line/70">{d.rd.map(([k,l,u,dp])=><div key={k} className="flex items-baseline justify-between gap-2 py-1.5"><span className="text-stone-600">{T(l)}</span><b className="font-mono text-base text-stone-900">{fmt(v[k],dp)}{u&&' '+u}</b></div>)}</div>
      <div className="mb-2 mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium text-stone-500">{T(rd[1])}</span>
       {d.rd.length>1&&<Seg val={ser} onChange={setSer} opts={d.rd.map(([k,l])=>[k,T(SHORT[k]||l)])}/>}</div>
      <LogChart key={ser} pts={log.map(([t,x])=>[t,x[ser]]).filter(q=>q[1]!=null&&isFinite(q[1]))} unit={rd[2]} dp={rd[3]}/></div></Card>
    </div></div>}</div></div>;
}
const SHORT={V:'Volume',T:'°C',left:'Left',H2:'H₂',pH:'pH',burnt:'H₂',water:'Water',E:'Energy',Tf:'Flame',P:'Power',CO2:'CO₂',soot:'Soot',lime:'Limewater',MgO:'MgO',gain:'Gain',O2:'O₂',solid:'Solid',aq:'Dissolved',Cu:'Cu',blue:'Blue'};

function Predict({d,pick,setPick,locked,T}){
 const [q,opts]=d.pred;
 return <Card><Title right={pick===-1?null:pick!=null&&<Badge tone="brand">{T('Saved')}</Badge>}>{T('Predict')}</Title><div className="p-4 text-sm">
  <p className="font-medium text-stone-900">{T(q)}</p>
  <div className="mt-2 space-y-1.5">{opts.map((o,i)=><label key={i} className={'flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 '+(pick===i?'border-brand-600 bg-brand-50':'border-line hover:bg-sand')+(locked?' pointer-events-none':'')}>
   <input type="radio" name={'pred'+d.id} checked={pick===i} onChange={()=>setPick(i)} disabled={locked} className="mt-0.5 accent-brand-700"/>{T(o)}</label>)}</div>
  {pick==null&&<button onClick={()=>setPick(-1)} className="mt-2 text-xs text-stone-500 underline-offset-2 hover:underline">{T('Skip the prediction')}</button>}</div></Card>;
}

function Explain({d,pick,T}){
 const [,opts,ok]=d.pred;
 return <Card><Title>{T('Explain')}</Title><div className="space-y-3 p-4 text-sm text-stone-700">
  {pick>=0&&<div className={'flex gap-2 rounded-md p-2.5 ring-1 ring-inset '+(pick===ok?'bg-emerald-50 text-emerald-800 ring-emerald-200':'bg-amber-50 text-amber-900 ring-amber-200')}><Icon n={pick===ok?'check':'info'} className="mt-0.5 h-4 w-4 shrink-0"/>
   <span>{T(pick===ok?'Your prediction was right.':'Not what you predicted.')} {pick!==ok&&<>{T('The answer is:')} <b>{T(opts[ok])}</b></>}</span></div>}
  <p>{T(d.explain)}</p>
  <p className="text-xs text-stone-500">{T('Open the atomic view to see the particles that make this happen.')}</p></div></Card>;
}
