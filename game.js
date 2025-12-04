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

let gameState = "idle";
let startTime = 0;
let timeoutID = null;

let bestScore = localStorage.getItem("reflex_best_score") || null;
if (bestScore) bestValue.textContent = bestScore;

const MIN_REACTION_MS = 80;
let clickLocked = false;

// START BUTTON
startButton.addEventListener("click", () => {
    switchScreen(startScreen, gameScreen);
    resetGame();
});

// CLICK REACTOR
reactorBtn.addEventListener("click", () => {
    if (clickLocked) return;
    if (gameState === "idle") return beginWait();
    if (gameState === "wait") return failEarly();
    if (gameState === "go") return success();
});

// WAIT PHASE
function beginWait() {
    gameState = "wait";
    statusText.textContent = "WAIT";
    statusText.style.color = "#8ab8d4";

    const delay = Math.random() * 2000 + 1200;

    timeoutID = setTimeout(() => {
        gameState = "go";
        statusText.textContent = "GO";
        statusText.style.color = "#00ff85";

        startTime = performance.now();
    }, delay);
}

// FAIL EARLY
function failEarly() {
    clearTimeout(timeoutID);
    gameState = "idle";

    statusText.textContent = "FAIL";
    statusText.style.color = "#ff3b6b";

    clickLocked = true;
    setTimeout(() => {
        clickLocked = false;
        resetGame();
    }, 900);
}

// SUCCESS
function success() {
    const reaction = performance.now() - startTime;
    if (reaction < MIN_REACTION_MS) return failEarly();

    const seconds = (reaction / 1000).toFixed(3);
    finalScore.textContent = seconds;

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

    switchScreen(gameScreen, scoreScreen);
}

// RESET
function resetGame() {
    gameState = "idle";
    statusText.textContent = "WAIT";
    statusText.style.color = "#8ab8d4";
}

// RETRY BUTTON
retryBtn.addEventListener("click", () => {
    switchScreen(scoreScreen, gameScreen);
    resetGame();
});

// SCREEN SWITCH
function switchScreen(from, to) {
    from.classList.remove("visible");
    setTimeout(() => {
        to.classList.add("visible");
    }, 50);
}
