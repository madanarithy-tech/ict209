'use client';
import { REAG } from '@/lib/chem';

const r01=i=>((i*37+11)%17)/17; // fixed scatter so solids don't jump between renders

// Flask interior is a cone frustum: half-width a at the base, b at the neck, over height H. 250 mL fills it to h = 84.
const FA=44,FB=12,FH=102,FK=(FA-FB)/FH,FV=h=>(FA**3-(FA-FK*h)**3)/(3*FK),F250=FV(84);
const flaskH=v=>(FA-Math.cbrt(FA**3-3*FK*Math.min(v,250)*F250/250))/FK;
const SHAPE={
 beaker:{outer:'M9 8Q14 8 14 14L14 138Q14 144 20 144L100 144Q106 144 106 138L106 12Q106 8 110 8',inner:'M16 8L16 138Q16 142 20 142L100 142Q104 142 104 138L104 8Z',
  bot:142,h:v=>Math.min(v,250)/250*120,x0:20,x1:100,therm:74,probe:30,top:8},
 flask:{outer:'M46 6L48 8L48 42L16 128Q12 144 28 144L92 144Q108 144 104 128L72 42L72 8L74 6',inner:'M49 6L49 42L17 128Q13 143 28 143L92 143Q107 143 103 128L71 42L71 6Z',
  bot:143,h:flaskH,x0:26,x1:94,therm:51,probe:56,top:6}};

// Height of the liquid surface (or the inside bottom) in vessel coordinates.
export const surfaceY=c=>{const S=SHAPE[c.kind];return S.bot-S.h(Math.max(c.water,0))};

export function Vessel({c,d}){
 const S=SHAPE[c.kind],id='v'+c.id,h=S.h(d.vol),top=S.bot-h,w=S.x1-S.x0,n=c.n;
 const bubbles=Math.min(14,Math.ceil(Math.sqrt(d.gr)*1500)),boil=d.boiling?10:0;
 const piece=(k,g)=>Math.ceil((n[k]||0)/(g)-1e-9);
 const mg=Math.min(6,piece('Mg',REAG.mg.g/REAG.mg.mm)),zn=Math.min(6,piece('Zn',REAG.zn.g/REAG.zn.mm)),ca=Math.min(6,piece('CaCO3',REAG.caco3.g/REAG.caco3.mm));
 const frac=(k,g)=>{const m=(n[k]||0)/g;return m-Math.floor(m-1e-9)};
 const xt=Math.min(18,Math.ceil(d.xtal*3)),ppt=Math.min(16,(n.CuOH2||0)*900),nh=Math.min(10,(n.NH4Cls||0)*120);
 const ticks=c.kind==='beaker'?[50,100,150,200,250]:[50,100,150,200];
 return <svg width="120" height="190" viewBox="0 -40 120 190" className="overflow-visible" aria-hidden="true">
  <defs><clipPath id={id}><path d={S.inner}/></clipPath>
   <linearGradient id={id+'g'} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55"/><stop offset=".25" stopColor="#fff" stopOpacity=".1"/><stop offset=".8" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#cbd5e1" stopOpacity=".35"/></linearGradient></defs>
  <path d={S.inner} fill="rgba(241,245,249,.35)"/>
  <g clipPath={`url(#${id})`}>
   {d.vol>.2&&<><rect x="0" y={top} width="120" height={h+4} fill={d.color} className="transition-[y,height] duration-500"/><line x1="0" x2="120" y1={top} y2={top} stroke="rgba(71,85,105,.35)" strokeWidth="1.2"/></>}
   {ppt>0&&<rect x="0" y={S.bot-ppt} width="120" height={ppt} fill="#9cc6ea" opacity=".9"/>}
   {nh>0&&<ellipse cx="60" cy={S.bot} rx={14+nh*2} ry={nh} fill="#fbfbfb" stroke="#d6dbe1"/>}
   {Array.from({length:xt}).map((_,i)=>{const x=S.x0+4+r01(i)*(w-8),y=S.bot-2-(i%3)*3,s=3+r01(i+5)*3;
    return <path key={'x'+i} d={`M${x} ${y-s}L${x+s*.7} ${y}L${x} ${y+s*.6}L${x-s*.7} ${y}Z`} fill={c.anh?'#f1f5f9':'#1d4ed8'} stroke={c.anh?'#cbd5e1':'#1e3a8a'} strokeWidth=".6"/>})}
   {Array.from({length:mg}).map((_,i)=>{const l=(i===mg-1?frac('Mg',REAG.mg.g/REAG.mg.mm):1)*22;return <rect key={'m'+i} x={S.x0+8+r01(i)*(w-40)} y={S.bot-3-i*1.5} width={Math.max(3,l)} height="2" rx=".5" fill="#d3d9e0" stroke="#7b8794" strokeWidth=".5" transform={`rotate(${(r01(i+3)-.5)*30} 60 ${S.bot})`}/>})}
   {Array.from({length:zn}).map((_,i)=><ellipse key={'z'+i} cx={S.x0+8+r01(i+1)*(w-16)} cy={S.bot-3} rx={2+3.5*Math.cbrt(i===zn-1?frac('Zn',REAG.zn.g/REAG.zn.mm):1)} ry="3" fill="#9aa4ae" stroke="#5b6672" strokeWidth=".6"/>)}
   {Array.from({length:ca}).map((_,i)=>{const s=3+4*Math.cbrt(i===ca-1?frac('CaCO3',REAG.caco3.g/REAG.caco3.mm):1),x=S.x0+10+r01(i+2)*(w-20),y=S.bot-s*.7;
    return <path key={'c'+i} d={`M${x-s} ${y+s*.6}L${x-s*.6} ${y-s*.5}L${x+s*.4} ${y-s*.7}L${x+s} ${y+s*.2}L${x+s*.5} ${y+s*.7}Z`} fill="#ecebe8" stroke="#a8a29e" strokeWidth=".6"/>})}
   {d.vol>2&&Array.from({length:bubbles+boil}).map((_,i)=>{const big=i>=bubbles;return <circle key={'b'+i} cx={S.x0+6+r01(i+7)*(w-12)} cy={S.bot-4} r={big?2.6+r01(i)*1.5:1.3+r01(i)*1}
    fill="rgba(255,255,255,.75)" stroke="rgba(100,116,139,.5)" strokeWidth=".5" className="gb" style={{'--h':`${-(h-6)}px`,animationDuration:(big?.7:1.3)+r01(i+4)*.6+'s',animationDelay:r01(i+9)*1.2+'s'}}/>})}
  </g>
  {ticks.map(v=>{const y=S.bot-S.h(v);return <g key={v}>
   {c.kind==='beaker'?<><line x1="94" x2="104" y1={y} y2={y} stroke="#64748b" strokeWidth=".8"/><text x="92" y={y+2.5} textAnchor="end" fontSize="7" fill="#64748b">{v}</text></>
   :(()=>{const hw=FA-FK*(S.bot-y);return <><line x1={60+hw-9} x2={60+hw-2} y1={y} y2={y} stroke="#64748b" strokeWidth=".8"/><text x={60+hw-11} y={y+2.5} textAnchor="end" fontSize="7" fill="#64748b">{v}</text></>})()}</g>})}
  <path d={S.inner} fill={`url(#${id}g)`}/>
  <path d={S.outer} fill="none" stroke="#8796a6" strokeWidth="1.6" strokeLinejoin="round"/>
  {c.stir&&<g className="rod" style={{transformOrigin:'64px -30px'}}><line x1="64" y1="-30" x2="58" y2={S.bot-4} stroke="#a5b4c3" strokeWidth="3" strokeLinecap="round"/><line x1="64" y1="-30" x2="58" y2={S.bot-4} stroke="#fff" strokeOpacity=".7" strokeWidth="1"/></g>}
  {c.probe&&<g><rect x={S.probe-3} y="-36" width="6" height={S.bot-28} rx="2" fill="#1f2937"/><rect x={S.probe-2.5} y={S.bot-12} width="5" height="8" rx="2.5" fill="#cbd5e1" stroke="#64748b" strokeWidth=".5"/></g>}
  {c.therm&&(()=>{const y0=S.bot-6,len=S.bot+30,lvl=Math.max(0,Math.min(1,(c.T+10)/120))*(len-12);
   return <g><rect x={S.therm-2.5} y="-34" width="5" height={len+4} rx="2.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth=".7"/><rect x={S.therm-1} y={y0-lvl} width="2" height={lvl} fill="#dc2626"/><circle cx={S.therm} cy={y0+1} r="3.3" fill="#dc2626"/></g>})()}
 </svg>;
}

export function BurnerSVG({gas,air}){
 const hf=gas?14+gas*5.6:0,yh=air?hf:Math.min(68,hf*1.25);
 return <svg width="140" height="150" viewBox="0 0 140 150" className="overflow-visible" aria-hidden="true">
  <defs><linearGradient id="metal" x1="0" x2="1"><stop offset="0" stopColor="#6b7280"/><stop offset=".4" stopColor="#d1d5db"/><stop offset="1" stopColor="#4b5563"/></linearGradient>
   <linearGradient id="yfl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#60a5fa" stopOpacity=".7"/><stop offset=".25" stopColor="#fbbf24"/><stop offset="1" stopColor="#f97316" stopOpacity=".55"/></linearGradient>
   <pattern id="mesh" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0L3 3M3 0L0 3" stroke="#6b7280" strokeWidth=".4"/></pattern></defs>
  <line x1="20" y1="9" x2="6" y2="148" stroke="#374151" strokeWidth="3" strokeLinecap="round"/><line x1="120" y1="9" x2="134" y2="148" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
  <line x1="70" y1="10" x2="70" y2="146" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M96 143C112 143 120 140 140 138" stroke="#b45309" strokeWidth="4" fill="none" strokeLinecap="round"/>
  <rect x="44" y="137" width="52" height="11" rx="3" fill="#374151"/><rect x="63" y="72" width="14" height="66" fill="url(#metal)"/>
  <rect x="61" y="116" width="18" height="12" rx="1.5" fill="#4b5563"/>{air?<rect x="66" y="119" width="8" height="6" rx="1" fill="#0f172a"/>:<line x1="66" x2="74" y1="122" y2="122" stroke="#111827" strokeWidth="1"/>}
  {gas>0&&(air?<g className="flame"><path d={`M63 72Q60 ${72-hf*.55} 70 ${72-hf}Q80 ${72-hf*.55} 77 72Z`} fill="rgba(129,140,248,.45)"/><path d={`M65.5 72Q65 ${72-hf*.3} 70 ${72-hf*.5}Q75 ${72-hf*.3} 74.5 72Z`} fill="rgba(56,189,248,.85)"/></g>
   :<g className="flame flame-y"><path d={`M63 72Q56 ${72-yh*.5} 66 ${72-yh*.8}Q70 ${72-yh} 71 ${72-yh}Q78 ${72-yh*.6} 77 72Z`} fill="url(#yfl)"/></g>)}
  <line x1="12" x2="128" y1="9" y2="9" stroke="#4b5563" strokeWidth="3" strokeLinecap="round"/>
  <rect x="10" y="3" width="120" height="5" fill="url(#mesh)" stroke="#6b7280" strokeWidth=".6"/><ellipse cx="70" cy="5.5" rx="26" ry="2.4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth=".5"/>
 </svg>;
}

export const BUR={top:20,mL:3}; // burette scale: 0.00 mL at y = 20, 3 px per mL
export function BuretteSVG({b,land=346}){
 const lvl=BUR.top+(50-b.vol)*BUR.mL,col=b.ch?REAG[b.ch].pc:'#fff';
 return <svg width="140" height="360" viewBox="0 0 140 360" aria-hidden="true">
  <rect x="4" y="346" width="132" height="10" rx="2" fill="#374151"/><rect x="118" y="8" width="4" height="338" fill="url(#rodg)"/>
  <defs><linearGradient id="rodg" x1="0" x2="1"><stop offset="0" stopColor="#6b7280"/><stop offset=".5" stopColor="#e5e7eb"/><stop offset="1" stopColor="#6b7280"/></linearGradient></defs>
  <rect x="72" y="58" width="48" height="6" rx="1" fill="#4b5563"/><rect x="114" y="54" width="12" height="14" rx="2" fill="#374151"/><rect x="61" y="54" width="14" height="14" rx="2" fill="none" stroke="#4b5563" strokeWidth="2"/>
  <rect x="64" y="8" width="8" height="168" rx="1" fill="rgba(241,245,249,.6)" stroke="#8796a6" strokeWidth="1"/>
  {b.vol>0&&<><rect x="65" y={lvl} width="6" height={176-lvl} fill={col} opacity=".75"/><path d={`M65 ${lvl}Q68 ${lvl+2} 71 ${lvl}`} fill="none" stroke="#475569" strokeWidth=".8"/></>}
  {Array.from({length:51}).map((_,i)=>{const y=BUR.top+i*BUR.mL,maj=i%10===0,mid=i%5===0;return <g key={i}><line x1="64" x2={maj?58:mid?60:62} y1={y} y2={y} stroke="#64748b" strokeWidth={maj?.8:.5}/>{maj&&<text x="56" y={y+2.5} fontSize="7" textAnchor="end" fill="#475569">{i}</text>}</g>})}
  <rect x="62" y="176" width="12" height="10" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth=".8"/>
  {b.tap?<rect x="66" y="171" width="4" height="20" rx="1.5" fill="#1e40af"/>:<rect x="59" y="179" width="18" height="4" rx="1.5" fill="#1e40af"/>}
  <path d="M65 186L67 214L69 214L71 186Z" fill={b.vol>0?col:'rgba(241,245,249,.6)'} stroke="#8796a6" strokeWidth=".8"/>
  {b.tap>0&&b.vol>0&&(b.tap===3?<line x1="68" x2="68" y1="214" y2={land} stroke={col==='#eef2f6'?'#bfdbfe':col} strokeWidth="1.6" opacity=".9"/>
   :<circle cx="68" cy="216" r="1.6" fill="#bfdbfe" stroke="#64748b" strokeWidth=".3" className="fall" style={{'--d':`${land-216}px`,animationDuration:b.tap===1?'1s':'.35s',animationIterationCount:'infinite'}}/>)}
 </svg>;
}

// Small drawings for the shelf: reagent bottle, dropper bottle, solid jar, or a piece of apparatus.
export function ShelfIcon({k,id,className='',...svg}){
 const st={fill:'none',stroke:'#475569',strokeWidth:1.3,strokeLinejoin:'round',strokeLinecap:'round'};
 if(k==='reag'){const r=REAG[id];
  if(r.f==='ind')return <svg viewBox="0 0 36 44" className={className} {...svg}><ellipse cx="18" cy="6" rx="4" ry="4" fill="#1f2937"/><rect x="15" y="9" width="6" height="6" fill="#374151"/><rect x="10" y="15" width="16" height="27" rx="3" fill="#a16207" fillOpacity=".55" stroke="#78350f" strokeWidth=".8"/><rect x="12" y="24" width="12" height="9" fill="#fff" fillOpacity=".9"/><rect x="13" y="27" width="10" height="3" fill={r.pc}/></svg>;
  if(r.f==='solid')return <svg viewBox="0 0 36 44" className={className} {...svg}><rect x="6" y="6" width="24" height="7" rx="1.5" fill="#334155"/><rect x="7" y="13" width="22" height="29" rx="3" fill="#f8fafc" fillOpacity=".7" stroke="#94a3b8" strokeWidth=".8"/><rect x="8" y="27" width="20" height="14" rx="2" fill={r.pc} stroke="#94a3b8" strokeWidth=".4"/><rect x="9" y="16" width="18" height="8" fill="#fff" stroke="#cbd5e1" strokeWidth=".4"/><text x="18" y="22" fontSize="5" textAnchor="middle" fill="#0f172a">{r.fm}</text></svg>;
  return <svg viewBox="0 0 36 44" className={className} {...svg}><rect x="13" y="2" width="10" height="6" rx="1" fill="#334155"/><rect x="14.5" y="8" width="7" height="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth=".6"/><path d="M14.5 13L8 18V40Q8 42 10 42H26Q28 42 28 40V18L21.5 13Z" fill="#f8fafc" fillOpacity=".75" stroke="#94a3b8" strokeWidth=".8"/><path d="M8.4 22H27.6V40Q27.6 41.6 26 41.6H10Q8.4 41.6 8.4 40Z" fill={r.pc} fillOpacity=".9"/><rect x="10" y="25" width="16" height="10" fill="#fff"/><text x="18" y="32" fontSize="5" textAnchor="middle" fill="#0f172a">{r.fm||'—'}</text></svg>;}
 const G={beaker:<><path d="M8 8h2v28h16V8h2" {...st}/><path d="M10 24h16" {...st} stroke="#60a5fa"/></>,
  flask:<><path d="M15 6v10L8 34q-1 3 2 3h16q3 0 2-3l-7-18V6" {...st}/><path d="M11 28h14" {...st} stroke="#60a5fa"/></>,
  bunsen:<><path d="M4 12h28M8 12 5 40M28 12l3 28" {...st}/><path d="M16 38h4V22h-4zM12 40h12" {...st}/><path d="M18 20q-2-3 0-6 2 3 0 6z" {...st} stroke="#3b82f6"/></>,
  burette:<><path d="M17 3h2v28h-2zM16 31h4l-1 3h-2zM30 3v37M6 40h28M19 10h11" {...st}/></>,
  balance:<><path d="M6 24h24l2 14H4z" {...st}/><path d="M10 20h16" {...st}/><rect x="12" y="29" width="12" height="5" {...st}/></>,
  therm:<><path d="M18 4v27" {...st}/><circle cx="18" cy="35" r="4" {...st}/><path d="M18 18v14" {...st} stroke="#dc2626"/></>,
  probe:<><rect x="15" y="4" width="6" height="28" rx="2" {...st}/><path d="M16 32h4v4q-2 3-4 0z" {...st}/><path d="M18 4V1" {...st}/></>,
  rod:<path d="M10 40 26 4" {...st} strokeWidth="2"/>};
 return <svg viewBox="0 0 36 44" className={className} {...svg}>{G[id]}</svg>;
}

// Pouring, drawn in the vessel's own coordinates: a bottle or jar tips its mouth over the opening, a dropper hangs above it,
// and whatever comes out falls from that point to the liquid surface (solids to the bottom).
export function Pour({pr,c}){
 const r=REAG[pr.rid],S=SHAPE[c.kind],mx=c.kind==='flask'?64:58,my=-20,land=r.f==='solid'?S.bot-4:surfaceY(c);
 const col=['#eef2f6','#f1f5f9','#e6f0f7','#f4f6f8','#e9edf2'].includes(r.pc)?'#bcd6ea':r.pc;
 const fall=(delay,y=my)=>({'--d':`${land-y}px`,animationDelay:delay+'s',opacity:0});
 const drops=r.f==='ind'||pr.small;
 return <svg width="120" height="190" viewBox="0 -40 120 190" className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden="true">
  {drops?<g className="dropper"><path d={`M${mx-4} -46Q${mx-4} -54 ${mx} -54Q${mx+4} -54 ${mx+4} -46V-40H${mx-4}Z`} fill="#1f2937"/>
    <path d={`M${mx-2} -40H${mx+2}V-14L${mx+.6} -8H${mx-.6}L${mx-2} -14Z`} fill="rgba(241,245,249,.8)" stroke="#94a3b8" strokeWidth=".6"/><rect x={mx-1.4} y="-24" width="2.8" height="12" fill={col} opacity=".85"/>
    {Array.from({length:r.f==='ind'||pr.amt<=.05?1:3}).map((_,i)=><circle key={i} cx={mx} cy="-6" r="1.8" fill={col} stroke="#64748b" strokeWidth=".3" className="fall" style={fall(.12+i*.2,-6)}/>)}</g>
  :<><g className="tiltb" style={{transformOrigin:`${mx}px ${my}px`}}><ShelfIcon k="reag" id={pr.rid} x={mx-18} y={my-2} width="36" height="44" overflow="visible"/></g>
   {r.f==='sol'?<rect x={mx-2} y={my} width="4" height={Math.max(0,land-my)} rx="1.5" fill={col} stroke="rgba(100,116,139,.35)" strokeWidth=".5" className="stream"/>
   :Array.from({length:r.sp==='NH4Cls'?9:3}).map((_,i)=><rect key={i} x={mx-3+(i%3)*2} y={my} width={r.sp==='Mg'?2:r.sp==='NH4Cls'?2.5:5} height={r.sp==='Mg'?10:r.sp==='NH4Cls'?2.5:5} rx={r.sp==='Zn'?2.5:.5}
     fill={r.pc} stroke="#94a3b8" strokeWidth=".5" className="fall" style={fall(.3+i*.05)}/>)}</>}
 </svg>;
}
