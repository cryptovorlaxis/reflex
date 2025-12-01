// Dosya Konumu: pages/api/score-image.tsx (veya .js)

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fontları Google Fonts'tan yüklüyoruz
const orbitronBold = fetch(
  new URL('https://fonts.gstatic.com/s/orbitron/v25/yMJMMV7293Z09/wtrwa7W5btl98.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const rajdhaniBold = fetch(
  new URL('https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-WT7F0cxTs.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [orbitronData, rajdhaniData] = await Promise.all([orbitronBold, rajdhaniBold]);
  
  const { searchParams } = new URL(req.url);
  // Skoru URL'den al, yoksa varsayılan bir değer göster
  const score = searchParams.get('score') || '0.000';

  return new ImageResponse(
    (
      // --- ANA KONTEYNER (Arka Plan) ---
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // Cyberpunk arka plan gradyanı (Mor -> Siyah -> Koyu Mavi)
          background: 'radial-gradient(circle at 50% 120%, #1a0b2e 0%, #000000 50%, #0a151f 100%)',
          fontFamily: '"Rajdhani"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* --- CYBER GRID EFEKTİ (Arka plan deseni) --- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(transparent 0%, rgba(0, 243, 255, 0.1) 1px, transparent 2px), linear-gradient(90deg, transparent 0%, rgba(188, 19, 254, 0.1) 1px, transparent 2px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) scale(1.5)',
            opacity: 0.4,
          }}
        />

        {/* --- GLASSMORPHISM SKOR KARTI --- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(20, 20, 30, 0.7)', // Yarı saydam cam
            borderRadius: '30px',
            border: '3px solid rgba(0, 243, 255, 0.3)', // Neon çerçeve
            boxShadow: '0 0 80px rgba(0, 243, 255, 0.2), inset 0 0 30px rgba(0, 243, 255, 0.1)',
            padding: '40px 60px',
            backdropFilter: 'blur(10px)', // Not: Bazı platformlarda çalışmayabilir ama görseli bozmaz
          }}
        >
          {/* ÜST BAŞLIK */}
          <div
            style={{
              fontFamily: '"Orbitron"',
              color: '#00f3ff',
              fontSize: '32px',
              letterSpacing: '4px',
              marginBottom: '10px',
              textShadow: '0 0 20px rgba(0, 243, 255, 0.8)',
            }}
          >
            REFLEX TEST ⚡ CYBERPUNK
          </div>

          {/* ALT BAŞLIK */}
          <div
            style={{
              color: '#bc13fe', // Neon Pembe
              fontSize: '24px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '0px',
              textShadow: '0 0 10px rgba(188, 19, 254, 0.8)',
            }}
          >
            REACTION TIME CAPTURED
          </div>

          {/* --- ANA SKOR GÖSTERGESİ --- */}
          <div
            style={{
              fontSize: '140px',
              fontFamily: '"Rajdhani"',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              marginTop: '10px',
              // Çift katmanlı neon gölge efekti
              textShadow: '0 0 30px #00f3ff, 0 0 60px rgba(0, 243, 255, 0.6), 3px 3px 0px #bc13fe',
            }}
          >
            {score}s
          </div>

          {/* ALT BİLGİ / CTA */}
          <div
            style={{
              marginTop: '30px',
              color: '#ffffff',
              fontSize: '20px',
              backgroundColor: 'rgba(0, 243, 255, 0.1)',
              padding: '10px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 243, 255, 0.5)',
              fontFamily: '"Orbitron"',
              letterSpacing: '2px',
            }}
          >
            CAN YOU BEAT THE GRID?
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Orbitron',
          data: orbitronData,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Rajdhani',
          data: rajdhaniData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
