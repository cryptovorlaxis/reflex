// ================================================================
// REFLEX — TRON EDITION
// Simple reflex game + pay-on-share (Base 0.001 ETH)
// ================================================================

// ---------------------------
// Element Referansları
// ---------------------------
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreScreen = document.getElementById("scoreScreen");

const startButton = document.getElementById("startButton");
const reactorBtn = document.getElementById("reactorBtn");

const statusText = document.getElementById("status");
const bestScoreValue = document.getElementById("bestValue");

const scorePanel = document.getElementById("scorePanel");
const scoreDisplay = document.getElementById("score");
const rankTitle = document.getElementById("rankTitle");
const newRecordBadge = document.getElementById("newRecordBadge");

const againBtn = document.getElementById("againBtn");
const shareBtn = document.getElementById("shareBtn");

// ---------------------------
// Oyun State Değişkenleri
// ---------------------------
let gameState = "INTRO"; // INTRO | WAIT | GO | SCORE | FAIL
let waitTimer = null;
let failTimer = null;
let goStartTime = null; // performance.now() zamanı
let bestScore = null; // ms cinsinden

// Share sırasında tekrar tıklamayı engellemek için
let isSharing = false;

// Ödeme bilgileri (Base ağında ETH)
const PAYMENT_RECEIVER = "0xb614b629466d9ce515410cb423960f980ecc6f73";
const PAYMENT_AMOUNT_WEI_HEX = "0x38d7ea4c68000"; // 0.001 ETH (1e15 wei)
const BASE_CHAIN_ID_HEX = "0x2105"; // 8453 (Base mainnet)

// ================================================================
// Mini App SDK HELPER
// ================================================================

function getMiniAppSDK() {
  // Önce window.miniapp.sdk, yoksa window.farcasterSDK.sdk
  if (window.miniapp && window.miniapp.sdk) {
    return window.miniapp.sdk;
  }
  if (window.farcasterSDK && window.farcasterSDK.sdk) {
    return window.farcasterSDK.sdk;
  }
  return null;
}

// ready() çağrısını güvenli yapan helper
async function callMiniAppReady() {
  try {
    const sdk = getMiniAppSDK();
    if (sdk && sdk.actions && typeof sdk.actions.ready === "function") {
      await sdk.actions.ready();
    }
  } catch (err) {
    // Uyarı ver, ama oyunu bozma
    console.warn("Mini app ready() çağrısı başarısız:", err);
  }
}

// Wallet provider alma helper
async function getEthereumProvider() {
  const sdk = getMiniAppSDK();
  if (!sdk || !sdk.wallet || typeof sdk.wallet.getEthereumProvider !== "function") {
    throw new Error("Ethereum wallet provider bu mini app hostunda desteklenmiyor.");
  }
  const provider = await sdk.wallet.getEthereumProvider();
  if (!provider) {
    throw new Error("Ethereum provider alınamadı.");
  }
  return provider;
}

// Base ağına geçiş helper
async function ensureBaseNetwork(provider) {
  try {
    const currentChainId = await provider.request({ method: "eth_chainId" });
    if (currentChainId === BASE_CHAIN_ID_HEX) {
      return; // Zaten Base'de
    }
  } catch (err) {
    console.warn("chainId okunamadı, direkt switch denenecek:", err);
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
    return;
  } catch (switchError) {
    // 4902 → chain tanımlı değilse addEthereumChain deneyebiliriz
    if (switchError && switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BASE_CHAIN_ID_HEX,
              chainName: "Base",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            },
          ],
        });
        return;
      } catch (addError) {
        console.error("Base ağı eklenemedi:", addError);
        throw addError;
      }
    }

    console.error("Base ağına geçilemedi:", switchError);
    throw switchError;
  }
}

// ================================================================
// Ekran & UI Helper Fonksiyonları
// ================================================================

function showScreen(screen) {
  // Tüm ekranları gizle
  [startScreen, gameScreen, scoreScreen].forEach((el) => {
    if (!el) return;
    el.classList.remove("visible");
  });

  // Hedef ekranı göster
  if (screen === "START" && startScreen) {
    startScreen.classList.add("visible");
  } else if (screen === "GAME" && gameScreen) {
    gameScreen.classList.add("visible");
  } else if (screen === "SCORE" && scoreScreen) {
    scoreScreen.classList.add("visible");
  }
}

function setStatus(text) {
  if (statusText) {
    statusText.textContent = text;
  }
}

function updateReactorState(modeClass) {
  if (!reactorBtn) return;

  reactorBtn.classList.remove("mode-wait", "mode-go", "mode-fail");

  if (modeClass) {
    reactorBtn.classList.add(modeClass);
  }
}

function formatScore(ms) {
  const seconds = ms / 1000;
  return seconds.toFixed(3); // "0.187"
}

// Rank mapping
function getRank(ms) {
  const s = ms / 1000;

  if (s <= 0.16) return "DIAMOND";
  if (s <= 0.21) return "PLATINUM";
  if (s <= 0.26) return "GOLD";
  if (s <= 0.33) return "SILVER";
  return "BRONZE";
}

// Rank classlarını güncelle
function applyRankClass(rank) {
  if (!scorePanel) return;

  scorePanel.classList.remove(
    "rank-diamond",
    "rank-platinum",
    "rank-gold",
    "rank-silver",
    "rank-bronze"
  );

  const lower = rank.toLowerCase();
  if (lower.includes("diamond")) scorePanel.classList.add("rank-diamond");
  else if (lower.includes("platinum")) scorePanel.classList.add("rank-platinum");
  else if (lower.includes("gold")) scorePanel.classList.add("rank-gold");
  else if (lower.includes("silver")) scorePanel.classList.add("rank-silver");
  else scorePanel.classList.add("rank-bronze");
}

// ================================================================
// Oyun Akışı Fonksiyonları
// ================================================================

function startGame() {
  // Timer temizliği
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }
  if (failTimer) {
    clearTimeout(failTimer);
    failTimer = null;
  }

  gameState = "WAIT";
  updateReactorState("mode-wait");
  setStatus("FOCUS…");

  // Rastgele bekleme: 1500–4500 ms
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

function handleFail(message) {
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }

  gameState = "FAIL";
  updateReactorState("mode-fail");
  setStatus(message || "FAIL");

  failTimer = setTimeout(() => {
    showScreen("GAME");
    startGame();
  }, 900);
}

function showScore(ms) {
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }

  gameState = "SCORE";

  const scoreText = formatScore(ms);
  if (scoreDisplay) {
    scoreDisplay.textContent = scoreText;
  }

  const rank = getRank(ms);
  if (rankTitle) {
    rankTitle.textContent = rank + " TIER";
  }
  applyRankClass(rank);

  // Best score (oturum içi)
  let isNewRecord = false;
  if (bestScore === null || ms < bestScore) {
    bestScore = ms;
    isNewRecord = true;
  }

  if (bestScoreValue) {
    bestScoreValue.textContent = bestScore === null ? "--" : formatScore(bestScore);
  }

  if (newRecordBadge) {
    newRecordBadge.style.display = isNewRecord ? "inline-block" : "none";
  }

  // Score ekranını göster
  showScreen("SCORE");
}

// SCORE ekranından oyuna dönüş
function resetToGame() {
  gameState = "INTRO";
  showScreen("GAME");
  setStatus("SYSTEM READY");
  updateReactorState(null);
}

// ================================================================
// PAY-THEN-SHARE AKIŞI
// ================================================================

async function handleShareClick() {
  if (isSharing) return;
  isSharing = true;

  const originalText = shareBtn ? shareBtn.textContent : "";
  if (shareBtn) {
    shareBtn.disabled = true;
    shareBtn.textContent = "PROCESSING…";
  }

  try {
    // 1) Skor ve rank bilgilerini oku
    const scoreText = scoreDisplay && scoreDisplay.textContent
      ? scoreDisplay.textContent
      : "0.000";
    const rankText = rankTitle && rankTitle.textContent
      ? rankTitle.textContent
      : "UNRANKED";

    const sdk = getMiniAppSDK();
    const miniAppUrl = window.location.origin;

    // Paylaşım görseli (OG image endpoint)
    const shareImageUrl = `${miniAppUrl}/api/score-image?score=${encodeURIComponent(
      scoreText
    )}&rank=${encodeURIComponent(rankText)}`;

    const castText = `My reflex time: ${scoreText}s — ${rankText} ⚡️
Play: ${miniAppUrl}`;

    // 2) ÖNCE: Wallet ödeme (0.001 ETH, Base)
    if (!sdk || !sdk.wallet || typeof sdk.wallet.getEthereumProvider !== "function") {
      throw new Error("Bu istemci wallet.getEthereumProvider özelliğini desteklemiyor.");
    }

    const provider = await getEthereumProvider();
    await ensureBaseNetwork(provider);

    // Basit ETH transferi
    const txParams = {
      to: PAYMENT_RECEIVER,
      value: PAYMENT_AMOUNT_WEI_HEX,
    };

    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    console.log("Payment tx sent:", txHash);

    // 3) Tx kabul edildikten sonra CAST
    if (sdk.actions && typeof sdk.actions.composeCast === "function") {
      await sdk.actions.composeCast({
        text: castText,
        embeds: [shareImageUrl], // Sadece score-image embed
      });
      return; // Başarılı → çık
    }

    // 4) Fallback: Web Share API
    if (navigator.share) {
      await navigator.share({
        title: "Reflex Score",
        text: castText,
        url: miniAppUrl,
      });
      return;
    }

    // 5) Fallback: Clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(castText);
      alert("Cast metni panoya kopyalandı!");
      return;
    }

    // En son çare: yeni sekme
    window.open(miniAppUrl, "_blank");
  } catch (err) {
    console.error("Pay-then-share sırasında hata:", err);
    alert("Ödeme veya paylaşım iptal edildi / başarısız oldu.");
  } finally {
    isSharing = false;
    if (shareBtn) {
      shareBtn.disabled = false;
      shareBtn.textContent = originalText || "SHARE";
    }
  }
}

// ================================================================
// EVENT LISTENERS & INIT
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1) Mini App ready() çağrısı
  callMiniAppReady();

  // 2) Başlangıç UI
  showScreen("START");
  setStatus("SYSTEM READY");

  if (bestScoreValue) {
    bestScoreValue.textContent = "--";
  }
  updateReactorState(null);

  // START butonu → oyuna geç
  if (startButton) {
    startButton.addEventListener("click", () => {
      showScreen("GAME");
      setStatus("SYSTEM READY");
      startGame();
    });
  }

  // REACTOR tıklaması
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

  // Tekrar dene
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      resetToGame();
      startGame();
    });
  }

  // SHARE (pay + cast)
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      handleShareClick();
    });
  }
});
