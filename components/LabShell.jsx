'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { LabProvider, useLab } from '@/lib/lab';
import { Logo, Sprig } from './ui';
import Chat from './Chat';
import Modals from './Modals';

function Nav(){
 const {lang,setLang}=useLab();
 const T=useT(),path=usePathname();
 return <nav className="flex w-16 shrink-0 flex-col gap-1 border-r border-[#e4d8bd] bg-white/70 p-2 backdrop-blur lg:w-60">
  <div className="mb-3 flex items-center gap-2 p-1"><Logo/><span className="serif hidden text-xl leading-tight text-stone-800 lg:inline">{T('Digital Researching Lab')}</span></div>
  {NAV.map(([href,l,e])=><Link key={href} href={href} title={T(l)} className={'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm '+(path===href?'bg-teal-500/20 text-teal-700':'text-stone-500 hover:bg-stone-100')}><span>{e}</span><span className="hidden lg:inline">{T(l)}</span></Link>)}<Sprig className="mt-auto hidden h-24 w-24 self-center opacity-70 lg:block"/>
  <button onClick={()=>setLang(lang==='en'?'km':'en')} aria-label="Switch language" title="English / ខ្មែរ" className="flex items-center gap-2 rounded-xl border border-[#e4d8bd] px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-100 max-lg:mt-auto lg:mt-2"><span>🌐</span><span className="hidden lg:inline">{lang==='en'?'ភាសាខ្មែរ':'English'}</span><span className="text-xs lg:hidden">{lang==='en'?'ខ្មែរ':'EN'}</span></button></nav>;
}

export default function LabShell({children}){
 return <LabProvider><div className="flex h-full">
  <Nav/>
  <main className="min-w-0 flex-1 overflow-auto">{children}</main>
  <Chat/>
  <Modals/></div></LabProvider>;
}
