// =================================================================
// TRON Reflex Mini Game — SIMPLE BEST SCORE VERSION (NO FLASH)
// + Pay-on-share (0.001 ETH on Base network) + PAID RUN badge
// =================================================================

// ---- Element referansları ----
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
const paidRunBadge = document.getElementById("paidRunBadge");

// ---- Oyun state ----
let gameState = "INTRO"; // INTRO, WAIT, GO, SCORE, FAIL
let waitTimer = null;
let goStartTime = 0;

// ---- Best score (oturum içi) ----
let bestScore = null;

// ---- Pay-then-share kontrol ----
let isSharing = false;

// ---- Payment yapılandırması ----
const PAYMENT_RECEIVER = "0xb614b629466d9ce515410cb423960f980ecc6f73";
const PAYMENT_AMOUNT_WEI_HEX = "0x38d7ea4c68000"; // 0.001 ETH
const BASE_CHAIN_ID_HEX = "0x2105"; // 8453 Base Mainnet

// ================================================================
// Mini App SDK helperları
// ================================================================

function getMiniAppSDK() {
  if (window.miniapp?.sdk) return window.miniapp.sdk;
  if (window.farcasterSDK?.sdk) return window.farcasterSDK.sdk;
  return null;
}

async function callMiniAppReady() {
  try {
    const sdk = getMiniAppSDK();
    if (sdk?.actions?.ready) {
      await sdk.actions.ready();
    }
  } catch (err) {
    console.warn("ready() çağrısı başarısız:", err);
  }
}

async function getEthereumProvider() {
  const sdk = getMiniAppSDK();
  if (!sdk?.wallet?.getEthereumProvider) {
    throw new Error("Ethereum provider desteklenmiyor.");
  }
  const provider = await sdk.wallet.getEthereumProvider();
  if (!provider) throw new Error("Provider alınamadı.");
  return provider;
}

async function ensureBaseNetwork(provider) {
  let current = null;
  try {
    current = await provider.request({ method: "eth_chainId" });
    if (current === BASE_CHAIN_ID_HEX) return;
  } catch (e) {
    console.warn("chainId okunamadı, switch denenecek:", e);
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
    return;
  } catch (err) {
    if (err && err.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BASE_CHAIN_ID_HEX,
            chainName: "Base",
            nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://mainnet.base.org"],
            blockExplorerUrls: ["https://basescan.org"],
          },
        ],
      });
      return;
    }
    throw err;
  }
}

// ================================================================
// Yardımcı fonksiyonlar
// ================================================================

function formatScore(ms) {
  return (ms / 1000).toFixed(3);
}

function getRank(ms) {
  const s = ms / 1000;
  if (s <= 0.16) return { label: "DIAMOND", cls: "rank-diamond" };
  if (s <= 0.21) return { label: "PLATINUM", cls: "rank-platinum" };
  if (s <= 0.26) return { label: "GOLD", cls: "rank-gold" };
  if (s <= 0.33) return { label: "SILVER", cls: "rank-silver" };
  return { label: "BRONZE", cls: "rank-bronze" };
}

function setStatus(t) {
  if (statusText) statusText.textContent = t;
}

function updateReactorState(cls) {
  if (!reactorBtn) return;
  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");
  if (cls) reactorBtn.classList.add(cls);
}

function hidePaidRunBadge() {
  if (paidRunBadge) paidRunBadge.style.display = "none";
}

function showPaidRunBadge() {
  if (paidRunBadge) paidRunBadge.style.display = "inline-block";
}

// ================================================================
// Score ekranı
// ================================================================

function showScore(ms) {
  gameState = "SCORE";

  // Her yeni skor geldiğinde PAID RUN etiketini resetle
  hidePaidRunBadge();

  const scoreStr = formatScore(ms);
  if (scoreDisplay) scoreDisplay.textContent = scoreStr;

  const { label, cls } = getRank(ms);
  if (rankTitle) rankTitle.textContent = label;

  if (scorePanel) {
    scorePanel.classList.remove(
      "rank-diamond",
      "rank-platinum",
      "rank-gold",
      "rank-silver",
      "rank-bronze"
    );
    scorePanel.classList.add(cls);
  }

  // Best score güncelle
  let isNew = false;
  if (bestScore === null || ms < bestScore) {
    bestScore = ms;
    isNew = true;
  }
  if (bestScoreValue) {
    bestScoreValue.textContent = bestScore === null ? "--" : formatScore(bestScore);
  }
  if (newRecordBadge) {
    newRecordBadge.style.display = isNew ? "inline-block" : "none";
  }

  if (scoreScreen) scoreScreen.classList.add("visible");
  if (scorePanel) scorePanel.classList.add("visible");
}

function handleFail(msg) {
  gameState = "FAIL";
  updateReactorState("mode-fail");
  setStatus(msg);

  setTimeout(() => {
    resetToGame();
    startGame();
  }, 900);
}

function resetToGame() {
  if (scoreScreen) scoreScreen.classList.remove("visible");
  if (scorePanel) scorePanel.classList.remove("visible");
  if (gameScreen) gameScreen.classList.add("visible");
  hidePaidRunBadge();
}

// ================================================================
// Oyun akışı
// ================================================================

function startGame() {
  if (waitTimer) clearTimeout(waitTimer);

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("FOCUS…");

  const randomWait = 1500 + Math.random() * 3000;

  waitTimer = setTimeout(() => {
    transitionToGo();
  }, randomWait);
}

function transitionToGo() {
  if (gameState !== "WAIT") return;

  gameState = "GO";
  goStartTime = performance.now();

  updateReactorState("mode-go");
  setStatus("STRIKE!");
}

// ================================================================
// Pay → sonra Share
// ================================================================

async function handleShare() {
  if (isSharing) return;
  isSharing = true;

  const originalText = shareBtn ? shareBtn.textContent : "";

  if (shareBtn) {
    shareBtn.disabled = true;
    shareBtn.textContent = "PROCESSING…";
  }

  try {
    const scoreText = scoreDisplay?.textContent || "0.000";
    const rankText = rankTitle?.textContent || "BRONZE";

    const shareImageUrl = `${window.location.origin}/api/score-image?score=${encodeURIComponent(
      scoreText
    )}&rank=${encodeURIComponent(rankText)}`;

    const miniAppUrl = window.location.origin;

    const castText = `My reflex time: ${scoreText}s — ${rankText} tier ⚡️
Play: ${miniAppUrl}`;

    // ---- 1) ÖDEME ----
    const provider = await getEthereumProvider();
    await ensureBaseNetwork(provider);

    const accounts = await provider.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("Wallet adresi bulunamadı (eth_accounts boş).");
    }
    const from = accounts[0];

    const txParams = {
      from,
      to: PAYMENT_RECEIVER,
      value: PAYMENT_AMOUNT_WEI_HEX,
    };

    await provider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    // ---- 2) CAST ----
    const sdk = getMiniAppSDK();
    let shared = false;

    if (sdk?.actions?.composeCast) {
      await sdk.actions.composeCast({
        text: castText,
        embeds: [shareImageUrl],
      });
      shared = true;
    } else if (navigator.share) {
      await navigator.share({
        title: "Reflex Score",
        text: castText,
        url: miniAppUrl,
      });
      shared = true;
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(castText);
      alert("Cast text copied to clipboard!");
      shared = true;
    } else {
      window.open(miniAppUrl, "_blank");
    }

    // Eğer cast/şar başarılıysa etiketi yak
    if (shared) {
      showPaidRunBadge();
    }
  } catch (err) {
    console.error("Share sırasında hata:", err);
    alert("Payment or share failed / cancelled.");
  } finally {
    isSharing = false;
    if (shareBtn) {
      shareBtn.disabled = false;
      shareBtn.textContent = originalText || "SHARE";
    }
  }
}

// ================================================================
// INIT
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Farcaster Mini App ready()
  callMiniAppReady();

  if (bestScoreValue) bestScoreValue.textContent = "--";
  hidePaidRunBadge();

  // START
  if (startButton) {
    const hint = document.querySelector(".start-hint");
    if (hint) hint.textContent = "Wait for the signal…";

    startButton.textContent = "START TEST";
    startButton.addEventListener("click", () => {
      if (startScreen) startScreen.style.display = "none";
      if (gameScreen) gameScreen.classList.add("visible");
      startGame();
    });
  }

  // TAP
  if (reactorBtn) {
    reactorBtn.addEventListener("click", () => {
      if (gameState === "WAIT") {
        handleFail("TOO EARLY!");
      } else if (gameState === "GO") {
        const diff = performance.now() - goStartTime;
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

  // SHARE → Payment + Cast
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      handleShare();
    });
  }
});
