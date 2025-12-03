import { ImageResponse } from '@vercel/og';
import React from 'react';

// Vercel Edge Runtime ayarı
export const config = {
  runtime: 'edge',
};

// Rank'a göre rengi döndüren fonksiyon
function getRankColor(rank) {
  if (rank.includes('SINGULARITY')) return '#ffffff'; // rank-s-plus
  if (rank.includes('DEMON')) return '#ff003c'; // rank-s
  if (rank.includes('OPERATIVE')) return '#00f3ff'; // rank-a
  if (rank.includes('SAMURAI')) return '#ffaa00'; // rank-b
  return '#bc13fe'; // rank-c (SYSTEM GLITCH veya UNRANKED GLITCH)
}

export default function handler(req) {
  // Gelen isteğin URL'sinden parametreleri al
  const { searchParams } = new URL(req.url);
  
  // Parametreleri güvenli bir şekilde okuyoruz
  const score = searchParams.get('score') || '0.000';
  const rank = searchParams.get('rank') || 'UNRANKED GLITCH';

  const neonColor = getRankColor(rank);

  // KRİTİK KORUMA: Görsel oluşturma sürecini try/catch içine alarak, çökme durumunda
  // bile uygulamanın bir hata döndürmesini (beyaz ekran yerine) sağlıyoruz.
  try {
    // Görseli ImageResponse ile oluştur
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#050505',
            // Fontu daha güvenli bir genel font ile değiştirelim
            fontFamily: 'sans-serif', 
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '900px',
              height: '500px',
              border: `10px solid ${neonColor}`, // Dinamik Çerçeve Rengi
              borderRadius: '40px',
              backgroundColor: '#111',
              boxShadow: `0 0 70px ${neonColor}`, // Dinamik Neon Gölge
              padding: '40px',
            }}
          >
            {/* Rütbe Başlığı */}
            <div style={{ 
              fontSize: 40, 
              color: neonColor, 
              marginBottom: 10, 
              fontWeight: 'bold', 
              textTransform: 'uppercase' 
            }}>
              {rank}
            </div>
            
            {/* Skor Değeri */}
            <div style={{ 
              fontSize: 160, 
              fontWeight: '900', 
              color: 'white', 
              lineHeight: 1, 
              // textShadow stilini Vercel'de crash etme riskine karşı kaldırıyoruz
              textDecoration: 'none'
            }}>
              {score}s
            </div>
            <div style={{ 
              marginTop: 10, 
              fontSize: 30,
              color: '#aaa',
              fontWeight: '500', 
              letterSpacing: 2
            }}>
              REACTION TIME (s)
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Yüksek performanslı Edge Function önbelleği (caching) ayarı
        headers: {
            'Cache-Control': 'public, max-age=600, must-revalidate'
        }
      }
    );
  } catch (e) {
      // HATA KORUMASI: Edge Function çökerse, beyaz ekran yerine basit bir hata mesajı döndürür.
      // Bu, Farcaster'da en azından boş bir API çağrısı yerine hata mesajı gösterilmesini sağlar.
      console.error("Image generation failed:", e);
      return new Response(`API Error: ${e.message || 'Image generation failed.'}`, {
          status: 500,
          headers: {
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
      });
  }
}
