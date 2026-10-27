import { AMB, pHof } from './chem';

// Reaction demonstrations. Each one has a bench-scale model (real amounts, enthalpies and rates) and an atomic-scale model.
// Bench model: init(p) → state, step(s, dt, p) → state, vals(s, p) → numbers shown in `rd`, done(s) → finished.
// Atomic model: atom(p) → particle world spec (see lib/particles.js). Step energies there are in kT at 25 °C,
// scaled down so reactions happen in seconds; the energy diagram uses the real values in kJ/mol.

const R=8.314,VM=24.8; // gas constant; molar volume in L at 28 °C and 1 atm
const arr=(Ea,T)=>Math.exp(-Ea/R*(1/(T+273.15)-1/(AMB+273.15)));
const interp=(x,t)=>{if(x<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(x<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return t[t.length-1][1]};
// Heat q (J) into a liquid of heat capacity C (J/K), with losses to the room and a boiling plateau at 100 °C.
const heat=(T,q,C,dt,loss=.004)=>Math.min(100,T+q/C-(T-AMB)*loss*dt);

export const TYPES=['Decomposition','Metal and water','Combustion','Synthesis','Neutralisation','Precipitation','Displacement'];

export const DEMOS=[
 {id:'toothpaste',type:'Decomposition',name:'Elephant toothpaste',level:'Upper secondary',teacher:true,icon:'foam',
  eq:'2H₂O₂(aq) → 2H₂O(l) + O₂(g)   catalyst: I⁻',
  desc:'Hydrogen peroxide breaks down into water and oxygen. A catalyst makes it happen in seconds, and washing-up liquid traps the oxygen as a column of hot foam.',
  note:'30 % hydrogen peroxide burns skin and the foam can be hot. Teacher demonstration only: wear gloves and goggles, and use a tray.',
  ctl:[['conc','Hydrogen peroxide',[[3,'3 %'],[6,'6 %'],[30,'30 %']],30],['cat','Catalyst',[['none','None'],['yeast','Yeast (catalase)'],['KI','Potassium iodide']],'KI']],
  rd:[['V','Oxygen released','L',2],['T','Temperature','°C',1],['left','Hydrogen peroxide left','%',0]],
  init:p=>{const rho=p.conc===30?1.11:1,n=50*rho*p.conc/100/34.01;return {t:0,n,n0:n,O2:0,T:AMB,C:(50*rho+15)*4.18,rate:0}},
  // First order in H₂O₂, but never faster than the catalyst can turn it over (vmax, mol/s).
  step:(s,dt,p)=>{const [k,Ea,vmax]={none:[2e-6,75000,1],yeast:[.12,23000,.03],KI:[.22,56000,.05]}[p.cat],x=Math.min(s.n*(1-Math.exp(-k*arr(Ea,s.T)*dt)),vmax*dt);
   return {...s,t:s.t+dt,n:s.n-x,O2:s.O2+x/2,T:heat(s.T,98200*x,s.C,dt),rate:x/2*VM*1000/dt}},
  vals:s=>({V:s.O2*VM,T:s.T,left:s.n/s.n0*100}),
  done:s=>s.n/s.n0<.01||s.t>(s.rate<.05&&s.t>15?15:120),
  pred:['What will potassium iodide do to the hydrogen peroxide?',['Nothing: it is only there to colour the foam','Speed up its breakdown without being used up','React with it to make iodine gas'],1],
  explain:'Iodide ions are a catalyst. They give the reaction a new route with a lower activation energy (56 kJ/mol instead of 75 kJ/mol), so many more collisions succeed. Iodide is turned into IO⁻ and then back into I⁻, so it is not used up. The breakdown releases 98 kJ for every mole of H₂O₂, which is why the foam steams. 50 mL of 30 % H₂O₂ gives about 6 L of oxygen.',
  energy:{r:'2H₂O₂',p:'2H₂O + O₂',ea:75,eac:56,dh:-196},
  atom:p=>({liquid:1,T:25,tau:1,init:[['H2O2',24],['H2O',10],...(p.cat==='none'?[]:[['I-',7],['K+',7]])],
   steps:[{r:['H2O2','H2O2'],p:['H2O','H2O','O2'],ea:7,dh:-1},{r:['H2O2','I-'],p:['H2O','IO-'],ea:1.8,dh:-.3},{r:['H2O2','IO-'],p:['H2O','O2','I-'],ea:1.2,dh:-.7}],
   track:['H2O2','O2','I-','IO-']})},

 {id:'alkali',type:'Metal and water',name:'Alkali metals in water',level:'Lower secondary',teacher:true,icon:'drop',
  eq:'2M(s) + 2H₂O(l) → 2MOH(aq) + H₂(g)   (M = Li, Na, K)',
  desc:'Drop a small piece of lithium, sodium or potassium onto water with phenolphthalein. Each fizzes out hydrogen and leaves an alkaline trail, and the reaction gets more violent down Group 1.',
  note:'Use a rice-grain-sized piece, a safety screen and a large trough of water. Never touch alkali metals with your hands.',
  ctl:[['m','Metal',[['Li','Lithium'],['Na','Sodium'],['K','Potassium']],'Na'],['g','Piece',[[.05,'0.05 g'],[.1,'0.10 g']],.1]],
  rd:[['H2','Hydrogen released','mL',1],['pH','pH of the water','',2],['T','Water temperature','°C',2],['left','Metal left','mg',1]],
  init:p=>({t:0,g:p.g,g0:p.g,H2:0,OH:0,T:AMB,x:.25,v:0,fire:false}),
  step:(s,dt,p)=>{const M=ALK[p.m],dg=Math.min(s.g,M.k*Math.cbrt(s.g0)*Math.pow(s.g,2/3)*dt),dn=dg/M.mm;
   let v=s.v+(Math.random()-.5)*M.k*18*dt-s.v*.8*dt,x=s.x+v*dt;if(x<.08||x>.92){v=-v;x=Math.max(.08,Math.min(.92,x))}
   const g=s.g-dg<1e-6?0:s.g-dg;
   return {...s,t:s.t+dt,g,H2:s.H2+dn/2,OH:s.OH+dn,T:heat(s.T,-M.dh*dn,500*4.18,dt,0),x,v,rate:dn/dt,fire:p.m==='K'&&g>0}},
  vals:s=>({H2:s.H2*VM*1000,pH:pHof({OH:s.OH},500,s.T),T:s.T,left:s.g*1000}),
  done:s=>s.g<=0,
  pred:['Which metal will react most violently with water?',['Lithium','Sodium','Potassium'],2],
  explain:'All three lose their single outer electron to water, making M⁺ ions, hydroxide ions (so phenolphthalein turns pink) and hydrogen gas. Going down Group 1 the outer electron is further from the nucleus and more shielded, so it is lost more easily: lithium fizzes, sodium melts into a ball and skates, and potassium gets hot enough to ignite the hydrogen with a lilac flame.',
  energy:{r:'2M + 2H₂O',p:'2MOH + H₂',dh:p=>ALK[p.m].dh*2/1000},
  atom:p=>({liquid:1,T:25,tau:1,surf:{sp:p.m+'(s)',rows:2},init:[['H2O',36]],
   // Simplified: the H atom left behind takes an H from water, and the OH radical it makes takes an electron from the metal.
   steps:[{r:['H2O',p.m+'(s)'],p:[p.m+'+','OH-','H'],ea:ALK[p.m].ea,dh:-.6},{r:['H','H2O'],p:['H2','OH'],ea:3,dh:0},{r:['OH',p.m+'(s)'],p:[p.m+'+','OH-'],ea:.5,dh:-.8},{r:['H','H'],p:['H2'],ea:0,dh:-1}],
   track:['H2O',p.m+'+','OH-','H2']})},

 {id:'h2comb',type:'Combustion',name:'Hydrogen pop test',level:'Lower secondary',teacher:false,icon:'fire',
  eq:'2H₂(g) + O₂(g) → 2H₂O(l)   ΔH = −572 kJ/mol',
  desc:'Hold a lit splint at the mouth of a test tube of hydrogen. How loud the pop is depends on how much oxygen is mixed with the hydrogen.',
  note:'Use test tubes of gas only, never a large container. Hydrogen and air mixtures from 4 % to 75 % hydrogen can explode.',
  ctl:[['mix','Gas in the 25 mL tube',[['pure','Pure hydrogen'],['air','Hydrogen and air (30 %)'],['o2','Hydrogen and oxygen (2 : 1)'],['lean','3 % hydrogen in air']],'air']],
  rd:[['burnt','Hydrogen burned','mL',1],['water','Water formed','mg',1],['E','Energy released','J',0]],
  init:p=>({t:0,lit:false,f:0,...H2MIX[p.mix]}),
  step:(s,dt)=>{const t=s.t+dt,lit=t>=1.2&&s.fl>0,f=lit?Math.min(1,s.f+dt/s.dur):s.f;return {...s,t,lit,f}},
  vals:s=>{const b=s.b*.025/VM*s.f;return {burnt:b*VM*1000,water:b*18.02*1000,E:b*286000}},
  done:s=>s.t>3.5,
  pred:['Which tube will give the loudest pop?',['Pure hydrogen','Hydrogen and oxygen mixed 2 : 1','3 % hydrogen in air'],1],
  explain:'Hydrogen needs oxygen to burn. In pure hydrogen only the gas at the mouth of the tube, where it mixes with air, can burn, so you hear a gentle squeaky pop. With the 2 : 1 ratio from the balanced equation every molecule has a partner, the flame races through the tube at about 10 m/s and you hear a loud bang. Below 4 % hydrogen there is too little fuel and nothing happens. Droplets of water form on the cold glass.',
  energy:{r:'2H₂ + O₂',p:'2H₂O',dh:-572},
  atom:p=>({liquid:0,T:25,tau:6,init:H2ATOM[p.mix],ignite:1,
   steps:[{r:['H2','O2'],p:['OH','OH'],ea:12,dh:.3},{r:['OH','H2'],p:['H2O','H'],ea:2.5,dh:-3},{r:['H','O2'],p:['OH','O'],ea:4,dh:.5},
    {r:['O','H2'],p:['OH','H'],ea:3,dh:0},{r:['H','OH'],p:['H2O'],ea:0,dh:-10},{r:['H','H'],p:['H2'],ea:0,dh:-8},{r:['O','O'],p:['O2'],ea:0,dh:-9}],
   track:['H2','O2','H2O','OH','H']})},

 {id:'ch4comb',type:'Combustion',name:'Burning methane: blue and yellow flames',level:'Upper secondary',teacher:false,icon:'fire',
  eq:'CH₄ + 2O₂ → CO₂ + 2H₂O   (complete)\n2CH₄ + 3O₂ → 2CO + 4H₂O,  CH₄ + O₂ → C + 2H₂O   (incomplete)',
  desc:'Change the air hole of a Bunsen burner and collect what the flame makes: soot on a cold funnel and carbon dioxide bubbling through limewater.',
  note:'Carbon monoxide from incomplete combustion is poisonous and has no smell. Burn gas only in a well-ventilated room.',
  ctl:[['air','Air hole',[['closed','Closed'],['half','Half open'],['open','Open']],'open',1]],
  rd:[['Tf','Flame temperature','°C',0],['P','Heat output','W',0],['CO2','Carbon dioxide made','g',3],['soot','Soot on the funnel','mg',1],['lime','Limewater cloudiness','%',0]],
  init:()=>({t:0,CO2:0,C:0,lc:0}),
  step:(s,dt,p)=>{const f=CH4MIX[p.air],n=1e-3*dt; // 1.5 L of methane per minute, about 0.9 kW like a school Bunsen burner
   return {...s,t:s.t+dt,CO2:s.CO2+n*f.co2,C:s.C+n*f.c,lc:s.lc+n*f.co2*.006}},
  // Limewater holds 0.2 mmol of Ca(OH)₂: cloudiness peaks when that much CO₂ has bubbled in, then clears as Ca(HCO₃)₂ forms.
  vals:(s,p)=>{const f=CH4MIX[p.air],x=s.lc/2e-4;return {Tf:f.T,P:1e-3*(890000*f.co2+607000*f.co+496000*f.c),CO2:s.CO2*44.01,soot:s.C*12.01*1000,lime:100*(x<=1?x:Math.max(0,2-x))}},
  done:s=>s.t>240,
  pred:['What will collect on a cold funnel held above the yellow flame?',['Black soot (carbon)','White magnesium oxide','Nothing at all'],0],
  explain:'With the air hole open, methane mixes with plenty of oxygen before it burns: combustion is complete, the flame is blue and hot (about 1500 °C) and the products are carbon dioxide and water. With the air hole closed there is too little oxygen, so some carbon is left as glowing soot (the yellow colour) and some becomes poisonous carbon monoxide. Carbon dioxide turns limewater milky (CaCO₃); bubbling in too much makes it clear again as soluble Ca(HCO₃)₂ forms.',
  energy:{r:'CH₄ + 2O₂',p:'CO₂ + 2H₂O',dh:-890},
  atom:p=>({liquid:0,T:CH4MIX[p.air].T,tau:1.2,init:CH4ATOM[p.air],
   steps:[{r:['CH4','O2'],p:['CH2O','H2O'],ea:12,dh:-4},{r:['CH2O','O2'],p:['CO','H2O','O'],ea:10,dh:-1},{r:['CO','O2'],p:['CO2','O'],ea:10,dh:-1},
    {r:['CO','O'],p:['CO2'],ea:2,dh:-6},{r:['CH2O','O'],p:['CO','H2O'],ea:3,dh:-4},{r:['O','CH4'],p:['CH2O','H2'],ea:6,dh:-2},{r:['H2','O'],p:['H2O'],ea:3,dh:-5},{r:['O','O'],p:['O2'],ea:0,dh:-5}],
   track:['CH4','O2','CH2O','CO','CO2','H2O']})},

 {id:'mgburn',type:'Synthesis',name:'Burning magnesium',level:'Lower secondary',teacher:false,icon:'spark',
  eq:'2Mg(s) + O₂(g) → 2MgO(s)',
  desc:'Hold a strip of magnesium ribbon in a Bunsen flame with tongs. It burns with a dazzling white light and leaves a white powder that is heavier than the ribbon.',
  note:'Do not look straight at burning magnesium: the light contains ultraviolet. Hold it with tongs over a heat-proof mat.',
  ctl:[['len','Ribbon length',[[3,'3 cm'],[5,'5 cm'],[10,'10 cm']],5],['glass','View through blue glass',[[false,'No'],[true,'Yes']],true,1]],
  rd:[['left','Ribbon left','cm',1],['MgO','Magnesium oxide made','g',3],['gain','Mass gained','g',3],['O2','Oxygen used','mL',1]],
  init:p=>({t:0,len:p.len,L:p.len,lit:false}),
  step:(s,dt)=>{const t=s.t+dt,lit=t>=1&&s.len>0,len=lit?Math.max(0,s.len-.8*dt):s.len;return {...s,t,lit:lit&&len>0,len}},
  vals:s=>{const m=(s.L-s.len)*MGCM,n=m/24.31;return {left:s.len,MgO:n*40.30,gain:n*16,O2:n/2*VM*1000}},
  done:s=>s.len<=0&&s.t>2,
  pred:['How does the mass of the white powder compare with the ribbon?',['It is lighter, because the metal burned away','It is the same','It is heavier, because oxygen has joined on'],2],
  explain:'Magnesium atoms each give two electrons to oxygen, forming the ionic solid magnesium oxide, MgO. This releases a great deal of energy (−1204 kJ for 2 mol of MgO), heating the metal to about 3000 °C so it glows white. Oxygen from the air is added to the magnesium, so the product is heavier: every 24.3 g of magnesium becomes 40.3 g of magnesium oxide.',
  energy:{r:'2Mg + O₂',p:'2MgO',dh:-1204},
  atom:()=>({liquid:0,T:25,tau:8,surf:{sp:'Mg(s)',rows:2},init:[['O2',16],['N2',36]],ignite:1,
   steps:[{r:['O2','Mg(s)'],p:['MgO','O'],ea:7,dh:-8},{r:['O','Mg(s)'],p:['MgO'],ea:1,dh:-10},{r:['O','O'],p:['O2'],ea:0,dh:-6}],
   track:['O2','MgO','O','N2']})},

 {id:'neut',type:'Neutralisation',name:'Neutralisation with universal indicator',level:'Lower secondary',teacher:false,icon:'burette',
  eq:'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)   H⁺ + OH⁻ → H₂O,  ΔH = −57.1 kJ/mol',
  desc:'Run 1.0 M sodium hydroxide from a burette into 25 mL of 1.0 M hydrochloric acid. Watch the indicator move through the rainbow and the temperature peak at the end point.',
  note:'Both solutions are corrosive at 1.0 M. Wear goggles and fill the burette below eye level.',
  ctl:[['flow','Burette tap',[[0,'Closed'],[.1,'Dropwise'],[.5,'Slow'],[2,'Fast']],.5,1]],
  rd:[['V','Sodium hydroxide added','mL',2],['pH','pH','',2],['T','Temperature','°C',1]],
  init:()=>({t:0,V:0,H:.025,OH:0,T:AMB}),
  step:(s,dt,p)=>{const v=Math.min(p.flow*dt,50-s.V);if(v<=0)return {...s,t:s.t+dt};
   let H=s.H,OH=s.OH+v/1000;const x=Math.min(H,OH);H-=x;OH-=x;const C=(25+s.V+v)*4.18+20;
   return {...s,t:s.t+dt,V:s.V+v,H,OH,T:heat((s.T*((25+s.V)*4.18+20)+AMB*v*4.18)/C,57100*x,C,dt,.002)}},
  vals:s=>({V:s.V,pH:pHof({H:s.H,OH:s.OH},25+s.V,s.T),T:s.T}),
  done:s=>s.V>=50,
  pred:['When will the temperature be highest?',['As soon as the first drop is added','At the end point, when all the acid is neutralised','After adding 50 mL'],1],
  explain:'Each H⁺ ion meets an OH⁻ ion to make a water molecule and releases 57.1 kJ/mol, so the mixture warms while acid is left to react. At 25.0 mL every H⁺ has been used, the pH jumps through 7 and the temperature is at its highest. Adding more cold alkali after that only dilutes and cools the mixture. Na⁺ and Cl⁻ are spectator ions: they do not take part.',
  energy:{r:'H₃O⁺ + OH⁻',p:'2H₂O',dh:-57.1},
  atom:()=>({liquid:1,T:25,tau:1,init:[['H3O+',14],['Cl-',14],['OH-',14],['Na+',14],['H2O',6]],
   steps:[{r:['H3O+','OH-'],p:['H2O','H2O'],ea:.4,dh:-.6}],track:['H3O+','OH-','H2O','Na+']})},

 {id:'goldrain',type:'Precipitation',name:'Golden rain',level:'Upper secondary',teacher:true,icon:'crystal',
  eq:'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)',
  desc:'Two colourless solutions make a bright yellow precipitate of lead(II) iodide. It dissolves in hot water, and as the solution cools it comes back as glittering golden plates.',
  note:'Lead compounds are toxic. Teacher demonstration only: wear gloves, and collect all waste for safe disposal.',
  ctl:[['hot','Hot plate',[[false,'Off'],[true,'On']],false,1]],
  rd:[['T','Temperature','°C',1],['solid','Lead(II) iodide solid','g',3],['aq','Dissolved','g',3]],
  init:()=>({t:0,T:AMB,pw:0,pl:0,aq:0}),
  step:(s,dt,p)=>{const t=s.t+dt;if(t<1.2)return {...s,t};
   const tot=7.5e-4,T=Math.min(95,p.hot?s.T+.45*dt:s.T)-(p.hot&&s.T<95?0:(s.T-AMB)*.006*dt);
   const cap=interp(T,PBI2)/461.0;let {pw,pl,aq}=s;if(s.t<1.2){aq=Math.min(tot,cap);pw=tot-aq}
   if(aq<cap){let x=Math.min(cap-aq,.02*tot*dt*(1+T/20));const a=Math.min(pw,x);pw-=a;x-=a;const b=Math.min(pl,x);pl-=b;aq+=a+b}
   else{const x=Math.min(aq-cap,.08*(aq-cap+1e-5)*dt);aq-=x;pl+=x}
   return {...s,t,T,pw,pl,aq}},
  vals:s=>({T:s.T,solid:(s.pw+s.pl)*461.0,aq:s.aq*461.0}),
  done:s=>s.t>600,
  pred:['What happens to the yellow solid when the hot, clear solution cools?',['Nothing: it stays dissolved','It comes back as shiny golden crystals','It turns blue'],1],
  explain:'Pb²⁺ and I⁻ ions attract strongly, and lead(II) iodide is only slightly soluble, so it falls out of solution as a yellow solid. Its solubility rises about fivefold from 20 °C to 100 °C (0.076 g to 0.41 g per 100 mL), so hot water dissolves it. As the solution cools it becomes saturated again, and the ions arrange themselves slowly into thin hexagonal crystals that glitter as they fall.',
  energy:{r:'Pb²⁺ + 2I⁻',p:'PbI₂(s)',dh:-63},
  atom:()=>({liquid:1,T:25,tau:1,init:[['Pb2+',10],['I-',20],['K+',20],['NO3-',20]],
   steps:[{r:['Pb2+','I-'],p:['PbI+'],ea:0,dh:-.3},{r:['PbI+','I-'],p:['PbI2(s)'],ea:0,dh:-.3}],
   uni:[{r:'PbI2(s)',p:['PbI+','I-'],A:2.5e8,ea:24,dh:0},{r:'PbI+',p:['Pb2+','I-'],A:2.5e8,ea:24,dh:0}],
   track:['Pb2+','I-','PbI2(s)','K+']})},

 {id:'displace',type:'Displacement',name:'Displacing copper',level:'Lower secondary',teacher:false,icon:'flask',
  eq:'M(s) + CuSO₄(aq) → MSO₄(aq) + Cu(s)   (M = Mg, Zn, Fe)',
  desc:'Add 1.0 g of metal powder to 50 mL of 0.50 M copper(II) sulfate. A more reactive metal pushes copper out of solution: the blue fades, brown copper appears and the mixture warms.',
  note:'Magnesium powder is flammable and copper(II) sulfate is harmful. Keep flames away and wash your hands afterwards.',
  ctl:[['m','Metal powder',[['Mg','Magnesium'],['Zn','Zinc'],['Fe','Iron'],['Ag','Silver']],'Zn']],
  rd:[['T','Temperature','°C',1],['Cu','Copper formed','g',3],['blue','Blue colour left','%',0]],
  init:p=>({t:0,nM:1/DIS[p.m].mm,nM0:1/DIS[p.m].mm,Cu2:.025,Cu:0,T:AMB}),
  step:(s,dt,p)=>{const M=DIS[p.m];if(!M.k||s.t<1)return {...s,t:s.t+dt};
   const x=Math.min(s.nM,s.Cu2,M.k*Math.pow(s.nM/s.nM0,2/3)*s.nM0*(s.Cu2/.025)*arr(40000,s.T)*dt);
   return {...s,t:s.t+dt,nM:s.nM-x,Cu2:s.Cu2-x,Cu:s.Cu+x,T:heat(s.T,-M.dh*x,50*4.18+5,dt,.003)}},
  vals:s=>({T:s.T,Cu:s.Cu*63.55,blue:s.Cu2/.025*100}),
  done:s=>s.t>90||s.nM<1e-7||s.Cu2<1e-7,
  pred:['Which metal will NOT displace copper?',['Magnesium','Iron','Silver'],2],
  explain:'A metal higher in the reactivity series loses electrons more easily than copper, so it gives them to Cu²⁺ ions: the metal dissolves as ions and copper metal is deposited. Fewer Cu²⁺ ions means less blue. Magnesium is far above copper, so it reacts fastest and releases the most heat; silver is below copper and nothing happens: the reaction is not spontaneous (E°cell = 0.34 − 0.80 = −0.46 V, so ΔG° = +89 kJ/mol).',
  energy:{r:p=>p.m==='Ag'?'2Ag + Cu²⁺':'M + Cu²⁺',p:p=>p.m==='Ag'?'2Ag⁺ + Cu':'M²⁺ + Cu',dh:p=>DIS[p.m].dh/1000},
  atom:p=>({liquid:1,T:25,tau:1,surf:{sp:p.m+'(s)',rows:2},init:[['Cu2+',14],['SO42-',14]],
   steps:DIS[p.m].ea?[{r:['Cu2+',p.m+'(s)'],p:[p.m+'2+','Cu(s)'],ea:DIS[p.m].ea,dh:-.8}]:[],track:['Cu2+',p.m+'2+','Cu(s)']})}];

// Alkali metals: molar mass, shrinking rate (g^(1/3)/s), ΔH per mol of metal (J), atomic barrier.
const ALK={Li:{mm:6.94,k:.06,dh:-222000,ea:2.6},Na:{mm:22.99,k:.4,dh:-184000,ea:1.6},K:{mm:39.10,k:1,dh:-196000,ea:.8}};
// b: mole fraction of the tube that is hydrogen able to burn (pure hydrogen only burns where it meets air at the mouth),
// dur: flame time in s, fl: whether it lights at all (hydrogen burns in air only from 4 % to 75 %).
const H2MIX={pure:{b:.14,dur:.6,fl:1,sound:'squeak'},air:{b:.29,dur:.15,fl:1,sound:'pop'},o2:{b:.667,dur:.05,fl:1,sound:'bang'},lean:{b:0,dur:1,fl:0,sound:null}};
const H2ATOM={pure:[['H2',34],['O2',2],['N2',6]],air:[['H2',14],['O2',7],['N2',28]],o2:[['H2',26],['O2',13]],lean:[['H2',3],['O2',14],['N2',52]]};
// Share of the carbon in methane ending as CO₂, CO and soot.
const CH4MIX={closed:{T:1000,co2:.6,co:.15,c:.25},half:{T:1300,co2:.9,co:.07,c:.03},open:{T:1500,co2:1,co:0,c:0}};
const CH4ATOM={closed:[['CH4',10],['O2',9],['N2',14]],half:[['CH4',10],['O2',15],['N2',22]],open:[['CH4',10],['O2',22],['N2',30]]};
const MGCM=.0167; // g of magnesium ribbon per cm
const PBI2=[[0,.044],[20,.076],[40,.12],[60,.19],[80,.29],[100,.41]]; // solubility of PbI₂, g per 100 mL
// Displacing metals: molar mass, rate (1/s), ΔH per mol of Cu²⁺ (J), atomic barrier (0 = no reaction).
const DIS={Mg:{mm:24.31,k:.25,dh:-532000,ea:.05},Zn:{mm:65.38,k:.06,dh:-219000,ea:.8},Fe:{mm:55.85,k:.025,dh:-153000,ea:1.8},Ag:{mm:107.87,k:0,dh:146000,ea:0}};
export const ctlDefaults=d=>Object.fromEntries(d.ctl.map(([k,,,v])=>[k,v]));
