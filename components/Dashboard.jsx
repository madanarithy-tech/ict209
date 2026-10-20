'use client';
import Link from 'next/link';
import { EXPS } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Card, Curve, Icon3D, Molecule, Sprig } from './ui';

export default function Dashboard(){
 const {completed,start,ex}=useLab();
 const T=useT();
 return <div className="mx-auto max-w-5xl p-6">
  <Card className="relative overflow-hidden p-8"><Molecule className="absolute -right-4 -top-4 h-48 w-48 opacity-60"/><Sprig className="absolute -bottom-3 right-28 h-24 w-24 opacity-70"/><h1 className="relative text-4xl text-stone-800">{T('Good to see you, Alex')}</h1>
   <p className="relative mt-1 text-stone-500">{T('Your bench is clean and the fume hood is on.')}</p>
   <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
    <div className="rounded-xl bg-stone-50/70 p-4"><div className="text-sm text-stone-500">{T('Experiments completed')}</div><div className="text-3xl font-bold text-teal-600">{completed}</div></div>
    <div className="rounded-xl bg-stone-50/70 p-4"><div className="text-sm text-stone-500">{T('Safety score')}</div><div className="text-3xl font-bold text-emerald-600">94%</div></div>
    <Link href="/" className="rounded-xl border border-teal-500/50 bg-teal-500/10 p-4 text-left hover:bg-teal-500/20"><div className="text-sm text-stone-500">{T('Resume last experiment')}</div><div className="font-semibold">{T(ex?ex.name:'Open an empty bench')}</div></Link></div></Card>
  <h2 className="mt-10 text-3xl text-stone-800">{T('Experiment catalog')}</h2><Curve className="mb-4 mt-1"/>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{EXPS.map(x=><Card key={x.id} className="p-5 flex flex-col">
   <Icon3D k={x.id} className="h-14 w-14"/><h3 className="mt-2 font-semibold">{T(x.name)}</h3><p className="mt-1 flex-1 text-sm text-stone-500">{T(x.desc)}</p>
   <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className={'rounded-full px-2 py-1 '+(x.diff==='Easy'?'bg-emerald-500/20 text-emerald-700':x.diff==='Medium'?'bg-teal-500/20 text-teal-700':'bg-amber-500/20 text-amber-700')}>{T(x.diff)}</span>
    <span className="rounded-full bg-stone-100 px-2 py-1">⏱ {T(x.time)}</span><span className="rounded-full bg-stone-100 px-2 py-1">🛡️ {'●'.repeat(x.safety)+'○'.repeat(5-x.safety)}</span></div>
   <button onClick={()=>start(x)} className="mt-4 rounded-xl bg-teal-700 py-2 font-semibold text-white hover:bg-teal-600">{T(x.risk?'Safety check & start':'Start experiment')}</button></Card>)}</div></div>;
}
