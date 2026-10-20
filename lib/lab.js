'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CHEMS, EXPS, SOL, derive, isC, liquid, uid } from './chem';
import { LangContext } from './i18n';

const LabContext=createContext(null);
export const useLab=()=>useContext(LabContext);

// Holds all lab state in the root layout so it survives navigation between routes.
export function LabProvider({children}){
 const router=useRouter();
 const [lang,setLang]=useState('en'),[items,setItems]=useState([]),[sel,setSel]=useState(null),[expId,setExpId]=useState(null);
 const [latch,setLatch]=useState([]),[alerts,setAlerts]=useState([]),[mode,setMode]=useState('pour'),[stir,setStir]=useState(false);
 const [hist,setHist]=useState(Array(40).fill(22)),[toast,setToast]=useState(''),[modal,setModal]=useState(null);
 const [passed,setPassed]=useState(false),[completed,setCompleted]=useState(0),[fin,setFin]=useState(false),[pending,setPending]=useState(null);
 const t0=useRef(0),selR=useRef(),itemsR=useRef();selR.current=sel;itemsR.current=items;
 const ex=EXPS.find(e=>e.id===expId);
 useEffect(()=>{document.body.classList.toggle('km',lang==='km');document.documentElement.lang=lang==='km'?'km':'en'},[lang]);
 const warn=(l,msg)=>setAlerts(a=>[{l,msg,k:uid()},...a].slice(0,4));
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);
 useEffect(()=>{const t=setInterval(()=>{setItems(p=>{const b=p.find(i=>i.kind==='bunsen'&&i.on);
  return p.map(i=>{if(!isC(i))return i;let t=i.t+(22-i.t)*.04,m=i.m;const hot=b&&i.id===selR.current;
   if(hot)t+=b.flame*.6;t=Math.min(100,t);
   if(hot&&t>=90&&liquid(m)>0)m=Object.fromEntries(Object.entries(m).map(([k,v])=>[k,SOL.includes(k)?v:v*.99]));
   return {...i,t,m}})})},500);
  const h=setInterval(()=>{const c=itemsR.current.find(i=>i.id===selR.current&&isC(i));setHist(x=>[...x.slice(1),c?c.t:22])},1000);
  return()=>{clearInterval(t);clearInterval(h)}},[]);
 const cs=items.filter(isC).map(c=>({...c,d:derive(c)}));
 const prog=ex?ex.steps.map(s=>s[1]({cs,items})):[];
 useEffect(()=>{if(!ex)return;setLatch(l=>{const n=ex.steps.map((_,i)=>!!(l[i]||prog[i]));return n.every((v,i)=>v===!!l[i])?l:n})},[prog.join()]);
 useEffect(()=>{if(ex&&!fin&&latch.length&&latch.every(Boolean)){setFin(true);setCompleted(c=>c+1);setModal('summary')}},[latch]);
 const go=x=>{setExpId(x.id);setLatch([]);setFin(false);setAlerts([]);setItems([]);setSel(null);t0.current=Date.now();router.push('/')};
 const start=x=>{if(x.risk&&!passed){setPending(x);setModal('quiz')}else go(x)};
 const ctx=()=>(ex?'Experiment: '+ex.name+'. ':'Free play. ')+(cs.length?cs.map(c=>`${c.kind} with ${Object.entries(c.m).map(([k,v])=>CHEMS[k].n+' '+Math.round(v)).join(', ')||'nothing'}; ${c.t.toFixed(0)}°C; pH ${c.d.pH.toFixed(1)}`).join(' | '):'bench is empty');
 const value={lang,setLang,items,setItems,sel,setSel,ex,latch,alerts,warn,mode,setMode,stir,setStir,hist,toast,setToast,
  modal,setModal,passed,setPassed,completed,pending,setPending,t0,go,start,ctx};
 return <LabContext.Provider value={value}><LangContext.Provider value={lang}>{children}</LangContext.Provider></LabContext.Provider>;
}
