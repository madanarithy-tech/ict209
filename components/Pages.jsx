'use client';
import { CHEMS } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { Card } from './ui';

export function Inventory(){
 const T=useT();
 return <div className="mx-auto max-w-4xl p-6"><h1 className="mb-4 text-2xl font-bold">{T('Inventory')}</h1><div className="grid gap-3 sm:grid-cols-2">{Object.values(CHEMS).map((c,i)=><Card key={i} className="p-4"><div className="flex justify-between"><span>{c.e} {T(c.n)}</span><span className="text-stone-500">{T(c.cat)}</span></div><div className="mt-2 h-1.5 rounded bg-stone-100"><div className="h-full rounded bg-teal-400" style={{width:(95-i*9)+'%'}}/></div></Card>)}</div></div>;
}

export function Safety(){
 const {setPending,setModal}=useLab();
 return <div className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-bold">Safety manual</h1><Card className="space-y-2 p-5 text-stone-600">{['Wear goggles, gloves and a lab coat at all times.','Add acid to water, never water to acid.','Keep flames away from hydrogen-producing reactions.','Rinse skin splashes with running water for 15 minutes.','Never taste or sniff chemicals directly.'].map(t=><div key={t}>✔ {t}</div>)}<button onClick={()=>{setPending(null);setModal('quiz')}} className="mt-3 rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white">Take the safety check</button></Card></div>;
}

export function Achievements(){
 const {completed}=useLab();
 const T=useT();
 const B=[['First reaction','Complete any experiment',completed>0],['Steady hands','Complete 2 experiments',completed>1],['Lab master','Complete all 3 experiments',completed>2],['Safety first','Pass the safety check',false]];
 return <div className="mx-auto max-w-3xl p-6"><h1 className="mb-4 text-2xl font-bold">{T('Achievements')}</h1><div className="grid gap-3 sm:grid-cols-2">{B.map(b=><Card key={b[0]} className={'p-4 '+(b[2]?'!border-emerald-500/60':'opacity-60')}><div className="text-2xl">{b[2]?'🏆':'🔒'}</div><b>{b[0]}</b><div className="text-sm text-stone-500">{b[1]}</div></Card>)}</div></div>;
}
