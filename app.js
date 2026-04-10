// ── Config ──
const MAP_CENTER = [37.235, -115.811];
const MAP_ZOOM = 12;

// ── Mock data ──
const assets = [
  {id:'001', type:'Air Vehicle', spd:75, hdg:278, alt:8460, status:'unknown', lat:37.255, lng:-115.835, mgrs:'15TvH 14856 23581'},
  {id:'002', type:'Air Vehicle', spd:72, hdg:279, alt:8460, status:'unknown', lat:37.248, lng:-115.818, mgrs:'15TvH 14902 23412'},
  {id:'003', type:'Air Vehicle', spd:78, hdg:281, alt:8420, status:'unknown', lat:37.240, lng:-115.800, mgrs:'15TvH 14978 23305'},
  {id:'004', type:'Air Vehicle', spd:74, hdg:277, alt:8500, status:'unknown', lat:37.230, lng:-115.790, mgrs:'15TvH 15012 23198'},
  {id:'005', type:'Air Vehicle', spd:76, hdg:280, alt:8440, status:'unknown', lat:37.222, lng:-115.810, mgrs:'15TvH 14930 23087'},
  {id:'006', type:'Air Vehicle', spd:80, hdg:275, alt:8380, status:'unknown', lat:37.260, lng:-115.780, mgrs:'15TvH 15045 23620'},
  {id:'007', type:'Air Vehicle', spd:68, hdg:283, alt:8520, status:'unknown', lat:37.215, lng:-115.840, mgrs:'15TvH 14812 22985'},
];

const friendlies = [
  {id:'F01', lat:37.250, lng:-115.850, label:'ALPHA'},
  {id:'F02', lat:37.243, lng:-115.825, label:'BRAVO'},
  {id:'F03', lat:37.237, lng:-115.808, label:'CHARLIE'},
  {id:'F04', lat:37.228, lng:-115.815, label:'DELTA'},
  {id:'F05', lat:37.260, lng:-115.820, label:'ECHO'},
  {id:'F06', lat:37.232, lng:-115.795, label:'FOXTROT'},
  {id:'F07', lat:37.245, lng:-115.845, label:'GOLF'},
  {id:'F08', lat:37.252, lng:-115.810, label:'HOTEL'},
];

const hostiles = [
  {id:'H01', lat:37.218, lng:-115.770, label:'BANDIT 1'},
  {id:'H02', lat:37.225, lng:-115.755, label:'BANDIT 2'},
  {id:'H03', lat:37.210, lng:-115.785, label:'BANDIT 3'},
  {id:'H04', lat:37.205, lng:-115.800, label:'BANDIT 4'},
  {id:'H05', lat:37.215, lng:-115.760, label:'BANDIT 5'},
  {id:'H06', lat:37.200, lng:-115.775, label:'BANDIT 6'},
  {id:'H07', lat:37.212, lng:-115.745, label:'BANDIT 7'},
];

let tracks = [
  {id:'T01', asset:'001', state:'pending', label:'to launch', eta:'01:32', track:'001'},
  {id:'T02', asset:'001', state:'pending', label:'launching', eta:'01:32', track:'001'},
  {id:'T03', asset:'001', state:'pending', label:'launching', eta:'01:32', track:'001'},
  {id:'T04', asset:'001', state:'current', label:'to target', eta:'01:32', track:'001'},
  {id:'T05', asset:'002', state:'current', label:'to target', eta:'01:32', track:'002'},
  {id:'T06', asset:'003', state:'current', label:'to target', eta:'01:32', track:'003'},
  {id:'T07', asset:'004', state:'current', label:'to target', eta:'01:32', track:'004'},
  {id:'T08', asset:'005', state:'current', label:'to target', eta:'01:32', track:'005'},
];

// Geofence zones
const zones = [
  {name:'AO NORTH', color:'rgba(255,200,80,0.5)', fill:'rgba(255,200,80,0.06)',
   coords:[[37.265,-115.860],[37.270,-115.815],[37.255,-115.790],[37.240,-115.795],[37.238,-115.830],[37.250,-115.855]]},
  {name:'KEZ', color:'rgba(226,58,46,0.7)', fill:'rgba(226,58,46,0.10)',
   coords:[[37.220,-115.780],[37.225,-115.755],[37.208,-115.750],[37.203,-115.770],[37.210,-115.785]]},
  {name:'AO SOUTH', color:'rgba(120,100,200,0.5)', fill:'rgba(120,100,200,0.06)',
   coords:[[37.210,-115.820],[37.215,-115.790],[37.200,-115.785],[37.195,-115.810],[37.200,-115.825]]},
];

// Flight paths
const flightPaths = [
  {pts:[[37.270,-115.860],[37.260,-115.835],[37.250,-115.815],[37.240,-115.800],[37.230,-115.785],[37.220,-115.770]], color:'rgba(95,214,255,0.5)', width:2},
  {pts:[[37.268,-115.855],[37.258,-115.832],[37.248,-115.812],[37.238,-115.798],[37.228,-115.782],[37.218,-115.768]], color:'rgba(95,214,255,0.35)', width:1.5},
  {pts:[[37.266,-115.850],[37.256,-115.828],[37.246,-115.808],[37.236,-115.794],[37.226,-115.778],[37.216,-115.764]], color:'rgba(95,214,255,0.25)', width:1.5},
  {pts:[[37.264,-115.848],[37.254,-115.826],[37.244,-115.806],[37.234,-115.792],[37.224,-115.776],[37.214,-115.762]], color:'rgba(95,214,255,0.18)', width:1},
];

// Impact / explosion point
const impactPoint = {lat:37.212, lng:-115.778};

// ── DOM helpers ──
const $ = s => document.querySelector(s);
let leafletMap = null;
let selectedAssetId = '001'; // first card expanded by default
let markerLayers = {};

// ── Renderers ──
function assetCard(a, idx){
  const sel = a.id === selectedAssetId;
  const expanded = sel;
  return `<div class="asset${sel ? ' selected' : ''}" data-id="${a.id}">
    <div class="asset-head">
      <div class="asset-title"><span class="tri">▲</span><b>${a.type}</b></div>
      <div class="asset-id">Track ${a.id}</div>
    </div>
    ${expanded ? `
    <div class="asset-expanded">
      <div class="stats-row">
        <span class="stat-inline">${a.spd}kts</span>
        <span class="stat-inline">${(a.hdg/10).toFixed(0)},${a.hdg%10}${a.hdg}°</span>
        <span class="stat-inline">${a.alt.toLocaleString()}'</span>
      </div>
      <div class="mgrs-row">${a.mgrs}</div>
      <div class="stats">
        <div class="stat"><div class="l">SPD</div><div class="v">${a.spd} kts</div></div>
        <div class="stat"><div class="l">HDG</div><div class="v">${a.hdg}°</div></div>
        <div class="stat"><div class="l">ALT</div><div class="v">${a.alt.toLocaleString()}</div></div>
      </div>
      <div class="compass">
        <svg viewBox="0 0 60 60" width="50" height="50">
          <circle cx="30" cy="30" r="28" fill="none" stroke="#333" stroke-width="1"/>
          <line x1="30" y1="30" x2="${30+22*Math.sin(a.hdg*Math.PI/180)}" y2="${30-22*Math.cos(a.hdg*Math.PI/180)}" stroke="#ff6a1f" stroke-width="2"/>
          <circle cx="30" cy="30" r="2" fill="#ff6a1f"/>
        </svg>
      </div>
      <div class="asset-actions">
        <button class="btn unknown">⚠ Unknown</button>
        <button class="btn task">+ Task</button>
      </div>
    </div>` : `
    <div class="asset-compact">
      <div class="stats-compact">
        <span>${a.spd}kts</span>
        <span>${a.hdg}°</span>
        <span>${a.alt.toLocaleString()}'</span>
      </div>
    </div>`}
  </div>`;
}

function trackRow(t, idx){
  let action = '';
  if(t.state === 'pending'){
    action = t.label === 'to launch'
      ? `<button class="btn cancel" data-i="${idx}">× Cancel</button>`
      : `<button class="btn estop" data-i="${idx}">◼ E-Stop</button>`;
  } else if(t.state === 'current'){
    action = `<button class="btn estop" data-i="${idx}">◼ E-Stop</button>`;
  }
  const trackColor = t.state === 'complete' ? '#555' : '';
  return `<div class="track" data-asset="${t.asset}">
    <div class="track-info">
      <div class="track-id">▲ Asset ${t.asset}</div>
      <div class="track-meta"><span class="track-eta">${t.eta}</span> ${t.label}</div>
    </div>
    <span class="pill"${trackColor ? ` style="color:${trackColor}"` : ''}>▲ Track ${t.track}</span>
    ${action}
  </div>`;
}

function render(){
  $('#needsList').innerHTML = assets.map((a,i) => assetCard(a,i)).join('');
  $('#needsCount').textContent = assets.length;

  const groups = {pending:[], current:[], complete:[]};
  tracks.forEach((t,i) => groups[t.state].push({...t, _i:i}));

  // Pending header shows active track
  const pendingHead = $('.group-head.pending');
  if(groups.pending.length > 0){
    const pt = groups.pending[0];
    pendingHead.innerHTML = `<span>Pending</span><span class="pending-track">Track ${pt.track} (pending)</span><span class="count">${groups.pending.length}</span>`;
  } else {
    pendingHead.innerHTML = `<span>Pending</span><span class="count">0</span>`;
  }

  $('#pendingList').innerHTML = groups.pending.map(t => trackRow(t, t._i)).join('');
  $('#currentList').innerHTML = groups.current.map(t => trackRow(t, t._i)).join('');
  $('#completeList').innerHTML = groups.complete.map(t => trackRow(t, t._i)).join('') ||
    '<div class="track" style="color:#555;justify-content:center">— empty —</div>';

  $('#currentCount').textContent = groups.current.length;
  $('#completeCount').textContent = groups.complete.length;
  $('#taskedCount').textContent = '2';
  $('#clearedCount').textContent = '0';
  $('#expiredCount').textContent = '1';
}

// ── Leaflet map ──
function initMap(){
  leafletMap = L.map('mapCanvas', {
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: true,
  }).setView(MAP_CENTER, MAP_ZOOM);

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {maxZoom: 18}
  ).addTo(leafletMap);

  // Geofence polygons
  zones.forEach(z => {
    L.polygon(z.coords, {
      color: z.color, weight: 1.5, fillColor: z.fill, fillOpacity: 1,
      dashArray: '6,4',
    }).addTo(leafletMap).bindTooltip(z.name, {permanent: false, className: 'zone-tip'});
  });

  // Flight path polylines
  flightPaths.forEach(fp => {
    L.polyline(fp.pts, {color: fp.color, weight: fp.width, dashArray: '8,6'}).addTo(leafletMap);
    fp.pts.forEach(p => {
      L.circleMarker(p, {radius: 1.5, color: fp.color, fillColor: fp.color, fillOpacity: 1, weight: 0}).addTo(leafletMap);
    });
  });

  // Impact / explosion marker
  const impactIcon = L.divIcon({
    className: 'map-marker impact',
    html: `<div class="impact-ring"></div>`,
    iconSize: [40, 40], iconAnchor: [20, 20],
  });
  L.marker([impactPoint.lat, impactPoint.lng], {icon: impactIcon}).addTo(leafletMap);

  // Friendly markers (cyan diamonds)
  friendlies.forEach(f => {
    const icon = L.divIcon({
      className: 'map-marker friendly',
      html: `<svg viewBox="0 0 20 20" width="16" height="16"><polygon points="10,2 18,10 10,18 2,10" fill="none" stroke="#5fd6ff" stroke-width="2"/></svg>`,
      iconSize: [16, 16], iconAnchor: [8, 8],
    });
    L.marker([f.lat, f.lng], {icon}).addTo(leafletMap)
      .bindTooltip(f.label, {permanent: false, className: 'friendly-tip', offset: [10, 0]});
  });

  // Hostile markers (red squares with X)
  hostiles.forEach(h => {
    const icon = L.divIcon({
      className: 'map-marker hostile',
      html: `<svg viewBox="0 0 16 16" width="14" height="14">
        <rect x="2" y="2" width="12" height="12" fill="none" stroke="#e23a2e" stroke-width="1.8"/>
        <line x1="2" y1="2" x2="14" y2="14" stroke="#e23a2e" stroke-width="1.4"/>
        <line x1="14" y1="2" x2="2" y2="14" stroke="#e23a2e" stroke-width="1.4"/>
      </svg>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    L.marker([h.lat, h.lng], {icon}).addTo(leafletMap)
      .bindTooltip(h.label, {permanent: false, className: 'hostile-tip', offset: [10, 0]});
  });

  // Unknown / asset markers (yellow/orange triangles)
  assets.forEach(a => {
    const icon = L.divIcon({
      className: 'map-marker unknown',
      html: `<svg viewBox="0 0 18 18" width="14" height="14"><polygon points="9,2 16,16 2,16" fill="none" stroke="#f1c40f" stroke-width="2"/></svg>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    const m = L.marker([a.lat, a.lng], {icon}).addTo(leafletMap);
    m.on('click', () => selectAsset(a.id));
    m.bindTooltip(`Track ${a.id}`, {permanent: false, className: 'unknown-tip', offset: [10, 0]});
    markerLayers[a.id] = m;
  });
}

// ── Selection / callout ──
function selectAsset(id){
  selectedAssetId = id;
  const a = assets.find(x => x.id === id);
  if(!a) return;

  const callout = $('#callout');
  callout.hidden = false;
  callout.querySelector('.callout-head').textContent = `Track ${a.id}`;
  callout.querySelector('.callout-mgrs').textContent = a.mgrs;
  const rows = callout.querySelectorAll('.callout-row');
  rows[0].querySelector('b').textContent = `${a.spd} KTS`;
  rows[1].querySelector('b').textContent = `${a.hdg}°`;
  rows[2].querySelector('b').textContent = `${a.alt.toLocaleString()} ft`;

  if(leafletMap && markerLayers[id]){
    const pt = leafletMap.latLngToContainerPoint(markerLayers[id].getLatLng());
    callout.style.left = (pt.x + 20) + 'px';
    callout.style.top = (pt.y - 10) + 'px';
  }

  render();
  leafletMap.panTo([a.lat, a.lng], {animate: true, duration: 0.5});
}

// ── Events ──
document.addEventListener('click', e => {
  const card = e.target.closest('.asset');
  if(card && !e.target.closest('.btn')){
    selectAsset(card.dataset.id);
    return;
  }

  const estop = e.target.closest('.btn.estop');
  if(estop){
    const i = +estop.dataset.i;
    tracks[i].state = 'complete';
    tracks[i].label = 'stopped';
    render();
    return;
  }

  const cancel = e.target.closest('.btn.cancel');
  if(cancel){
    const i = +cancel.dataset.i;
    tracks[i].state = 'complete';
    tracks[i].label = 'cancelled';
    render();
    return;
  }

  const task = e.target.closest('.btn.task');
  if(task){
    const card = task.closest('.asset');
    if(card) card.style.borderLeftColor = '#5fd6ff';
    return;
  }

  if(e.target.closest('.map') && !e.target.closest('.callout') && !e.target.closest('.map-marker')){
    $('#callout').hidden = true;
    selectedAssetId = null;
    render();
  }
});

// Search filter
$('.search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.asset').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

// Track row hover → pulse marker
document.addEventListener('mouseover', e => {
  const row = e.target.closest('.track[data-asset]');
  if(row && markerLayers[row.dataset.asset]){
    markerLayers[row.dataset.asset].getElement()?.classList.add('pulse');
  }
});
document.addEventListener('mouseout', e => {
  const row = e.target.closest('.track[data-asset]');
  if(row && markerLayers[row.dataset.asset]){
    markerLayers[row.dataset.asset].getElement()?.classList.remove('pulse');
  }
});

// ── Init ──
render();
initMap();

// Live clock
function tick(){
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  $('#clock').textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}Z`;
}
tick(); setInterval(tick, 1000);

// Simulate telemetry drift
setInterval(() => {
  assets.forEach(a => {
    a.spd = Math.max(60, Math.min(95, a.spd + Math.round((Math.random() - 0.5) * 2)));
    a.hdg = (a.hdg + Math.round((Math.random() - 0.5) * 2) + 360) % 360;
    a.alt = Math.max(7800, Math.min(9200, a.alt + Math.round((Math.random() - 0.5) * 20)));
    a.lat += (Math.random() - 0.5) * 0.0002;
    a.lng += (Math.random() - 0.5) * 0.0002;
    if(markerLayers[a.id]) markerLayers[a.id].setLatLng([a.lat, a.lng]);
  });
  render();
  if(selectedAssetId){
    const a = assets.find(x => x.id === selectedAssetId);
    if(a && leafletMap && markerLayers[a.id]){
      const callout = $('#callout');
      callout.querySelector('.callout-head').textContent = `Track ${a.id}`;
      const rows = callout.querySelectorAll('.callout-row');
      rows[0].querySelector('b').textContent = `${a.spd} KTS`;
      rows[1].querySelector('b').textContent = `${a.hdg}°`;
      rows[2].querySelector('b').textContent = `${a.alt.toLocaleString()} ft`;
      const pt = leafletMap.latLngToContainerPoint(markerLayers[a.id].getLatLng());
      callout.style.left = (pt.x + 20) + 'px';
      callout.style.top = (pt.y - 10) + 'px';
    }
  }
}, 2000);
