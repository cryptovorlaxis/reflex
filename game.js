// =================================================================
// game.js — TRON Reflex Mini Game
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
const gameLogo = document.getElementById("gameLogo"); // 👈 LOGO

// Durum değişkenleri
let gameState = "INTRO"; // INTRO, WAIT, GO, FAIL, SCORE
let waitTimer = null;
let goStartTime = 0;
let bestScore =
  localStorage.getItem("reflexBestScore") != null
    ? parseFloat(localStorage.getItem("reflexBestScore"))
    : 0;

// Yardımcı fonksiyonlar
function formatScore(ms) {
  return (ms / 1000).toFixed(3);
}

function getRank(ms) {
  const s = ms / 1000;

  if (s <= 0.15) {
    return { label: "SINGULARITY PROTOCOL", cssClass: "rank-s-plus" };
  } else if (s <= 0.22) {
    return { label: "DEMON REACTOR", cssClass: "rank-s" };
  } else if (s <= 0.3) {
    return { label: "OPERATIVE", cssClass: "rank-a" };
  } else if (s <= 0.4) {
    return { label: "NEON SAMURAI", cssClass: "rank-b" };
  }
  return { label: "UNRANKED GLITCH", cssClass: "rank-c" };
}

function setStatus(text) {
  if (statusText) statusText.textContent = text;
}

function updateReactorState(mode) {
  if (!reactorBtn) return;
  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");
  if (mode) reactorBtn.classList.add(mode);
}

function showScore(ms) {
  gameState = "SCORE";
  const scoreStr = formatScore(ms);
  scoreDisplay.textContent = scoreStr;

  const { label, cssClass } = getRank(ms);
  rankTitle.textContent = label;

  scorePanel.classList.remove(
    "rank-s-plus",
    "rank-s",
    "rank-a",
    "rank-b",
    "rank-c"
  );
  scorePanel.classList.add(cssClass);

  let isNewRecord = false;
  if (bestScore === 0 || ms < bestScore) {
    bestScore = ms;
    localStorage.setItem("reflexBestScore", String(ms));
    isNewRecord = true;
  }

  bestScoreValue.textContent =
    bestScore === 0 ? "--" : formatScore(bestScore);

  newRecordBadge.style.display = isNewRecord ? "inline-block" : "none";

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

// Oyun döngüsü
function startGame() {
  if (waitTimer) clearTimeout(waitTimer);

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("WAIT FOR GREEN...");

  const randomWait = 1500 + Math.random() * 3000;

  waitTimer = setTimeout(() => {
    transitionToGo();
  }, randomWait);
}

function transitionToGo() {
  gameState = "GO";
  goStartTime = performance.now();
  updateReactorState("mode-go");
  setStatus("TAP NOW!");
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  bestScoreValue.textContent =
    bestScore === 0 ? "--" : formatScore(bestScore);

  // 🔒 LOGO GÖRÜNÜRLÜK KİLİDİ
  if (gameLogo) {
    // Başlangıçta zorla görünür yap
    gameLogo.style.setProperty("opacity", "1", "important");
    gameLogo.style.setProperty("display", "block", "important");

    // Her 1 saniyede bir tekrar zorla (Farcaster bir şeyle bozsa bile)
    setInterval(() => {
      if (!document.body.contains(gameLogo)) {
        // DOM'dan silinmişse geri tak
        const container = document.querySelector(".logo-container");
        if (container) container.prepend(gameLogo);
      }
      gameLogo.style.setProperty("opacity", "1", "important");
      gameLogo.style.setProperty("display", "block", "important");
    }, 1000);
  }

  // START
  if (startButton) {
    startButton.addEventListener("click", () => {
      startScreen.style.display = "none";
      gameScreen.classList.add("visible");
      startGame();
    });
  }

  // REACTOR TIKLAMA
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

  // TEKRAR
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      resetToGame();
      startGame();
    });
  }

  // SHARE → tek görselli cast
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const scoreText = scoreDisplay.textContent || "0.000";
      const rankText = rankTitle.textContent || "UNRANKED GLITCH";

      const shareImageUrl = `${window.location.origin}/api/score-image?score=${encodeURIComponent(
        scoreText
      )}&rank=${encodeURIComponent(rankText)}`;

      const miniAppUrl = window.location.origin;

      const castText = `My reflex time: ${scoreText}s — ${rankText} in REFLEX TEST ⚡️

Play: ${miniAppUrl}`;

      // 1) Farcaster Mini App içindeysek: composeCast (tek embed = skor görseli)
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
        } catch (e) {
          console.warn("miniapp.sdk.actions.composeCast failed", e);
        }
      }

      // 2) Tarayıcı native share
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Reflex Score",
            text: castText,
            url: miniAppUrl,
          });
          return;
        } catch (e) {
          console.warn("navigator.share failed", e);
        }
      }

      // 3) Clipboard fallback
      try {
        await navigator.clipboard.writeText(castText);
        alert("Cast text copied to clipboard!");
        return;
      } catch (e) {
        console.warn("clipboard failed", e);
      }

      // 4) En son çare: oyun linkini aç
      window.open(miniAppUrl, "_blank");
    });
  }
});
