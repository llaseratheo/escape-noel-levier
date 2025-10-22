
document.addEventListener('DOMContentLoaded', function(){
  // background music
  let music = document.createElement('audio'); music.id='eg-music'; music.src='/musique_noel.wav'; music.loop=true; music.volume=0.25; music.autoplay=true; music.play().catch(()=>{}); document.body.appendChild(music);
  let narr = document.createElement('audio'); narr.id='eg-narr'; narr.src='/voice_narration.wav'; narr.volume=0.95; narr.autoplay=true; narr.play().catch(()=>{}); document.body.appendChild(narr);
  // controls
  const ctrl = document.createElement('div'); ctrl.style.position='fixed'; ctrl.style.right='12px'; ctrl.style.top='12px'; ctrl.style.zIndex=99999; ctrl.style.display='flex'; ctrl.style.gap='8px';
  const btnM = document.createElement('button'); btnM.textContent='🎵'; btnM.onclick=()=>{ if(music.paused){ music.play(); } else { music.pause(); } };
  const btnN = document.createElement('button'); btnN.textContent='🗣️'; btnN.onclick=()=>{ if(narr.paused){ narr.play(); } else { narr.pause(); } };
  ctrl.appendChild(btnM); ctrl.appendChild(btnN); document.body.appendChild(ctrl);
  // start snow if body has data-snow=1
  if(document.body.dataset.snow === '1'){ const s = document.createElement('script'); s.src='/snow.js'; s.onload = ()=>{ startSnow(); }; document.body.appendChild(s); }
});
