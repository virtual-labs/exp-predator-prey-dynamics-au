/* Lightweight dependency-free line/scatter chart engine (dual-axis capable). */
const Chart=(()=>{
function fmt(v){const a=Math.abs(v);if(a>=1000)return(v/1000).toFixed(a>=10000?0:1)+'k';if(a>0&&a<1)return v.toFixed(2);if(!Number.isInteger(v))return v.toFixed(1);return''+v;}
function draw(cv,series,opts={}){
  const dpr=window.devicePixelRatio||1,W=cv.clientWidth||cv.width,H=W*(opts.ratio||0.52);
  cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  const hasR=series.some(s=>s.axis==='r');const m={l:58,r:hasR?58:18,t:16,b:44};g.clearRect(0,0,W,H);
  let xs=[];series.forEach(s=>s.data.forEach(p=>xs.push(p[0])));
  if(!xs.length){g.fillStyle='#9aa3b2';g.font='15px Segoe UI';g.textAlign='center';g.fillText('Press "Run" to see results',W/2,H/2);cv._series=null;cv._map=null;return;}
  const L=series.filter(s=>s.axis!=='r'),R=series.filter(s=>s.axis==='r');
  let ysL=[];L.forEach(s=>s.data.forEach(p=>ysL.push(p[1])));if(!ysL.length)ysL=[0,1];
  let ysR=[];R.forEach(s=>s.data.forEach(p=>ysR.push(p[1])));
  let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(0,...ysL),ymax=Math.max(...ysL);
  if(opts.xmin!=null)xmin=opts.xmin;if(opts.ymin!=null)ymin=opts.ymin;
  if(xmax===xmin)xmax=xmin+1;if(ymax===ymin)ymax=ymin+1;ymax+=(ymax-ymin)*0.08;
  let ymin2=0,ymax2=1;if(ysR.length){ymin2=Math.min(0,...ysR);ymax2=Math.max(...ysR);if(ymax2===ymin2)ymax2=ymin2+1;ymax2+=(ymax2-ymin2)*0.08;}
  const X=x=>m.l+(x-xmin)/(xmax-xmin)*(W-m.l-m.r);
  const YL=y=>H-m.b-(y-ymin)/(ymax-ymin)*(H-m.t-m.b);
  const YR=y=>H-m.b-(y-ymin2)/(ymax2-ymin2)*(H-m.t-m.b);
  g.font='12px Segoe UI';const nT=6;
  for(let i=0;i<=nT;i++){const gy=ymin+(ymax-ymin)*i/nT;g.strokeStyle='#eef1f6';g.beginPath();g.moveTo(m.l,YL(gy));g.lineTo(W-m.r,YL(gy));g.stroke();g.fillStyle='#7b8494';g.textAlign='right';g.textBaseline='middle';g.fillText(fmt(gy),m.l-8,YL(gy));}
  if(ysR.length){for(let i=0;i<=nT;i++){const gy=ymin2+(ymax2-ymin2)*i/nT;g.fillStyle='#0e7c86';g.textAlign='left';g.textBaseline='middle';g.fillText(fmt(gy),W-m.r+8,YR(gy));}}
  for(let i=0;i<=nT;i++){const gx=xmin+(xmax-xmin)*i/nT;g.strokeStyle='#f4f6fa';g.beginPath();g.moveTo(X(gx),m.t);g.lineTo(X(gx),H-m.b);g.stroke();g.fillStyle='#7b8494';g.textAlign='center';g.textBaseline='top';g.fillText(fmt(gx),X(gx),H-m.b+6);}
  g.strokeStyle='#c7ccd6';g.beginPath();g.moveTo(m.l,m.t);g.lineTo(m.l,H-m.b);g.lineTo(W-m.r,H-m.b);g.stroke();
  g.fillStyle='#4a5261';g.font='13px Segoe UI';
  if(opts.xlabel){g.textAlign='center';g.fillText(opts.xlabel,(m.l+W-m.r)/2,H-10);}
  if(opts.ylabel){g.save();g.translate(15,(m.t+H-m.b)/2);g.rotate(-Math.PI/2);g.textAlign='center';g.fillText(opts.ylabel,0,0);g.restore();}
  if(opts.ylabelR){g.save();g.translate(W-13,(m.t+H-m.b)/2);g.rotate(Math.PI/2);g.textAlign='center';g.fillStyle='#0e7c86';g.fillText(opts.ylabelR,0,0);g.restore();}
  series.forEach(s=>{if(!s.data.length)return;const Y=s.axis==='r'?YR:YL;g.strokeStyle=s.color;g.lineWidth=2.4;g.setLineDash(s.dash?[6,5]:[]);g.beginPath();s.data.forEach((p,i)=>{const px=X(p[0]),py=Y(p[1]);i?g.lineTo(px,py):g.moveTo(px,py);});g.stroke();g.setLineDash([]);if(s.points!==false){g.fillStyle=s.color;s.data.forEach(p=>{g.beginPath();g.arc(X(p[0]),Y(p[1]),2.3,0,7);g.fill();});}});
  cv._series=series;cv._map={xmin,xmax,ymin,ymax,m,W,H};
}
return{draw};})();
