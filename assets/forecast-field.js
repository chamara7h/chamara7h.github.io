
(()=>{
const canvas=document.getElementById('field');
if(!canvas)return;
const ctx=canvas.getContext('2d'),hero=document.querySelector('.hero'),button=document.getElementById('motion'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let w=0,h=0,t=0,last=0,raf=0,visible=true,playing=!reduced.matches,pointer={x:0,y:0},target={x:0,y:0};
const dots=Array.from({length:36},(_,i)=>({x:((i*73+17)%359)/359,y:((i*47+13)%101)/101,r:2+(i%5)*1.25,phase:i*2.17,gold:i%6===0}));
function size(){const box=hero.getBoundingClientRect();w=box.width;h=box.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw();}
function curve(x,offset){return h*(.93-.28*x+.035*Math.sin(x*8+offset)) +offset*h*.055;}
function draw(){ctx.clearRect(0,0,w,h);pointer.x+=(target.x-pointer.x)*.025;pointer.y+=(target.y-pointer.y)*.025;
for(let k=0;k<4;k++){ctx.beginPath();for(let n=0;n<=100;n++){const x=n/100;const yy=curve(x,k)+Math.sin(t*.2+x*4)*6; n?ctx.lineTo(x*w,yy):ctx.moveTo(x*w,yy);}ctx.strokeStyle=k===1?'rgba(173,133,64,.12)':'rgba(69,109,128,.09)';ctx.lineWidth=.8;ctx.stroke();}
for(const d of dots){const x=(d.x+t*.007)%1;let y=curve(x,d.y*3)-Math.sin(d.phase+t*.35)*h*.045;const px=x*w+pointer.x*9,py=y+pointer.y*7;ctx.beginPath();ctx.arc(px,py,d.r,0,Math.PI*2);ctx.fillStyle=d.gold?'rgba(173,133,64,.39)':'rgba(69,109,128,'+(.17+(d.r/30))+')';ctx.fill();}
}
function tick(now){if(!playing||document.hidden||!visible){raf=0;return}t+=last?Math.min((now-last)/1000,.05):0;last=now;draw();raf=requestAnimationFrame(tick);}
function sync(){button.setAttribute('aria-pressed',String(playing));button.textContent=playing?'Ⅱ   Pause motion':'▷   Play motion';if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(playing&&visible&&!document.hidden)raf=requestAnimationFrame(tick);else draw();}
button.addEventListener('click',()=>{playing=!playing;sync()});reduced.addEventListener('change',()=>{playing=!reduced.matches;sync()});
hero.addEventListener('pointermove',e=>{if(!playing||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();target={x:(e.clientX-r.left)/w-.5,y:(e.clientY-r.top)/h-.5};});hero.addEventListener('pointerleave',()=>{target={x:0,y:0}});
new ResizeObserver(size).observe(hero);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(hero);document.addEventListener('visibilitychange',sync);size();sync();
})();
