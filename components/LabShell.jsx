'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { LabProvider, useLab } from '@/lib/lab';
import { Icon, Logo } from './ui';
import Chat from './Chat';
import Modals from './Modals';

function Nav(){
 const {lang,setLang}=useLab();
 const T=useT(),path=usePathname();
 return <nav className="flex w-14 shrink-0 flex-col gap-0.5 border-r border-line bg-sand p-2 text-stone-600 lg:w-56">
  <div className="mb-4 flex items-center gap-2.5 px-1 py-1.5"><Logo s={30}/><div className="hidden leading-tight lg:block"><div className="text-sm font-semibold text-stone-900">{T('Digital Researching Lab')}</div><div className="text-[11px] text-stone-500">{T('Virtual chemistry lab')}</div></div></div>
  {NAV.map(([href,l,ic])=><Link key={href} href={href} title={T(l)} className={'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm '+(path===href?'bg-brand-700/10 font-medium text-brand-800 shadow-[inset_3px_0_0_#b8975a]':'hover:bg-stone-900/5 hover:text-stone-900')}><Icon n={ic} className="h-[18px] w-[18px] shrink-0"/><span className="hidden lg:inline">{T(l)}</span></Link>)}
  <button onClick={()=>setLang(lang==='en'?'km':'en')} aria-label="Switch language" title="English / ខ្មែរ" className="mt-auto flex items-center gap-3 rounded-md border border-line bg-paper px-2.5 py-2 text-sm hover:text-stone-900"><Icon n="globe" className="h-[18px] w-[18px] shrink-0"/><span className="hidden lg:inline">{lang==='en'?'ភាសាខ្មែរ':'English'}</span></button></nav>;
}

export default function LabShell({children}){
 return <LabProvider><div className="flex h-full">
  <Nav/>
  <main className="min-w-0 flex-1 overflow-auto">{children}</main>
  <Chat/>
  <Modals/></div></LabProvider>;
}
