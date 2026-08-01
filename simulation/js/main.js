let sim=null,anim=null,frame=0;
function g(id){return +document.getElementById(id).value;}
function integrate(){
  const R=[g('prey')],S=[g('pred')],n=Math.round(g('steps')),h=g('stepSize'),T=[0];
  const r=g('r'),K=g('K'),th=g('th'),a=g('a'),e=g('e'),c=g('c'),sat=g('sat'),sated=document.getElementById('modelSel').value==='1';
  const fR=(R,S)=>{const grow=r*R*(1-Math.pow(Math.max(R,0)/K,th));const pred=sated?sat*(1-Math.exp(-a*R/sat))*S:a*R*S;return grow-pred;};
  const fS=(S,R)=>{const gain=sated?e*sat*(1-Math.exp(-a*R/sat))*S:e*a*R*S;return gain-c*S;};
  for(let i=0;i<n;i++){const A=R[i],B=S[i];
    const k1a=fR(A,B),k1b=fS(B,A);
    const k2a=fR(A+.5*h*k1a,B+.5*h*k1b),k2b=fS(B+.5*h*k1b,A+.5*h*k1a);
    const k3a=fR(A+.5*h*k2a,B+.5*h*k2b),k3b=fS(B+.5*h*k2b,A+.5*h*k2a);
    const k4a=fR(A+h*k3a,B+h*k3b),k4b=fS(B+h*k3b,A+h*k3a);
    R[i+1]=Math.max(0,A+h/6*(k1a+2*k2a+2*k3a+k4a));
    S[i+1]=Math.max(0,B+h/6*(k1b+2*k2b+2*k3b+k4b));
    T[i+1]=+((i+1)*h).toFixed(2);}
  return {R,S,T,n};
}
const chart=()=>document.getElementById('chart');
function drawChart(){
  if(!sim){Chart.draw(chart(),[]);return;}
  const m=document.getElementById('plotMode').value,t=document.getElementById('plotTitle');
  if(m==='phase'){Chart.draw(chart(),[{color:'#7d0130',data:sim.R.map((r,i)=>[r,sim.S[i]]),points:false}],{xlabel:'Prey',ylabel:'Predator',ratio:0.5});setLegend([{color:'#7d0130',name:'Trajectory (Prey, Predator)'}]);t.textContent='Phase plane (Prey vs Predator)';}
  else if(m==='prey'){Chart.draw(chart(),[{color:'#b50246',data:sim.T.map((tt,i)=>[tt,sim.R[i]]),points:false}],{xlabel:'Time',ylabel:'Prey',ratio:0.5});setLegend([{color:'#b50246',name:'Prey'}]);t.textContent='Prey vs time';}
  else if(m==='pred'){Chart.draw(chart(),[{color:'#0e7c86',data:sim.T.map((tt,i)=>[tt,sim.S[i]]),points:false}],{xlabel:'Time',ylabel:'Predator',ratio:0.5});setLegend([{color:'#0e7c86',name:'Predator'}]);t.textContent='Predator vs time';}
  else{Chart.draw(chart(),[{color:'#b50246',data:sim.T.map((tt,i)=>[tt,sim.R[i]]),points:false},{color:'#0e7c86',data:sim.T.map((tt,i)=>[tt,sim.S[i]]),points:false}],{xlabel:'Time',ylabel:'Population',ratio:0.5});setLegend([{color:'#b50246',name:'Prey'},{color:'#0e7c86',name:'Predator'}]);t.textContent='Prey & Predator vs time';}
}
function drawField(i){
  if(!sim)return;const maxR=Math.max(10,...sim.R),maxS=Math.max(5,...sim.S);
  const nR=Math.min(150,Math.round(sim.R[i]/maxR*140)),nS=Math.min(130,Math.round(sim.S[i]/maxS*95));
  renderField('field',[{emoji:'🐀',count:nR},{emoji:'🐍',count:nS}]);
}
function info(i){document.getElementById('counts').innerHTML=sim?`Prey: <b>${Math.round(sim.R[i])}</b> &nbsp; Predator: <b>${Math.round(sim.S[i])}</b> &nbsp; Time: <b>${sim.T[i]}</b>`:'';}
function run(){stopAnim();sim=integrate();frame=sim.n;drawChart();drawField(frame);info(frame);toast('Model integrated');}
function play(){if(!sim)run();if(anim){stopAnim();return;}document.getElementById('playBtn').textContent='Pause ⏸';let i=(frame>=sim.n)?0:frame;anim=setInterval(function(){if(i>sim.n){stopAnim();return;}frame=i;drawField(i);info(i);i++;},90);}
function stopAnim(){if(anim){clearInterval(anim);anim=null;}document.getElementById('playBtn').textContent='Play ▶';}
function step(){if(!sim)run();stopAnim();frame=(frame>=sim.n)?0:frame+1;drawField(frame);info(frame);}
function sync(){document.querySelectorAll('#simbox .val').forEach(function(v){var el=document.getElementById(v.id.slice(2));if(el)v.textContent=el.value;});}
const D={prey:140,pred:20,r:0.9,K:200,th:1,a:0.05,e:0.02,c:0.1,sat:10,steps:200,stepSize:1};
function resetSim(){stopAnim();for(const k in D)document.getElementById(k).value=D[k];document.getElementById('modelSel').value='0';document.getElementById('plotMode').value='both';sync();sim=null;frame=0;Chart.draw(chart(),[]);document.getElementById('legend').innerHTML='';document.getElementById('counts').textContent='';renderField('field',[]);toast('Reset');}
function downloadCSV(){if(!sim){toast('Run first');return;}let csv='time,prey,predator\n';for(let i=0;i<=sim.n;i++)csv+=sim.T[i]+','+sim.R[i]+','+sim.S[i]+'\n';dl(csv,'carrying-satiation.csv','text/csv');toast('CSV downloaded');}
sync();window.addEventListener('resize',function(){if(sim){drawChart();drawField(frame);}});
