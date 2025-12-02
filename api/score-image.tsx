import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  // 1. URL'den skoru al
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // 2. HİÇBİR FONT YÜKLEMİYORUZ (Sistem varsayılanı kullanacak)
  // Bu sayede "yüklenemedi" hatası alma şansı %0.

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
          backgroundColor: '#050505', // Arka plan SİYAH
          color: 'white',
          fontFamily: 'sans-serif', // Varsayılan font
        }}
      >
        {/* Basit Neon Çerçeve */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff',
            borderRadius: '20px',
            padding: '40px 80px',
            backgroundColor: '#111',
            boxShadow: '0 0 50px #00f3ff',
          }}
        >
          <div style={{ fontSize: 40, color: '#00f3ff', fontWeight: 'bold', marginBottom: 10 }}>
            REFLEX TEST
          </div>
          
          <div style={{ fontSize: 120, fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
            {score}s
          </div>

          <div style={{ 
            marginTop: 20, 
            backgroundColor: '#00f3ff', 
            color: 'black', 
            padding: '10px 40px', 
            borderRadius: 50, 
            fontSize: 20,
            fontWeight: 'bold' 
          }}>
            CYBERPUNK
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: []  <-- BURAYI BOŞ BIRAKTIK Kİ HATA VERMESİN
    }
  );
}
