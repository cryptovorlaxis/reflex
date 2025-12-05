// =================================================================
// TRON Reflex Mini Game — FINAL GAME.JS (Diamond → Platinum → Gold → Silver → Bronze)
// =================================================================

// Element referansları
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const reactorBtn = document.getElementById("reactorBtn");
const statusText = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const bestScoreValue = document.getElementById("bestValue");
const rankTitle = document.getElementById("rankTitle");
const newRecordBadge = document.getElementById("newRecordBadge");
const againBtn = document.getElementById("againBtn");
const shareBtn = document.getElementById("shareBtn");
const scorePanel = document.getElementById("scorePanel");
const scoreScreen = document.getElementById("scoreScreen");

// Oyun durum değişkenleri
let gameState = "INTRO";
let waitTimer = null;
let goStartTime = 0;

let bestScore = localStorage.getItem("reflexBestScore")
  ? parseFloat(localStorage.getItem("reflexBestScore"))
  : 0;

// Yardımcı
function formatScore(ms) {
  return (ms / 1000).toFixed(3);
}

// TIER sistemi
function getRank(ms) {
  const s = ms / 1000;

  if (s <= 0.16)
    return { label: "DIAMOND", cssClass: "rank-diamond" };
  if (s <= 0.21)
    return { label: "PLATINUM", cssClass: "rank-platinum" };
  if (s <= 0.26)
    return { label: "GOLD", cssClass: "rank-gold" };
  if (s <= 0.33)
    return { label: "SILVER", cssClass: "rank-silver" };

  return { label: "BRONZE", cssClass: "rank-bronze" };
}

function setStatus(text) {
  statusText.textContent = text;
}

function updateReactorState(stateClass) {
  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");
  if (stateClass) reactorBtn.classList.add(stateClass);
}

// SCORE PANELİ AÇ
function showScore(ms) {
  gameState = "SCORE";

  const scoreStr = formatScore(ms);
  scoreDisplay.textContent = scoreStr;

  const { label, cssClass } = getRank(ms);
  rankTitle.textContent = label;

  // Eski sınıfları temizle
  scorePanel.classList.remove(
    "rank-diamond",
    "rank-platinum",
    "rank-gold",
    "rank-silver",
    "rank-bronze"
  );
  scorePanel.classList.add(cssClass);

 // BEST SCORE yükleme
let bestScore = localStorage.getItem("reflexBestScore")
  ? parseFloat(localStorage.getItem("reflexBestScore"))
  : null;

function loadBestScore() {
  if (bestScore === null) {
    bestScoreValue.textContent = "--";
  } else {
    bestScoreValue.textContent = (bestScore / 1000).toFixed(3);
  }
}

// SHOW SCORE içinde:
function showScore(ms) {
  ...
  let isNewRecord = false;

  if (bestScore === null || ms < bestScore) {
    bestScore = ms;
    localStorage.setItem("reflexBestScore", String(ms));
    isNewRecord = true;
  }

  bestScoreValue.textContent = (bestScore / 1000).toFixed(3);

  newRecordBadge.style.display = isNewRecord ? "inline-block" : "none";
  ...
}

// DOM READY:
document.addEventListener("DOMContentLoaded", () => {
  loadBestScore();
});


  // Panel aç
  scoreScreen.classList.add("visible");
  scorePanel.classList.add("visible");
}

function handleFail(reason) {
  gameState = "FAIL";
  updateReactorState("mode-fail");
  setStatus(reason);

  setTimeout(() => {
    resetToGame();
    startGame();
  }, 900);
}

function resetToGame() {
  scoreScreen.classList.remove("visible");
  scorePanel.classList.remove("visible");
  gameScreen.classList.add("visible");
}

// OYUN AKIŞI
function startGame() {
  if (waitTimer) clearTimeout(waitTimer);

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("STANDBY…");

  const randomWait = 1500 + Math.random() * 3000;

  waitTimer = setTimeout(() => {
    transitionToGo();
  }, randomWait);
}

function transitionToGo() {
  gameState = "GO";
  goStartTime = performance.now();

  updateReactorState("mode-go");
  setStatus("GO!");
}

// EVENT LİSTENERLAR
document.addEventListener("DOMContentLoaded", () => {
  bestScoreValue.textContent =
    bestScore === 0 ? "--" : formatScore(bestScore);

  // START BUTTON
  if (startButton) {
    startButton.textContent = "INITIATE REACTOR";

    const hint = document.querySelector(".start-hint");
    if (hint) {
      hint.textContent = "Booting reflex engine…";
    }

    startButton.addEventListener("click", () => {
      startScreen.style.display = "none";
      gameScreen.classList.add("visible");
      startGame();
    });
  }

  // TAP BUTTON
  if (reactorBtn) {
    reactorBtn.addEventListener("click", () => {
      if (gameState === "WAIT") {
        handleFail("TOO EARLY!");
      } else if (gameState === "GO") {
        const now = performance.now();
        const diff = now - goStartTime;
        showScore(diff);
      }
    });
  }

  // AGAIN
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      resetToGame();
      startGame();
    });
  }

  // SHARE — tek görsel embed
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const scoreText = scoreDisplay.textContent || "0.000";
      const rankText = rankTitle.textContent || "BRONZE";

      const shareImageUrl = `${window.location.origin}/api/score-image?score=${encodeURIComponent(
        scoreText
      )}&rank=${encodeURIComponent(rankText)}`;

      const miniAppUrl = window.location.origin;

      const castText = `My reflex time: ${scoreText}s — ${rankText} tier ⚡️
Try your skill: ${miniAppUrl}`;

      // Farcaster composeCast (mini app)
      if (
        window.miniapp &&
        window.miniapp.sdk &&
        window.miniapp.sdk.actions &&
        typeof window.miniapp.sdk.actions.composeCast === "function"
      ) {
        try {
          await window.miniapp.sdk.actions.composeCast({
            text: castText,
            embeds: [shareImageUrl],
          });
          return;
        } catch (err) {
          console.warn("composeCast error:", err);
        }
      }

      // Web share
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Reflex Score",
            text: castText,
            url: miniAppUrl,
          });
          return;
        } catch (err) {}
      }

      // Clipboard fall-back
      try {
        await navigator.clipboard.writeText(castText);
        alert("Copied to clipboard!");
      } catch (err) {
        window.open(miniAppUrl, "_blank");
      }
    });
  }
});
