// =================================================================
// TRON Reflex Mini Game — SIMPLE BEST SCORE VERSION (NO FAKE FLASH)
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

// Oyun durumları
let gameState = "INTRO";
let waitTimer = null;
let goStartTime = 0;

// BEST SCORE (sadece bu oturum için)
let bestScore = null;

// Format
function formatScore(ms) {
  return (ms / 1000).toFixed(3);
}

// Tier sistemi
function getRank(ms) {
  const s = ms / 1000;
  if (s <= 0.16) return { label: "DIAMOND", cssClass: "rank-diamond" };
  if (s <= 0.21) return { label: "PLATINUM", cssClass: "rank-platinum" };
  if (s <= 0.26) return { label: "GOLD", cssClass: "rank-gold" };
  if (s <= 0.33) return { label: "SILVER", cssClass: "rank-silver" };
  return { label: "BRONZE", cssClass: "rank-bronze" };
}

function setStatus(text) {
  statusText.textContent = text;
}

function updateReactorState(cls) {
  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");
  if (cls) reactorBtn.classList.add(cls);
}

// GO anında kısa beyaz flaş (SADECE GERÇEK GO İÇİN)
function flashScreen() {
  const flash = document.createElement("div");
  flash.className = "go-flash";
  document.body.appendChild(flash);
  setTimeout(() => {
    flash.remove();
  }, 200);
}

// SCORE ekranını göster
function showScore(ms) {
  gameState = "SCORE";

  // Anlık skor
  const scoreStr = formatScore(ms);
  scoreDisplay.textContent = scoreStr;

  // Rank
  const { label, cssClass } = getRank(ms);
  rankTitle.textContent = label;

  scorePanel.classList.remove(
    "rank-diamond",
    "rank-platinum",
    "rank-gold",
    "rank-silver",
    "rank-bronze"
  );
  scorePanel.classList.add(cssClass);

  // BEST SCORE (sadece bu oturum)
  let isNewRecord = false;
  if (bestScore === null || ms < bestScore) {
    bestScore = ms;
    isNewRecord = true;
  }

  bestScoreValue.textContent =
    bestScore === null ? "--" : formatScore(bestScore);
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

// Oyun akışı
function startGame() {
  if (waitTimer) clearTimeout(waitTimer);

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("FOCUS");

  // Sadece gerçek GO için random bekleme
  const randomWait = 2500 + Math.random() * 4500;

  waitTimer = setTimeout(() => {
    transitionToGo();
  }, randomWait);
}

function transitionToGo() {
  // Güvenlik: sadece WAIT modunda GO'ya geç
  if (gameState !== "WAIT") return;

  gameState = "GO";
  goStartTime = performance.now();

  updateReactorState("mode-go");
  setStatus("GO!");


  reactorBtn.classList.add("reactor-go-pulse");
  setTimeout(() => reactorBtn.classList.remove("reactor-go-pulse"), 350);

  statusText.classList.add("status-shake");
  setTimeout(() => statusText.classList.remove("status-shake"), 250);
}

// EVENTLER
document.addEventListener("DOMContentLoaded", () => {
  // Başlangıçta BEST
  bestScoreValue.textContent = "--";

  if (startButton) {
    startButton.textContent = "START TEST";

    const hint = document.querySelector(".start-hint");
    if (hint) hint.textContent = "Wait for the signal…";

    startButton.addEventListener("click", () => {
      startScreen.style.display = "none";
      gameScreen.classList.add("visible");
      startGame();
    });
  }

  if (reactorBtn) {
    reactorBtn.addEventListener("click", () => {
      if (gameState === "FOCUS") {
        handleFail("TOO EARLY!");
      } else if (gameState === "STRIKE") {
        const now = performance.now();
        const diff = now - goStartTime;
        showScore(diff);
      }
    });
  }

  if (againBtn) {
    againBtn.addEventListener("click", () => {
      resetToGame();
      startGame();
    });
  }

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

      // Farcaster
      if (
        window.miniapp &&
        window.miniapp.sdk &&
        window.miniapp.sdk.actions?.composeCast
      ) {
        try {
          await window.miniapp.sdk.actions.composeCast({
            text: castText,
            embeds: [shareImageUrl],
          });
          return;
        } catch (e) {}
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
        } catch (e) {}
      }

      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(castText);
        alert("Copied to clipboard!");
      } catch (e) {
        window.open(miniAppUrl, "_blank");
      }
    });
  }
});
