export const KB=[[/neutral|titrat|pink|phenol|naoh|end ?point|burette/,'HCl + NaOH → NaCl + H₂O. Phenolphthalein is pink above about pH 8.2 and colourless below, so the end point is the first drop of acid that removes the pink. Open the burette tap fully at first, then add acid drop by drop near the end point. Concentration of NaOH = 0.100 × V(HCl) ÷ 25.0.','HCl + NaOH → NaCl + H₂O។ ហ្វេណុលផ្តាលេអ៊ីនមានពណ៌ផ្កាឈូកពេល pH លើសប្រហែល ៨.២ ហើយគ្មានពណ៌ពេលក្រោមនោះ ដូច្នេះចំណុចសមមូលគឺជាដំណក់អាស៊ីតដំបូងដែលធ្វើឲ្យពណ៌ផ្កាឈូកបាត់។ កំហាប់ NaOH = ០.១០០ × V(HCl) ÷ ២៥.០។'],
[/zinc|magnes|metal|bubble|hydrogen|\bzn\b|\bmg\b/,'Magnesium and zinc react with acid to make hydrogen gas (the bubbles) and heat: Mg + 2HCl → MgCl₂ + H₂. Magnesium reacts faster than zinc because it is more reactive. Keep flames away because hydrogen is flammable.','ម៉ាញេស្យូម និងស័ង្កសីធ្វើប្រតិកម្មជាមួយអាស៊ីតបង្កើតឧស្ម័នអ៊ីដ្រូសែន (ពពុះ) និងកំដៅ៖ Mg + 2HCl → MgCl₂ + H₂។ ម៉ាញេស្យូមធ្វើប្រតិកម្មលឿនជាងស័ង្កសី។ សូមដាក់ភ្លើងឲ្យឆ្ងាយ ព្រោះអ៊ីដ្រូសែនងាយឆេះ។'],
[/marble|caco3|rate|carbon dioxide|co2|balance|mass/,'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Carbon dioxide escapes, so the balance reading falls. The reaction slows down as the acid and marble are used up. Warmer or more concentrated acid gives a faster rate.','CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂។ ឧស្ម័នកាបូនឌីអុកស៊ីតភាយចេញ ដូច្នេះម៉ាសលើជញ្ជីងថយចុះ។ ប្រតិកម្មយឺតទៅៗ ព្រោះអាស៊ីត និងថ្មម៉ាប្រត្រូវបានប្រើអស់។'],
[/copper|cuso4|precipit|crystal|evapor/,'Copper(II) sulfate is more soluble in hot water. Boil the solution to remove water, stop before it is dry, then let it cool: the solution becomes saturated and blue CuSO₄·5H₂O crystals form. With NaOH, copper(II) sulfate gives a pale blue Cu(OH)₂ precipitate.','ស៊ុលហ្វាតទង់ដែងរលាយច្រើនក្នុងទឹកក្តៅ។ ដាំឲ្យពុះដើម្បីបំហួតទឹក ឈប់មុនពេលស្ងួត រួចទុកឲ្យត្រជាក់៖ ដំណោះស្រាយឆ្អែត ហើយគ្រីស្តាល់ CuSO₄·5H₂O ពណ៌ខៀវកកើតឡើង។'],
[/burner|flame|heat|tripod|gauze|bunsen/,'Only a container standing on the tripod and gauze over a lit Bunsen burner is heated. Light the burner with the air hole closed (yellow safety flame), then open the air hole for a hot blue heating flame.','មានតែធុងដែលដាក់លើជើងបី និងសំណាញ់ពីលើចង្ក្រានប៊ុនសិនដែលកំពុងឆេះប៉ុណ្ណោះ ទើបត្រូវបានកំដៅ។ អុជចង្ក្រានដោយបិទរន្ធខ្យល់ (អណ្តាតភ្លើងលឿងសុវត្ថិភាព) រួចបើករន្ធខ្យល់សម្រាប់អណ្តាតភ្លើងខៀវក្តៅ។'],
[/safe|dilut|splash|goggle/,'Always add acid to water, never water to acid. Wear goggles and a lab coat, tie back long hair, and rinse splashes with running water for 15 minutes.','ត្រូវចាក់អាស៊ីតចូលទឹកជានិច្ច កុំចាក់ទឹកចូលអាស៊ីត។ ពាក់វ៉ែនតា និងអាវមន្ទីរពិសោធន៍ ចងសក់វែង ហើយលាងកន្លែងប៉ះដោយទឹកហូរ ១៥ នាទី។']];
export const KBD=['I can explain titration, metal–acid reactions, rates, crystallisation, energy changes, the Bunsen burner and safety. Try asking, “Why did my solution turn pink?”','ខ្ញុំអាចពន្យល់អំពីទីត្រាស្យុង ប្រតិកម្មលោហៈជាមួយអាស៊ីត ល្បឿនប្រតិកម្ម ការធ្វើគ្រីស្តាល់ បម្រែបម្រួលថាមពល ចង្ក្រានប៊ុនសិន និងសុវត្ថិភាព។'];

export const uid=()=>Math.random().toString(36).slice(2,8);
export const AMB=28; // typical classroom temperature in Cambodia, °C
export const DROP=0.05; // mL per drop
export const CAP=250; // every container holds 250 mL
export const MM={Mg:24.31,Zn:65.38,CaCO3:100.09,NH4Cl:53.49,CuSO4:159.61,hydrate:249.69,H2:2.016,CO2:44.01};

// Shelf. Solutions list moles of each species per mL, indicators are counted in drops, solids give one piece's mass.
// `pc` is the colour shown in the bottle, `fm` the formula on its label.
export const REAG={
 hcl2:{n:'Hydrochloric acid',c:'2.0 M',fm:'HCl',f:'sol',cat:'Solutions',per:{H:2e-3,Cl:2e-3},rho:1.03,pc:'#eef2f6',haz:'Corrosive'},
 hcl01:{n:'Hydrochloric acid',c:'0.100 M',fm:'HCl',f:'sol',cat:'Solutions',per:{H:1e-4,Cl:1e-4},rho:1,pc:'#eef2f6',haz:'Irritant'},
 naohx:{n:'Sodium hydroxide',c:'unknown',fm:'NaOH',f:'sol',cat:'Solutions',per:null,rho:1,pc:'#f1f5f9',haz:'Irritant'},
 naoh1:{n:'Sodium hydroxide',c:'1.0 M',fm:'NaOH',f:'sol',cat:'Solutions',per:{Na:1e-3,OH:1e-3},rho:1.04,pc:'#f1f5f9',haz:'Corrosive'},
 cuso4:{n:'Copper(II) sulfate',c:'1.0 M',fm:'CuSO₄',f:'sol',cat:'Solutions',per:{Cu:1e-3,SO4:1e-3},rho:1.16,pc:'#2f6fd6',haz:'Harmful'},
 water:{n:'Distilled water',c:'',fm:'H₂O',f:'sol',cat:'Solutions',per:{},rho:1,pc:'#e6f0f7',haz:'None'},
 lime:{n:'Lime juice',c:'',fm:'',f:'sol',cat:'Household',per:{H:6.3e-6},rho:1.03,pc:'#dfe6a6',haz:'None'},
 vinegar:{n:'Vinegar',c:'',fm:'',f:'sol',cat:'Household',per:{H:1.26e-6},rho:1.01,pc:'#f1e7cf',haz:'None'},
 soda:{n:'Baking soda solution',c:'',fm:'NaHCO₃',f:'sol',cat:'Household',per:{OH:2e-9},rho:1.02,pc:'#f4f6f8',haz:'None'},
 soap:{n:'Soap solution',c:'',fm:'',f:'sol',cat:'Household',per:{OH:1e-7},rho:1,pc:'#e9edf2',haz:'Irritant'},
 univ:{n:'Universal indicator',c:'',fm:'',f:'ind',cat:'Indicators',pc:'#3f7d3a',haz:'Flammable'},
 phph:{n:'Phenolphthalein',c:'',fm:'',f:'ind',cat:'Indicators',pc:'#f4f6f8',haz:'Flammable'},
 mo:{n:'Methyl orange',c:'',fm:'',f:'ind',cat:'Indicators',pc:'#e3801f',haz:'Harmful'},
 mg:{n:'Magnesium ribbon',c:'3 cm strip',fm:'Mg',f:'solid',cat:'Solids',sp:'Mg',g:.05,mm:MM.Mg,pc:'#c8cfd8',haz:'Flammable'},
 zn:{n:'Zinc granules',c:'0.5 g each',fm:'Zn',f:'solid',cat:'Solids',sp:'Zn',g:.5,mm:MM.Zn,pc:'#98a2ad',haz:'Low hazard'},
 caco3:{n:'Marble chips',c:'1 g each',fm:'CaCO₃',f:'solid',cat:'Solids',sp:'CaCO3',g:1,mm:MM.CaCO3,pc:'#e7e5e4',haz:'Low hazard'},
 nh4cl:{n:'Ammonium chloride',c:'2 g spatula',fm:'NH₄Cl',f:'solid',cat:'Solids',sp:'NH4Cls',g:2,mm:MM.NH4Cl,pc:'#fafafa',haz:'Harmful'}};
export const EQUIP={beaker:{n:'Beaker',c:'250 mL'},flask:{n:'Conical flask',c:'250 mL'},bunsen:{n:'Bunsen burner',c:'with tripod and gauze'},
 burette:{n:'Burette',c:'50 mL, on a stand'},balance:{n:'Electronic balance',c:'0.01 g'},therm:{n:'Thermometer',c:'−10 to 110 °C'},probe:{n:'pH meter',c:'glass probe'},rod:{n:'Stirring rod',c:'glass'}};
export const TABS=['Solutions','Household','Indicators','Solids','Apparatus'];
export const AMTS=[[DROP,'1 drop'],[1,'1 mL'],[5,'5 mL'],[10,'10 mL'],[25,'25 mL'],[50,'50 mL']];
export const TAP=[0,.1,.5,2]; // burette flow in mL/s: closed, dropwise, slow, fast
export const TAPLBL=['Closed','Dropwise','Slow','Fast'];
export const HAZ={Corrosive:'rose',Irritant:'amber',Harmful:'amber',Flammable:'orange','Low hazard':'stone',None:'stone'};
export const isC=i=>i.kind==='beaker'||i.kind==='flask';
export const fullName=(r,T)=>T(r.n)+(r.c?' '+T(r.c):'');

const interp=(x,t)=>{if(x<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(x<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return t[t.length-1][1]};
const mixc=(x,t)=>[0,1,2].map(k=>interp(x,t.map(([p,c])=>[p,c[k]])));
// Solubility in g per 100 g of water.
export const solCuSO4=T=>interp(T,[[0,14.3],[20,20.7],[40,28.5],[60,40],[80,55],[100,75.4]]);
export const solNH4Cl=T=>interp(T,[[0,29.7],[20,37.2],[40,45.8],[60,55.3],[80,65.6],[100,77.3]]);
export const heatCap=c=>Math.max(c.water,0)*4.18+c.glass*.84; // J/K

export function newContainer(kind,label){
 return {id:uid(),kind,label,at:null,water:0,n:{},src:{},mass:0,glass:+((kind==='beaker'?98:122)+Math.random()*12).toFixed(2),
  T:AMB,hi:AMB,lo:AMB,therm:false,probe:false,stir:false,gas:{H2:0,CO2:0},rH2:0,rCO2:0,boil:0,anh:false,log:[]};
}

// Adds `amt` mL of a solution, drops of an indicator or pieces of a solid. Added material is at room temperature.
export function add(c,rid,amt,naohC){
 const r=REAG[rid],x={...c,n:{...c.n},src:{...c.src}},C0=heatCap(c);let v=0;
 if(r.f==='ind'){x.n[rid]=(x.n[rid]||0)+amt;v=amt*DROP;x.mass+=v}
 else if(r.f==='solid'){x.n[r.sp]=(x.n[r.sp]||0)+amt*r.g/r.mm;x.mass+=amt*r.g}
 else{const per=rid==='naohx'?{Na:naohC/1000,OH:naohC/1000}:r.per;for(const k in per)x.n[k]=(x.n[k]||0)+per[k]*amt;v=amt;x.mass+=amt*r.rho}
 x.water+=v;x.src[rid]=(x.src[rid]||0)+amt;
 x.T=(C0*c.T+v*4.18*AMB)/(C0+v*4.18);x.hi=Math.max(x.hi,x.T);x.lo=Math.min(x.lo,x.T);
 return x;
}

export function pHof(n,V){
 const L=V/1000,e=((n.H||0)-(n.OH||0))/L;
 if(e<0){const oh=(-e+Math.sqrt(e*e+4e-14))/2;return Math.min(14,14+Math.log10(oh))}
 const K=1e-14+5.6e-10*(n.NH4||0)/L+3e-8*(n.Cu||0)/L; // weak acidity of NH₄⁺ and Cu²⁺
 return Math.max(0,-Math.log10((e+Math.sqrt(e*e+4*K))/2));
}

const UNIV=[[0,[198,40,40]],[2,[229,57,53]],[3,[244,81,30]],[4,[251,140,0]],[5,[240,200,40]],[6,[180,195,50]],[7,[67,160,71]],[8,[0,137,123]],[9,[30,136,229]],[10,[57,73,171]],[11,[94,53,177]],[12,[106,27,154]],[14,[74,20,140]]];
const MO=[[3.1,[214,48,49]],[4.4,[240,180,40]]];
export function colorOf(c,pH){
 const V=Math.max(c.water,1),n=c.n,L=[];
 if(n.Cu>0)L.push([[37,99,235],Math.min(.6,n.Cu/V*600)]);
 const ind=(k,col,f=1)=>{const d=n[k]||0;if(d>0&&f>0)L.push([col,Math.min(.75,d/V*14)*f])};
 if(pH!=null){ind('univ',mixc(pH,UNIV));ind('mo',mixc(pH,MO));ind('phph',[219,39,119],Math.max(0,Math.min(1,(pH-8.2)/1.8)))}
 if(c.src.lime)L.push([[205,214,120],Math.min(.25,c.src.lime/V*.25)]);
 const cl=Math.min(.85,(n.CuOH2||0)/V*4000+(c.src.soap||0)/V*.3);
 if(cl>0)L.push([n.CuOH2>0?[120,175,225]:[236,240,244],cl]);
 let w=0,r=0,g=0,b=0;for(const [col,a] of L){r+=col[0]*a;g+=col[1]*a;b+=col[2]*a;w+=a}
 return w?`rgba(${r/w|0},${g/w|0},${b/w|0},${Math.min(.88,.22+w)})`:'rgba(205,225,238,.3)';
}

export function derive(c){
 const pH=c.water>.5?pHof(c.n,c.water):null;
 return {vol:c.water,pH,color:colorOf(c,pH),xtal:((c.n.Xtal||0)*MM.hydrate),ppt:(c.n.CuOH2||0)>1e-6,gr:c.rH2+c.rCO2,boiling:c.boil>1e-4};
}

const onA=(s,c,kind)=>{const b=s.items.find(i=>i.id===c.at);return b&&b.kind===kind?b:null};
// Each step is [instruction, completed(state), asks for a typed answer]. `q` is the conclusion question, `res` the results shown at the end.
export const EXPS=[
 {id:'ind',name:'Acids and alkalis at home',level:'Lower secondary',diff:'Easy',time:'15 min',safety:5,risk:false,
  eq:'Universal indicator: red (pH 1) → green (pH 7) → violet (pH 14)',
  desc:'Test lime juice, soap and water with universal indicator and place them on the pH scale.',
  note:'Do not taste anything in the lab, even food such as lime juice.',
  steps:[['Pour 10 mL of lime juice into a beaker and add 3 drops of universal indicator',s=>s.cs.some(c=>c.src.lime>=5&&c.n.univ>=2)],
   ['Do the same with soap solution in a second beaker',s=>s.cs.some(c=>c.src.soap>=5&&c.n.univ>=2)],
   ['Do the same with distilled water in a third beaker',s=>s.cs.some(c=>c.src.water>=5&&c.n.univ>=2&&Object.keys(c.src).every(k=>k==='water'||k==='univ'))]],
  q:['Which liquid is the most acidic?',['Soap solution','Lime juice','Distilled water'],1]},
 {id:'energy',name:'Exothermic and endothermic changes',level:'Lower secondary',diff:'Medium',time:'20 min',safety:3,risk:true,
  eq:'Mg + 2HCl → MgCl₂ + H₂ (ΔH < 0)  ·  NH₄Cl(s) → NH₄⁺ + Cl⁻ (ΔH > 0)',
  desc:'Measure the temperature change when magnesium reacts with acid, and when ammonium chloride dissolves in water.',
  note:'Hydrogen is flammable. Keep every Bunsen burner off during this experiment.',
  steps:[['Put 25 mL of 2.0 M hydrochloric acid in a beaker and insert a thermometer',s=>s.cs.some(c=>c.src.hcl2>=20&&c.therm)],
   ['Add 2 strips of magnesium ribbon and record the highest temperature',s=>s.cs.some(c=>c.therm&&(c.n.Mg2||0)>0&&c.hi>=AMB+5)],
   ['Put 50 mL of distilled water in another beaker with a thermometer',s=>s.cs.some(c=>c.src.water>=40&&c.therm&&!c.src.hcl2)],
   ['Add 2 spatulas of ammonium chloride, stir, and record the lowest temperature',s=>s.cs.some(c=>c.therm&&(c.n.NH4||0)>0&&c.lo<=AMB-2)]],
  q:['Why did the temperature fall when ammonium chloride dissolved?',['It released heat energy (exothermic)','The thermometer was broken','It took in heat energy from the water (endothermic)'],2],
  res:s=>{const a=s.cs.find(c=>c.n.Mg2>0),b=s.cs.find(c=>c.n.NH4>0);return [a&&['Highest temperature with magnesium',a.hi.toFixed(1)+' °C'],b&&['Lowest temperature with ammonium chloride',b.lo.toFixed(1)+' °C']].filter(Boolean)}},
 {id:'rate',name:'Rate of reaction: marble and acid',level:'Upper secondary',diff:'Medium',time:'25 min',safety:4,risk:false,
  eq:'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
  desc:'Follow the mass of carbon dioxide lost over time to see how the rate of reaction changes.',
  note:'Wear goggles: the acid can spray as the gas bubbles out.',
  steps:[['Place a conical flask on the electronic balance',s=>s.cs.some(c=>c.kind==='flask'&&onA(s,c,'balance'))],
   ['Add 50 mL of 2.0 M hydrochloric acid, then press Tare',s=>s.cs.some(c=>{const b=onA(s,c,'balance');return b&&c.src.hcl2>=45&&b.tare>=c.glass+40})],
   ['Add 2 marble chips and watch the balance reading fall',s=>s.cs.some(c=>onA(s,c,'balance')&&c.gas.CO2>0)],
   ['Wait until about 0.8 g of carbon dioxide has escaped',s=>s.cs.some(c=>c.gas.CO2*MM.CO2>=.8)]],
  q:['Why does the mass go down more slowly as time passes?',['The balance becomes less accurate','The acid and marble are used up, so there are fewer collisions','Carbon dioxide stops being a gas'],1],
  res:s=>{const c=s.cs.find(c=>c.gas.CO2>0);return c?[['Carbon dioxide lost',(c.gas.CO2*MM.CO2).toFixed(2)+' g']]:[]}},
 {id:'cryst',name:'Copper(II) sulfate crystals',level:'Lower secondary',diff:'Medium',time:'30 min',safety:3,risk:true,
  eq:'CuSO₄(aq) → CuSO₄·5H₂O(s)  (evaporate, then cool)',
  desc:'Evaporate a copper(II) sulfate solution over a Bunsen burner, then cool it to grow blue crystals.',
  note:'Never heat the beaker until it is dry: the solid spits and the glass can crack.',
  steps:[['Pour 50 mL of 1.0 M copper(II) sulfate into a beaker',s=>s.cs.some(c=>c.src.cuso4>=45)],
   ['Stand the beaker on the tripod and gauze over a lit Bunsen burner',s=>s.cs.some(c=>{const b=onA(s,c,'bunsen');return c.src.cuso4>=45&&b&&b.gas>0})],
   ['Heat until the solution boils',s=>s.cs.some(c=>c.src.cuso4>=45&&c.hi>=99.5)],
   ['Evaporate until about 20 mL remains (do not boil dry)',s=>s.cs.some(c=>c.src.cuso4>=45&&c.hi>=99.5&&c.water<=22&&c.water>2)],
   ['Turn off the burner and let it cool below 40 °C until crystals form',s=>s.cs.some(c=>c.src.cuso4>=45&&(c.n.Xtal||0)*MM.hydrate>=1&&c.T<40)]],
  q:['Why do crystals appear as the solution cools?',['Cooling adds more copper(II) sulfate','The copper reacts with air','Copper(II) sulfate is less soluble in cold water'],2],
  res:s=>{const c=s.cs.find(c=>c.n.Xtal>0);return c?[['Mass of crystals',((c.n.Xtal)*MM.hydrate).toFixed(2)+' g']]:[]}},
 {id:'titr',name:'Acid–base titration',level:'Upper secondary',diff:'Hard',time:'40 min',safety:3,risk:false,
  eq:'HCl + NaOH → NaCl + H₂O',
  desc:'Find the concentration of a sodium hydroxide solution by titrating it with 0.100 M hydrochloric acid.',
  note:'Fill the burette below eye level, and read it at the bottom of the meniscus.',
  steps:[['Measure 25 mL of the sodium hydroxide (unknown) into a conical flask',s=>s.cs.some(c=>c.kind==='flask'&&c.src.naohx>=24.5&&c.src.naohx<=25.5)],
   ['Add 3 drops of phenolphthalein (the solution turns pink)',s=>s.cs.some(c=>c.src.naohx>0&&c.n.phph>=2&&c.d.pH>8.2)],
   ['Fill the burette with 0.100 M HCl and stand the flask under it',s=>s.items.some(b=>b.kind==='burette'&&b.ch==='hcl01'&&s.cs.some(c=>c.at===b.id&&c.src.naohx>0))],
   ['Open the tap and add acid until one drop turns the pink colourless',s=>s.cs.some(c=>c.src.naohx>0&&c.src.hcl01>0&&c.n.phph>0&&c.d.pH<8.2)],
   ['Calculate the concentration of sodium hydroxide in mol/L',s=>s.ans.titr!=null&&Math.abs(s.ans.titr-s.naohC)/s.naohC<=.03,true]],
  q:['Why is the acid added drop by drop near the end point?',['One drop can change the colour, so going slowly gives an accurate volume','Pouring fast makes the reaction exothermic','Phenolphthalein only works with drops'],0],
  res:s=>{const c=s.cs.find(c=>c.src.naohx>0&&c.src.hcl01>0);return [c&&['Volume of HCl used',c.src.hcl01.toFixed(2)+' mL'],['Your answer',s.ans.titr!=null?s.ans.titr+' mol/L':'—'],['Actual concentration',s.naohC.toFixed(3)+' mol/L']].filter(Boolean)}}];

export const QUIZ=[['Acid splashes on your skin. What do you do first?',['Wipe it with a dry cloth','Rinse with running water for 15 minutes','Neutralise it with a strong base'],1],
 ['How do you light a Bunsen burner safely?',['Close the air hole, hold the flame at the top, then turn on the gas','Turn the gas on fully, then look for a lighter','Open the air hole fully before lighting'],0],
 ['Which flame should you use to heat a beaker?',['A yellow flame with the air hole closed','No flame: put the beaker next to the burner','A blue flame with the air hole open'],2],
 ['Where should a beaker be when you heat it?',['Held in your hand above the flame','On a tripod and gauze above the burner','On the bench beside the burner'],1],
 ['Magnesium is reacting with acid. Why must flames be kept away?',['It makes hydrogen, which is flammable','The magnesium will melt','The acid will freeze'],0]];
export const NAV=[['/','Lab bench','bench'],['/dashboard','Experiments','grid'],['/inventory','Chemicals','bottle'],['/safety','Safety','shield'],['/achievements','Progress','award']];
