// =================================================================
// game.js — TRON Reflex Mini Game + Farcaster entegrasyonu
// =================================================================

// 1. Element Referansları
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

// 2. Oyun Durumu ve Değişkenler
// INTRO, WAIT, GO, FAIL, SCORE
let gameState = "INTRO";
let waitTimer = null;
let goStartTime = 0;
let bestScore =
  localStorage.getItem("reflexBestScore") != null
    ? parseFloat(localStorage.getItem("reflexBestScore"))
    : 0.0;

// 3. Yardımcı Fonksiyonlar

function formatScore(ms) {
  // ms -> saniye
  return (ms / 1000).toFixed(3);
}

function getRank(ms) {
  const s = ms / 1000;

  if (s <= 0.150) {
    return {
      label: "SINGULARITY PROTOCOL",
      cssClass: "rank-s-plus",
    };
  } else if (s <= 0.220) {
    return {
      label: "DEMON REACTOR",
      cssClass: "rank-s",
    };
  } else if (s <= 0.300) {
    return {
      label: "OPERATIVE",
      cssClass: "rank-a",
    };
  } else if (s <= 0.400) {
    return {
      label: "NEON SAMURAI",
      cssClass: "rank-b",
    };
  } else {
    return {
      label: "UNRANKED GLITCH",
      cssClass: "rank-c",
    };
  }
}

function setStatus(text) {
  if (statusText) {
    statusText.textContent = text;
  }
}

function updateReactorState(mode) {
  if (!reactorBtn) return;

  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");

  if (mode) {
    reactorBtn.classList.add(mode);
  }
}

function showScore(ms) {
  gameState = "SCORE";
  const scoreStr = formatScore(ms);
  scoreDisplay.textContent = scoreStr;

  // Rank hesapla
  const { label, cssClass } = getRank(ms);
  rankTitle.textContent = label;

  // Score panel rank class'ları reset
  scorePanel.classList.remove(
    "rank-s-plus",
    "rank-s",
    "rank-a",
    "rank-b",
    "rank-c"
  );
  scorePanel.classList.add(cssClass);

  // Best score
  let isNewRecord = false;
  if (bestScore === 0 || ms < bestScore) {
    bestScore = ms;
    localStorage.setItem("reflexBestScore", String(ms));
    isNewRecord = true;
  }

  bestScoreValue.textContent =
    bestScore === 0 ? "--" : formatScore(bestScore);

  // NEW RECORD badge
  if (isNewRecord) {
    newRecordBadge.style.display = "inline-block";
  } else {
    newRecordBadge.style.display = "none";
  }

  // Score screen göster
  scoreScreen.classList.add("visible");
  scorePanel.classList.add("visible");
}

function handleFail(reason) {
  gameState = "FAIL";
  updateReactorState("mode-fail");
  setStatus(reason);

  // Kısa bir süre sonra score screen yerine tekrar oyuna al
  setTimeout(() => {
    resetToGame();
    startGame();
  }, 900);
}

function resetToGame() {
  // Score ekranını kapat
  scoreScreen.classList.remove("visible");
  scorePanel.classList.remove("visible");

  // Game ekranını açık bırak
  gameScreen.classList.add("visible");
}

// =================================================================
// 4. Oyun Döngüsü
// =================================================================

function startGame() {
  // Eski timer'ları temizle
  if (waitTimer) clearTimeout(waitTimer);

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("WAIT FOR GREEN...");

  // Rastgele bekleme süresi: 1.5s - 4.5s
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

// =================================================================
// 5. Event Listeners
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Best skor göster
  bestScoreValue.textContent =
    bestScore === 0 ? "--" : formatScore(bestScore);

  // START
  if (startButton) {
    startButton.addEventListener("click", async () => {
      // Start ekranını kapat, game ekranını aç
      startScreen.style.display = "none";
      gameScreen.classList.add("visible");

      // Farcaster'a "hazırım" de
      // (Mini app içindeysek, splash screen bundan sonra kaybolur)
      try {
        if (
          window.farcasterSDK &&
          window.farcasterSDK.actions &&
          typeof window.farcasterSDK.actions.ready === "function"
        ) {
          await window.farcasterSDK.actions.ready();
        }
      } catch (err) {
        console.error("Farcaster Ready Failed:", err);
      }

      // Oyunu başlat
      startGame();
    });
  }

  // REACTOR TIKLAMA
  if (reactorBtn) {
    reactorBtn.addEventListener("click", () => {
      if (gameState === "WAIT") {
        // Erken bastı
        handleFail("TOO EARLY!");
      } else if (gameState === "GO") {
        // Doğru anda bastı
        const now = performance.now();
        const diff = now - goStartTime;
        showScore(diff);
      }
    });
  }

  // TEKRAR OYNA
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      resetToGame();
      startGame();
    });
  }

  // SHARE
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const scoreText = scoreDisplay.textContent || "0.000";
      const rankText = rankTitle.textContent || "UNRANKED GLITCH";

      const shareUrl = `${window.location.origin}/api/score-image?score=${encodeURIComponent(
        scoreText
      )}&rank=${encodeURIComponent(rankText)}`;

      // Farcaster mini app içindeysek, burada cast / share action
      // kullanabilirsin. Şimdilik sadece linki kopyalıyoruz.
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share image URL copied to clipboard!");
      } catch {
        alert("Share URL: " + shareUrl);
      }
    });
  }
});
