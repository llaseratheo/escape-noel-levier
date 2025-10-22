
// snow.js - simple snow canvas effect
(function(){
  function startSnow(){
    if(document.getElementById('snow-canvas')) return;
    const c = document.createElement('canvas'); c.id='snow-canvas';
    c.style.position='fixed'; c.style.left=0; c.style.top=0; c.style.pointerEvents='none'; c.style.zIndex=9999;
    document.body.appendChild(c); const ctx=c.getContext('2d');
    function resize(){ c.width=window.innerWidth; c.height=window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const flakes=[]; for(let i=0;i<120;i++) flakes.push({x:Math.random()*c.width,y:Math.random()*c.height,r:1+Math.random()*3, s:0.3+Math.random()*1.2, d:Math.random()*Math.PI*2});
    function draw(){ ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle='rgba(255,255,255,0.9)'; for(let f of flakes){ ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); f.y += f.s; f.x += Math.sin(f.d)*0.5; f.d += 0.01; if(f.y>c.height+10){ f.y=-10; f.x=Math.random()*c.width; } } requestAnimationFrame(draw); }
    draw();
  }
  if(typeof window !== 'undefined') window.startSnow = startSnow;
})();
