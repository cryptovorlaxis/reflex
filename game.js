// ===================================================================
//  REFLEX TRON — FINAL ÇALIŞAN GAME.JS
// ===================================================================

// ELEMENTLER
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const reactorBtn = document.getElementById("reactorBtn");
const statusText = document.getElementById("status");
const scorePanel = document.getElementById("scorePanel");
const scoreScreen = document.getElementById("scoreScreen");
const scoreText = document.getElementById("score");
const rankTitle = document.getElementById("rankTitle");
const newRecordBadge = document.getElementById("newRecordBadge");
const bestValue = document.getElementById("bestValue");
const againBtn = document.getElementById("againBtn");


// GLOBAL STATE
let gameState = "IDLE";
let startTime = 0;
let timeoutID = null;
let bestScore = localStorage.getItem("reflexBestScore")
    ? parseFloat(localStorage.getItem("reflexBestScore"))
    : null;


// ================================================================
// START SCREEN → GAME SCREEN GEÇİŞİ
// ================================================================

startButton.addEventListener("click", () => {

    // Start Screen'i yok et
    startScreen.style.display = "none";

    // Game Screen'i göster
    gameScreen.classList.add("visible");

    // Oyun başlat
    startWAIT();

    // LOGONUN KAYBOLMA SORUNUNU KESİN ÇÖZEN SATIR
    const gameLogo = document.getElementById("gameLogo");
    if (gameLogo) gameLogo.style.opacity = "1";

    // Farcaster ready çağrısı (Sadece burada)
    if (window.farcasterSDK?.actions?.ready) {
        window.farcasterSDK.actions.ready().catch(() => {});
    }
});


// ================================================================
//  WAIT → GO MANTIĞI
// ================================================================

function startWAIT() {
    gameState = "WAIT";

    statusText.textContent = "WAIT FOR SIGNAL...";
    reactorBtn.className = "reactor-core mode-wait";

    const randomTime = Math.random() * 2500 + 800;

    timeoutID = setTimeout(() => startGO(), randomTime);
}

function startGO() {
    gameState = "GO";

    statusText.textContent = "TAP NOW !!!";
    reactorBtn.className = "reactor-core mode-go";

    startTime = Date.now();
}


// ================================================================
//  REACTOR BUTTON TIKLAMA
// ================================================================

reactorBtn.addEventListener("click", () => {

    if (gameState === "WAIT") {
        failEarly();
        return;
    }

    if (gameState === "GO") {
        succeed();
        return;
    }
});


// ================================================================
//  FAIL LOGIC
// ================================================================

function failEarly() {
    clearTimeout(timeoutID);
    gameState = "FAIL";

    statusText.textContent = "SYSTEM FAILURE";
    reactorBtn.className = "reactor-core mode-fail";

    setTimeout(() => startWAIT(), 1200);
}


// ================================================================
//  SUCCESS LOGIC
// ================================================================

function succeed() {
    clearTimeout(timeoutID);
    gameState = "SUCCESS";

    const reaction = (Date.now() - startTime) / 1000;
    const result = reaction.toFixed(3);

    scoreText.textContent = result;

    showScoreScreen(result);
}


// ================================================================
//  SCORE SCREEN GÖSTERME
// ================================================================

function showScoreScreen(scoreValue) {

    // En iyi skor kontrolü
    if (!bestScore || parseFloat(scoreValue) < bestScore) {
        bestScore = scoreValue;
        localStorage.setItem("reflexBestScore", bestScore);
        newRecordBadge.style.display = "block";
    } else {
        newRecordBadge.style.display = "none";
    }

    bestValue.textContent = bestScore;

    // Rank hesaplama
    rankTitle.textContent = getRank(scoreValue);

    // Ekranı göster
    scoreScreen.classList.add("visible");
    scorePanel.classList.add("visible");
}


// ================================================================
//  RANK HESABI
// ================================================================

function getRank(score) {
    score = parseFloat(score) * 1000;

    if (score < 160) return "S+ SINGULARITY";
    if (score < 200) return "S DEMON";
    if (score < 230) return "A OPERATIVE";
    if (score < 300) return "B SAMURAI";
    return "C GLITCH";
}


// ================================================================
//  RETRY
// ================================================================

againBtn.addEventListener("click", () => {
    scoreScreen.classList.remove("visible");
    scorePanel.classList.remove("visible");

    startWAIT();
});
