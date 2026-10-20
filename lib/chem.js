export const KB=[[/neutral|titrat|pink|phenol|naoh/,'HCl + NaOH → NaCl + H₂O. It is exothermic, so the temperature rises. Phenolphthalein is pink above pH 8.2 and colourless below, so the colour change shows the endpoint.','HCl + NaOH → NaCl + H₂O។ ប្រតិកម្មនេះបញ្ចេញកំដៅ ដូច្នេះសីតុណ្ហភាពឡើង។ ហ្វេណុលតាលេអ៊ីនមានពណ៌ផ្កាឈូកពេល pH លើស ៨.២ ហើយគ្មានពណ៌ពេលក្រោមនោះ។'],
[/zinc|magnes|metal|bubble|gas|\bzn\b|\bmg\b/,'Metals such as Mg and Zn react with HCl to release hydrogen gas (the bubbles) and heat: Mg + 2HCl → MgCl₂ + H₂. Keep flames away because hydrogen is flammable.','លោហៈដូចជា Mg និង Zn ធ្វើប្រតិកម្មជាមួយ HCl បញ្ចេញឧស្ម័នអ៊ីដ្រូសែន (ពពុះ) និងកំដៅ៖ Mg + 2HCl → MgCl₂ + H₂។ សូមដាក់ភ្លើងឲ្យឆ្ងាយ ព្រោះអ៊ីដ្រូសែនឆេះ។'],
[/copper|cuso4|precipit|crystal/,'Copper sulfate solution is blue. Adding NaOH forms pale blue Cu(OH)₂ precipitate. Heating evaporates the water and blue CuSO₄ crystals form.','ដំណោះស្រាយស៊ុលហ្វាតទង់ដែងមានពណ៌ខៀវ។ ការដាក់ NaOH បង្កើតកករ Cu(OH)₂ ពណ៌ខៀវស្រាល។ ការកំដៅធ្វើឲ្យទឹកហួត ហើយគ្រីស្តាល់ CuSO₄ ពណ៌ខៀវកកើតឡើង។'],
[/safe|dilut|splash|goggle/,'Always add acid to water, never water to acid. Wear goggles, gloves and a lab coat, and rinse splashes with running water for 15 minutes.','ត្រូវចាក់អាស៊ីតចូលទឹកជានិច្ច កុំចាក់ទឹកចូលអាស៊ីត។ ពាក់វ៉ែនតា ស្រោមដៃ និងអាវមន្ទីរពិសោធន៍ ហើយលាងកន្លែងប៉ះដោយទឹកហូរ ១៥ នាទី។']];
export const KBD=['I can explain neutralisation, metal–acid reactions, precipitates, crystallisation and safety. Try asking, “Why did my solution turn pink?”','ខ្ញុំអាចពន្យល់អំពីការបន្សាប ប្រតិកម្មលោហៈជាមួយអាស៊ីត កករ គ្រីស្តាល់ និងសុវត្ថិភាព។'];
export const uid=()=>Math.random().toString(36).slice(2,8);
export const SOL=['zn','mg'];
export const CHEMS={
 hcl:{n:'Hydrochloric acid 1M',cat:'Acids & Bases',e:'🧪',f:'liquid',pc:'#fde68a'},naoh:{n:'Sodium hydroxide',cat:'Acids & Bases',e:'⚪',f:'pellet',pc:'#f8fafc'},
 water:{n:'Distilled water',cat:'Acids & Bases',e:'💧',f:'liquid',pc:'#7dd3fc'},cuso4:{n:'Copper(II) sulfate',cat:'Salts',e:'🔷',f:'crystal',pc:'#2563eb'},
 nacl:{n:'Table salt (NaCl)',cat:'Salts',e:'🧂',f:'powder',pc:'#ffffff'},zn:{n:'Zinc granules',cat:'Metals',e:'🪨',f:'granule',pc:'#94a3b8'},
 mg:{n:'Magnesium ribbon',cat:'Metals',e:'🎗️',f:'ribbon',pc:'#e2e8f0'},phph:{n:'Phenolphthalein',cat:'Indicators',e:'🩷',f:'liquid',pc:'#fbcfe8'}};
export const FORMLBL={liquid:'Liquid',pellet:'Pellets',crystal:'Crystals',powder:'Powder',granule:'Granules',ribbon:'Ribbon'};
export const GLASS={beaker:{n:'Beaker 250 mL',e:'🥛'},flask:{n:'Conical flask',e:'⚗️'},bunsen:{n:'Bunsen burner',e:'🔥'},
 stirrer:{n:'Stirrer',e:'🌀'},therm:{n:'Thermometer',e:'🌡️'},pipette:{n:'Dropper pipette',e:'💉'}};
export const TABS=['Acids & Bases','Salts','Metals','Indicators','Glassware'];
export const isC=i=>i.kind==='beaker'||i.kind==='flask';
export const liquid=m=>Object.entries(m).reduce((a,[k,v])=>SOL.includes(k)?a:a+v,0);
export function derive(c){
 const m=c.m,vol=liquid(m),net=((m.hcl||0)-(m.naoh||0))/Math.max(vol,1);
 let pH=7;if(Math.abs(net)>1e-4)pH=net>0?Math.max(0,-Math.log10(net)):Math.min(14,14+Math.log10(-net));
 const pink=(m.phph||0)>0&&pH>8.2,ppt=(m.cuso4||0)>0&&(m.naoh||0)>0&&pH>7;
 const blue=Math.min(1,((m.cuso4||0)/Math.max(vol,1))*1.6);
 const gas=((m.zn||0)+(m.mg||0))>0&&(m.hcl||0)>0&&net>0.001;
 const color=pink?'rgba(236,72,153,.75)':ppt?'rgba(125,211,252,.6)':blue>0?`rgba(37,99,235,${.25+blue*.55})`:'rgba(186,230,253,.4)';
 const mass=vol*1.02+(m.zn||0)+(m.mg||0);
 return {vol,pH,pink,ppt,gas,color,mass,cuso4:m.cuso4||0,naoh:m.naoh||0};
}
export const EXPS=[
 {id:'titr',name:'Acid-Base Titration',e:'🧪',diff:'Medium',time:'20 min',safety:3,risk:false,eq:'HCl + NaOH → NaCl + H₂O',
  desc:'Neutralise sodium hydroxide with hydrochloric acid, using phenolphthalein to see the endpoint.',
  steps:[['Place a beaker on the bench',s=>s.cs.length>0],['Add 25 mL NaOH',s=>s.cs.some(c=>c.m.naoh>=25)],
  ['Add phenolphthalein (solution turns pink)',s=>s.cs.some(c=>c.d.pink)],
  ['Add HCl until the pink disappears (pH near 7)',s=>s.cs.some(c=>c.m.phph>0&&c.m.hcl>0&&!c.d.pink&&Math.abs(c.d.pH-7)<1)]]},
 {id:'cryst',name:'Copper Sulfate Crystallization',e:'🔷',diff:'Easy',time:'30 min',safety:4,risk:false,eq:'CuSO₄(aq) → CuSO₄ crystals + H₂O (evaporation)',
  desc:'Heat a copper sulfate solution to evaporate water and grow blue crystals.',
  steps:[['Place a beaker and a Bunsen burner',s=>s.cs.length>0&&s.items.some(i=>i.kind==='bunsen')],['Add 50 mL copper sulfate',s=>s.cs.some(c=>c.m.cuso4>=50)],
  ['Heat the beaker above 90 °C (select it, turn on burner)',s=>s.cs.some(c=>c.t>=90)],['Evaporate to under 25 mL',s=>s.cs.some(c=>c.d.cuso4>5&&c.d.vol<25)]]},
 {id:'exo',name:'Exothermic Metal Reactions',e:'💥',diff:'Hard',time:'25 min',safety:2,risk:true,eq:'Mg + 2HCl → MgCl₂ + H₂↑',
  desc:'React magnesium with acid and measure the heat released. Requires the safety check.',
  steps:[['Place a beaker on the bench',s=>s.cs.length>0],['Add 25 mL HCl',s=>s.cs.some(c=>c.m.hcl>=25)],
  ['Add a metal (Mg or Zn) and watch for bubbles',s=>s.cs.some(c=>c.d.gas)],['Reach above 30 °C',s=>s.cs.some(c=>c.t>30)]]}];
export const QUIZ=[['Acid splashes on your skin. What first?',['Rinse with running water for 15 minutes','Wipe with a dry cloth','Apply a strong base'],0],
 ['How do you dilute concentrated acid?',['Add water to the acid','Add acid slowly to water','Heat the acid first'],1],
 ['Which protective gear is required?',['Sunglasses','Open sandals','Goggles, gloves and lab coat'],2]];
export const NAV=[['/','Lab Bench','🧪'],['/dashboard','Dashboard','🏠'],['/inventory','Inventory','📦'],['/safety','Safety Manual','🛡️'],['/achievements','Achievements','🏆']];
