// Line icons on a 24-unit grid, drawn with currentColor.
const P={
 bench:'M3 20h18M5 20V9h14v11M9 9V4h6v5M9 13h6',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
 bottle:'M10 3h4M10 3v4l-3 3v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V10l-3-3V3M7 14h10',shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
 award:'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14 7 21l5-3 5 3-1.5-7',globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9',
 chat:'M4 5h16v11H9l-5 4z',x:'M6 6l12 12M18 6 6 18',check:'M5 12l5 5 9-10',alert:'M12 4 2.5 20h19zM12 10v4M12 17v.5',info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5V8',
 clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',play:'M7 5l12 7-12 7z',pause:'M8 5v14M16 5v14',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
 flask:'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9',thermo:'M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0zM12 9v7',
 scale:'M12 4v16M5 20h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0zM5 8h14',drop:'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z',
 lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',send:'M4 12l16-8-6 16-3-7z',record:'M5 4h11l3 3v13H5zM9 4v5h6V4M8 14h8M8 17h5',
 crystal:'M12 3l6 6-6 12-6-12zM6 9h12M12 3v18',burette:'M11 2h2v14h-2zM10 16h4l-1 2h-2zM12 18v3M6 9h3M6 5h3M6 13h3',arrow:'M5 12h14M13 6l6 6-6 6',sound:'M4 9v6h4l5 4V5L8 9z'};
export const Icon=({n,className='h-4 w-4',sw=1.6})=><svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]}/></svg>;
export const Logo=({s=32})=><svg width={s} height={s} viewBox="0 0 32 32" aria-label="Digital Researching Lab logo"><rect width="32" height="32" rx="7" fill="#0f766e"/>
 <path d="M13 7h6M14 7v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V7" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M11.2 19h9.6l1.6 3a1 1 0 0 1-.9 1.5H10.5a1 1 0 0 1-.9-1.5z" fill="#5eead4"/></svg>;
export const Card=({className='',...p})=><div className={'rounded-lg border border-line bg-paper shadow-[0_1px_2px_rgba(120,90,40,.06)] '+className} {...p}/>;
export const Title=({children,right})=><div className="flex items-center justify-between gap-2 border-b border-line/70 px-4 py-2.5"><h2 className="text-[13px] font-semibold uppercase tracking-wide text-stone-500">{children}</h2>{right}</div>;
export const Seg=({opts,val,onChange,className=''})=><div className={'inline-flex rounded-md border border-line bg-sand p-0.5 '+className}>{opts.map(([k,l])=><button key={String(k)} onClick={()=>onChange(k)}
 className={'rounded px-2 py-1 text-xs font-medium transition '+(val===k?'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200':'text-stone-500 hover:text-stone-800')}>{l}</button>)}</div>;
const TONE={rose:'bg-rose-50 text-rose-700 ring-rose-200',amber:'bg-amber-50 text-amber-800 ring-amber-200',orange:'bg-orange-50 text-orange-700 ring-orange-200',stone:'bg-stone-50 text-stone-600 ring-stone-200',emerald:'bg-emerald-50 text-emerald-700 ring-emerald-200',violet:'bg-violet-50 text-violet-700 ring-violet-200',gold:'bg-gold-50 text-gold-700 ring-gold-200',brand:'bg-brand-50 text-brand-700 ring-brand-100'};
export const Badge=({tone='stone',children,className=''})=><span className={'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset '+TONE[tone]+' '+className}>{children}</span>;
export const Btn=({kind='plain',className='',...p})=><button className={'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 '+
 (kind==='primary'?'bg-brand-700 text-white hover:bg-brand-600':kind==='danger'?'text-rose-700 hover:bg-rose-50':'border border-line bg-paper text-stone-700 hover:bg-sand')+' '+className} {...p}/>;
// Page heading with the gold rule from the original design.
export const H1=({children})=><h1 className="text-2xl font-semibold text-stone-900">{children}<span className="mt-2 block h-0.5 w-12 rounded bg-gold-500"/></h1>;
