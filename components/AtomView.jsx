'use client';
import { useEffect, useRef, useState } from 'react';
import { colorOf } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { EL, SP, WH, WW, draw, makeWorld, setTemp, spark, stepWorld } from '@/lib/particles';
import { Btn, Card, Icon, Seg, Title } from './ui';

const ELN={H:'Hydrogen',C:'Carbon',N:'Nitrogen',O:'Oxygen',Li:'Lithium',Na:'Sodium',Mg:'Magnesium',S:'Sulfur',Cl:'Chlorine',K:'Potassium',Fe:'Iron',Cu:'Copper',Zn:'Zinc',Ag:'Silver',I:'Iodine',Pb:'Lead'};
const LINE=['#0f766e','#b8975a','#7c3aed','#e11d48','#0284c7','#65a30d'];
const eqn=st=>[st.r,st.p].map(x=>[].concat(x).map(k=>SP[k].f).join(' + ')).join('  →  ');
// Liquid tint from what is dissolved: pink phenolphthalein, blue copper(II) ions, or universal indicator.
const BG={
 alkali:c=>c['OH-']?`rgba(219,39,119,${Math.min(.32,c['OH-']*.02)})`:null,
 displace:c=>`rgba(37,99,235,${(c['Cu2+']||0)*.022})`,
 neut:c=>{const e=((c['H3O+']||0)-(c['OH-']||0))/14,pH=e>0?-Math.log10(e):e<0?14+Math.log10(-e):7;return colorOf({water:25,n:{univ:5},src:{}},pH).replace(/[\d.]+\)$/,'.35)')}};

export default function AtomView({d,p,onSeen}){
 const T=useT();
 const spec=d.atom(p),cv=useRef(),box=useRef(),W=useRef(null),px=useRef(1);
 const [run,setRun]=useState(true),[slow,setSlow]=useState(1),[temp,setT]=useState(spec.T),[labels,setLabels]=useState(true),[spot,setSpot]=useState(true),[tick,setTick]=useState(0),[gen,setGen]=useState(0);
 const st=useRef({run,slow,labels,spot});st.current={run,slow,labels,spot};
 const key=JSON.stringify(p);
 useEffect(()=>{onSeen&&onSeen()},[]);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)setRun(false)},[]);
 useEffect(()=>{W.current=makeWorld(spec);setT(spec.T);setTick(t=>t+1)},[key,gen]);
 useEffect(()=>{W.current&&setTemp(W.current,temp)},[temp]);
 // Canvas follows its box width at the device pixel ratio.
 useEffect(()=>{const ro=new ResizeObserver(()=>{const c=cv.current,w=box.current.clientWidth,r=window.devicePixelRatio||1;c.width=Math.round(w*r);c.height=Math.round(w*WH/WW*r);px.current=w*r/WW});
  ro.observe(box.current);return()=>ro.disconnect()},[]);
 useEffect(()=>{let raf,last=performance.now(),acc=0,slowUntil=0,lastEv=null;
  const frame=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;const w=W.current,o=st.current;
   if(w&&!document.hidden){
    const ev=w.events[w.events.length-1];
    if(o.spot&&ev&&ev!==lastEv){lastEv=ev;slowUntil=now+1400}
    const sl=o.spot&&now<slowUntil?.15:1;
    if(o.run)stepWorld(w,dt*o.slow*sl);
    const focus=o.spot&&now<slowUntil&&ev?new Set(ev.ids):null;
    const ctx=cv.current.getContext('2d');draw(ctx,w,px.current,{bg:BG[d.id]&&BG[d.id](countsNow(w)),labels:o.labels,focus});
    if(focus){ctx.setTransform(px.current,0,0,px.current,0,0);ctx.font='600 15px ui-monospace,monospace';const s=eqn(ev.st),tw=ctx.measureText(s).width;
     ctx.fillStyle='rgba(12,31,30,.85)';ctx.fillRect(WW/2-tw/2-12,10,tw+24,28);ctx.fillStyle='#fde68a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,WW/2,24.5)}
    acc+=dt;if(acc>.25){acc=0;setTick(t=>t+1)}}
   raf=requestAnimationFrame(frame)};
  raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf)},[d.id]);
 const w=W.current,c=w?countsNow(w):{},hot=d.id==='h2comb'||d.id==='ch4comb'||d.id==='mgburn';
 const els=w?[...new Set(w.bodies.flatMap(b=>SP[b.sp].a.map(a=>a[0])))]:[];
 return <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
  <div className="flex min-w-0 flex-col gap-3">
   <Card className="overflow-hidden">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line/70 px-3 py-2 text-sm">
     <Btn kind="primary" onClick={()=>setRun(!run)} className="!px-2.5"><Icon n={run?'pause':'play'}/>{T(run?'Pause':'Play')}</Btn>
     <Btn onClick={()=>{const o=W.current;if(o){stepWorld(o,1/30);setTick(t=>t+1)}}} disabled={run} title={T('Step forward')}><Icon n="step"/></Btn>
     <Seg val={slow} onChange={setSlow} opts={[[.1,'×0.1'],[.25,'×0.25'],[1,'×1']]}/>
     {spec.ignite&&<Btn onClick={()=>W.current&&spark(W.current,WW/2,spec.surf?WH-60:WH/2)} className="!border-amber-300 !bg-amber-50 !text-amber-900"><Icon n="fire"/>{T('Ignite')}</Btn>}
     <Btn onClick={()=>setGen(g=>g+1)} className="ml-auto"><Icon n="reset"/>{T('Reset')}</Btn></div>
    <div ref={box} className="relative bg-[#0c1f1e]"><canvas ref={cv} className="block w-full" style={{aspectRatio:`${WW}/${WH}`}} role="img" aria-label={T('Particles colliding and reacting')}/>
     <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 font-mono text-[11px] text-teal-100">{w?(w.Ts-273.15).toFixed(0):temp} °C · t = {w?w.t.toFixed(1):'0.0'} s</div></div>
    <div className="grid gap-3 border-t border-line/70 p-3 text-sm sm:grid-cols-2">
     <label className="flex items-center gap-2 text-stone-600"><Icon n="thermo" className="h-4 w-4 shrink-0"/>{T('Temperature')}
      <input type="range" min="0" max={hot?2000:100} step={hot?25:1} value={temp} onChange={e=>setT(+e.target.value)} className="min-w-0 flex-1 accent-brand-700"/><span className="w-16 text-right font-mono">{temp} °C</span></label>
     <div className="flex flex-wrap items-center gap-3 text-stone-600">
      <label className="flex items-center gap-1.5"><input type="checkbox" checked={spot} onChange={e=>setSpot(e.target.checked)} className="accent-brand-700"/>{T('Slow down at each reaction')}</label>
      <label className="flex items-center gap-1.5"><input type="checkbox" checked={labels} onChange={e=>setLabels(e.target.checked)} className="accent-brand-700"/>{T('Formulas')}</label></div></div></Card>
   <Card><Title>{T('What you are seeing')}</Title><div className="space-y-2 p-4 text-sm text-stone-700">
    <p>{T('Every particle moves with a speed set by the temperature. When two particles collide, they react only if the energy along the line of their collision is at least the activation energy. Otherwise they bounce apart. Products are built from the same atoms, so no atom is created or destroyed.')}</p>
    <p className="text-xs text-stone-500">{T('The model is two-dimensional and energies are scaled down so that reactions happen in seconds rather than in billionths of a second. The energy diagram shows the real values.')}</p></div></Card>
  </div>
  <div className="flex flex-col gap-3">
   <Card><Title>{T('Particle count')}</Title><div className="p-4"><Counts w={w} track={spec.track} c={c} T={T}/></div></Card>
   <Card><Title>{T('Energy profile')}</Title><div className="p-3"><Energy e={d.energy} p={p} T={T}/></div></Card>
   <Card><Title>{T('Recent reactions')}</Title><ul className="max-h-40 space-y-1 overflow-auto p-3 font-mono text-[11px] text-stone-700">{w&&w.events.length?[...w.events].reverse().slice(0,8).map((e,i)=><li key={i} className="flex justify-between gap-2"><span>{eqn(e.st)}</span><span className="shrink-0 text-stone-400">{e.t.toFixed(1)} s</span></li>)
    :<li className="font-sans text-xs text-stone-500">{T(spec.ignite?'Nothing reacts at room temperature. Press Ignite, or raise the temperature.':'Waiting for the first successful collision…')}</li>}</ul></Card>
   <Card><Title>{T('Key')}</Title><div className="grid grid-cols-2 gap-x-3 gap-y-1.5 p-3 text-xs text-stone-700">{els.map(e=><span key={e} className="flex items-center gap-2"><span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-stone-300" style={{background:`radial-gradient(circle at 35% 35%,#fff,${EL[e][2]} 45%)`}}/><b className="font-mono">{e}</b>{T(ELN[e])}</span>)}
    <span className="col-span-2 mt-1 flex items-center gap-2 text-stone-500"><span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-700 text-[8px] font-bold text-white">+</span>{T('ion charge')}<span className="ml-2 h-2 w-2 rounded-full bg-amber-200 ring-1 ring-amber-400"/>{T('radical (unpaired electron)')}</span></div></Card>
  </div></div>;
}
function countsNow(w){const c={...w.escN};for(const b of w.bodies)c[b.sp]=(c[b.sp]||0)+1;return c}

// Counts of the tracked species now, and a chart of how they changed.
function Counts({w,track,c,T}){
 const H=w?w.hist:[],W=288,h=90,max=Math.max(4,...H.flatMap(([,k])=>track.map(s=>k[s]||0)));
 const X=i=>H.length<2?0:i/(H.length-1)*W,Y=n=>h-4-n/max*(h-8);
 return <><div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">{track.map((s,i)=><div key={s} className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm" style={{background:LINE[i]}}/><span className="font-mono">{SP[s].f}</span></span><b className="font-mono text-stone-900">{c[s]||0}</b></div>)}</div>
  {w&&w.escN&&Object.keys(w.escN).length>0&&<p className="mt-1 text-[11px] text-stone-500">{T('Includes gas that has bubbled out of the liquid.')}</p>}
  <svg viewBox={`0 0 ${W} ${h}`} className="mt-2 w-full rounded bg-stone-50" role="img" aria-label={T('Particle count')}>{H.length>1&&track.map((s,i)=><polyline key={s} fill="none" stroke={LINE[i]} strokeWidth="1.8" strokeLinejoin="round" points={H.map(([,k],j)=>X(j)+','+Y(k[s]||0)).join(' ')}/>)}</svg></>;
}

// Reaction profile from the real enthalpy change and, where it is known, the activation energy, in kJ/mol.
export function Energy({e,p,T}){
 const v=x=>typeof x==='function'?x(p):x,dh=v(e.dh),ea=e.ea||Math.max(40,Math.abs(dh)*.25),W=300,H=170,l=34,top=16,bot=H-26;
 const lo=Math.min(0,dh),hi=ea,Y=v=>top+(hi-v)/(hi-lo)*(bot-top),y0=Y(0),y1=Y(dh),yt=Y(ea),yc=e.eac!=null?Y(e.eac):null;
 const curve=yy=>`M${l} ${y0}H${l+40}C${l+80} ${y0} ${l+90} ${yy} ${l+118} ${yy}C${l+146} ${yy} ${l+156} ${y1} ${l+196} ${y1}H${W-8}`;
 return <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={T('Energy profile')}>
  <line x1={l} y1={top-6} x2={l} y2={bot} stroke="#a8a29e"/><line x1={l} y1={bot} x2={W-8} y2={bot} stroke="#a8a29e"/>
  <text x="12" y={(top+bot)/2} fontSize="9" fill="#78716c" transform={`rotate(-90 12 ${(top+bot)/2})`} textAnchor="middle">{T('Energy')}</text>
  <text x={(l+W)/2} y={H-8} fontSize="9" fill="#78716c" textAnchor="middle">{T('Progress of reaction')}</text>
  {yc!=null&&<path d={curve(yc)} fill="none" stroke="#b8975a" strokeWidth="2" strokeDasharray="4 3"/>}
  <path d={curve(yt)} fill="none" stroke="#0f766e" strokeWidth="2.2"/>
  <text x={l+4} y={y0-5} fontSize="9" fill="#292524">{v(e.r)}</text><text x={W-10} y={y1+(dh<0?12:-5)} fontSize="9" fill="#292524" textAnchor="end">{v(e.p)}</text>
  <line x1={l+118} x2={l+118} y1={y0} y2={yt+3} stroke="#0f766e" strokeDasharray="2 2"/><text x={l+122} y={(y0+yt)/2+3} fontSize="9" fill="#0f766e">Eₐ{e.ea?` = ${e.ea} kJ/mol`:''}</text>
  {yc!=null&&<text x={l+122} y={yc+12} fontSize="9" fill="#8a6d36">{T('with catalyst')} {e.eac} kJ/mol</text>}
  <line x1={W-58} x2={W-58} y1={y0} y2={y1} stroke="#be123c" markerEnd="url(#ah)"/><defs><marker id="ah" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L6 3L0 6z" fill="#be123c"/></marker></defs>
  <line x1={l+150} x2={W-50} y1={y0} y2={y0} stroke="#d6d3d1" strokeDasharray="2 2"/>
  <text x={W-62} y={(y0+y1)/2+3} fontSize="9" fill="#be123c" textAnchor="end">ΔH = {dh>0?'+':'−'}{Math.abs(dh).toFixed(Math.abs(dh)<100?1:0)} kJ/mol</text>
 </svg>;
}
