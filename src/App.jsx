
import React, { useEffect, useState } from 'react';

/* Escape Noël — version distribuable
   - Uses images in /public/assets/
   - Admin password: Thégoat
   - French UI
*/

const DEFAULT_TEAMS = {
  LLASERA:{members:['Florent','Marie D','Emma','Théo'], notes:{Florent:'adore la randonnée', 'Marie D':'très attentionnée', Emma:'blessée au genou', Théo:'grand maître du jeu'}},
  Marlot:{members:['Marie M','Olivier','Clémentine','Antonin','Félicien'], notes:{'Olivier':'prof de judo','Marie M':'présidente du judo','Clémentine':'dort tout le temps','Antonin':'déra...pe','Félicien':'dans sa cabane'}},
  Pecot:{members:['Norbert','Marie-Luce','Léon','Gaspard'], notes:{Norbert:'aime les legos','Marie-Luce':'fait des gâteaux','Léon':'menuisier',"Gaspard":"s'énerve vite"}},
  Oléron:{members:['Fabien','Claire','Fanny','Anais'], notes:{Fabien:'fait du badminton','Claire':'connaît tout le monde','Fanny':'gardienne de handball','Anais':'la petite du groupe'}},
  Saulnier:{members:['Marc','Marie S','Ana','Camille'], notes:{Marc:'maire de Levier',"Marie S":"s'occupe du jardin",'Ana':'en Irlande','Camille':'dans la lune'}},
  Cuenot:{members:['Bernard','Céline','Manon','Romain'], notes:{Bernard:'plombier','Céline':'prof','Manon':'physique','Romain':'aime le foot'}},
  Baud:{members:['Max','Cyrielle','Zoé','Timothée'], notes:{Max:'parti à Blegny','Cyrielle':'partie à Blegny','Zoé':'gym','Timothée':'basket'}}
};

function nowIso(){ return new Date().toISOString(); }
function saveJSON(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function loadJSON(k, fallback){ try{ const r=localStorage.getItem(k); return r? JSON.parse(r): fallback; }catch(e){ return fallback; } }

function getTeamChestCode(teamKey){ let acc=0; for(let i=0;i<teamKey.length;i++){ acc += teamKey.charCodeAt(i)*(i+3); } return (acc%10000).toString().padStart(4,'0'); }
function defaultFinalAnswer(teamKey){ return teamKey.slice(0,3).toLowerCase(); }

function defaultConfig(){
  return {
    title: 'Escape Noël — Le Trésor de Levier',
    teams: DEFAULT_TEAMS,
    adminPassword: 'Thégoat',
    dailyUnlockHour: 17,
    places: { gymnase:'Gymnase municipal', mairie:'Mairie de Levier', rondeCabane:'Cabane du Rondé', coffreLLASERA:'Coffre chez LLASERA' },
    images: {
      tree: '/assets/gymnase.jpg', // decorative: use gymnase image for now
      gymnase: '/assets/gymnase.jpg',
      mairie: '/assets/mairie.webp',
      rondecabane: '/assets/cabane.png',
      coffre: '/assets/cabane.png'
    },
    audio: { music: null },
    mairieQuizAnswers: { q1:null, q2:null, q3:null },
    chestCodes: {},
    final: { gps:null, code:null, finalAnswerOverrides:{} }
  };
}

function defaultState(cfg){
  const s = loadJSON('eg_state', null);
  if(s) return s;
  const st = { teams:{}, createdAt: nowIso() };
  Object.keys(cfg.teams).forEach(t=> st.teams[t] = { selected:false, startedAt:null, completed:[], answers:{}, photo:null, hints:0, forced:[] });
  return st;
}

export default function App(){
  const [config, setConfig] = useState(()=> loadJSON('eg_config', defaultConfig()));
  const [state, setState] = useState(()=> defaultState(config));
  useEffect(()=> saveJSON('eg_config', config), [config]);
  useEffect(()=> saveJSON('eg_state', state), [state]);

  return (
    <div className="app">
      <IntroOrMain config={config} setConfig={setConfig} state={state} setState={setState} />
    </div>
  );
}

/* Simple Intro then Main */
function IntroOrMain({config, setConfig, state, setState}){
  const [showIntro, setShowIntro] = useState(true);
  useEffect(()=>{
    // auto-start intro audio via user gesture not allowed; we'll auto-play if browser permits
    const pre = setTimeout(()=> setShowIntro(false), 6000); // auto proceed after 6s
    return ()=> clearTimeout(pre);
  },[]);
  return showIntro ? <Intro onEnter={()=>setShowIntro(false)} config={config} /> : <Main config={config} setConfig={setConfig} state={state} setState={setState} />;
}

function Intro({onEnter, config}){
  return (
    <div style={{textAlign:'center', padding:30}}>
      <img src={config.images.tree} alt="sapin" style={{maxWidth:300, borderRadius:12, boxShadow:'0 8px 30px rgba(0,0,0,0.12)'}}/>
      <h1 style={{fontSize:28, marginTop:12}}>Escape Game — Le Trésor de Levier</h1>
      <p style={{color:'#555'}}>Bienvenue aventuriers — la magie de Noël a dispersé les indices autour de Levier.</p>
      <button onClick={onEnter} style={{padding:'10px 18px', marginTop:12, background:'#0b6623', color:'white', borderRadius:8}}>🎄 Entrer dans l'aventure</button>
    </div>
  );
}

/* Main simplified UI: team picker + play screen + admin */
function Main({config, setConfig, state, setState}){
  const [teamKey, setTeamKey] = useState(null);
  const [view, setView] = useState('play');
  return (
    <div>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><strong>{config.title}</strong></div>
        <div style={{fontSize:12, color:'#666'}}>Admin: Thégoat</div>
      </header>
      <div style={{marginTop:12, display:'flex', gap:12}}>
        <div style={{flex:1}}>
          <TeamList teams={config.teams} onChoose={(k)=>{ setTeamKey(k); const s={...state}; if(!s.teams[k].startedAt) s.teams[k].startedAt = nowIso(); s.teams[k].selected=true; setState(s); }} selected={teamKey} />
        </div>
        <div style={{width:220, display:'flex', flexDirection:'column', gap:8}}>
          <button onClick={()=>setView('play')} style={{padding:8}}>Jouer</button>
          <button onClick={()=>setView('admin')} style={{padding:8}}>Admin</button>
          <button onClick={()=>setView('setup')} style={{padding:8}}>Setup</button>
        </div>
      </div>

      {view==='play' && <PlayScreen teamKey={teamKey} config={config} state={state} setState={setState} />}
      {view==='admin' && <AdminScreen config={config} setConfig={setConfig} state={state} setState={setState} />}
      {view==='setup' && <SetupScreen config={config} setConfig={setConfig} />}
    </div>
  );
}

function TeamList({teams, onChoose, selected}){
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8}}>
      {Object.keys(teams).map(k=>(
        <button key={k} onClick={()=>onChoose(k)} style={{textAlign:'left', padding:10, borderRadius:8, border:selected===k?'2px solid #0b6623':'1px solid #ddd'}}>
          <div style={{fontWeight:700}}>{k}</div>
          <div style={{fontSize:12, color:'#555'}}>{teams[k].members.join(', ')}</div>
        </button>
      ))}
    </div>
  );
}

function PlayScreen({teamKey, config, state, setState}){
  if(!teamKey) return <div style={{padding:20}}>Choisis une équipe pour commencer.</div>;
  const team = state.teams[teamKey];
  const completed = team.completed.map(c=>c.step);
  const next = completed.length+1;
  return (
    <div style={{marginTop:16}}>
      <h3>Équipe: {teamKey}</h3>
      <ol>
        {[1,2,3,4,5,6].map(n=>(
          <li key={n} style={{margin:'8px 0'}}>
            <strong>Étape {n}</strong> — {['L\\'étoile disparue','Message au gymnase','Cabane du Rondé','Appel au Grand Maître','Coffre LLASERA','Trésor final'][n-1]}
            <div style={{fontSize:12, color:'#666'}}>{team.completed.find(c=>c.step===n)?'fait':'en attente'}</div>
          </li>
        ))}
      </ol>
      <div style={{marginTop:12}}>
        <p>Code coffre LLASERA: <strong>{config.chestCodes[teamKey] || getTeamChestCode(teamKey)}</strong></p>
        <p>Progression sauvegardée localement. Utilise l'admin pour débloquer ou envoyer indices.</p>
      </div>
    </div>
  );
}

function AdminScreen({config, setConfig, state, setState}){
  const [pw, setPw] = useState('');
  const [auth, setAuth] = useState(false);
  const [sel, setSel] = useState(Object.keys(config.teams)[0]);
  function login(){ if(pw===config.adminPassword){ setAuth(true); } else alert('Mot de passe incorrect'); }
  if(!auth) return (<div style={{padding:10}}><h4>Admin</h4><input placeholder="Mot de passe" value={pw} onChange={(e)=>setPw(e.target.value)} /><button onClick={login}>Se connecter</button><div style={{fontSize:12, color:'#666'}}>Mot de passe: Thégoat</div></div>);
  function uploadImage(key,f){ if(!f) return; const r=new FileReader(); r.onload=()=>{ const c={...config}; c.images={...c.images,[key]:r.result}; setConfig(c); alert('Image uploadée'); }; r.readAsDataURL(f); }
  function setMairie(){ const q1=prompt('Q1 (fusion 2017)'); const q2=prompt('Q2 (massif)'); const q3=prompt('Q3 (seigneur)'); if(q1&&q2&&q3){ const c={...config}; c.mairieQuizAnswers={q1,q2,q3}; setConfig(c); alert('Réponses enregistrées'); } }
  function setFinal(){ const lat=prompt('Lat'); const lon=prompt('Lon'); const code=prompt('Code final'); if(lat&&lon&&code){ const c={...config}; c.final={gps:{lat:parseFloat(lat),lon:parseFloat(lon)}, code}; setConfig(c); alert('Final enregistré'); } }
  return (<div style={{padding:10}}><h4>Admin</h4><div><label>Equipe<select value={sel} onChange={(e)=>setSel(e.target.value)}>{Object.keys(config.teams).map(k=> <option key={k} value={k}>{k}</option>)}</select></label></div>
    <div style={{marginTop:8}}><button onClick={()=>{ const s={...state}; s.teams[sel].forced = [1,2,3,4,5,6]; setState(s); alert('Tout débloqué'); }}>Tout débloquer</button>
    <button onClick={()=>{ const s={...state}; const done=s.teams[sel].completed.map(x=>x.step); const next=Math.min(6, done.length+1); s.teams[sel].forced=s.teams[sel].forced||[]; if(!s.teams[sel].forced.includes(next)) s.teams[sel].forced.push(next); setState(s); alert('Étape '+next+' débloquée'); }} style={{marginLeft:8}}>Débloquer prochaine étape</button></div>
    <div style={{marginTop:10}}><div>Médias:</div>
      <div><label>Gymnase <input type="file" onChange={(e)=>uploadImage('gymnase', e.target.files[0])} /></label></div>
      <div><label>Mairie <input type="file" onChange={(e)=>uploadImage('mairie', e.target.files[0])} /></label></div>
      <div><label>Cabane <input type="file" onChange={(e)=>uploadImage('rondecabane', e.target.files[0])} /></label></div>
      <div style={{marginTop:8}}><button onClick={setMairie}>Saisir réponses mairie (wiki)</button><button onClick={setFinal} style={{marginLeft:8}}>Saisir coordonnées + code final</button></div>
    </div>
  </div>);
}

function SetupScreen({config, setConfig}){ const [t, setT] = useState(config.title||''); return (<div style={{padding:10}}><h4>Setup</h4><input value={t} onChange={(e)=>setT(e.target.value)} /><button onClick={()=>{ setConfig({...config, title:t}); alert('Titre mis à jour'); }}>Sauvegarder</button></div>); }
