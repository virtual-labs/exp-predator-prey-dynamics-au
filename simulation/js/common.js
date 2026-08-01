/* Shared helpers for every simulation page (Population Ecology Virtual Lab II). */
function toast(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},2200);}
function dl(t,n,ty){var b=new Blob([t],{type:ty});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();URL.revokeObjectURL(a.href);}
function downloadPNG(name){var cv=document.getElementById('chart');if(!cv||!cv._series){toast('Plot/Run first');return;}var o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;var c=o.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,o.width,o.height);c.drawImage(cv,0,0);var a=document.createElement('a');a.download=name;a.href=o.toDataURL();a.click();toast('PNG downloaded');}
function legendHTML(series){return series.map(function(s){return '<span><i style="background:'+s.color+'"></i>'+(s.name||'')+'</span>';}).join('');}
function setLegend(series){var el=document.getElementById('legend');if(el)el.innerHTML=legendHTML(series);}
function saveRun(key){var o={};document.querySelectorAll('#simbox input,#simbox select').forEach(function(i){o[i.id]=(i.type==='radio'||i.type==='checkbox')?i.checked:i.value;});localStorage.setItem(key,JSON.stringify(o));toast('Run saved');}
function loadRun(key,after){var s=localStorage.getItem(key);if(!s){toast('No saved run');return;}var o=JSON.parse(s);for(var k in o){var el=document.getElementById(k);if(!el)continue;if(el.type==='radio'||el.type==='checkbox')el.checked=o[k];else el.value=o[k];}if(typeof sync==='function')sync();if(after)after();toast('Run loaded');}
/* flicker-free animation: fixed positions, only the count changes */
var _POS=[];(function(){for(var i=0;i<800;i++)_POS.push([Math.random(),Math.random()]);})();
function renderField(canvasId,groups){
  var cv=document.getElementById(canvasId);if(!cv)return;var dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=W*0.36;
  cv.width=W*dpr;cv.height=H*dpr;var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
  c.font='15px serif';c.textAlign='center';c.textBaseline='middle';var idx=0;
  groups.forEach(function(gp){for(var k=0;k<gp.count;k++){var p=_POS[idx%_POS.length];idx++;c.fillText(gp.emoji,10+p[0]*(W-20),10+p[1]*(H-20));}});
}
/* fullscreen — whole simulation box */
function toggleFS(){var el=document.getElementById('simbox');var fsEl=document.fullscreenElement||document.webkitFullscreenElement;if(!fsEl){var rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq)rq.call(el);}else{var ex=document.exitFullscreen||document.webkitExitFullscreen;if(ex)ex.call(document);}}
function _fsSync(){var b=document.getElementById('fsBtn');var on=document.fullscreenElement||document.webkitFullscreenElement;if(b)b.textContent=on?'✕':'⛶';setTimeout(function(){window.dispatchEvent(new Event('resize'));},70);}
document.addEventListener('fullscreenchange',_fsSync);
document.addEventListener('webkitfullscreenchange',_fsSync);
/* chart hover read-out */
window.addEventListener('load',function(){
  var cv=document.getElementById('chart');if(!cv)return;
  cv.addEventListener('pointermove',function(e){
    var M=cv._map;if(!M)return;var r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    if(mx<M.m.l||mx>M.W-M.m.r||my<M.m.t||my>M.H-M.m.b)return;
    var xv=M.xmin+(mx-M.m.l)/(M.W-M.m.l-M.m.r)*(M.xmax-M.xmin);
    var yv=M.ymin+(M.H-M.m.b-my)/(M.H-M.m.b-M.m.t)*(M.ymax-M.ymin);
    var rx=document.getElementById('rx'),ry=document.getElementById('ry');
    if(rx)rx.textContent=xv.toFixed(2);if(ry)ry.textContent=yv.toFixed(2);
  });
});
