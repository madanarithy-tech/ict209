'use client';
import { EQUIP, EXPS, HAZ, REAG, TABS } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { useLab } from '@/lib/lab';
import { ShelfIcon } from './Apparatus';
import { Badge, Btn, Card, H1, Icon, Title } from './ui';

const HAZINFO=[['Corrosive','Destroys skin and eyes on contact. Rinse at once with plenty of water.'],['Irritant','Makes skin and eyes red and sore. Wash it off with water.'],
 ['Harmful','Harmful if swallowed or breathed in. Wash your hands after use.'],['Flammable','Catches fire easily. Keep it away from flames.']];

export function Inventory(){
 const T=useT();
 return <div className="mx-auto max-w-5xl p-4 sm:p-8"><H1>{T('Chemicals')}</H1>
  <p className="mt-1 text-stone-600">{T('Everything on the shelf, with its hazard. Read the label before you use any chemical.')}</p>
  {TABS.filter(t=>t!=='Apparatus').map(cat=><Card key={cat} className="mt-6 overflow-hidden"><Title>{T(cat)}</Title>
   <div className="divide-y divide-line/70">{Object.entries(REAG).filter(([,r])=>r.cat===cat).map(([id,r])=><div key={id} className="flex items-center gap-3 px-4 py-2.5">
    <ShelfIcon k="reag" id={id} className="h-11 w-9 shrink-0"/><div className="min-w-0 flex-1"><div className="font-medium text-stone-900">{T(r.n)}</div><div className="text-sm text-stone-500">{id==='naohx'?T('unknown concentration'):T(r.c)}</div></div>
    {r.fm&&<span className="hidden font-mono text-sm text-stone-600 sm:inline">{r.fm}</span>}<Badge tone={HAZ[r.haz]}>{T(r.haz==='None'?'No hazard':r.haz)}</Badge></div>)}</div></Card>)}
  <Card className="mt-6 overflow-hidden"><Title>{T('Apparatus')}</Title><div className="grid gap-px bg-line/60 sm:grid-cols-2">{Object.entries(EQUIP).map(([id,e])=><div key={id} className="flex items-center gap-3 bg-paper px-4 py-2.5">
   <ShelfIcon k="equip" id={id} className="h-10 w-8 shrink-0"/><div><div className="font-medium text-stone-900">{T(e.n)}</div><div className="text-sm text-stone-500">{T(e.c)}</div></div></div>)}</div></Card></div>;
}

const RULES=[['Before you start',['Wear goggles and a lab coat. Tie back long hair.','Know where the eye wash, the fire blanket and the first-aid kit are.','Never eat, drink or taste anything in the lab.']],
 ['Using the Bunsen burner',['Stand the burner on a heat-proof mat, away from paper and bags.','Close the air hole, hold the lighter at the top of the barrel, then turn on the gas.','The yellow flame is the safety flame: easy to see, but cool and sooty. Open the air hole for a hot blue flame when heating.','Heat beakers and flasks on a tripod and gauze, never in your hand.','Turn the gas off at the tap when you finish.']],
 ['Heating liquids',['Never fill a beaker more than half full when you heat it.','Never heat a container until it is dry: the solid spits and the glass can crack.','Hot glass looks the same as cold glass. Use tongs and let it cool.']],
 ['Handling chemicals',['Add acid to water, never water to acid.','Use the smallest amount that works, and never put chemicals back in the bottle.','Keep flames away from reactions that make hydrogen.']],
 ['If there is an accident',['Skin or eyes: rinse with running water for 15 minutes and tell your teacher.','Broken glass: do not pick it up with your hands. Tell your teacher.','Fire: turn off the gas, step back and tell your teacher at once.']]];

export function Safety(){
 const {setPending,setModal,passed}=useLab();const T=useT();
 return <div className="mx-auto max-w-3xl p-4 sm:p-8"><H1>{T('Safety rules')}</H1>
  <p className="mt-1 text-stone-600">{T('A real lab follows these rules, and so does this one. Pass the safety check to unlock experiments with flames and flammable gas.')}</p>
  <div className="mt-6 space-y-4">{RULES.map(([h,l])=><Card key={h}><Title>{T(h)}</Title><ul className="space-y-2 p-4 text-sm text-stone-700">{l.map(x=><li key={x} className="flex gap-2.5"><Icon n="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"/>{T(x)}</li>)}</ul></Card>)}
   <Card><Title>{T('Hazard labels')}</Title><dl className="divide-y divide-line/70 text-sm">{HAZINFO.map(([h,d])=><div key={h} className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"><dt className="w-28 shrink-0"><Badge tone={HAZ[h]}>{T(h)}</Badge></dt><dd className="text-stone-700">{T(d)}</dd></div>)}</dl></Card></div>
  <Btn kind="primary" onClick={()=>{setPending(null);setModal('quiz')}} className="mt-6"><Icon n="shield"/>{T(passed?'Take the safety check again':'Take the safety check')}</Btn></div>;
}

export function Achievements(){
 const {done,passed,incidents}=useLab();
 const T=useT();
 const B=[['First reaction','Complete any experiment',done.length>0],['Safety first','Pass the safety check',passed],['Careful worker','Complete an experiment with no serious safety warnings',done.length>0&&incidents===0],
  ['Analyst','Complete the acid–base titration',done.includes('titr')],['Crystal grower','Grow copper(II) sulfate crystals',done.includes('cryst')],['Lab master','Complete every experiment',done.length===EXPS.length]];
 return <div className="mx-auto max-w-4xl p-4 sm:p-8"><H1>{T('Progress')}</H1>
  <div className="mt-6 grid gap-3 sm:grid-cols-2">{B.map(b=><Card key={b[0]} className={'flex items-center gap-4 p-4 '+(b[2]?'':'opacity-70')}>
   <div className={'grid h-10 w-10 shrink-0 place-items-center rounded-full '+(b[2]?'bg-gold-50 text-gold-700 ring-1 ring-gold-200':'bg-stone-100 text-stone-400')}><Icon n={b[2]?'award':'lock'} className="h-5 w-5"/></div>
   <div><b className="text-stone-900">{T(b[0])}</b><div className="text-sm text-stone-500">{T(b[1])}</div></div></Card>)}</div></div>;
}
