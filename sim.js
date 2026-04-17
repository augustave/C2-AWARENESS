// ══════════════════════════════════════════════
// 51 — SIMULATION ENGINE
// ══════════════════════════════════════════════

const SIM = {
  running: false,
  speed: 1,          // 1x, 2x, 5x
  tickMs: 500,       // base tick interval
  elapsed: 0,        // total sim seconds
  wave: 1,
  waveTimer: 0,
  waveInterval: 60,  // seconds between waves
  autoTask: false,

  // Stats
  kills: 0,
  assetsLost: 0,
  totalThreats: 0,
  responseTimes: [],

  // Active entities managed by sim
  simHostiles: [],   // {id, lat, lng, hdg, spd, alt, hp, waypoints[], wpIdx, status:'active'|'destroyed'}
  simAssets: [],     // {id, lat, lng, spd, targetId, status:'idle'|'intercepting'|'returning'|'destroyed', launchTime}
  engagements: [],   // {assetId, hostileId, startTime}
  explosions: [],    // {lat, lng, time, radius}

  // Replay
  replay: [],

  // Wave spawn points (edges of map)
  spawnZones: [
    {lat: 37.280, lng: -115.830, hdgRange: [200, 250]},  // north
    {lat: 37.280, lng: -115.790, hdgRange: [210, 260]},  // northeast
    {lat: 37.210, lng: -115.720, hdgRange: [240, 280]},  // east
    {lat: 37.185, lng: -115.760, hdgRange: [300, 340]},  // south
    {lat: 37.190, lng: -115.850, hdgRange: [330, 20]},   // southwest
  ],

  // Defensive positions (where assets return to)
  baseLat: 37.250,
  baseLng: -115.835,

  // Kill zone center (where hostiles are heading)
  targetLat: 37.235,
  targetLng: -115.811,
};

// ── Helpers ──────────────────────────────────
function simHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (lat2 - lat1) * toR, dLon = (lon2 - lon1) * toR;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(lat1, lon1, lat2, lon2) {
  const toR = Math.PI / 180, toD = 180 / Math.PI;
  const dLon = (lon2 - lon1) * toR;
  const y = Math.sin(dLon) * Math.cos(lat2 * toR);
  const x = Math.cos(lat1 * toR) * Math.sin(lat2 * toR) - Math.sin(lat1 * toR) * Math.cos(lat2 * toR) * Math.cos(dLon);
  return (Math.atan2(y, x) * toD + 360) % 360;
}

function moveLatLng(lat, lng, hdg, distKm) {
  const R = 6371, toR = Math.PI / 180, toD = 180 / Math.PI;
  const lat1 = lat * toR, lng1 = lng * toR, brng = hdg * toR;
  const d = distKm / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * toD, lng: lng2 * toD };
}

let simHostileCounter = 100;
let simAssetCounter = 100;

// ── Wave spawner ─────────────────────────────
function spawnWave() {
  const count = Math.min(3 + SIM.wave, 8);
  const newHostiles = [];

  for (let i = 0; i < count; i++) {
    const zone = SIM.spawnZones[Math.floor(Math.random() * SIM.spawnZones.length)];
    const id = `SH${++simHostileCounter}`;
    const hdg = zone.hdgRange[0] + Math.random() * (zone.hdgRange[1] - zone.hdgRange[0]);

    // Generate waypoints toward target
    const startLat = zone.lat + (Math.random() - 0.5) * 0.01;
    const startLng = zone.lng + (Math.random() - 0.5) * 0.01;
    const waypoints = [];
    const steps = 3 + Math.floor(Math.random() * 3);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      waypoints.push({
        lat: startLat + (SIM.targetLat - startLat) * t + (Math.random() - 0.5) * 0.008,
        lng: startLng + (SIM.targetLng - startLng) * t + (Math.random() - 0.5) * 0.008,
      });
    }

    const hostile = {
      id,
      lat: startLat,
      lng: startLng,
      hdg: hdg,
      spd: 60 + Math.random() * 40,  // m/s
      alt: 5000 + Math.random() * 5000,
      rcs: 3 + Math.random() * 8,
      hp: 1,
      waypoints,
      wpIdx: 0,
      status: 'active',
      label: `BANDIT ${simHostileCounter}`,
      spawnTime: SIM.elapsed,
    };

    SIM.simHostiles.push(hostile);
    newHostiles.push(hostile);
    SIM.totalThreats++;
  }

  SIM.wave++;
  SIM.waveTimer = 0;

  return newHostiles;
}

// ── Asset management ─────────────────────────
function simLaunchAsset(hostileId) {
  const hostile = SIM.simHostiles.find(h => h.id === hostileId && h.status === 'active');
  if (!hostile) return null;

  // Check if already engaged
  if (SIM.simAssets.find(a => a.targetId === hostileId && a.status === 'intercepting')) return null;

  const id = `SA${++simAssetCounter}`;
  const asset = {
    id,
    lat: SIM.baseLat + (Math.random() - 0.5) * 0.005,
    lng: SIM.baseLng + (Math.random() - 0.5) * 0.005,
    spd: 120 + Math.random() * 60, // faster than hostiles
    targetId: hostileId,
    status: 'intercepting',
    launchTime: SIM.elapsed,
    trail: [],
  };

  SIM.simAssets.push(asset);
  SIM.engagements.push({ assetId: id, hostileId, startTime: SIM.elapsed });

  return asset;
}

// ── Auto-tasking AI ──────────────────────────
function autoTaskAI() {
  if (!SIM.autoTask) return;

  const unengaged = SIM.simHostiles.filter(h => {
    if (h.status !== 'active') return false;
    return !SIM.simAssets.find(a => a.targetId === h.id && a.status === 'intercepting');
  });

  // Sort by distance to target (closest = most urgent)
  unengaged.sort((a, b) => {
    const da = simHaversine(a.lat, a.lng, SIM.targetLat, SIM.targetLng);
    const db = simHaversine(b.lat, b.lng, SIM.targetLat, SIM.targetLng);
    return da - db;
  });

  // Launch up to 2 per tick
  let launched = 0;
  for (const h of unengaged) {
    if (launched >= 2) break;
    const asset = simLaunchAsset(h.id);
    if (asset) {
      launched++;
      if (typeof simOnAssetLaunch === 'function') simOnAssetLaunch(asset, h);
    }
  }
}

// ── Engagement resolution ────────────────────
function resolveEngagement(asset, hostile) {
  // Hit probability based on distance, speed differential, and RCS
  const dist = simHaversine(asset.lat, asset.lng, hostile.lat, hostile.lng);
  const basePk = 0.85; // base probability of kill
  const speedPenalty = Math.max(0, (hostile.spd - 70) / 200); // faster = harder
  const rcsPenalty = hostile.rcs < 5 ? 0.1 : 0;
  const pk = Math.max(0.4, basePk - speedPenalty - rcsPenalty);

  return Math.random() < pk;
}

// ── Main tick ────────────────────────────────
function simTick(dtSeconds) {
  if (!SIM.running) return;

  const dt = dtSeconds * SIM.speed;
  SIM.elapsed += dt;
  SIM.waveTimer += dt;

  // Wave spawner
  if (SIM.waveTimer >= SIM.waveInterval) {
    const newH = spawnWave();
    if (typeof simOnWaveSpawn === 'function') simOnWaveSpawn(newH, SIM.wave - 1);
  }

  // Move hostiles along waypoints
  SIM.simHostiles.forEach(h => {
    if (h.status !== 'active') return;

    const wp = h.waypoints[h.wpIdx];
    if (!wp) {
      // Reached target area — threat succeeded
      h.status = 'reached';
      SIM.assetsLost++;
      if (typeof simOnThreatReached === 'function') simOnThreatReached(h);
      return;
    }

    const distToWp = simHaversine(h.lat, h.lng, wp.lat, wp.lng);
    const moveDist = (h.spd / 1000) * dt; // km moved this tick

    if (distToWp < moveDist * 1.5) {
      h.lat = wp.lat;
      h.lng = wp.lng;
      h.wpIdx++;
    } else {
      const hdg = bearing(h.lat, h.lng, wp.lat, wp.lng);
      h.hdg = hdg;
      const newPos = moveLatLng(h.lat, h.lng, hdg, moveDist);
      h.lat = newPos.lat;
      h.lng = newPos.lng;
    }

    // Drift altitude and speed
    h.alt += (Math.random() - 0.5) * 20 * dt;
    h.spd += (Math.random() - 0.5) * 2 * dt;
    h.spd = Math.max(40, Math.min(120, h.spd));
  });

  // Move intercepting assets toward their targets
  SIM.simAssets.forEach(a => {
    if (a.status === 'intercepting') {
      const target = SIM.simHostiles.find(h => h.id === a.targetId);
      if (!target || target.status !== 'active') {
        a.status = 'returning';
        return;
      }

      // Record trail
      a.trail.push({ lat: a.lat, lng: a.lng });
      if (a.trail.length > 60) a.trail.shift();

      const dist = simHaversine(a.lat, a.lng, target.lat, target.lng);
      const moveDist = (a.spd / 1000) * dt;

      if (dist < 0.3) { // engagement range: 300m
        const hit = resolveEngagement(a, target);
        if (hit) {
          target.status = 'destroyed';
          SIM.kills++;
          SIM.explosions.push({
            lat: target.lat, lng: target.lng,
            time: SIM.elapsed, radius: 0, alpha: 1,
          });
          const responseTime = SIM.elapsed - a.launchTime;
          SIM.responseTimes.push(responseTime);
          if (typeof simOnKill === 'function') simOnKill(a, target);
        } else {
          // Missed - asset continues past
          if (typeof simOnMiss === 'function') simOnMiss(a, target);
        }
        a.status = 'returning';
      } else {
        const hdg = bearing(a.lat, a.lng, target.lat, target.lng);
        const newPos = moveLatLng(a.lat, a.lng, hdg, moveDist);
        a.lat = newPos.lat;
        a.lng = newPos.lng;
      }
    } else if (a.status === 'returning') {
      const dist = simHaversine(a.lat, a.lng, SIM.baseLat, SIM.baseLng);
      if (dist < 0.2) {
        a.status = 'idle';
        a.trail = [];
      } else {
        const hdg = bearing(a.lat, a.lng, SIM.baseLat, SIM.baseLng);
        const moveDist = (a.spd / 1000) * dt;
        const newPos = moveLatLng(a.lat, a.lng, hdg, moveDist);
        a.lat = newPos.lat;
        a.lng = newPos.lng;
      }
    }
  });

  // Auto-task AI
  autoTaskAI();

  // Animate explosions
  SIM.explosions.forEach(ex => {
    ex.radius += 3 * dt;
    ex.alpha = Math.max(0, ex.alpha - 0.4 * dt);
  });
  SIM.explosions = SIM.explosions.filter(ex => ex.alpha > 0.01);

  // Record replay frame
  SIM.replay.push({
    t: SIM.elapsed,
    hostiles: SIM.simHostiles.map(h => ({ id: h.id, lat: h.lat, lng: h.lng, status: h.status })),
    assets: SIM.simAssets.map(a => ({ id: a.id, lat: a.lat, lng: a.lng, status: a.status })),
  });
  // Keep last 2000 frames
  if (SIM.replay.length > 2000) SIM.replay.shift();

  // Snapshot for stats
  if (typeof simOnTick === 'function') simOnTick();
}

// ── Controls ─────────────────────────────────
function simStart() {
  SIM.running = true;
  // Spawn initial wave if no hostiles
  if (SIM.simHostiles.length === 0) {
    const newH = spawnWave();
    if (typeof simOnWaveSpawn === 'function') simOnWaveSpawn(newH, SIM.wave - 1);
  }
}

function simPause() {
  SIM.running = false;
}

function simSetSpeed(spd) {
  SIM.speed = spd;
}

function simToggleAutoTask() {
  SIM.autoTask = !SIM.autoTask;
  return SIM.autoTask;
}

function simReset() {
  SIM.running = false;
  SIM.speed = 1;
  SIM.elapsed = 0;
  SIM.wave = 1;
  SIM.waveTimer = 0;
  SIM.kills = 0;
  SIM.assetsLost = 0;
  SIM.totalThreats = 0;
  SIM.responseTimes = [];
  SIM.simHostiles = [];
  SIM.simAssets = [];
  SIM.engagements = [];
  SIM.explosions = [];
  SIM.replay = [];
  SIM.autoTask = false;
  simHostileCounter = 100;
  simAssetCounter = 100;
  if (typeof simOnReset === 'function') simOnReset();
}

function simGetStats() {
  const avgResp = SIM.responseTimes.length > 0
    ? (SIM.responseTimes.reduce((a, b) => a + b, 0) / SIM.responseTimes.length).toFixed(1) + 's'
    : '--';
  return {
    kills: SIM.kills,
    lost: SIM.assetsLost,
    threats: SIM.simHostiles.filter(h => h.status === 'active').length,
    wave: SIM.wave,
    avgResp,
    totalThreats: SIM.totalThreats,
    activeAssets: SIM.simAssets.filter(a => a.status === 'intercepting').length,
    idleAssets: SIM.simAssets.filter(a => a.status === 'idle').length,
  };
}

// ── Sim loop (runs at fixed interval, independent of app render) ──
let simInterval = null;

function simBootLoop() {
  if (simInterval) clearInterval(simInterval);
  simInterval = setInterval(() => {
    simTick(SIM.tickMs / 1000);
  }, SIM.tickMs);
}

simBootLoop();
