// =================================================================
// REFLEX GAME LOGIC: TRON EDITION (game.js TAM VERSİYON)
// =================================================================

// 1. Element Referansları
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreScreen = document.getElementById("scoreScreen");
const reactorBtn = document.getElementById("reactorBtn");
const statusText = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const bestScoreValue = document.getElementById("bestValue");
const rankTitle = document.getElementById("rankTitle");
const newRecordBadge = document.getElementById("newRecordBadge");
const againBtn = document.getElementById("againBtn");
const shareBtn = document.getElementById("shareBtn");
const scorePanel = document.getElementById("scorePanel");

// 2. Oyun Durumu ve Değişkenler
let gameState = 'INTRO'; // INTRO, WAIT, GO, FAIL, SCORE
let reactionTime = 0;
let waitTimer = null;
let goTimer = null;
let bestScore = localStorage.getItem('reflexBestScore') ? parseFloat(localStorage.getItem('reflexBestScore')) : 0.000;

// 3. Oyun Mantığı Fonksiyonları

// A. Puanlama ve Sıralama Fonksiyonu
function getRank(time) {
    if (time <= 0.150) return { title: 'S+', color: 'rank-s-plus' };
    if (time <= 0.200) return { title: 'S', color: 'rank-s' };
    if (time <= 0.250) return { title: 'A', color: 'rank-a' };
    if (time <= 0.350) return { title: 'B', color: 'rank-b' };
    return { title: 'C', color: 'rank-c' };
}

// B. Oyun Ekranını Güncelleme
function updateReactor(mode, statusMsg) {
    reactorBtn.className = 'reactor-core'; // Tüm modları sıfırla
    if (mode) {
        reactorBtn.classList.add(mode);
    }
    statusText.textContent = statusMsg;
}

// C. Reaksiyon Süresi Hesaplama ve Skor Ekranı
function showScore() {
    clearTimeout(waitTimer);
    clearTimeout(goTimer);
    gameState = 'SCORE';

    // Skor hesaplama ve formatlama
    const finalScore = parseFloat(reactionTime.toFixed(3));
    scoreDisplay.textContent = finalScore.toFixed(3);

    // Sıralama belirleme
    const rank = getRank(finalScore);
    rankTitle.textContent = rank.title;
    scorePanel.className = 'score-panel visible ' + rank.color;

    // Yüksek skor kontrolü
    let isNewRecord = false;
    if (finalScore < bestScore || bestScore === 0.000) {
        isNewRecord = true;
        bestScore = finalScore;
        localStorage.setItem('reflexBestScore', finalScore);
    }
    
    // Görsel güncelleme
    bestScoreValue.textContent = bestScore.toFixed(3);
    newRecordBadge.style.display = isNewRecord ? 'block' : 'none';

    // Ekranları değiştir
    gameScreen.style.display = 'none';
    scoreScreen.classList.add('visible');
    scorePanel.classList.add('visible');
}

// D. Hata Durumu
function handleFail() {
    gameState = 'FAIL';
    clearTimeout(waitTimer);
    clearTimeout(goTimer);
    
    updateReactor('mode-fail', 'FAULT: TOO FAST');

    // Ses efekti ekleyebilirsiniz (fail.mp3)
    // new Audio('fail.mp3').play(); 

    // Kısa bir titremenin ardından skor ekranına geç
    setTimeout(() => {
        reactionTime = 9.999; // Hata puanı
        showScore();
    }, 500);
}

// E. "GO" Durumuna Geçiş
function transitionToGO() {
    gameState = 'GO';
    reactionTime = performance.now(); // Başlangıç zamanını kaydet
    
    updateReactor('mode-go', 'INITIATE REFLEX');

    // Ses efekti ekleyebilirsiniz (ready.mp3)
    // new Audio('ready.mp3').play();
}

// F. Oyun Döngüsünü Başlatma (WAIT Durumu)
function startGame() {
    gameState = 'WAIT';
    updateReactor('mode-wait', 'STANDBY...');
    
    // Rastgele bekleme süresi (1.5s - 4.5s arası)
    const randomWaitTime = Math.random() * 3000 + 1500; 

    // "GO" durumuna geçiş zamanlayıcısı
    waitTimer = setTimeout(transitionToGO, randomWaitTime);
    
    // Ekranı sıfırla
    scoreScreen.classList.remove('visible');
    scorePanel.classList.remove('visible');
    gameScreen.classList.add('visible');
}


// 4. Olay Dinleyicileri (Event Listeners)

// A. Reaktör Tıklaması
reactorBtn.addEventListener('click', () => {
    if (gameState === 'GO') {
        // BAŞARILI TIKLAMA
        const endTime = performance.now();
        reactionTime = (endTime - reactionTime) / 1000; // Saniyeye çevir
        
        // Ses efekti ekleyebilirsiniz (win.mp3)
        // new Audio('win.mp3').play();
        
        showScore();

    } else if (gameState === 'WAIT') {
        // ERKEN TIKLAMA (HATA)
        handleFail();

    } else if (gameState === 'SCORE' || gameState === 'FAIL') {
        // Puan ekranında tıklama (Yeniden Oyna butonu kullanılmalı)
        // Eğer reaktöre yanlışlıkla tıklanırsa bir şey yapma
    }
});

// B. Başlangıç Ekranı Butonları (Mini Uygulama Girişi)
document.addEventListener("DOMContentLoaded", () => {
    
    // En iyi skoru göster
    bestScoreValue.textContent = bestScore.toFixed(3);

    // 💡 Farcaster / HTML Giriş Butonu
    if (startButton) {
        startButton.addEventListener("click", () => {
            // 1. Ekranları değiştir (Intro ekranını kapat, Oyun ekranını aç)
            startScreen.style.display = "none";
            gameScreen.classList.add("visible");
            
            // 2. Farcaster'a Hazır Olduğunu Bildir (Logo Sorununu Çözer)
            if (window.farcasterSDK && window.farcasterSDK.actions && window.farcasterSDK.actions.ready) {
                window.farcasterSDK.actions.ready()
                    .catch(e => console.error("Farcaster Ready Failed:", e));
            }
            
            // 3. OYUNU BAŞLAT
            startGame(); 
        });
    }

    // C. Puan Ekranı Butonları
    againBtn.addEventListener('click', startGame);
    
    shareBtn.addEventListener('click', () => {
        // Mini Uygulama Paylaşım Aksiyonu (SDK gerektirir)
        const scoreTime = reactionTime.toFixed(3);
        const shareText = `My Reflex time is ${scoreTime}s! Can you beat my score? #ReflexArcade @ReflexAppFarcaster`;
        
        if (window.farcasterSDK && window.farcasterSDK.actions && window.farcasterSDK.actions.composeCast) {
            window.farcasterSDK.actions.composeCast({ 
                text: shareText,
                embeds: ["https://reflex-rho.vercel.app"] // Uygulamanızın URL'sini kullanın
            })
            .catch(e => console.error("Compose Cast Failed:", e));
        } else {
            // Tarayıcı yedekleme
            alert('Your score: ' + scoreTime + 's. Share function requires Farcaster Mini App client.');
        }
    });
});
