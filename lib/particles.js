// Atomic-scale view: a 2D collision-theory simulation. Molecules move with thermal speeds, bounce elastically,
// and react only when they meet a matching elementary step with enough energy along the line of centres.
// Atoms are never created or destroyed: products are built from the reactants' own atoms.

// Element: [radius px, mass u, fill, outline], close to the standard CPK colours.
export const EL={H:[7,1,'#f1f5f9','#94a3b8'],C:[11,12,'#52525b','#d4d4d8'],N:[10.5,14,'#3b5bdb','#1e3a8a'],O:[10,16,'#e03131','#7f1d1d'],
 Li:[11,7,'#c084fc','#6b21a8'],Na:[13,23,'#9b5de5','#4c1d95'],Mg:[12,24,'#8fb339','#3f6212'],S:[12,32,'#e6c229','#854d0e'],Cl:[12,35.5,'#2f9e44','#14532d'],
 K:[15,39,'#7e3fbf','#3b0764'],Fe:[12,56,'#d9622b','#7c2d12'],Cu:[12,63.5,'#c87533','#7c3f12'],Zn:[12,65.4,'#8189b0','#3f4565'],Ag:[13,108,'#cbd5e1','#64748b'],
 I:[15,127,'#9d3bb0','#4a044e'],Pb:[15,207,'#6b6e76','#27272a']};

// Species: f formula, a atoms [element, x, y] in the molecule's frame, q charge, rad radical,
// gas (rises and escapes from a liquid), sink (settles as a precipitate), fixed (part of a solid lattice).
export const SP={
 H2:{f:'H₂',a:[['H',-4.5,0],['H',4.5,0]],gas:1},O2:{f:'O₂',a:[['O',-6.5,0],['O',6.5,0]],gas:1},N2:{f:'N₂',a:[['N',-6,0],['N',6,0]]},
 H2O:{f:'H₂O',a:[['O',0,-2],['H',-8,5],['H',8,5]]},H2O2:{f:'H₂O₂',a:[['O',-6.5,0],['O',6.5,0],['H',-11,-8],['H',11,8]]},
 OH:{f:'OH·',a:[['O',-2,0],['H',8,0]],rad:1},'OH-':{f:'OH⁻',a:[['O',-2,0],['H',8,0]],q:-1},H:{f:'H·',a:[['H',0,0]],rad:1},O:{f:'O·',a:[['O',0,0]],rad:1},
 'H3O+':{f:'H₃O⁺',a:[['O',0,0],['H',-8,5],['H',8,5],['H',0,-9.5]],q:1},'I-':{f:'I⁻',a:[['I',0,0]],q:-1},'IO-':{f:'IO⁻',a:[['I',-5,0],['O',12,0]],q:-1},
 'K+':{f:'K⁺',a:[['K',0,0]],q:1},'Na+':{f:'Na⁺',a:[['Na',0,0]],q:1},'Li+':{f:'Li⁺',a:[['Li',0,0]],q:1},'Cl-':{f:'Cl⁻',a:[['Cl',0,0]],q:-1},
 CH4:{f:'CH₄',a:[['C',0,0],['H',-11,0],['H',11,0],['H',0,-11],['H',0,11]]},CH2O:{f:'CH₂O',a:[['C',-3,0],['O',10,0],['H',-11,-8],['H',-11,8]]},
 CO:{f:'CO',a:[['C',-6,0],['O',7,0]]},CO2:{f:'CO₂',a:[['C',0,0],['O',-13,0],['O',13,0]],gas:1},MgO:{f:'MgO',a:[['Mg',-6,0],['O',8,0]]},
 'Pb2+':{f:'Pb²⁺',a:[['Pb',0,0]],q:2},'PbI+':{f:'PbI⁺',a:[['Pb',-8.5,0],['I',8.5,0]],q:1},'PbI2(s)':{f:'PbI₂',a:[['I',-17,0],['Pb',0,0],['I',17,0]],sink:1},
 'NO3-':{f:'NO₃⁻',a:[['N',0,0],['O',0,-11],['O',9.5,5.5],['O',-9.5,5.5]],q:-1},'SO42-':{f:'SO₄²⁻',a:[['S',0,0],['O',0,-12],['O',12,0],['O',0,12],['O',-12,0]],q:-2},
 'Cu2+':{f:'Cu²⁺',a:[['Cu',0,0]],q:2},'Zn2+':{f:'Zn²⁺',a:[['Zn',0,0]],q:2},'Fe2+':{f:'Fe²⁺',a:[['Fe',0,0]],q:2},'Mg2+':{f:'Mg²⁺',a:[['Mg',0,0]],q:2},
 'Li(s)':{f:'Li',a:[['Li',0,0]],fixed:1},'Na(s)':{f:'Na',a:[['Na',0,0]],fixed:1},'K(s)':{f:'K',a:[['K',0,0]],fixed:1},'Mg(s)':{f:'Mg',a:[['Mg',0,0]],fixed:1},
 'Zn(s)':{f:'Zn',a:[['Zn',0,0]],fixed:1},'Fe(s)':{f:'Fe',a:[['Fe',0,0]],fixed:1},'Ag(s)':{f:'Ag',a:[['Ag',0,0]],fixed:1},'Cu(s)':{f:'Cu',a:[['Cu',0,0]],fixed:1}};
for(const s of Object.values(SP)){s.m=s.a.reduce((m,[e])=>m+EL[e][1],0);s.r=Math.max(...s.a.map(([e,x,y])=>Math.hypot(x,y)+EL[e][0]))}

export const WW=720,WH=400; // world size in px
export const KT=365; // kinetic energy per kelvin, u·px²/s²: water moves at about 110 px/s at 25 °C
const T0=298.15,E0=KT*T0; // step energies are given in units of kT at 25 °C
const TW=.45; // seconds for atoms to move into their new molecule
const gauss=()=>Math.sqrt(-2*Math.log(Math.random()||1e-9))*Math.cos(2*Math.PI*Math.random());
const key=(a,b)=>a<b?a+'|'+b:b+'|'+a;

// spec: {init:[[sp,n]], surf:{sp,cols,rows}, steps:[{r:[a,b],p:[...],ea,dh}], uni:[{r,p,A,ea}], liquid, T (°C), tau (s, null = insulated)}
export function makeWorld(spec){
 const W={spec,bodies:[],t:0,id:0,T:spec.T+273.15,Tm:spec.T+273.15,Ts:spec.T+273.15,tau:spec.tau,events:[],esc:{},escN:{},hist:[],lastH:-1,flash:[],steps:new Map(),uni:new Map()};
 for(const s of spec.steps)W.steps.set(key(s.r[0],s.r[1]),s);
 for(const u of spec.uni||[])W.uni.set(u.r,u);
 if(spec.surf){const {sp,rows}=spec.surf,d=2*EL[SP[sp].a[0][0]][0]-2,cols=spec.surf.cols||Math.floor((WW-d)/d),x0=WW/2-(cols-1)*d/2;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)W.bodies.push(body(W,sp,x0+i*d+(j%2)*d/2,WH-d/2-2-j*d*.87,0,0))}
 for(const [sp,n] of spec.init)for(let k=0;k<n;k++){
  const r=SP[sp].r;let x,y,ok=false;
  for(let tries=0;tries<200&&!ok;tries++){x=r+Math.random()*(WW-2*r);y=r+Math.random()*(WH-2*r-(spec.surf?spec.surf.rows*26+10:0));ok=W.bodies.every(b=>Math.hypot(b.x-x,b.y-y)>b.r+r+2)}
  const b=body(W,sp,x,y);thermal(b,W.T);W.bodies.push(b);
 }
 W.atoms0=atoms(W);
 return W;
}
function body(W,sp,x,y,vx=0,vy=0){const S=SP[sp];return {id:++W.id,sp,x,y,vx,vy,a:S.fixed?0:Math.random()*6.283,w:S.fixed?0:gauss()*1.5,m:S.m,r:S.r,fixed:!!S.fixed,from:null,tw:1,hl:0}}
function thermal(b,T){const s=Math.sqrt(KT*T/b.m);b.vx=gauss()*s;b.vy=gauss()*s}

export function atoms(W){const c={...W.esc};for(const b of W.bodies)for(const [e] of SP[b.sp].a)c[e]=(c[e]||0)+1;return c}
export function counts(W){const c={...W.escN};for(const b of W.bodies)c[b.sp]=(c[b.sp]||0)+1;return c}
// Measured temperature: mean translational kinetic energy of the moving particles (2D: ⟨E⟩ = kT).
// Rising bubbles and settling crystals are driven by buoyancy and gravity, so they are left out.
const free=(W,b)=>!b.fixed&&!(W.spec.liquid&&SP[b.sp].gas)&&!SP[b.sp].sink;
const measure=W=>{let e=0,n=0;for(const b of W.bodies)if(free(W,b)){e+=.5*b.m*(b.vx*b.vx+b.vy*b.vy);n++}return n?e/n/KT:W.T};

// Builds the products of step st from the atoms of reactants rs, conserving momentum and adding the reaction energy.
function react(W,rs,st,x,y){
 const pool=[];
 for(const B of rs){const c=Math.cos(B.a),s=Math.sin(B.a);B.dead=true;
  for(const [e,ax,ay] of SP[B.sp].a)pool.push({e,x:B.x+ax*c-ay*s,y:B.y+ax*s+ay*c,used:false})}
 const site=rs.find(B=>B.fixed),mob=rs.filter(B=>!B.fixed);
 let P=[0,0],E=-st.dh*E0;for(const B of mob){P[0]+=B.m*B.vx;P[1]+=B.m*B.vy;E+=.5*B.m*(B.vx*B.vx+B.vy*B.vy)}
 const prods=st.p.map(sp=>{
  const S=SP[sp],pick=[];
  for(const [e] of S.a){let best=null,bd=1e18;const ref=pick[0]||null;
   for(const q of pool)if(!q.used&&q.e===e){const d=ref?(q.x-ref.x)**2+(q.y-ref.y)**2:0;if(d<bd){bd=d;best=q}if(!ref)break}
   best.used=true;pick.push(best)}
  const cx=S.fixed&&site?site.x:pick.reduce((s,q)=>s+q.x,0)/pick.length,cy=S.fixed&&site?site.y:pick.reduce((s,q)=>s+q.y,0)/pick.length;
  const b=body(W,sp,cx,cy);b.a=S.fixed?0:Math.random()*6.283;b.from=pick.map(q=>[q.x-cx,q.y-cy]);b.tw=0;b.hl=1.6;return b});
 const mp=prods.filter(b=>!b.fixed),M=mp.reduce((s,b)=>s+b.m,0);
 if(mp.length){
  const V=site?[0,0]:[P[0]/M,P[1]/M];let rel=E-(site?0:.5*M*(V[0]**2+V[1]**2));
  if(mp.length===1){
   // An association needs a third body to carry away the energy: give it to the nearest neighbour.
   const b=mp[0];
   if(site){const s=Math.sqrt(2*Math.max(rel,0)/b.m);b.vx=gauss()*s*.4;b.vy=-Math.abs(s)}else{b.vx=V[0];b.vy=V[1]}
   if(!site&&rel>0){let n=null,nd=1e18;for(const o of W.bodies)if(!o.dead&&!o.fixed){const d=(o.x-x)**2+(o.y-y)**2;if(d<nd){nd=d;n=o}}
    if(n){const e=.5*n.m*(n.vx**2+n.vy**2)+rel,v=Math.hypot(n.vx,n.vy)||1,s=Math.sqrt(2*e/n.m)/v;n.vx*=s;n.vy*=s}}
  }else{
   const u=mp.map(b=>{const a=Math.random()*6.283;return [Math.cos(a)/Math.sqrt(b.m),Math.sin(a)/Math.sqrt(b.m)]});
   const um=[0,1].map(k=>u.reduce((s,q,i)=>s+mp[i].m*q[k],0)/M);u.forEach(q=>{q[0]-=um[0];q[1]-=um[1]});
   const eu=u.reduce((s,q,i)=>s+.5*mp[i].m*(q[0]**2+q[1]**2),0)||1,f=Math.sqrt(Math.max(rel,0)/eu);
   mp.forEach((b,i)=>{b.vx=V[0]+u[i][0]*f;b.vy=V[1]+u[i][1]*f;if(site&&b.vy>0)b.vy=-b.vy});
  }
 }
 W.bodies.push(...prods);W.events.push({t:W.t,x,y,st,ids:prods.map(b=>b.id)});if(W.events.length>40)W.events.shift();
 W.flash.push({x,y,t:0});
 return prods;
}

function collide(W,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1e-6,ov=a.r+b.r-d;if(ov<=0)return;
 if(a.fixed&&b.fixed)return;
 // A settling crystal stops when it lands on the pile.
 if(SP[a.sp].sink&&SP[b.sp].sink&&a.fixed!==b.fixed){const m=a.fixed?b:a;m.fixed=true;m.vx=m.vy=m.w=0;return}
 const nx=dx/d,ny=dy/d,vr=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
 if(vr<0&&a.tw>=1&&b.tw>=1){
  const st=W.steps.get(key(a.sp,b.sp));
  if(st){const mu=a.fixed?b.m:b.fixed?a.m:a.m*b.m/(a.m+b.m);
   if(.5*mu*vr*vr>=st.ea*E0&&Math.random()<(st.pf??1)){react(W,[a,b],st,(a.x+b.x)/2,(a.y+b.y)/2);return}}
  if(a.fixed){b.vx-=2*vr*nx;b.vy-=2*vr*ny}
  else if(b.fixed){a.vx+=2*vr*nx;a.vy+=2*vr*ny}
  else{const j=2*vr/(1/a.m+1/b.m);a.vx+=j/a.m*nx;a.vy+=j/a.m*ny;b.vx-=j/b.m*nx;b.vy-=j/b.m*ny}
 }
 // Push apart so particles never sit inside each other.
 if(a.fixed){b.x+=nx*ov;b.y+=ny*ov}else if(b.fixed){a.x-=nx*ov;a.y-=ny*ov}
 else{const ia=1/a.m,ib=1/b.m,s=ov/(ia+ib);a.x-=nx*s*ia;a.y-=ny*s*ia;b.x+=nx*s*ib;b.y+=ny*s*ib}
}

// Advances the world by dt seconds of simulated time.
export function stepWorld(W,dt){
 const n=Math.max(1,Math.ceil(dt/.004)),h=dt/n,liq=W.spec.liquid;
 for(let k=0;k<n;k++){
  const B=W.bodies;
  for(const b of B){
   if(b.tw<1){b.tw=Math.min(1,b.tw+h/TW);if(b.tw>=1)b.from=null}
   if(b.hl>0)b.hl-=h;
   if(b.fixed)continue;
   const S=SP[b.sp];
   // Bubbles rise and crystals settle at a steady speed, as drag in the liquid allows.
   if(liq&&S.gas){b.vy+=(-110-b.vy)*Math.min(1,2*h);b.vx*=1-Math.min(1,h)}
   if(S.sink){b.vy+=(28-b.vy)*Math.min(1,3*h);b.vx*=1-Math.min(1,3*h)}
   b.x+=b.vx*h;b.y+=b.vy*h;b.a+=b.w*h;
   if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)}else if(b.x>WW-b.r){b.x=WW-b.r;b.vx=-Math.abs(b.vx)}
   if(b.y<b.r){if(liq&&S.gas&&b.tw>=1){b.dead=true;for(const [e] of S.a)W.esc[e]=(W.esc[e]||0)+1;W.escN[b.sp]=(W.escN[b.sp]||0)+1;continue}b.y=b.r;b.vy=Math.abs(b.vy)}
   else if(b.y>WH-b.r){b.y=WH-b.r;b.vy=-Math.abs(b.vy);if(S.sink){b.fixed=true;b.vx=b.vy=b.w=0}}
  }
  for(let i=0;i<B.length;i++){const a=B[i];if(a.dead)continue;
   for(let j=i+1;j<B.length;j++){const b=B[j];if(b.dead)continue;
    if(Math.abs(b.x-a.x)>a.r+b.r||Math.abs(b.y-a.y)>a.r+b.r)continue;
    collide(W,a,b);if(a.dead)break}}
  // One-particle steps, such as a precipitate redissolving when hot.
  if(W.uni.size)for(const b of W.bodies){const u=!b.dead&&W.uni.get(b.sp);if(!u)continue;
   // These depend on the temperature of the solution, which the surroundings hold at W.T.
   if(Math.random()<u.A*Math.exp(-u.ea*T0/W.T)*h){const ps=react(W,[b],u,b.x,b.y);for(const p of ps){thermal(p,W.T);if(p.y>WH-p.r-1)p.vy=-Math.abs(p.vy)}}}
  if(W.bodies.some(b=>b.dead))W.bodies=W.bodies.filter(b=>!b.dead);
  // Exchange heat with the surroundings (a weak thermostat), unless insulated.
  W.Tm=measure(W);W.Ts+=(W.Tm-W.Ts)*Math.min(1,h/1.5); // Ts: smoothed reading for display
  if(W.tau){const l=Math.sqrt(Math.max(.64,Math.min(1.5625,1+h/W.tau*(W.T/Math.max(W.Tm,1)-1))));for(const b of W.bodies)if(free(W,b)){b.vx*=l;b.vy*=l}}
  W.t+=h;
 }
 for(const f of W.flash)f.t+=dt;W.flash=W.flash.filter(f=>f.t<.5);
 if(Math.floor(W.t/.25)>W.lastH){W.lastH=Math.floor(W.t/.25);W.hist.push([W.t,counts(W),W.Ts]);if(W.hist.length>480)W.hist.shift()}
 if(process.env.NODE_ENV!=='production'){const a=atoms(W);for(const e in W.atoms0)console.assert(a[e]===W.atoms0[e],'Atoms not conserved: '+e)}
}

// Gives the particles near (x, y) a burst of energy, like a spark or a lit splint.
export function spark(W,x,y,R=120,e=40){for(const b of W.bodies)if(!b.fixed&&Math.hypot(b.x-x,b.y-y)<R){const s=Math.sqrt(2*e*E0/b.m),a=Math.random()*6.283;b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s}W.flash.push({x,y,t:0,big:1})}
export const setTemp=(W,c)=>{W.T=c+273.15};

// Atom sprites with soft 3D shading, cached per element and pixel ratio.
const SPR=new Map();
function sprite(e,px){const k=e+px;if(SPR.has(k))return SPR.get(k);
 const [r,,fill,line]=EL[e],s=Math.ceil((r+1)*2*px),c=document.createElement('canvas');c.width=c.height=s;const g=c.getContext('2d'),R=r*px,m=s/2;
 const gr=g.createRadialGradient(m-R*.35,m-R*.4,R*.1,m,m,R);gr.addColorStop(0,'#fff');gr.addColorStop(.28,fill);gr.addColorStop(1,shade(fill));
 g.fillStyle=gr;g.beginPath();g.arc(m,m,R,0,7);g.fill();g.lineWidth=Math.max(1,px*.8);g.strokeStyle=line;g.stroke();SPR.set(k,c);return c}
const shade=h=>{const n=parseInt(h.slice(1),16),f=x=>Math.round(x*.55);return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`};
const ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
const qs=q=>q===1?'+':q===-1?'−':q>0?q+'+':-q+'−';

// Draws the world. px is the canvas pixels per world px; bg the liquid tint (or null for a gas).
export function draw(ctx,W,px,{bg,labels,focus}){
 ctx.setTransform(px,0,0,px,0,0);
 ctx.fillStyle='#0c1f1e';ctx.fillRect(0,0,WW,WH);
 if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,WW,WH)}
 ctx.strokeStyle='rgba(94,234,212,.06)';ctx.lineWidth=1;ctx.beginPath();for(let x=40;x<WW;x+=40){ctx.moveTo(x,0);ctx.lineTo(x,WH)}for(let y=40;y<WH;y+=40){ctx.moveTo(0,y);ctx.lineTo(WW,y)}ctx.stroke();
 for(const f of W.flash){const a=1-f.t/.5,R=(f.big?60:14)+f.t*(f.big?160:70);const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,R);g.addColorStop(0,`rgba(253,230,138,${.75*a})`);g.addColorStop(1,'rgba(253,230,138,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,R,0,7);ctx.fill()}
 const list=[...W.bodies].sort((a,b)=>(a.fixed?0:1)-(b.fixed?0:1));
 for(const b of list){
  const S=SP[b.sp],c=Math.cos(b.a),s=Math.sin(b.a),k=b.tw<1?ease(b.tw):1,dim=focus&&!focus.has(b.id);
  ctx.globalAlpha=dim?.28:1;
  const pts=S.a.map(([e,x,y],i)=>{let X=x*c-y*s,Y=x*s+y*c;if(b.from&&k<1){X=b.from[i][0]+(X-b.from[i][0])*k;Y=b.from[i][1]+(Y-b.from[i][1])*k}return [e,b.x+X,b.y+Y]});
  for(const [e,X,Y] of [...pts].sort((p,q)=>EL[q[0]][0]-EL[p[0]][0])){const im=sprite(e,px),h=im.width/px/2;ctx.drawImage(im,X-h,Y-h,h*2,h*2)}
  if(b.hl>0&&!b.fixed){ctx.strokeStyle=`rgba(184,151,90,${Math.min(1,b.hl)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r+4,0,7);ctx.stroke()}
  if(S.q){const x=b.x+b.r*.72,y=b.y-b.r*.72;ctx.fillStyle=S.q>0?'#0f766e':'#b45309';ctx.beginPath();ctx.arc(x,y,6.5,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 9px ui-monospace,monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(qs(S.q),x,y+.5)}
  if(S.rad){ctx.fillStyle='#fde68a';ctx.beginPath();ctx.arc(b.x+b.r*.8,b.y-b.r*.6,2.6,0,7);ctx.fill()}
  if(labels&&!b.fixed&&b.tw>=1){ctx.fillStyle='rgba(255,253,249,.82)';ctx.font='10px ui-monospace,monospace';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(S.f,b.x,b.y+b.r+2)}
 }
 ctx.globalAlpha=1;
}
