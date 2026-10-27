'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AMB, CAP, DROP, EQUIP, EXPS, REAG, TAPLBL, add, derive, isC, newContainer, uid } from './chem';
import { advance, burnerPower } from './sim';
import { LangContext } from './i18n';

const LabContext=createContext(null);
export const useLab=()=>useContext(LabContext);
const MAXC=6,MAXS=2;
export const fmtTime=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
// Burette scale is read to the nearest 0.05 mL, like a real one.
export const buretteReading=b=>Math.round((50-b.vol)/.05)*.05;

// Holds all lab state in the root layout so it survives navigation between routes.
export function LabProvider({children}){
 const router=useRouter();
 const [lang,setLang]=useState('en'),[lab,setLab]=useState({items:[],t:0}),[sel,setSel]=useState(null),[expId,setExpId]=useState(null);
 const [latch,setLatch]=useState([]),[alerts,setAlerts]=useState([]),[amt,setAmt]=useState(10),[speed,setSpeed]=useState(1);
 const [toast,setToast]=useState(''),[modal,setModal]=useState(null),[pours,setPours]=useState({}),[notes,setNotes]=useState([]),[ans,setAns]=useState({});
 const [passed,setPassed]=useState(false),[done,setDone]=useState([]),[fin,setFin]=useState(false),[pending,setPending]=useState(null),[incidents,setIncidents]=useState(0);
 const [naohC]=useState(()=>+(.08+Math.random()*.04).toFixed(3));
 // Reaction demos: which have been run to the end, which were watched at the atomic scale, and the one open now (for the assistant).
 const [ran,setRan]=useState([]),[seen,setSeen]=useState([]),demoR=useRef(null);
 const markRan=id=>setRan(r=>r.includes(id)?r:[...r,id]),markSeen=id=>setSeen(r=>r.includes(id)?r:[...r,id]),setDemo=x=>{demoR.current=x};
 const t0=useRef(0),speedR=useRef(1),warned=useRef({});speedR.current=speed;
 const items=lab.items,setItems=f=>setLab(L=>({...L,items:typeof f==='function'?f(L.items):f}));
 const ex=EXPS.find(e=>e.id===expId);
 useEffect(()=>{document.body.classList.toggle('km',lang==='km');document.documentElement.lang=lang==='km'?'km':'en'},[lang]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)},[toast]);
 // A repeated warning is shown again only after 10 s.
 const warn=(l,msg,key=msg)=>{const now=Date.now();if(now-(warned.current[key]||0)<10000)return;warned.current[key]=now;
  if(l==='danger')setIncidents(n=>n+1);setAlerts(a=>[{l,msg,k:uid()},...a].slice(0,5))};

 useEffect(()=>{let last=performance.now();
  const t=setInterval(()=>{const now=performance.now(),real=Math.min(.5,(now-last)/1000);last=now;
   if(speedR.current)setLab(L=>advance(L,real*speedR.current,naohC))},200);
  return()=>clearInterval(t)},[naohC]);

 // Safety monitor: watches the bench and raises the warnings a teacher would.
 useEffect(()=>{
  const lit=items.filter(i=>i.kind==='bunsen'&&i.gas>0);
  for(const c of items.filter(isC)){
   const P=burnerPower(items.find(i=>i.id===c.at)),b=items.find(i=>i.id===c.at);
   if(c.rH2>1e-7&&lit.length)warn('danger','Hydrogen is being produced while a Bunsen flame is lit. Turn the burner off.','h2');
   if(P>0&&c.water===0&&c.T>120)warn('danger','The container has boiled dry. Turn off the burner: the glass can crack and the solid spits.','dry'+c.id);
   if(c.therm&&c.T>110)warn('warn','The temperature is above the thermometer’s range (110 °C). Remove the thermometer.','th'+c.id);
   if(c.boil>1e-4&&c.water>200)warn('warn','The beaker is very full and boiling. It may boil over.','bo'+c.id);
   if(P>0&&b&&!b.air)warn('info','A yellow flame is cooler and leaves soot on the glass. Open the air hole for a blue heating flame.','yel'+b.id);
  }
  for(const b of items)if(b.kind==='burette'&&b.msgN){
   if(b.msg==='spill')warn('warn','Acid dripped onto the bench. Stand a flask under the burette before opening the tap.','sp'+b.id+b.msgN);
   if(b.msg==='full')warn('warn','The flask is full, so the burette tap was closed.','fu'+b.id+b.msgN);
  }},[items]);

 const letter=()=>{const used=items.filter(isC).map(c=>c.label);return 'ABCDEFGH'.split('').find(l=>!used.includes(l))};
 const addEquip=k=>{
  const c=items.find(i=>i.id===sel&&isC(i));
  if(k==='therm'||k==='probe'||k==='rod'){if(!c){setToast('Select a beaker or flask first');return}toggle(c.id,k==='rod'?'stir':k);return}
  if(k==='beaker'||k==='flask'){if(items.filter(isC).length>=MAXC){setToast('The bench is full. Remove a container first.');return}
   const n=newContainer(k,letter());setItems(p=>[...p,n]);setSel(n.id);return}
  if(items.filter(i=>i.kind===k).length>=MAXS){setToast('You already have two of these on the bench.');return}
  const base={id:uid(),kind:k};
  setItems(p=>[...p,k==='bunsen'?{...base,gas:0,air:false}:k==='burette'?{...base,ch:null,vol:0,tap:0}:{...base,tare:0}]);
 };
 const toggle=(id,f)=>setItems(p=>p.map(i=>i.id===id?{...i,[f]:!i[f]}:i));
 const patch=(id,x)=>setItems(p=>p.map(i=>i.id===id?{...i,...x}:i));
 const remove=id=>{setItems(p=>p.filter(i=>i.id!==id).map(i=>i.at===id?{...i,at:null}:i));if(sel===id)setSel(null)};
 const place=(cid,at)=>{
  const c=items.find(i=>i.id===cid);if(!c)return;
  if(at&&items.some(i=>i.at===at&&i.id!==cid)){setToast('Something is already there.');return}
  if(c.T>60&&c.at!==at)warn('info','That glass is hot. In a real lab, move it with tongs or heat-proof gloves.','hot'+cid);
  patch(cid,{at});setSel(cid);
 };
 const dispense=(cid,rid)=>{
  const c=items.find(i=>i.id===cid),r=REAG[rid];if(!c)return;
  const a=r.f==='sol'?amt:1,v=r.f==='sol'?a:r.f==='ind'?DROP:0;
  if(c.water+v>CAP){warn('warn','That would overflow: the container holds 250 mL.','of');return}
  const k=uid();setPours(p=>({...p,[cid]:{rid,k,amt:v,small:r.f==='sol'&&v<=1}}));setSel(cid);
  setTimeout(()=>setItems(p=>p.map(i=>i.id===cid?add(i,rid,a,naohC):i)),r.f==='sol'&&v>1?650:350);
  setTimeout(()=>setPours(p=>p[cid]&&p[cid].k===k?{...p,[cid]:null}:p),1400);
 };
 const fill=(bid,rid)=>{if(!rid)return;patch(bid,{ch:rid,vol:50,tap:0})};
 const drop=bid=>setItems(p=>{const b=p.find(i=>i.id===bid),c=p.find(i=>isC(i)&&i.at===bid);if(!b||!b.ch||b.vol<DROP)return p;
  if(!c){setTimeout(()=>warn('warn','Acid dripped onto the bench. Stand a flask under the burette before opening the tap.','spd'),0);return p.map(i=>i.id===bid?{...i,vol:i.vol-DROP}:i)}
  return p.map(i=>i.id===bid?{...i,vol:i.vol-DROP}:i.id===c.id?add(i,b.ch,DROP,naohC):i)});
 const tare=bid=>{const c=items.find(i=>isC(i)&&i.at===bid);patch(bid,{tare:c?+(c.glass+c.mass).toFixed(2):0})};
 const empty=cid=>setItems(p=>p.map(i=>i.id===cid?{...newContainer(i.kind,i.label),id:i.id,glass:i.glass,at:i.at,therm:i.therm,probe:i.probe,log:i.log}:i));
 const clear=()=>{setItems([]);setSel(null)};

 const cs=items.filter(isC).map(c=>({...c,d:derive(c)}));
 const S={cs,items,ans,naohC};
 const prog=ex?ex.steps.map(s=>!!s[1](S)):[];
 useEffect(()=>{if(!ex)return;setLatch(l=>{const n=ex.steps.map((_,i)=>!!(l[i]||prog[i]));return n.every((v,i)=>v===!!l[i])?l:n})},[prog.join()]);
 useEffect(()=>{if(ex&&!fin&&latch.length&&latch.every(Boolean)){setFin(true);setDone(d=>d.includes(ex.id)?d:[...d,ex.id]);setModal('summary')}},[latch]);
 const go=x=>{setExpId(x.id);setLatch([]);setFin(false);setAlerts([]);setItems([]);setSel(null);setNotes([]);setAns({});t0.current=Date.now();router.push('/')};
 const start=x=>{if(x.risk&&!passed){setPending(x);setModal('quiz')}else go(x)};
 const record=()=>{const c=cs.find(i=>i.id===sel)||cs[0];if(!c){setToast('Select a beaker or flask first');return}
  const bal=items.find(i=>i.id===c.at&&i.kind==='balance'),bur=items.find(i=>i.kind==='burette'&&i.ch);
  setNotes(n=>[...n,{k:uid(),t:lab.t,label:c.label,kind:c.kind,T:c.therm?c.T:null,pH:c.probe&&c.d.pH!=null?c.d.pH:null,m:bal?c.glass+c.mass-bal.tare:null,bur:bur?buretteReading(bur):null}])};
 const ctx=()=>{
  if(demoR.current)return demoR.current;
  const where=c=>{const s=items.find(i=>i.id===c.at);if(!s)return 'on the bench';
   if(s.kind==='bunsen')return `on the tripod over a Bunsen burner (${s.gas?`gas ${s.gas}/10, ${s.air?'blue':'yellow'} flame`:'off'})`;
   if(s.kind==='burette')return 'under the burette';return 'on the balance'};
  const step=ex&&ex.steps.findIndex((_,i)=>!latch[i]);
  return (ex?`Experiment: ${ex.name}. ${step>=0?`Next step (${step+1} of ${ex.steps.length}): ${ex.steps[step][0]}.`:'All steps done.'} `:'Free practice. ')+`Lab time ${fmtTime(lab.t)}, room ${AMB} °C. `+
   (cs.length?cs.map(c=>`${EQUIP[c.kind].n} ${c.label} ${where(c)}: ${c.water.toFixed(1)} mL; contents ${Object.entries(c.src).map(([k,v])=>`${REAG[k].n}${REAG[k].c?' '+REAG[k].c:''} ${REAG[k].f==='sol'?v.toFixed(2)+' mL':REAG[k].f==='ind'?v+' drops':v+' pieces'}`).join(', ')||'none'}; ${c.T.toFixed(1)} °C; pH ${c.d.pH!=null?c.d.pH.toFixed(2):'n/a'}${c.d.gr>1e-7?'; gas bubbling':''}${c.d.xtal>.05?`; ${c.d.xtal.toFixed(2)} g crystals`:''}${c.d.ppt?'; pale blue precipitate':''}`).join(' | '):'No containers on the bench.')+
   items.filter(i=>i.kind==='burette'&&i.ch).map(b=>` Burette: ${REAG[b.ch].n} ${REAG[b.ch].c}, reading ${buretteReading(b).toFixed(2)} mL, tap ${TAPLBL[b.tap].toLowerCase()}.`).join('');
 };
 const value={lang,setLang,items,setItems,t:lab.t,sel,setSel,ex,latch,alerts,warn,amt,setAmt,speed,setSpeed,toast,setToast,modal,setModal,
  passed,setPassed,done,pending,setPending,incidents,t0,go,start,ctx,cs,S,addEquip,toggle,patch,remove,place,dispense,fill,drop,tare,empty,clear,
  pours,notes,setNotes,record,ans,setAns,naohC,ran,seen,markRan,markSeen,setDemo};
 return <LabContext.Provider value={value}><LangContext.Provider value={lang}>{children}</LangContext.Provider></LabContext.Provider>;
}
