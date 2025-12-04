/* ============================================================
   ELEMENTS
============================================================ */
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreScreen = document.getElementById("scoreScreen");

const startButton = document.getElementById("startButton");
const hexButton = document.getElementById("hexButton");
const statusText = document.getElementById("statusText");

const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");

const bestValue = document.getElementById("bestValue");
const finalScore = document.getElementById("finalScore");
const rankText = document.getElementById("rankText");

/* ============================================================
   SOUNDS
============================================================ */
const sndMusic = document.getElementById("sndMusic");
const sndReady = document.getElementById("sndReady");
const sndFail = document.getElementById("sndFail");
const sndWin = document.getElementById("sndWin");

let musicStarted = false;

/* ============================================================
   GAME VARIABLES
============================================================ */
let gameState = "idle"; 
let startTime = 0;
let timeoutID = null;
let bestScore = localStorage.getItem("reflex_best_score") || null;
if (bestScore) bestValue.textContent = bestScore;

/* Anti-Cheat — minimum allowed reaction time */
const MIN_REACTION_MS = 80;

/* Prevent spam clicking */
let clickLocked = false;

/* ============================================================
   START SCREEN
============================================================ */

startButton.addEventListener("click", () => {
  playMusic();
  switchScreen(startScreen, gameScreen);
  resetGame();
});

/* Music allowed only after user gesture */
function playMusic() {
  if (!musicStarted) {
    sndMusic.volume = 0.45;
    sndMusic.play().catch(() => {});
    musicStarted = true;
  }
}

/* ============================================================
   GAME LOOP
============================================================ */

hexButton.addEventListener("click", () => {
  if (clickLocked) return;

  if (gameState === "idle") beginWait();
  else if (gameState === "wait") failEarly();
  else if (gameState === "go") success();
});

/* -------------------------------
   START WAIT TIMER
-------------------------------- */
function beginWait() {
  gameState = "wait";
  statusText.textContent = "WAIT";
  statusText.style.color = "#8ab8d4";

  hexButton.classList.remove("go", "fail");

  const delay = Math.random() * 2000 + 1200;
  timeoutID = setTimeout(() => {
    gameState = "go";
    statusText.textContent = "GO";
    statusText.style.color = "#00ff85";
    hexButton.classList.add("go");
    sndReady.play().catch(() => {});
    startTime = performance.now();
  }, delay);
}

/* -------------------------------
   FAIL EARLY
-------------------------------- */
function failEarly() {
  clearTimeout(timeoutID);
  gameState = "idle";
  statusText.textContent = "FAIL";
  statusText.style.color = "#ff3b6b";

  hexButton.classList.remove("go");
  hexButton.classList.add("fail");

  sndFail.play().catch(() => {});

  clickLocked = true;
  setTimeout(() => {
    clickLocked = false;
    resetGame();
  }, 900);
}

/* -------------------------------
   SUCCESS
-------------------------------- */
function success() {
  const reaction = performance.now() - startTime;

  if (reaction < MIN_REACTION_MS) {
    return failEarly(); // anti-cheat
  }

  const seconds = (reaction / 1000).toFixed(3);
  finalScore.textContent = seconds;

  sndWin.play().catch(() => {});

  /* RANKING */
  let rank = "UNRANKED";

  if (reaction < 180) rank = "S+ — THE SINGULARITY";
  else if (reaction < 220) rank = "S — CYBER DEMON";
  else if (reaction < 260) rank = "A — NEON OPERATIVE";
  else if (reaction < 320) rank = "B — STREET SAMURAI";
  else rank = "C — SYSTEM GLITCH";

  rankText.textContent = rank;

  /* BEST SCORE */
  if (!bestScore || parseFloat(seconds) < parseFloat(bestScore)) {
    bestScore = seconds;
    localStorage.setItem("reflex_best_score", bestScore);
    bestValue.textContent = bestScore;
  }

  switchScreen(gameScreen, scoreScreen);
}

/* ============================================================
   RESET GAME
============================================================ */
function resetGame() {
  gameState = "idle";
  statusText.textContent = "WAIT";
  statusText.style.color = "#8ab8d4";

  hexButton.classList.remove("go", "fail");
}

/* ============================================================
   BUTTONS — RETRY + SHARE
============================================================ */

retryBtn.addEventListener("click", () => {
  switchScreen(scoreScreen, gameScreen);
  resetGame();
});

/* SHARE */
shareBtn.addEventListener("click", async () => {
  const score = finalScore.textContent;
  const rank = rankText.textContent;

  const url =
    "https://reflex-rho.vercel.app/api/score-image?score=" +
    encodeURIComponent(score) +
    "&rank=" +
    encodeURIComponent(rank);

  const text =
    "⚡ " + rank +
    "\nReflex: " + score + "s\n\n" +
    "Can you beat my time? 👇";

  const compose =
    "https://warpcast.com/~/compose?text=" +
    encodeURIComponent(text) +
    "&embeds[]=" +
    encodeURIComponent(url);

  try {
    const sdk = window.farcasterSDK;
    await sdk.actions.openUrl({ url: compose });
  } catch (e) {
    console.error("Share failed:", e);
  }
});

/* ============================================================
   SCREEN TRANSITION
============================================================ */
function switchScreen(from, to) {
  from.classList.remove("visible");
  setTimeout(() => {
    to.classList.add("visible");
  }, 50);
}

/* ============================================================
   DONE
============================================================ */
console.log("Cyber Steel Reflex Engine Loaded.");

/* ============================================================
   V6 — ULTRA ANIMATION PACK (JS ENGINE)
   TRON Legacy FX + Medium Motion + Impact System
============================================================ */


/* ------------------------------------------------------------
   CAMERA SHAKE (GO hit)
------------------------------------------------------------ */
function triggerCameraShake() {
  document.body.classList.add("shake-active");
  setTimeout(() => document.body.classList.remove("shake-active"), 200);
}


/* ------------------------------------------------------------
   GRID SHOCKWAVE (GO)
------------------------------------------------------------ */
function triggerShockwave() {
  const bg = document.querySelector(".tron-bg");
  bg.classList.add("shockwave-active");

  setTimeout(() => {
    bg.classList.remove("shockwave-active");
  }, 400);
}


/* ------------------------------------------------------------
   REACTOR BLOOM PULSE (GO)
------------------------------------------------------------ */
function triggerReactorBloom() {
  reactor.classList.add("reactor-preflash");

  setTimeout(() => {
    reactor.classList.remove("reactor-preflash");
  }, 300);
}


/* ------------------------------------------------------------
   GO HOLOGRAM GLITCH
------------------------------------------------------------ */
function triggerGoGlitch() {
  const txt = statusText;

  txt.classList.add("go-holo");
  txt.setAttribute("data-text", txt.innerText);
  txt.classList.add("glitch-active");

  setTimeout(() => txt.classList.remove("glitch-active"), 150);
}


/* ------------------------------------------------------------
   NEON PARTICLE SPARKS (SUCCESS)
------------------------------------------------------------ */
function spawnSparks(x, y) {
  for (let i = 0; i < 28; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 120 + 40;

    const tx = Math.cos(angle) * velocity + "px";
    const ty = Math.sin(angle) * velocity + "px";

    spark.style.setProperty("--tx", tx);
    spark.style.setProperty("--ty", ty);

    spark.style.left = x + "px";
    spark.style.top = y + "px";

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 500);
  }
}


/* ------------------------------------------------------------
   FAIL — BREACH RED SHOCK
------------------------------------------------------------ */
function triggerBreach() {
  document.body.classList.add("screen-breach");
  setTimeout(() => document.body.classList.remove("screen-breach"), 250);
}


/* ------------------------------------------------------------
   SCORE PANEL — TRON FLOATING CARD
------------------------------------------------------------ */
function revealScoreCard() {
  const card = document.querySelector(".score-card");
  card.classList.add("score-show");
  setTimeout(() => card.classList.remove("score-show"), 400);
}


/* ------------------------------------------------------------
   LOGO HOLOGRAM REVEAL (Start Screen)
------------------------------------------------------------ */
function revealLogo() {
  const logo = document.getElementById("logoHolo");
  logo.classList.add("logo-reveal");
}


/* ------------------------------------------------------------
   BACKGROUND PARALLAX (gyro + mouse)
------------------------------------------------------------ */
function enableParallax() {
  const bg = document.querySelector(".tron-bg");

  /* Mouse */
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    bg.style.transform = `translate(${x}px, ${y}px)`;
  });

  /* Gyro (mobile) */
  window.addEventListener("deviceorientation", (e) => {
    const x = (e.gamma / 45) * 10;
    const y = (e.beta / 45) * 6;
    bg.style.transform = `translate(${x}px, ${y}px)`;
  });
}


/* ============================================================
   BÜTÜN ANİMASYONLARIN OYUNA ENTEGRASYONU
============================================================ */

/* Start Screen → Logo Reveal */
revealLogo();

/* Enable Parallax Background */
enableParallax();

/* GO Transition effects */
function goEffects() {
  triggerCameraShake();
  triggerReactorBloom();
  triggerGoGlitch();
  triggerShockwave();
}

/* Success */
function successEffects() {
  const rect = reactor.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  spawnSparks(x, y);
  revealScoreCard();
}

/* Fail */
function failEffects() {
  triggerBreach();
}


/* ------------------------------------------------------------
   BAĞLANTILAR — ŞU ANDA GAME.JS İÇİNDEKİ ORİJİNAL KODLA BİRLEŞİYOR
------------------------------------------------------------ */

/* GO event override */
const oldStartGo = startGo;
startGo = function () {
  oldStartGo();
  goEffects();
};

/* SUCCESS override */
const oldTriggerSuccess = triggerSuccess;
triggerSuccess = function () {
  oldTriggerSuccess();
  successEffects();
};

/* FAIL override */
const oldTriggerFail = triggerFail;
triggerFail = function (msg) {
  oldTriggerFail(msg);
  failEffects();
};

/* Horizon bloom effect */
function triggerHorizonBloom() {
  const hz = document.querySelector(".horizon-glow");
  hz.classList.add("horizon-bloom");
  setTimeout(() => hz.classList.remove("horizon-bloom"), 1400);
}

/* Reactor heat */
function enableReactorHeat() {
  reactor.classList.add("reactor-heat");
}

/* GO ultra FX */
const oldGoFX = goEffects;
goEffects = function () {
  oldGoFX();
  triggerHorizonBloom();
  enableReactorHeat();
};

/* Extra FAIL FX */
const oldFailFX = failEffects;
failEffects = function () {
  oldFailFX();
  triggerHorizonBloom(); // kırmızı breach sonrası glow
};

