// ══════════════════════════════════════════════
// C2 AWARENESS — Full Feature Build
// ══════════════════════════════════════════════

const MAP_CENTER = [37.235, -115.811];
const MAP_ZOOM = 12;

// ── Mock data ──────────────────────────────────
const assets = [
  {id:'001', type:'Air Vehicle', spd:75, rcs:7.278, hdg:29, alt:8460, status:'unknown', lat:37.255, lng:-115.835, dist:16.1, mgrs:'11S MT 14808 28581'},
  {id:'002', type:'Air Vehicle', spd:72, rcs:7.278, hdg:29, alt:8460, status:'unknown', lat:37.248, lng:-115.818, dist:12.4, mgrs:'11S MT 14902 28412'},
  {id:'003', type:'Air Vehicle', spd:78, rcs:7.278, hdg:31, alt:8420, status:'unknown', lat:37.240, lng:-115.800, dist:9.8, mgrs:'11S MT 14978 28305'},
  {id:'004', type:'Air Vehicle', spd:74, rcs:7.278, hdg:27, alt:8500, status:'unknown', lat:37.230, lng:-115.790, dist:8.2, mgrs:'11S MT 15012 28198'},
  {id:'005', type:'Air Vehicle', spd:76, rcs:7.278, hdg:30, alt:8440, status:'unknown', lat:37.222, lng:-115.810, dist:11.5, mgrs:'11S MT 14930 28087'},
  {id:'006', type:'Air Vehicle', spd:80, rcs:7.278, hdg:25, alt:8380, status:'unknown', lat:37.260, lng:-115.780, dist:14.3, mgrs:'11S MT 15045 28620'},
  {id:'007', type:'Air Vehicle', spd:68, rcs:7.278, hdg:33, alt:8520, status:'unknown', lat:37.215, lng:-115.840, dist:18.1, mgrs:'11S MT 14812 27985'},
  {id:'008', type:'Air Vehicle', spd:71, rcs:7.278, hdg:28, alt:8400, status:'unknown', lat:37.262, lng:-115.805, dist:13.7, mgrs:'11S MT 14950 28650'},
];

const expiredAssets = [
  {id:'E01', type:'Air Vehicle', spd:75, rcs:7.278, hdg:29, alt:8460, status:'expired', lat:37.20, lng:-115.83, dist:0, mgrs:'11S MT 14700 27800'},
  {id:'E02', type:'Air Vehicle', spd:75, rcs:7.278, hdg:29, alt:8460, status:'expired', lat:37.19, lng:-115.82, dist:0, mgrs:'11S MT 14750 27700'},
];

const friendlies = [
  {id:'F01', lat:37.250, lng:-115.850, label:'1 PLT', sym:'I'},
  {id:'F02', lat:37.243, lng:-115.825, label:'2 PLT', sym:'II'},
  {id:'F03', lat:37.237, lng:-115.808, label:'HQ', sym:'HQ'},
  {id:'F04', lat:37.228, lng:-115.815, label:'3 PLT', sym:'III'},
  {id:'F05', lat:37.260, lng:-115.820, label:'FIRES', sym:'F'},
  {id:'F06', lat:37.232, lng:-115.795, label:'RECON', sym:'R'},
  {id:'F07', lat:37.245, lng:-115.845, label:'LOG', sym:'L'},
  {id:'F08', lat:37.252, lng:-115.810, label:'AIR DEF', sym:'AD'},
  {id:'F09', lat:37.256, lng:-115.830, label:'ENG', sym:'E'},
  {id:'F10', lat:37.242, lng:-115.840, label:'MED', sym:'+'},
  {id:'F11', lat:37.248, lng:-115.805, label:'SIG', sym:'S'},
  {id:'F12', lat:37.235, lng:-115.820, label:'FST', sym:'▶'},
  {id:'F13', lat:37.265, lng:-115.842, label:'MORT', sym:'M'},
  {id:'F14', lat:37.238, lng:-115.850, label:'TOW', sym:'T'},
  {id:'F15', lat:37.255, lng:-115.802, label:'JAV', sym:'J'},
  {id:'F16', lat:37.247, lng:-115.835, label:'CBRN', sym:'C'},
  {id:'F17', lat:37.233, lng:-115.808, label:'UAS', sym:'U'},
];

const hostiles = [
  {id:'H01', lat:37.218, lng:-115.770, label:'BANDIT 1', hdg:220},
  {id:'H02', lat:37.225, lng:-115.755, label:'BANDIT 2', hdg:210},
  {id:'H03', lat:37.210, lng:-115.785, label:'BANDIT 3', hdg:240},
  {id:'H04', lat:37.205, lng:-115.800, label:'BANDIT 4', hdg:250},
  {id:'H05', lat:37.215, lng:-115.760, label:'BANDIT 5', hdg:215},
  {id:'H06', lat:37.200, lng:-115.775, label:'BANDIT 6', hdg:230},
  {id:'H07', lat:37.212, lng:-115.745, label:'BANDIT 7', hdg:200},
  {id:'H08', lat:37.195, lng:-115.790, label:'BANDIT 8', hdg:260},
  {id:'H09', lat:37.222, lng:-115.740, label:'BANDIT 9', hdg:195},
  {id:'H10', lat:37.208, lng:-115.810, label:'BANDIT 10', hdg:270},
  {id:'H11', lat:37.198, lng:-115.750, label:'BANDIT 11', hdg:205},
  {id:'H12', lat:37.203, lng:-115.730, label:'BANDIT 12', hdg:190},
  {id:'H13', lat:37.190, lng:-115.805, label:'BANDIT 13', hdg:265},
  {id:'H14', lat:37.217, lng:-115.730, label:'BANDIT 14', hdg:185},
];

const targetPoint = {lat:37.212, lng:-115.778}; // primary target near impact

let tracks = [
  {id:'T01', asset:'001', state:'pending', label:'to launch', eta:'01:32', track:'001', dist:11.2},
  {id:'T02', asset:'001', state:'pending', label:'Launching', eta:'01:32', track:'001', dist:11.2},
  {id:'T03', asset:'001', state:'pending', label:'Launching', eta:'01:32', track:'001', dist:11.2},
  {id:'T04', asset:'001', state:'current', label:'to target', eta:'01:32', track:'001', dist:9.2},
  {id:'T05', asset:'002', state:'current', label:'to target', eta:'01:32', track:'002', dist:4.1},
  {id:'T06', asset:'003', state:'current', label:'to target', eta:'01:32', track:'003', dist:3.8},
  {id:'T07', asset:'004', state:'current', label:'to target', eta:'01:32', track:'004', dist:15.2},
  {id:'T08', asset:'005', state:'current', label:'to target', eta:'01:32', track:'005', dist:11.2},
];
for(let i=1;i<=12;i++){
  tracks.push({id:`TC${i}`, asset:String(i%5+1).padStart(3,'0'), state:'complete', label:'complete', eta:'00:00', track:String(i%3+1).padStart(3,'0'), dist:0});
}

// Geofences
const zones = [
  {name:'AO NORTH', color:'rgba(200,170,60,0.7)', fill:'rgba(200,170,60,0.06)',
   coords:[[37.268,-115.860],[37.272,-115.815],[37.258,-115.788],[37.242,-115.792],[37.236,-115.825],[37.248,-115.858]]},
  {name:'KEZ', color:'rgba(226,58,46,0.7)', fill:'rgba(226,58,46,0.10)',
   coords:[[37.222,-115.780],[37.228,-115.752],[37.210,-115.748],[37.203,-115.768],[37.212,-115.785]]},
  {name:'AO SOUTH', color:'rgba(120,100,200,0.6)', fill:'rgba(120,100,200,0.06)',
   coords:[[37.210,-115.825],[37.215,-115.790],[37.198,-115.782],[37.192,-115.808],[37.198,-115.828]]},
];

// Flight paths — higher opacity for visibility
const flightPaths = [
  {pts:[[37.272,-115.858],[37.262,-115.838],[37.252,-115.818],[37.242,-115.802],[37.232,-115.788],[37.222,-115.774]], color:'rgba(95,214,255,0.7)', width:2.5, dash:'10,8'},
  {pts:[[37.270,-115.854],[37.260,-115.834],[37.250,-115.814],[37.240,-115.798],[37.230,-115.784],[37.220,-115.770]], color:'rgba(95,214,255,0.55)', width:2, dash:'8,6'},
  {pts:[[37.268,-115.850],[37.258,-115.830],[37.248,-115.810],[37.238,-115.794],[37.228,-115.780],[37.218,-115.766]], color:'rgba(95,214,255,0.4)', width:1.5, dash:'8,6'},
  {pts:[[37.266,-115.846],[37.256,-115.826],[37.246,-115.806],[37.236,-115.790],[37.226,-115.776],[37.216,-115.762]], color:'rgba(95,214,255,0.3)', width:1, dash:'6,6'},
  {pts:[[37.264,-115.843],[37.254,-115.823],[37.244,-115.803],[37.234,-115.788],[37.224,-115.774],[37.214,-115.760]], color:'rgba(95,214,255,0.2)', width:1, dash:'6,6'},
];

const hostileLinks = [
  [[37.218,-115.770],[37.225,-115.755]],[[37.225,-115.755],[37.212,-115.745]],
  [[37.218,-115.770],[37.210,-115.785]],[[37.210,-115.785],[37.205,-115.800]],
  [[37.215,-115.760],[37.222,-115.740]],[[37.205,-115.800],[37.200,-115.775]],
  [[37.200,-115.775],[37.195,-115.790]],[[37.208,-115.810],[37.205,-115.800]],
  [[37.198,-115.750],[37.212,-115.745]],[[37.203,-115.730],[37.217,-115.730]],
];

const impactPoint = {lat:37.208, lng:-115.798};

// ── State ──────────────────────────────────────
const $ = s => document.querySelector(s);
let leafletMap = null;
let selectedAssetId = '001';
let markerLayers = {};
let layerGroups = {};
let audioCtx = null;
let muted = false;
let eventLog = [];
let prevTrackStates = {};

// ── Audio ──────────────────────────────────────
function getAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq, dur, vol=0.15){
  if(muted) return;
  try{
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur/1000);
  }catch(e){}
}
function beepConfirm(){ beep(400, 60); }
function beepAlert(){ beep(800, 120); }
function beepUrgent(){ beep(1200, 80); setTimeout(()=>beep(1200, 80), 120); }

// ── Toast ──────────────────────────────────────
function showToast(msg, type='info'){
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(()=>{ el.classList.add('fade-out'); }, 3000);
  setTimeout(()=>{ el.remove(); }, 3300);
}

// ── Event log / timeline ───────────────────────
function logEvent(type, label){
  eventLog.push({type, label, time: Date.now()});
  renderTimeline();
}

function renderTimeline(){
  const track = $('#tlTrack');
  const now = Date.now();
  const span = 10*60*1000; // 10 min window
  const start = now - span;
  const w = track.offsetWidth || 800;

  let html = '';
  // Tick marks every minute
  for(let i=0;i<=10;i++){
    const x = (i/10)*100;
    const t = new Date(start + i*60*1000);
    const lbl = `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
    html += `<div class="tl-tick${i%5===0?' major':''}" style="position:absolute;left:${x}%"></div>`;
    if(i%2===0) html += `<div class="tl-label" style="left:${x}%">${lbl}</div>`;
  }
  // Events
  eventLog.forEach(ev => {
    if(ev.time < start) return;
    const x = ((ev.time - start)/span)*100;
    html += `<div class="tl-event ${ev.type}" style="left:${x}%"><div class="tl-tip">${ev.label}</div></div>`;
  });
  track.innerHTML = html;
}

// ── Haversine distance (km) ────────────────────
function haversine(lat1,lon1,lat2,lon2){
  const R=6371, toR=Math.PI/180;
  const dLat=(lat2-lat1)*toR, dLon=(lon2-lon1)*toR;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*toR)*Math.cos(lat2*toR)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ── Renderers ──────────────────────────────────
function assetCard(a){
  const sel = a.id === selectedAssetId;
  const isExpired = a.status === 'expired';
  return `<div class="asset${sel?' selected':''}${isExpired?' expired-card':''}" data-id="${a.id}" draggable="${!isExpired}">
    <div class="asset-head">
      <div class="asset-title"><span class="tri">▲</span><b>${a.type}</b></div>
      <div style="display:flex;align-items:center;gap:4px">
        ${!isExpired?'<span class="cam-icon">📹</span>':''}
        <span class="asset-id">Track ${a.id}</span>
      </div>
    </div>
    ${sel && !isExpired ? expandedCard(a) : compactCard(a)}
  </div>`;
}

function expandedCard(a){
  return `<div class="asset-expanded">
    <div class="stats-4">
      <div class="stat-4"><div class="l">SPEED</div><div class="v">${a.spd}<small style="color:var(--dim);font-size:8px">m/s</small></div></div>
      <div class="stat-4"><div class="l">RCS</div><div class="v">${a.rcs.toFixed(3)}</div></div>
      <div class="stat-4"><div class="l">HEADING</div><div class="v">${a.hdg}°</div></div>
      <div class="stat-4"><div class="l">ALTITUDE</div><div class="v">${a.alt.toLocaleString()}<small style="color:var(--dim);font-size:8px">m</small></div></div>
    </div>
    <div class="detail-row">
      <div><div class="l">DISTANCE ◇</div><div class="v">${a.dist.toFixed(1)} km 98°</div></div>
      <div><div class="l">LOCATION</div><div class="v">${a.mgrs}</div></div>
    </div>
    <div class="action-row">
      <select class="dropdown"><option>Unknown ▾</option><option>Hostile</option><option>Friendly</option></select>
      <button class="icon-btn green">✓</button>
      <button class="icon-btn">⋯</button>
      <button class="btn-task">Task</button>
    </div>
  </div>`;
}

function compactCard(a){
  return `<div class="stats-compact">
    <span><span class="l">SPEED</span>${a.spd}<small style="color:var(--dim);font-size:8px">m/s</small></span>
    <span><span class="l">RCS</span>${a.rcs.toFixed(3)}</span>
    <span><span class="l">HEADING</span>${a.hdg}°</span>
    <span><span class="l">ALTITUDE</span>${a.alt.toLocaleString()}<small style="color:var(--dim);font-size:8px">m</small></span>
  </div>`;
}

function trackRow(t, idx){
  let action = '';
  if(t.state==='pending'){
    action = t.label==='to launch'
      ? `<button class="btn cancel" data-i="${idx}">Cancel</button>`
      : `<button class="btn estop" data-i="${idx}">⊘ E-Stop</button>`;
  } else if(t.state==='current'){
    action = `<button class="btn estop" data-i="${idx}">⊘ E-Stop</button>`;
  }
  const urgent = t.dist && t.dist < 2;
  return `<div class="track" data-asset="${t.asset}" data-idx="${idx}">
    <div class="track-info">
      <div class="track-id"><span class="arrow">↓</span> Asset ${t.asset}</div>
      <div class="track-meta">
        ${t.state!=='complete'?`<span class="track-eta">${t.eta}</span>`:''}
        ${t.label}
      </div>
    </div>
    ${t.dist?`<span class="dist-pill${urgent?' urgent':''}">${t.dist.toFixed(1)} km</span>`:''}
    <span class="pill"><span class="arrow">↓</span> Track ${t.track}</span>
    ${action}
  </div>`;
}

function render(){
  $('#needsList').innerHTML = assets.map(a=>assetCard(a)).join('');
  $('#needsCount').textContent = assets.length;
  $('#expiredSection').innerHTML = expiredAssets.map(a=>assetCard(a)).join('');

  const groups = {pending:[], current:[], complete:[]};
  tracks.forEach((t,i)=>groups[t.state].push({...t,_i:i}));

  if(groups.pending.length>0){
    const pt = groups.pending[0];
    $('#pendingSub').innerHTML = `
      <div class="pending-spinner"></div>
      <span class="pending-label">Track ${pt.track} pending</span>
      <span class="pending-close">⊘</span>`;
    $('#pendingSub').style.display = 'flex';
  } else {
    $('#pendingSub').style.display = 'none';
  }

  $('#pendingCount').textContent = groups.pending.length;
  $('#pendingList').innerHTML = groups.pending.map(t=>trackRow(t,t._i)).join('');
  $('#currentList').innerHTML = groups.current.map(t=>trackRow(t,t._i)).join('');
  $('#completeList').innerHTML = groups.complete.map(t=>trackRow(t,t._i)).join('');
  $('#currentCount').textContent = groups.current.length;
  $('#completeCount').textContent = groups.complete.length;

  // Detect state changes for audio/toast
  tracks.forEach(t=>{
    const key = t.id;
    const prev = prevTrackStates[key];
    if(prev && prev !== t.state){
      if(t.state==='complete' && t.label==='stopped'){
        beepConfirm();
        showToast(`Asset ${t.asset} stopped`, 'alert');
        logEvent('estop', `E-Stop ${t.asset}`);
      } else if(t.state==='complete' && t.label==='cancelled'){
        beepConfirm();
        showToast(`Track ${t.track} cancelled`, 'warning');
        logEvent('cancel', `Cancel ${t.track}`);
      }
    }
    prevTrackStates[key] = t.state;
  });
}

// ── Leaflet map ────────────────────────────────
function initMap(){
  leafletMap = L.map('mapCanvas', {
    zoomControl:false, attributionControl:false,
    dragging:true, scrollWheelZoom:true,
  }).setView(MAP_CENTER, MAP_ZOOM);

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {maxZoom:18}
  ).addTo(leafletMap);

  // Layer groups
  layerGroups.zones = L.layerGroup().addTo(leafletMap);
  layerGroups.paths = L.layerGroup().addTo(leafletMap);
  layerGroups.friendly = L.layerGroup().addTo(leafletMap);
  layerGroups.hostile = L.layerGroup().addTo(leafletMap);
  layerGroups.unknown = L.layerGroup().addTo(leafletMap);

  // Geofences
  zones.forEach(z=>{
    L.polygon(z.coords, {color:z.color, weight:1.5, fillColor:z.fill, fillOpacity:1, dashArray:'8,5'})
      .addTo(layerGroups.zones)
      .bindTooltip(z.name, {permanent:false, className:'zone-tip'});
  });

  // Flight paths
  flightPaths.forEach(fp=>{
    L.polyline(fp.pts, {color:fp.color, weight:fp.width, dashArray:fp.dash}).addTo(layerGroups.paths);
  });

  // Hostile links
  hostileLinks.forEach(hl=>{
    L.polyline(hl, {color:'rgba(226,58,46,0.5)', weight:1, dashArray:'4,4'}).addTo(layerGroups.hostile);
  });

  // Smoke plume (multi-layer)
  const smokeIcon = L.divIcon({
    className:'map-marker',
    html:`<div class="smoke-plume">
      <div class="smoke-layer"></div>
      <div class="smoke-layer"></div>
      <div class="smoke-layer"></div>
    </div>`,
    iconSize:[120,120], iconAnchor:[60,60],
  });
  L.marker([impactPoint.lat, impactPoint.lng], {icon:smokeIcon, interactive:false}).addTo(leafletMap);

  // Secondary smoke particles
  for(let i=0;i<4;i++){
    const pIcon = L.divIcon({
      className:'map-marker',
      html:`<div style="width:${30+i*15}px;height:${30+i*15}px;border-radius:50%;
        background:radial-gradient(circle,rgba(50,40,30,${0.4-i*0.08}) 0%,transparent 70%);
        filter:blur(${3+i*2}px);animation:smoke-drift${(i%3)+1} ${3+i*0.5}s ease-in-out infinite"></div>`,
      iconSize:[60,60], iconAnchor:[30,30],
    });
    L.marker([impactPoint.lat+(Math.random()-0.5)*0.004, impactPoint.lng+(Math.random()-0.5)*0.004],
      {icon:pIcon, interactive:false}).addTo(leafletMap);
  }

  // Persistent hostile callout on map
  const hostileCallout = L.divIcon({
    className:'map-marker',
    html:`<div class="map-callout">
      <div class="mc-label">HOSTILE</div>
      <div class="mc-type">Air Vehicle</div>
      <div class="mc-stats"><b>75</b> m/s  <b>7</b> RCS</div>
      <div class="mc-stats"><b>8640</b> ft AGL</div>
    </div>`,
    iconSize:[140,60], iconAnchor:[-10,30],
  });
  L.marker([impactPoint.lat+0.003, impactPoint.lng+0.005], {icon:hostileCallout, interactive:false}).addTo(leafletMap);

  // Friendly markers
  friendlies.forEach(f=>{
    const icon = L.divIcon({
      className:'map-marker',
      html:`<div class="unit-icon friendly">${f.sym}</div>`,
      iconSize:[18,14], iconAnchor:[9,7],
    });
    L.marker([f.lat,f.lng], {icon}).addTo(layerGroups.friendly)
      .bindTooltip(f.label, {permanent:false, className:'friendly-tip', offset:[12,0]});
  });

  // Hostile markers
  hostiles.forEach(h=>{
    const icon = L.divIcon({
      className:'map-marker',
      html:`<div class="unit-icon hostile"><span>✦</span></div>`,
      iconSize:[14,14], iconAnchor:[7,7],
    });
    const m = L.marker([h.lat,h.lng], {icon}).addTo(layerGroups.hostile);
    m.bindTooltip(h.label, {permanent:false, className:'hostile-tip', offset:[12,0]});

    // Direction arrow
    const arrowIcon = L.divIcon({
      className:'map-marker',
      html:`<svg viewBox="0 0 10 14" width="8" height="12" style="transform:rotate(${h.hdg}deg)">
        <polygon points="5,0 10,14 5,10 0,14" fill="rgba(226,58,46,0.7)"/>
      </svg>`,
      iconSize:[8,12], iconAnchor:[4,-4],
    });
    L.marker([h.lat,h.lng], {icon:arrowIcon, interactive:false}).addTo(layerGroups.hostile);
  });

  // Unknown / asset markers
  assets.forEach(a=>{
    const icon = L.divIcon({
      className:'map-marker',
      html:`<div class="unit-icon unknown">▲</div>`,
      iconSize:[14,14], iconAnchor:[7,7],
    });
    const m = L.marker([a.lat,a.lng], {icon}).addTo(layerGroups.unknown);
    m.on('click', ()=>selectAsset(a.id));
    m.bindTooltip(`Track ${a.id}`, {permanent:false, className:'unknown-tip', offset:[10,0]});
    markerLayers[a.id] = m;
  });
}

// ── Selection / callout ────────────────────────
function selectAsset(id){
  selectedAssetId = id;
  const a = assets.find(x=>x.id===id);
  if(!a) return;

  const callout = $('#callout');
  callout.hidden = false;
  $('#calloutLabel').textContent = a.status==='unknown'?'HOSTILE':a.status.toUpperCase();
  $('#calloutHead').textContent = a.type;
  $('#cSpd').textContent = a.spd;
  $('#cRcs').textContent = a.rcs.toFixed(0);
  $('#cAlt').textContent = a.alt.toLocaleString();

  if(leafletMap && markerLayers[id]){
    const pt = leafletMap.latLngToContainerPoint(markerLayers[id].getLatLng());
    callout.style.left = (pt.x+18)+'px';
    callout.style.top = (pt.y-8)+'px';
  }
  render();
  leafletMap.panTo([a.lat,a.lng], {animate:true, duration:0.4});
}

// ── Events ─────────────────────────────────────
document.addEventListener('click', e=>{
  const card = e.target.closest('.asset');
  if(card && !e.target.closest('.btn') && !e.target.closest('.dropdown') && !e.target.closest('.icon-btn') && !e.target.closest('.btn-task')){
    selectAsset(card.dataset.id);
    return;
  }

  const estop = e.target.closest('.btn.estop');
  if(estop){
    const i = +estop.dataset.i;
    tracks[i].state = 'complete';
    tracks[i].label = 'stopped';
    tracks[i].dist = 0;
    render();
    return;
  }

  const cancel = e.target.closest('.btn.cancel');
  if(cancel){
    const i = +cancel.dataset.i;
    tracks[i].state = 'complete';
    tracks[i].label = 'cancelled';
    tracks[i].dist = 0;
    render();
    return;
  }

  // Collapsible sections
  const coll = e.target.closest('.collapsible');
  if(coll){
    const section = coll.dataset.section;
    const el = document.getElementById(section)||document.getElementById(section+'Section');
    if(el){
      el.classList.toggle('open');
      const chev = coll.querySelector('.chevron');
      if(chev) chev.classList.toggle('down');
    }
    return;
  }

  // Layer toggles
  const layerBtn = e.target.closest('.layer-btn[data-layer]');
  if(layerBtn){
    const layer = layerBtn.dataset.layer;
    layerBtn.classList.toggle('active');
    if(layerBtn.classList.contains('active')){
      layerGroups[layer].addTo(leafletMap);
    } else {
      leafletMap.removeLayer(layerGroups[layer]);
    }
    return;
  }

  // NVG toggle
  if(e.target.closest('#nvgBtn')){
    document.body.classList.toggle('nvg');
    e.target.closest('#nvgBtn').classList.toggle('active');
    return;
  }

  // Mute toggle
  if(e.target.closest('#muteBtn')){
    muted = !muted;
    const btn = e.target.closest('#muteBtn');
    btn.classList.toggle('active');
    btn.querySelector('.ldot').nextSibling.textContent = muted?'🔇':'🔊';
    return;
  }

  if(e.target.closest('.map') && !e.target.closest('.callout') && !e.target.closest('.map-marker') && !e.target.closest('.layer-bar')){
    $('#callout').hidden = true;
    selectedAssetId = null;
    render();
  }
});

// Search
$('.search').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#needsList .asset').forEach(el=>{
    el.style.display = el.textContent.toLowerCase().includes(q)?'':'none';
  });
});

// Track hover → pulse marker
document.addEventListener('mouseover', e=>{
  const row = e.target.closest('.track[data-asset]');
  if(row && markerLayers[row.dataset.asset]) markerLayers[row.dataset.asset].getElement()?.classList.add('pulse');
});
document.addEventListener('mouseout', e=>{
  const row = e.target.closest('.track[data-asset]');
  if(row && markerLayers[row.dataset.asset]) markerLayers[row.dataset.asset].getElement()?.classList.remove('pulse');
});

// ── Keyboard shortcuts ─────────────────────────
document.addEventListener('keydown', e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT') return;

  const idx = assets.findIndex(a=>a.id===selectedAssetId);

  switch(e.key){
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      if(idx>0) selectAsset(assets[idx-1].id);
      else if(idx===-1) selectAsset(assets[0].id);
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      if(idx<assets.length-1) selectAsset(assets[idx+1].id);
      else if(idx===-1) selectAsset(assets[0].id);
      break;
    case 'e':
    case 'E':
      // E-Stop first current track
      const ci = tracks.findIndex(t=>t.state==='current');
      if(ci>=0){
        tracks[ci].state='complete';
        tracks[ci].label='stopped';
        tracks[ci].dist=0;
        render();
      }
      break;
    case 't':
    case 'T':
      if(selectedAssetId){
        const card = document.querySelector(`.asset[data-id="${selectedAssetId}"]`);
        if(card) card.style.borderLeftColor='var(--cyan)';
        showToast(`Asset ${selectedAssetId} tasked`, 'info');
        logEvent('launch', `Tasked ${selectedAssetId}`);
      }
      break;
    case 'Escape':
      $('#callout').hidden = true;
      selectedAssetId = null;
      render();
      break;
    case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':
      const n = parseInt(e.key)-1;
      if(assets[n]) selectAsset(assets[n].id);
      break;
  }
});

// ── Drag & drop ────────────────────────────────
let dragAssetId = null;

document.addEventListener('dragstart', e=>{
  const card = e.target.closest('.asset');
  if(card){
    dragAssetId = card.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragAssetId);
    card.style.opacity = '0.5';
  }
});

document.addEventListener('dragend', e=>{
  const card = e.target.closest('.asset');
  if(card) card.style.opacity = '1';
  document.querySelectorAll('.track.drop-target').forEach(el=>el.classList.remove('drop-target'));
  dragAssetId = null;
});

document.addEventListener('dragover', e=>{
  const row = e.target.closest('.track');
  if(row && dragAssetId){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    row.classList.add('drop-target');
  }
});

document.addEventListener('dragleave', e=>{
  const row = e.target.closest('.track');
  if(row) row.classList.remove('drop-target');
});

document.addEventListener('drop', e=>{
  e.preventDefault();
  const row = e.target.closest('.track');
  if(row && dragAssetId){
    const idx = +row.dataset.idx;
    if(!isNaN(idx) && tracks[idx]){
      tracks[idx].asset = dragAssetId;
      showToast(`Track ${tracks[idx].track} → Asset ${dragAssetId}`, 'info');
      logEvent('complete', `Reassign → ${dragAssetId}`);
      beepConfirm();
      render();
    }
    row.classList.remove('drop-target');
  }
  dragAssetId = null;
});

// ── Init ───────────────────────────────────────
// Snapshot initial track states
tracks.forEach(t=>{ prevTrackStates[t.id] = t.state; });
render();
initMap();
renderTimeline();

// Seed some initial events
logEvent('launch', 'System init');
logEvent('launch', 'Track 001 created');

// ── Telemetry loop ─────────────────────────────
setInterval(()=>{
  assets.forEach(a=>{
    a.spd = Math.max(60, Math.min(95, a.spd+Math.round((Math.random()-0.5)*2)));
    a.hdg = (a.hdg+Math.round((Math.random()-0.5)*2)+360)%360;
    a.alt = Math.max(7800, Math.min(9200, a.alt+Math.round((Math.random()-0.5)*20)));
    a.lat += (Math.random()-0.5)*0.00015;
    a.lng += (Math.random()-0.5)*0.00015;

    // Update distance to target
    a.dist = haversine(a.lat, a.lng, targetPoint.lat, targetPoint.lng);

    if(markerLayers[a.id]) markerLayers[a.id].setLatLng([a.lat, a.lng]);
  });

  // Update track distances
  tracks.forEach(t=>{
    if(t.state==='current'||t.state==='pending'){
      const a = assets.find(x=>x.id===t.asset);
      if(a){
        t.dist = a.dist;
        // Urgency alert
        if(t.dist < 2 && t.state==='current'){
          beepUrgent();
          showToast(`Asset ${t.asset} < 2km from target!`, 'alert');
        }
      }
    }
  });

  render();

  // Update callout position
  if(selectedAssetId){
    const a = assets.find(x=>x.id===selectedAssetId);
    if(a && leafletMap && markerLayers[a.id]){
      const callout = $('#callout');
      if(!callout.hidden){
        $('#cSpd').textContent = a.spd;
        $('#cAlt').textContent = a.alt.toLocaleString();
        const pt = leafletMap.latLngToContainerPoint(markerLayers[a.id].getLatLng());
        callout.style.left = (pt.x+18)+'px';
        callout.style.top = (pt.y-8)+'px';
      }
    }
  }
}, 2000);

// Timeline refresh
setInterval(renderTimeline, 10000);
