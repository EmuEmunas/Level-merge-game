
let level = 1;
let playerLevel = 5;
let basePlayerLevel = 5;
let debuff = 0;
let enemies = [];
let bossMode = false;
let bossPhase = 0;
let bossTargetLevel = Math.floor(Math.random() * 10) + 1;
let totalEnemyStrength = 0;

let stats = {
  levelBeendet: 0,
  powerupsGenutzt: 0,
  fallenGetroffen: 0,
  zufallGenutzt: 0,
  bosseBesiegt: 0
};

const gameDiv = document.getElementById('game');
const playerLevelSpan = document.getElementById('playerLevel');
const logDiv = document.getElementById('log');
const levelNumberSpan = document.getElementById('levelNumber');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const statsDiv = document.getElementById('stats');
const debuffText = document.getElementById('debuffText');

function log(msg) {
  logDiv.innerHTML += `<div>${msg}</div>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function updateUI() {
  gameDiv.innerHTML = '';
  enemies.forEach(e => {
    const btn = document.createElement('div');
    btn.className = e.type;
    if (e.dead) btn.classList.add('dead');
    if (e.effect === 'x2') btn.classList.add('x2');
    else if (e.effect === '-5') btn.classList.add('minus5');
    else if (e.effect === 'random') btn.classList.add('random');
    btn.innerText = e.type === 'enemy' || e.type === 'boss' ? `Stärke ${e.level}` : e.effect.toUpperCase();
    btn.onclick = () => handleClick(e);
    gameDiv.appendChild(btn);
  });
  playerLevelSpan.textContent = playerLevel;
  levelNumberSpan.textContent = level;
  debuffText.textContent = debuff > 0 ? `⚠️ Erschöpfung: -${debuff} Stärke` : '';
}

function handleClick(entity) {
  if (entity.dead) return;

  if (entity.type === 'enemy' || entity.type === 'boss') {
    if (playerLevel > entity.level) {
      playerLevel += entity.level;
      log(`🗡️ Besiegt! Neue Stärke: ${playerLevel}`);
      entity.dead = true;
    } else if (playerLevel === entity.level) {
      log(`🤺 Gleichstand mit Gegner Stärke ${entity.level} – du verlierst!`);
      gameDiv.innerHTML = '<h2>Game Over</h2>';
      return;
    } else {
      log(`💀 Verloren gegen Gegner mit ${entity.level}.`);
      if (entity.type === 'boss') {
        debuff = Math.min(debuff + 1, 5);
        log(`❌ Bosskampf verloren. Debuff erhöht auf -${debuff} Stärke.`);
        startLevel();
      } else {
        gameDiv.innerHTML = '<h2>Game Over</h2>';
        return;
      }
    }
  } else if (entity.type === 'item') {
    if (entity.effect === 'x2') {
      playerLevel *= 2;
      stats.powerupsGenutzt++;
      log(`⚡ Powerup aktiviert! Stärke verdoppelt: ${playerLevel}`);
    } else if (entity.effect === '-5') {
      if (playerLevel <= 5) {
        log(`💀 Falle war tödlich. Game Over.`);
        gameDiv.innerHTML = '<h2>Game Over</h2>';
        return;
      } else {
        playerLevel -= 5;
        stats.fallenGetroffen++;
        log(`⚠️ -5 Falle getroffen. Neue Stärke: ${playerLevel}`);
      }
    } else if (entity.effect === 'random') {
      const change = Math.floor(Math.random() * 11) - 5;
      playerLevel += change;
      stats.zufallGenutzt++;
      log(`🎲 Zufallseffekt: ${change >= 0 ? '+' : ''}${change}. Neue Stärke: ${playerLevel}`);
    }
    entity.dead = true;
  }

  updateUI();
  checkLevelCompletion();
}

function checkLevelCompletion() {
  if (enemies.every(e => e.dead || (!e.required && e.type === 'item'))) {
    nextLevelBtn.style.display = 'block';
  }
}

function startLevel() {
  nextLevelBtn.style.display = 'none';
  playerLevel = basePlayerLevel - debuff;
  if (level === bossTargetLevel) {
    bossMode = true;
    bossPhase = 0;
    totalEnemyStrength = 0;
    enemies = generateBossWave();
  } else {
    enemies = generateEnemies(level);
  }
  updateUI();
}

function generateBossWave() {
  const phaseCount = Math.floor(Math.random() * 3) + 3;
  const wave = [];
  if (bossPhase < phaseCount - 1) {
    const count = 3 + Math.floor(Math.random() * 3);
    let valid = false;
    while (!valid) {
      wave.length = 0;
      for (let i = 0; i < count; i++) {
        let str = Math.floor(playerLevel * 0.6 + Math.random() * 5);
        wave.push({ type: 'enemy', level: str });
      }
      valid = wave.some(e => e.level < playerLevel);
    }
    wave.forEach(e => totalEnemyStrength += e.level);
    bossPhase++;
  } else {
    const factor = 0.95 + Math.random() * 0.1;
    const bossStrength = Math.round(totalEnemyStrength * factor);
    wave.push({ type: 'boss', level: bossStrength });
    log(`<strong>⚔️ Der Boss erscheint! Stärke ${bossStrength}</strong>`);
    if (debuff > 0) {
      log(`✅ Boss besiegt! Debuff aufgehoben.`);
      debuff = 0;
    }
    bossMode = false;
    totalEnemyStrength = 0;
  }
  wave.forEach((e, i) => e.id = `b${bossPhase}-${i}`);
  return wave;
}

function generateEnemies(level) {
  const base = basePlayerLevel - debuff;
  const requiredEnemyCount = 3 + Math.floor(Math.random() * 3);
  let list = [];

  // Erzwinge einen Gegner unter Startstärke
  const lower = Math.max(1, base - 1);
  list.push({ type: 'enemy', level: lower });

  // Erzwinge einen stärkeren Gegner
  const higher = base + 4 + Math.floor(Math.random() * 5);
  list.push({ type: 'enemy', level: higher });

  // Füge Mittelwert-Gegner hinzu
  while (list.length < requiredEnemyCount) {
    const mid = base + Math.floor(Math.random() * 3);
    list.push({ type: 'enemy', level: mid });
  }

  // Füge Powerup hinzu, wenn es rechnerisch gebraucht wird
  const requirePowerup = true;
  if (requirePowerup) list.push({ type: 'item', effect: 'x2', required: true });

  // Füge -5 Falle vor dem stärksten Gegner ein
  list.push({ type: 'item', effect: '-5', required: true });

  // Mische und vergebe IDs
  shuffleArray(list);
  list.forEach((e, i) => e.id = i);
  return list;
}

nextLevelBtn.onclick = () => {
  if (!bossMode && level === bossTargetLevel) {
    bossMode = true;
    bossPhase = 0;
    totalEnemyStrength = 0;
  } else {
    level++;
  }

  if (!bossMode) {
    stats.levelBeendet++;
  }

  if (debuff > 0 && !bossMode) {
    log(`<strong>🧠 Du spielst unter Erschöpfung (-${debuff} Stärke).</strong>`);
  }

  startLevel();
  statsDiv.innerHTML = `
    <p>Level beendet: ${stats.levelBeendet}</p>
    <p>Powerups genutzt: ${stats.powerupsGenutzt}</p>
    <p>Fallen getroffen: ${stats.fallenGetroffen}</p>
    <p>Zufall genutzt: ${stats.zufallGenutzt}</p>
    <p>Bosse besiegt: ${stats.bosseBesiegt}</p>
  `;
};

startLevel();
