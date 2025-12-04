// game.js dosyasının TAM İÇERİĞİ. YALNIZCA JavaScript mantığını içerir.

// 1. Gerekli HTML elementlerine erişim
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

// 2. DOMContentLoaded: HTML içeriği tamamen yüklendikten sonra kodun çalışmasını sağlar. 
// Bu, butona erişim hatasını (null hatası) engeller.
document.addEventListener("DOMContentLoaded", () => {
    
    // Güvenlik kontrolü
    if (!startButton) {
        console.error("Hata: Başlangıç butonu ('startButton') bulunamadı. Lütfen index.html dosyasını kontrol edin.");
        return;
    }

    // "ENTER THE GRID" düğmesine tıklama olayı
    startButton.addEventListener("click", () => {
        
        // A) Ekranları değiştir (Kendi CSS mantığınız)
        startScreen.style.display = "none";
        gameScreen.classList.add("visible");
        
        // B) Farcaster'a Hazır Olduğunu Bildir (Mini Uygulama Sorununu Çözümleyen Kısım)
        // Bu, Farcaster Splash Screen'i gizler ve logonun hemen kaybolmasını engeller.
        if (window.farcasterSDK && window.farcasterSDK.actions && window.farcasterSDK.actions.ready) {
            window.farcasterSDK.actions.ready()
                .catch(e => console.error("Farcaster Ready Failed:", e));
        } else {
            console.log("Mini App'e Giriş Yapıldı. SDK bulunamadı (Tarayıcıda Çalışıyor).");
        }
    });

    // Not: Oyunun ana mantığı (reaktör/sayaç) buraya eklenmelidir.
    // Örnek: initGame() çağrısı veya reaktör olay dinleyicileri.

});
