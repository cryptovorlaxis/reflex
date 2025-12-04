/* ============================================================
   ELEMENTS
============================================================ */
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreScreen = document.getElementById("scoreScreen");

const startButton = document.getElementById("startButton");
const reactorBtn = document.getElementById("reactorBtn");

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

const MIN_REACTION_MS = 80; 
let clickLocked = false;


/* ============================================================
   START BUTTON
============================================================ */
startButton.addEventListener("click", () => {
  playMusic();
  switchScreen(startScreen, gameScreen);
  resetGame();
});

function playMusic() {
  if (!musicStarted) {
    sndMusic.volume = 0.45;
    sndMusic.play().catch(() => {});
    musicStarted = true;
  }
}


/* ============================================================
   REACTOR BUTTON CLICK
============================================================ */
reactorBtn.addEventListener("click", () => {
  if (clickLocked) return;

  if (gameState === "idle") return beginWait();
  if (gameState === "wait") return failEarly();
  if (gameState === "go") return success();
});


/* ============================================================
   WAIT — RANDOM DELAY
============================================================ */
function beginWait() {
  gameState = "wait";

  statusText.textContent = "WAIT";
  statusText.style.color = "#8ab8d4";

  reactorBtn.classList.remove("go", "fail");

  const delay = Math.random() * 2000 + 1200;

  timeoutID = setTimeout(() => {
    gameState = "go";

    statusText.textContent = "GO";
    statusText.style.color = "#00ff85";

    reactorBtn.classList.add("go");
    sndReady.play().catch(() => {});

    startTime = performance.now();

    goEffects();
  }, delay);
}


/* ============================================================
   FAIL (EARLY CLICK)
============================================================ */
function failEarly() {
  clearTimeout(timeoutID);
  gameState = "idle";

  statusText.textContent = "FAIL";
  statusText.style.color = "#ff3b6b";

  reactorBtn.classList.remove("go");
  reactorBtn.classList.add("fail");

  sndFail.play().catch(() => {});

  failEffects();

  clickLocked = true;
  setTimeout(() => {
    clickLocked = false;
    resetGame();
  }, 900);
}


/* ============================================================
   SUCCESS
============================================================ */
function success() {
  const reaction = performance.now() - startTime;

  if (reaction < MIN_REACTION_MS) return failEarly();

  const seconds = (reaction / 1000).toFixed(3);
  finalScore.textContent = seconds;

  sndWin.play().catch(() => {});

  let rank = "UNRANKED";
  if (reaction < 180) rank = "S+ — THE SINGULARITY";
  else if (reaction < 220) rank = "S — CYBER DEMON";
  else if (reaction < 260) rank = "A — NEON OPERATIVE";
  else if (reaction < 320) rank = "B — STREET SAMURAI";
  else rank = "C — SYSTEM GLITCH";

  rankText.textContent = rank;

  if (!bestScore || parseFloat(seconds) < parseFloat(bestScore)) {
    bestScore = seconds;
    localStorage.setItem("reflex_best_score", bestScore);
    bestValue.textContent = bestScore;
  }

  successEffects();

  switchScreen(gameScreen, scoreScreen);
}


/* ============================================================
   RESET
============================================================ */
function resetGame() {
  gameState = "idle";

  statusText.textContent = "WAIT";
  statusText.style.color = "#8ab8d4";

  reactorBtn.classList.remove("go", "fail");
}


/* ============================================================
   RETRY + SHARE
============================================================ */
retryBtn.addEventListener("click", () => {
  switchScreen(scoreScreen, gameScreen);
  resetGame();
});

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
    const sdk = window.farcasterSDK || await import("https://esm.sh/@farcaster/miniapp-sdk");
    await sdk.actions.openUrl({ url: compose });
  } catch (e) {
    console.error("Share failed:", e);
  }
});


/* ============================================================
   SCREEN SWITCH
============================================================ */
function switchScreen(from, to) {
  from.classList.remove("visible");
  setTimeout(() => {
    to.classList.add("visible");
  }, 60);
}


/* ============================================================
   PLACEHOLDER FX (Çalışsın diye boş fonksiyonlar)
============================================================ */
function goEffects(){ }
function failEffects(){ }
function successEffects(){ }


/* ============================================================
   LOGO REVEAL
============================================================ */
function revealLogo(){ }
revealLogo();
