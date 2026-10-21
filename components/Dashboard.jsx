'use client';
import { useState } from 'react';
import Link from 'next/link';
import { EXPS } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Badge, Btn, Card, H1, Icon, Seg } from './ui';

const ICON={ind:'drop',energy:'thermo',rate:'scale',cryst:'crystal',titr:'burette'};

export default function Dashboard(){
 const {done,start,ex,passed,incidents}=useLab();
 const T=useT();
 const [lv,setLv]=useState('all');
 const list=EXPS.filter(x=>lv==='all'||x.level===lv);
 return <div className="mx-auto max-w-6xl p-4 sm:p-8">
  <H1>{T('Experiments')}</H1>
  <p className="mt-3 max-w-2xl text-stone-600">{T('Real reactions with real measurements, for lower and upper secondary chemistry. Every result on the bench comes from the chemistry, not from a script.')}</p>
  <div className="mt-6 grid gap-3 sm:grid-cols-3">
   <Card className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Completed')}</div><div className="mt-1 font-mono text-2xl font-semibold text-stone-900">{done.length}<span className="text-base text-stone-400"> / {EXPS.length}</span></div></Card>
   <Card className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Safety check')}</div><div className={'mt-1 flex items-center gap-1.5 text-lg font-semibold '+(passed?'text-emerald-700':'text-stone-500')}><Icon n={passed?'check':'lock'} className="h-5 w-5"/>{T(passed?'Passed':'Not taken')}</div></Card>
   <Link href="/" className="rounded-lg border border-line bg-paper p-4 shadow-[0_1px_2px_rgba(120,90,40,.06)] hover:border-brand-600"><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{T('Bench')}</div><div className="mt-1 flex items-center justify-between font-semibold text-stone-900">{T(ex?ex.name:'Free practice')}<Icon n="arrow"/></div>
    {incidents>0&&<div className="mt-1 text-xs text-rose-700">{incidents} {T('serious safety warnings this session')}</div>}</Link></div>
  <div className="mt-10 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-stone-900">{T('Experiment catalogue')}</h2>
   <Seg val={lv} onChange={setLv} opts={[['all',T('All')],['Lower secondary',T('Lower secondary')],['Upper secondary',T('Upper secondary')]]}/></div>
  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map(x=><Card key={x.id} className="flex flex-col p-5">
   <div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-md bg-brand-50 text-brand-700"><Icon n={ICON[x.id]} className="h-5 w-5"/></div>{done.includes(x.id)&&<Badge tone="emerald"><Icon n="check" className="h-3 w-3"/>{T('Done')}</Badge>}</div>
   <h3 className="mt-3 font-semibold text-stone-900">{T(x.name)}</h3><p className="mt-1 flex-1 text-sm text-stone-600">{T(x.desc)}</p>
   <div className="mt-3 font-mono text-[11px] text-stone-500">{x.eq}</div>
   <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone={x.level==='Upper secondary'?'violet':'brand'}>{T(x.level)}</Badge><Badge>{T(x.diff)}</Badge><Badge><Icon n="clock" className="h-3 w-3"/>{T(x.time)}</Badge>{x.risk&&<Badge tone="amber"><Icon n="shield" className="h-3 w-3"/>{T('Safety check')}</Badge>}</div>
   <Btn kind="primary" onClick={()=>start(x)} className="mt-4 w-full">{T(x.risk&&!passed?'Safety check and start':'Start experiment')}</Btn></Card>)}</div></div>;
}
