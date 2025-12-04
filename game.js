let btn = document.getElementById("reactor");
let text = document.getElementById("reactorText");
let status = document.getElementById("status");

let scorePanel = document.getElementById("scorePanel");
let scoreText = document.getElementById("score");
let rankTitle = document.getElementById("rankTitle");

let againBtn = document.getElementById("againBtn");
let shareBtn = document.getElementById("shareBtn");

let gameState = "idle";
let startTime = 0;
let timeoutID;

btn.addEventListener("click", () => {
    if (gameState === "idle") startGame();
    else if (gameState === "wait") fail();
    else if (gameState === "go") success();
});

againBtn.addEventListener("click", resetGame);
shareBtn.addEventListener("click", () => window.shareScore?.(scoreText.innerText));

function startGame() {
    gameState = "wait";
    status.innerText = "WAIT FOR SIGNAL...";
    text.innerText = "HOLD";

    const delay = Math.random() * 1200 + 650;  // ⚡ HIZLANDIRILDI

    timeoutID = setTimeout(() => {
        gameState = "go";
        status.innerText = "TAP NOW!";
        text.innerText = "GO!";
        startTime = performance.now();
    }, delay);
}

function fail() {
    clearTimeout(timeoutID);
    gameState = "idle";
    status.innerText = "FAIL";
    text.innerText = "X";
    setTimeout(resetGame, 900);
}

function success() {
    const ms = performance.now() - startTime;
    const sec = (ms / 1000).toFixed(3);

    scoreText.innerText = sec;
    rankTitle.innerText = rank(ms);

    scorePanel.classList.add("visible");

    status.innerText = "SYNC OK";
    text.innerText = "✔";
}

function rank(ms) {
    if (ms < 180) return "THE SINGULARITY 🌌";
    if (ms < 220) return "CYBER DEMON 👹";
    if (ms < 260) return "NEON OPERATIVE ⚡";
    if (ms < 320) return "STREET SAMURAI ⚔️";
