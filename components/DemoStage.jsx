'use client';
import { colorOf } from '@/lib/chem';
import { useT } from '@/lib/i18n';
import { BuretteSVG, Vessel, surfaceY } from './Apparatus';

// Bench-scale drawings for the reaction demonstrations, in the same style as the lab bench apparatus.
// Each scene is drawn from the demo's model state s, its controls p and the derived readings v.
const r01=i=>((i*37+11)%17)/17;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const GLASS={fill:'rgba(241,245,249,.35)',stroke:'#8796a6',strokeWidth:1.6,strokeLinejoin:'round'};
const Lbl=({x,y,children,a='middle'})=>{const T=useT();return <text x={x} y={y} fontSize="9" textAnchor={a} fill="#78716c">{T(children)}</text>};
// The bench top runs past the drawing so it reaches both edges of a wide stage.
const Top=()=><><rect x="-1200" y="270" width="2880" height="3" fill="#5a524a"/><rect x="-1200" y="273" width="2880" height="27" fill="#403a34"/></>;
const Frame=({children})=><svg viewBox="0 0 480 300" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet" aria-hidden="true">{children}<Top/></svg>;
const Fizz=({x,y,n=6,h=-16,w=16})=>Array.from({length:n}).map((_,i)=><circle key={i} cx={x-w/2+r01(i)*w} cy={y} r={1+r01(i+3)} fill="rgba(255,255,255,.85)" stroke="rgba(100,116,139,.5)" strokeWidth=".4" className="gb" style={{'--h':h+'px',animationDuration:.5+r01(i+5)*.5+'s',animationDelay:r01(i+7)*.6+'s'}}/>);
const Steam=({x,y,n=3})=>Array.from({length:n}).map((_,i)=><circle key={i} cx={x-12+i*12} cy={y} r="10" fill="rgba(226,232,240,.75)" className="svap" style={{animationDelay:i*.7+'s'}}/>);
// Bunsen burner standing on the bench with its flame; air is 0 (closed) to 1 (open).
function Burner({x,air,on=true}){
 const h=air>=1?62:air>0?80:110;
 return <g>
  <path d={`M${x+10} 262C${x+60} 262 ${x+90} 258 ${x+140} 256`} stroke="#b45309" strokeWidth="4" fill="none" strokeLinecap="round"/>
  <rect x={x-26} y="258" width="52" height="12" rx="3" fill="#374151"/><rect x={x-8} y="170" width="16" height="90" fill="url(#metal2)"/>
  <rect x={x-10} y="234" width="20" height="13" rx="1.5" fill="#4b5563"/><rect x={x-4*air} y="237" width={8*air+.01} height="7" rx="1" fill="#0f172a"/>
  {on&&(air>=1?<g className="flame"><path d={`M${x-8} 170Q${x-12} ${170-h*.5} ${x} ${170-h}Q${x+12} ${170-h*.5} ${x+8} 170Z`} fill="rgba(129,140,248,.45)"/><path d={`M${x-5} 170Q${x-5} ${170-h*.3} ${x} ${170-h*.42}Q${x+5} ${170-h*.3} ${x+5} 170Z`} fill="rgba(56,189,248,.9)"/></g>
   :air>0?<g className="flame"><path d={`M${x-8} 170Q${x-13} ${170-h*.5} ${x-1} ${170-h}Q${x+12} ${170-h*.55} ${x+8} 170Z`} fill="url(#yfl2)"/><path d={`M${x-5} 170Q${x-5} ${170-h*.25} ${x} ${170-h*.35}Q${x+5} ${170-h*.25} ${x+5} 170Z`} fill="rgba(56,189,248,.85)"/></g>
   :<g className="flame flame-y"><path d={`M${x-8} 170Q${x-18} ${170-h*.45} ${x-4} ${170-h*.8}Q${x+2} ${170-h} ${x+3} ${170-h}Q${x+14} ${170-h*.55} ${x+8} 170Z`} fill="url(#yfl2)"/></g>)}
 </g>;
}
const Defs=()=><defs><linearGradient id="metal2" x1="0" x2="1"><stop offset="0" stopColor="#6b7280"/><stop offset=".4" stopColor="#d1d5db"/><stop offset="1" stopColor="#4b5563"/></linearGradient>
 <linearGradient id="yfl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#60a5fa" stopOpacity=".7"/><stop offset=".25" stopColor="#fbbf24"/><stop offset="1" stopColor="#f97316" stopOpacity=".55"/></linearGradient>
 <pattern id="foam" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#f7cf7a"/><circle cx="3" cy="3" r="2.2" fill="#fff6dd" stroke="#e7b553" strokeWidth=".5"/><circle cx="7.5" cy="7" r="1.4" fill="#fff6dd" stroke="#e7b553" strokeWidth=".4"/></pattern>
 <radialGradient id="glow"><stop offset="0" stopColor="#fff"/><stop offset=".25" stopColor="#fff" stopOpacity=".9"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient></defs>;

function Toothpaste({s,p,v}){
 const x0=205,x1=245,top=58,bot=262,k=(bot-top-6)/500,liq=65*k;
 const foam=v.V*900,inside=Math.min(foam,435),over=Math.max(0,foam-inside),jet=Math.min(150,(s.rate||0)/9),pile=Math.min(130,Math.sqrt(over)*1.7);
 const fy=bot-liq-inside*k;
 return <Frame><Defs/>
  <rect x="80" y="262" width="320" height="8" rx="2" fill="#9ca3af"/><Lbl x={92} y={258} a="start">tray</Lbl>
  {pile>2&&<ellipse cx="225" cy="262" rx={pile} ry={Math.max(4,pile*.3)} fill="url(#foam)" stroke="#e7b553"/>}
  <rect x={x0+2} y={bot-liq} width={x1-x0-4} height={liq} fill={p.cat==='KI'?'rgba(146,64,14,.45)':'rgba(234,179,8,.25)'}/>
  {inside>1&&<rect x={x0+2} y={fy} width={x1-x0-4} height={inside*k} fill="url(#foam)"/>}
  {over>1&&jet>1&&<path d={`M${x0+4} ${top+2}L${x0+2} ${top-jet+12}Q${x0} ${top-jet-6} ${(x0+x1)/2} ${top-jet-8}Q${x1} ${top-jet-6} ${x1-2} ${top-jet+12}L${x1-4} ${top+2}Z`} fill="url(#foam)" stroke="#e7b553"/>}
  {over>1&&<path d={`M${x1-6} ${top+4}Q${x1+18} ${top+10} ${x1+22} ${bot-8}L${x1+6} ${bot-8}Q${x1+4} ${top+30} ${x1-8} ${top+16}Z`} fill="url(#foam)" stroke="#e7b553" opacity=".95"/>}
  <path d={`M${x0-6} ${top}H${x0}V${bot}H${x1}V${top}H${x1+6}`} {...GLASS} fill="none"/><rect x={x0-14} y={bot} width={x1-x0+28} height="6" rx="2" fill="#cbd5e1" stroke="#8796a6"/>
  {[100,200,300,400,500].map(m=><g key={m}><line x1={x1-10} x2={x1} y1={bot-m*k} y2={bot-m*k} stroke="#64748b" strokeWidth=".8"/><text x={x1-12} y={bot-m*k+3} fontSize="7" textAnchor="end" fill="#64748b">{m}</text></g>)}
  {s.T>60&&<Steam x={225} y={over>1?top-jet:fy}/>}
  <Lbl x={x1+30} y={bot-40} a="start">500 mL</Lbl>
 </Frame>;
}

function Alkali({s,p,v}){
 const x=60+s.x*360,started=s.t>0,on=s.g>0,r=2+Math.cbrt(s.g*1000)*1.5,pink=clamp((v.pH-8.2)/2.5)*.5*clamp(s.t/25); // the alkali spreads from the trail over about 25 s
 return <Frame><Defs/>
  <rect x="34" y="62" width="412" height="208" fill="rgba(186,230,253,.12)" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3"/><Lbl x={40} y={74} a="start">safety screen</Lbl>
  <rect x="62" y="172" width="356" height="94" fill="rgba(186,215,233,.45)"/><rect x="62" y="172" width="356" height="94" fill={`rgba(219,39,119,${pink})`}/>
  {on&&started&&<ellipse cx={x} cy="176" rx="46" ry="14" fill="rgba(219,39,119,.4)"/>}
  <path d="M60 140V262Q60 268 66 268H414Q420 268 420 262V140" {...GLASS} fill="none"/>
  {!started&&<g><path d={`M${x-4} 60L${x-1} 128M${x+4} 60L${x+1} 128`} stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"/><rect x={x-5} y="128" width="10" height="6" rx="1" fill={METAL[p.m]}/></g>}
  {started&&on&&<g>
   {p.m==='Li'?<rect x={x-r} y="169" width={2*r} height="5" rx="1.2" fill={METAL.Li} stroke="#6b7280" strokeWidth=".6"/>
    :<g><circle cx={x} cy="170" r={r*.8} fill={METAL[p.m]} stroke="#9ca3af" strokeWidth=".6"/><circle cx={x-r*.3} cy={170-r*.3} r={r*.25} fill="#fff" opacity=".8"/></g>}
   {s.fire&&<g className="flame"><path d={`M${x-r} 168Q${x-r-4} 148 ${x} 128Q${x+r+4} 148 ${x+r} 168Z`} fill="rgba(192,132,252,.75)"/><path d={`M${x-r*.5} 168Q${x-r*.5} 156 ${x} 146Q${x+r*.5} 156 ${x+r*.5} 168Z`} fill="rgba(233,213,255,.9)"/></g>}
   <Fizz x={x} y={172} n={p.m==='Li'?4:8} w={r*3}/></g>}
  <Lbl x={240} y={256}>{'water + phenolphthalein'}</Lbl>
 </Frame>;
}
const METAL={Li:'#b8bec6',Na:'#e5e7eb',K:'#d4d4d8'};

export const H2SOUND={pure:'squeak',air:'pop',o2:'bang',lean:null};
function H2({s,p,v}){
 const kind=H2SOUND[p.mix],u=clamp(s.t/1.2),sx=400-u*138,sy=250-u*36,fl=s.lit&&s.f<1,after=s.t>1.2;
 const col=kind==='bang'?'rgba(191,219,254,.95)':kind==='pop'?'rgba(253,186,116,.9)':'rgba(253,186,116,.8)',drops=after&&v.water>0?Math.min(16,Math.round(v.water*1.3)):0;
 return <Frame><Defs/>
  <rect x="110" y="262" width="110" height="8" rx="2" fill="#374151"/><rect x="146" y="66" width="5" height="196" fill="url(#metal2)"/>
  <rect x="148" y="116" width="92" height="5" rx="1" fill="#4b5563"/><rect x="232" y="111" width="36" height="15" rx="3" fill="none" stroke="#374151" strokeWidth="3"/>
  {fl&&(kind==='squeak'?<ellipse cx="250" cy="206" rx="13" ry="10" fill={col}/>:<rect x="238" y="74" width="24" height="134" rx="11" fill={col}/>)}
  {Array.from({length:drops}).map((_,i)=><circle key={i} cx={240+r01(i)*20} cy={84+r01(i+4)*110} r={1+r01(i+2)*1.2} fill="rgba(186,230,253,.9)" stroke="#64748b" strokeWidth=".3"/>)}
  <path d="M236 210V82A14 14 0 0 1 264 82V210" {...GLASS}/>
  {fl&&kind&&[0,1,2].slice(0,kind==='bang'?3:kind==='pop'?2:1).map(i=><path key={i} d={`M${232-i*12} ${222+i*6}Q${250} ${236+i*12} ${268+i*12} ${222+i*6}`} stroke="#b45309" strokeWidth="1.5" fill="none" opacity=".7"/>)}
  <line x1={sx} y1={sy} x2={sx+120} y2={sy+30} stroke="#b08850" strokeWidth="3" strokeLinecap="round"/>
  {!(after&&kind==='bang')&&<g className="flame flame-y"><path d={`M${sx-1} ${sy+2}Q${sx-7} ${sy-6} ${sx-3} ${sy-14}Q${sx+4} ${sy-6} ${sx+3} ${sy+2}Z`} fill="url(#yfl2)"/></g>}
  <Lbl x={250} y={66}>25 mL</Lbl>
 </Frame>;
}

function Methane({s,p,v}){
 const air={closed:0,half:.5,open:1}[p.air],soot=clamp(v.soot/40,0,.85),milk=v.lime/100;
 return <Frame><Defs/>
  <Burner x={160} air={air}/>
  <path d="M118 74L154 34V14H166V34L202 74Z" fill="rgba(241,245,249,.35)"/><path d="M124 72L156 37V16H164V37L196 72Z" fill={`rgba(28,25,23,${soot})`}/>
  <path d="M118 74L154 34V14M166 14V34L202 74" fill="none" stroke="#8796a6" strokeWidth="1.6"/>
  <path d="M154 14V8H380V140" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinejoin="round"/><path d="M380 140V244" stroke="#94a3b8" strokeWidth="3"/>
  <rect x="368" y="172" width="24" height="88" fill="rgba(226,240,250,.6)"/><rect x="368" y="172" width="24" height="88" fill={`rgba(255,255,255,${milk*.9})`}/>
  {s.t>0&&<Fizz x={380} y={240} n={7} h={-62} w={10}/>}
  <path d="M366 126V250A14 14 0 0 0 394 250V126" {...GLASS} fill="none"/>
  <Lbl x={380} y={118}>limewater</Lbl><Lbl x={214} y={62} a="start">cold funnel</Lbl><Lbl x={270} y={20}>gases drawn through by a pump</Lbl>
 </Frame>;
}

function Magnesium({s,p}){
 const cm=14,x0=168,bp=x0+(s.L-s.len)*cm,end=x0+s.L*cm,y=148,started=s.t>0;
 return <Frame><Defs/>
  <rect x="70" y="262" width="340" height="8" rx="1" fill="#a8a29e"/><Lbl x={78} y={258} a="start">heat-proof mat</Lbl>
  <Burner x={150} air={1}/>
  {bp>x0+1&&<path d={`M${x0} ${y}Q${(x0+bp)/2} ${y+10} ${bp} ${y}`} stroke="#f5f5f4" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="5 2"/>}
  {s.len>0&&<line x1={bp} y1={y} x2={end} y2={y} stroke="#c8cfd8" strokeWidth="3"/>}
  {!started&&<circle cx={x0} cy={y} r="3" fill="#fb923c" opacity=".8"/>}
  <path d={`M${end-4} ${y-2}L${end+130} ${y+28}M${end-4} ${y+2}L${end+130} ${y+38}`} stroke="#57534e" strokeWidth="3" strokeLinecap="round"/>
  {s.lit&&<><circle cx={bp} cy={y} r={p.glass?30:60} fill="url(#glow)" className="flame-y"/><Steam x={bp} y={y-24}/></>}
  {s.len<=0&&s.t>2&&<path d={`M${x0-6} 262Q${x0+10} 252 ${x0+30} 262Z`} fill="#fafaf9" stroke="#d6d3d1"/>}
  {p.glass&&<rect width="480" height="270" fill="rgba(30,64,175,.28)"/>}
 </Frame>;
}

function Neutral({s,v}){
 const c={id:'neutd',kind:'beaker',water:25+s.V,n:{univ:5,H:s.H,OH:s.OH},src:{},therm:true,stir:true,T:s.T},d={vol:c.water,color:colorOf(c,v.pH),gr:0,boiling:false,xtal:0};
 const b={vol:50-s.V,ch:'naoh1',tap:s.run?[0,.1,.5,2].indexOf(s.flow):0};
 return <div className="relative mx-auto h-[360px] w-[140px]"><BuretteSVG b={b} land={202+surfaceY(c)}/>
  <div className="absolute left-[2px] top-[345px] h-[3px] w-[136px] bg-white/90"/><div className="absolute left-2" style={{top:162}}><Vessel c={c} d={d}/></div></div>;
}

function Gold({s,p}){
 const tot=7.5e-4,mixed=s.t>=1.2,c={id:'goldd',kind:'beaker',water:100,n:{},src:{},therm:true,T:s.T},d={vol:100,color:'rgba(205,225,238,.3)',gr:0,boiling:s.T>94,xtal:0};
 const pw=s.pw/tot,np=Math.round(s.pl/tot*34),top=142-surfaceY(c),T=useT();
 return <div className="flex flex-col items-center"><div className="relative h-[190px] w-[120px]"><Vessel c={c} d={d}/>
  <svg width="120" height="190" viewBox="0 -40 120 190" className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
   {mixed&&pw>0&&Array.from({length:70}).map((_,i)=><circle key={i} cx={20+r01(i)*80} cy={142-r01(i*3+1)*top*(1-.5*r01(i+2))} r={.9+r01(i+5)} fill="#f4c430" opacity={clamp(pw*1.3)}/>)}
   {mixed&&pw>.02&&<rect x="16" y={142-top} width="88" height={top} fill={`rgba(250,204,21,${clamp(pw)*.45})`}/>}
   {Array.from({length:np}).map((_,i)=>{const x=22+r01(i+9)*76,y=140-r01(i*5+2)*top*.95,z=2+r01(i)*2.2;return <path key={i} d={`M${x-z} ${y}L${x-z/2} ${y-z*.8}H${x+z/2}L${x+z} ${y}L${x+z/2} ${y+z*.8}H${x-z/2}Z`} fill="#facc15" stroke="#b45309" strokeWidth=".4" className="glint" style={{animationDelay:r01(i+3)*2+'s'}}/>})}
  </svg></div>
  <div className={'mt-0.5 h-5 w-[150px] rounded-sm border border-stone-500 '+(p.hot?'bg-gradient-to-b from-stone-500 to-stone-700 shadow-[0_-3px_10px_rgba(239,68,68,.55)]':'bg-gradient-to-b from-stone-400 to-stone-600')}/>
  <div className="flex h-6 w-[170px] items-center justify-end gap-1.5 rounded-b-md bg-stone-700 px-2"><span className={'h-2 w-2 rounded-full '+(p.hot?'bg-rose-500':'bg-stone-500')}/><span className="font-mono text-[10px] text-stone-200">{p.hot?'95 °C':T('off')}</span></div></div>;
}

function Displace({s,p}){
 const c={id:'dispd',kind:'beaker',water:50,n:{Cu:s.Cu2},src:{},therm:true,T:s.T},d={vol:50,color:colorOf(c,null),gr:0,boiling:false,xtal:0};
 const f=s.Cu/(s.Cu+s.nM||1),fe=p.m==='Fe'?clamp((s.nM0-s.nM)/.018)*.35:0,mg=p.m==='Mg'&&s.Cu2>1e-4&&s.nM>0;
 return <div className="relative h-[190px] w-[120px]"><Vessel c={c} d={d}/>
  <svg width="120" height="190" viewBox="0 -40 120 190" className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
   {fe>0&&<rect x="16" y={surfaceY(c)} width="88" height={142-surfaceY(c)} fill={`rgba(132,204,22,${fe})`}/>}
   {s.t>.3&&<><path d="M30 142Q34 132 46 134Q60 128 74 134Q86 132 90 142Z" fill={DMET[p.m]} stroke="#64748b" strokeWidth=".5"/>
    <path d="M30 142Q34 132 46 134Q60 128 74 134Q86 132 90 142Z" fill="#8b4513" opacity={clamp(f)*.95}/>
    {Array.from({length:Math.round(clamp(f)*14)}).map((_,i)=><rect key={i} x={30+r01(i)*58} y={120+r01(i+6)*14} width="3" height="1.6" fill="#a0522d" transform={`rotate(${r01(i+2)*90} ${30+r01(i)*58} ${126})`}/>)}</>}
   {mg&&<Fizz x={60} y={128} n={6} h={-30} w={40}/>}
  </svg></div>;
}
const DMET={Mg:'#c8cfd8',Zn:'#98a2ad',Fe:'#52525b',Ag:'#d1d5db'};

const SCENE={toothpaste:Toothpaste,alkali:Alkali,h2comb:H2,ch4comb:Methane,mgburn:Magnesium,neut:Neutral,goldrain:Gold,displace:Displace};
const HTML={neut:1,goldrain:1,displace:1};
export default function DemoStage({d,s,p,v,run}){
 const S=SCENE[d.id];
 return HTML[d.id]?<div className="flex h-full flex-col"><div className="flex flex-1 items-end justify-center px-6 pt-6">
   <div style={{transform:d.id==='neut'?'none':'scale(1.25)',transformOrigin:'bottom center'}}><S s={{...s,run,flow:p.flow}} p={p} v={v}/></div></div>
   <div className="h-3 border-t-2 border-[#5a524a] bg-[#403a34]"/><div className="h-6 bg-[#332e29]"/></div>
  :<S s={s} p={p} v={v}/>;
}

// What a student would see right now, in words.
export function observe(d,s,p,v){
 const t=s.t>0;
 switch(d.id){
  case 'toothpaste':return !t?'Hydrogen peroxide, washing-up liquid and dye in a measuring cylinder.':p.cat==='none'?'Only a few tiny bubbles: without a catalyst the reaction is very slow.':s.n/s.n0<.02?'The reaction has finished. The foam is warm and full of oxygen.':s.rate>150?'Foam shoots out of the cylinder and steams.':s.rate>3?'Foam rises steadily up the cylinder.':'The reaction has finished. The foam is warm and full of oxygen.';
  case 'alkali':return !t?'A small piece of metal, held with tweezers above the water.':s.g<=0?'The metal has gone. The water is pink because it is now alkaline.':{Li:'Lithium floats and fizzes steadily. It does not melt.',Na:'Sodium melts into a silvery ball and skates across the water, fizzing.',K:'Potassium bursts into a lilac flame and races across the surface.'}[p.m];
  case 'h2comb':return s.t<1.2?'Bring a lit splint to the mouth of the tube.':{squeak:'A gentle squeaky pop. A few droplets of water form on the glass.',pop:'A sharp, loud pop. Droplets of water form on the glass.',bang:'A very loud bang that blows out the splint. Droplets of water form on the glass.',null:'Nothing happens: there is too little hydrogen to burn.'}[H2SOUND[p.mix]];
  case 'ch4comb':return ({open:'Roaring blue flame: complete combustion.',half:'Quieter blue flame with a yellow tip.',closed:'Tall, wavy yellow flame: incomplete combustion. Soot collects on the funnel.'})[p.air];
  case 'mgburn':return !t?'Hold the end of the ribbon in the blue flame.':s.lit?(p.glass?'Through blue glass you can see the ribbon burning away, leaving white ash.':'Dazzling white light and white smoke. Do not stare at it.'):s.len<=0?'Only white, crumbly magnesium oxide is left.':'The ribbon is heating up in the flame.';
  case 'neut':{const x=v.pH;return x<3?'Red: strongly acidic.':x<6?'Orange to yellow: weakly acidic.':x<8?'Green: neutral.':x<11?'Blue: weakly alkaline.':'Violet: strongly alkaline.'}
  case 'goldrain':return s.t<1.2?'Two colourless solutions: lead(II) nitrate and potassium iodide.':s.pl>s.pw&&s.pl>1e-5?'Glittering golden plates fall through the liquid.':s.pw>1e-5?'A bright yellow precipitate forms at once.':'Hot and almost colourless: the lead(II) iodide has dissolved.';
  case 'displace':return p.m==='Ag'?'No change: silver is less reactive than copper.':!t?'Blue copper(II) sulfate solution.':p.m==='Fe'?'A brown coat of copper forms and the solution slowly turns pale green.':'The blue colour fades and brown copper forms. The beaker gets warm.';
 }
}

// A pop, made from filtered noise: louder and sharper for better-mixed gas, with a whistle for pure hydrogen.
export function playPop(kind){
 try{const A=window.AudioContext||window.webkitAudioContext,ac=new A(),t=ac.currentTime,len=kind==='squeak'?.45:.35;
  const buf=ac.createBuffer(1,ac.sampleRate*len,ac.sampleRate),x=buf.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*(kind==='bang'?.06:.03)));
  const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=buf;f.type='lowpass';f.frequency.value=kind==='bang'?2400:1200;g.gain.value=kind==='bang'?1:kind==='pop'?.6:.25;
  src.connect(f).connect(g).connect(ac.destination);src.start(t);
  if(kind==='squeak'){const o=ac.createOscillator(),og=ac.createGain();o.frequency.setValueAtTime(1300,t);o.frequency.exponentialRampToValueAtTime(500,t+.3);og.gain.setValueAtTime(.12,t);og.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(og).connect(ac.destination);o.start(t);o.stop(t+.36)}
  setTimeout(()=>ac.close(),1000)}catch(e){}
}
