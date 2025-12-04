// game.js dosyasının TAM İÇERİĞİ.
// Bu dosya, sadece JavaScript (mantık) kodunu içermelidir.

// 1. Gerekli HTML elementlerine erişim
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

// 2. DOMContentLoaded: HTML içeriği tamamen yüklendikten sonra kodun çalışmasını sağlar. 
// Bu, "startButton" bulunamama hatasını (null hatası) engeller.
document.addEventListener("DOMContentLoaded", () => {
    
    // Güvenlik kontrolü
    if (!startButton) {
        console.error("Hata: 'ENTER THE GRID' butonu ('startButton') bulunamadı. Lütfen HTML'deki ID'yi kontrol edin.");
        return;
    }

    // "ENTER THE GRID" düğmesine tıklama olayı
    startButton.addEventListener("click", () => {
        
        // A) Ekranları değiştir (Intro ekranını kapat, Oyun ekranını aç)
        // Bu, logonuzun görünür kalmasını sağladıktan sonra, tıklamayla kaybolup oyunun başlamasını sağlar.
        startScreen.style.display = "none";
        gameScreen.classList.add("visible");
        
        // B) Farcaster'a Hazır Olduğunu Bildir (Mini Uygulama Splash Screen'i Gizler)
        // Bu çağrı, butona basıldığı anı, uygulamanın hazır olduğu an olarak kabul eder.
        if (window.farcasterSDK && window.farcasterSDK.actions && window.farcasterSDK.actions.ready) {
            window.farcasterSDK.actions.ready()
                .catch(e => console.error("Farcaster Ready Failed:", e));
        } else {
            console.log("SDK bulunamadı. Muhtemelen tarayıcıda çalışıyor.");
        }
    });

    // Not: Oyununuzun ana mantığı (reaktör tıklamaları, skor güncellemesi vb.) buraya eklenmelidir.
    // Şimdilik sadece başlangıç tuşunu çalıştırdık.
});
