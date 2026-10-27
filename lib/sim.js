import { AMB, CAP, MM, TAP, add, heatCap, hplus, isC, pHof, solCuSO4, solNH4Cl, weakH } from './chem';

// Kinetic reactions with acid: [solid, rate constant, heat released J/mol, gas, ion formed].
// Rate = k · n^(2/3) (surface area) · [H⁺] · Arrhenius(Ea = 50 kJ/mol). Weak acids such as vinegar react too, more slowly.
const RX=[['Mg',1.6e-3,466850,'H2','Mg2'],['Zn',1.3e-4,153900,'H2','Zn2'],['CaCO3',8.6e-4,15000,'CO2','Ca']];
export const SUB=.5; // largest physics step, simulated seconds
const LOG=2; // seconds between logged readings

// Heat a Bunsen flame delivers to whatever stands on its gauze, in W. A yellow flame is cooler.
export const burnerPower=b=>b&&b.kind==='bunsen'&&b.gas>0?b.gas/10*(b.air?450:220):0;

// Advances one container by dt simulated seconds while P watts of heat reach it from below.
export function physics(c0,dt,P){
 const c={...c0,n:{...c0.n},gas:{...c0.gas}},n=c.n;let q=P*dt,x;
 c.rH2=0;c.rCO2=0;
 // Fast reactions: neutralisation, then copper(II) hydroxide precipitating in alkali or dissolving in acid.
 x=Math.min(n.H||0,n.OH||0);if(x>0){n.H-=x;n.OH-=x;q+=57100*x}
 x=Math.min(n.Cu||0,(n.OH||0)/2);if(x>0){n.Cu-=x;n.OH-=2*x;n.CuOH2=(n.CuOH2||0)+x}
 x=Math.min(n.CuOH2||0,(n.H||0)/2);if(x>0){n.CuOH2-=x;n.H-=2*x;n.Cu=(n.Cu||0)+x}
 if(c.water>.5){
  const L=c.water/1000,ar=Math.exp(-6014*(1/(c.T+273.15)-1/298.15))*(c.stir?1.5:1);
  for(const [s,k,dH,g,ion] of RX){
   const m=n[s]||0;if(m<=0)continue;if(m<1e-7){n[s]=0;continue}
   const h=hplus(n,c.water,c.T),H=n.H||0;
   x=Math.min(m,(H+weakH(n,h))/2,k*Math.pow(m,2/3)*h*ar*dt);if(x<=0)continue;
   // Protons come from strong acid first; the rest from weak acids, whose anions the metal ion now balances.
   n[s]-=x;n.H=Math.max(0,H-2*x);n.B=(n.B||0)+Math.max(0,2*x-H);n[ion]=(n[ion]||0)+x;c.gas[g]+=x;c.mass-=x*MM[g];q+=dH*x;c['r'+g]+=x/dt;
  }
  const s=n.NH4Cls||0;
  if(s>0){x=Math.min(s,Math.max(0,solNH4Cl(c.T)*c.water/100/MM.NH4Cl-(n.NH4||0)),8e-3*Math.pow(s,2/3)*(c.stir?3:1)*dt);
   if(x>0){n.NH4Cls-=x;n.NH4=(n.NH4||0)+x;n.Cl=(n.Cl||0)+x;q-=14780*x}}
 }
 // Copper(II) sulfate crystallises as CuSO₄·5H₂O once the water can hold no more, and redissolves if it can.
 const dis=Math.min(n.Cu||0,n.SO4||0),cap=solCuSO4(c.T)*Math.max(c.water,0)/100/MM.CuSO4;
 if(dis>cap){x=Math.min((dis-cap)*Math.min(1,dt/12),c.water/90.08);if(x>0){n.Cu-=x;n.SO4-=x;n.Xtal=(n.Xtal||0)+x;c.water-=x*90.08}}
 else if((n.Xtal||0)>0&&c.water>.5&&!c.anh){x=Math.min(n.Xtal,(cap-dis)*Math.min(1,dt/6));n.Xtal-=x;n.Cu+=x;n.SO4+=x;c.water+=x*90.08}
 // Heat balance: losses to the room, evaporation from the surface, and a boiling plateau at 100 °C.
 const C=heatCap(c),hA=(c.kind==='beaker'?1:.8)*(.6+.008*Math.max(c.water,0));
 q-=hA*(c.T-AMB)*dt;
 if(c.water>0&&c.T>40){x=Math.min(c.water,(c.kind==='beaker'?.014:.004)*Math.exp((c.T-100)/14)*dt);c.water-=x;c.mass-=x;q-=x*2260}
 let T=c.T+q/C;c.boil=0;
 if(c.water>0&&T>100){x=Math.min(c.water,(T-100)*C/2260);c.water-=x;c.mass-=x;c.boil=x/dt;T=100}
 if(c.water<=.05){c.water=0;const d=Math.min(n.Cu||0,n.SO4||0);if(d>0){n.Cu-=d;n.SO4-=d;n.Xtal=(n.Xtal||0)+d}if(T>150&&n.Xtal>0)c.anh=true}
 c.T=Math.min(T,450);c.hi=Math.max(c.hi,c.T);c.lo=Math.min(c.lo,c.T);
 return c;
}

function step(items,dt,naohC){
 const by=new Map(items.map(i=>[i.id,i]));
 // Burettes drain into whatever stands under them; with nothing there the acid spills and the tap is closed.
 for(const b0 of items){
  if(b0.kind!=='burette'||!b0.tap)continue;
  const b=by.get(b0.id),c=items.find(i=>isC(i)&&i.at===b.id),v=Math.min(b.vol,TAP[b.tap]*dt);
  if(!b.ch||v<=0){by.set(b.id,{...b,tap:0});continue}
  if(!c){by.set(b.id,{...b,tap:0,msg:'spill',msgN:(b.msgN||0)+1});continue}
  const cc=by.get(c.id);
  if(cc.water+v>CAP){by.set(b.id,{...b,tap:0,msg:'full',msgN:(b.msgN||0)+1});continue}
  by.set(b.id,{...b,vol:b.vol-v});by.set(c.id,add(cc,b.ch,v,naohC));
 }
 for(const i of items)if(isC(i))by.set(i.id,physics(by.get(i.id),dt,burnerPower(by.get(i.at))));
 return items.map(i=>by.get(i.id));
}

// Advances the whole lab by dt simulated seconds, logging readings every LOG seconds.
export function advance(lab,dt,naohC){
 let {items,t}=lab;
 while(dt>1e-9){
  const h=Math.min(SUB,dt);dt-=h;items=step(items,h,naohC);
  const nt=t+h;
  if(Math.floor(nt/LOG)>Math.floor(t/LOG))items=items.map(c=>isC(c)?{...c,log:[...c.log.slice(-299),[nt,c.T,c.water>.5?pHof(c.n,c.water,c.T):null,c.glass+c.mass]]}:c);
  t=nt;
 }
 return {...lab,items,t};
}
