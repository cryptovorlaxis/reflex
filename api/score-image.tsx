import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // 1. Fontları güvenli şekilde (fonksiyon içinde) yüklüyoruz
  const orbitronData = await fetch(
    'https://fonts.gstatic.com/s/orbitron/v25/yMJMMV7293Z09/wtrwa7W5btl98.ttf'
  ).then((res) => res.arrayBuffer());

  const rajdhaniData = await fetch(
    'https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-WT7F0cxTs.ttf'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505', // Koyu arka plan
          fontFamily: '"Rajdhani"',
          position: 'relative',
        }}
      >
        {/* 2. Arka Plan Efektleri (Düz 2D) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to bottom, #1a0b2e, #000)',
            opacity: 0.8,
          }}
        />
        {/* Izgara Çizgileri */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.4,
          }}
        />

        {/* 3. Neon Skor Kartı */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff', // Camgöbeği neon çerçeve
            borderRadius: '30px',
            backgroundColor: 'rgba(10, 21, 31, 0.9)',
            padding: '50px 90px',
            boxShadow: '0 0 80px rgba(0, 243, 255, 0.3)', // Neon parlaması
            zIndex: 10,
          }}
        >
          {/* Başlık */}
          <div style={{ fontFamily: '"Orbitron"', color: '#00f3ff', fontSize: 46, marginBottom: 10, fontWeight: 700, letterSpacing: '2px' }}>
            REFLEX TEST
          </div>
          {/* Alt Başlık */}
          <div style={{ color: '#bc13fe', fontSize: 32, letterSpacing: 6, textTransform: 'uppercase' }}>
            REACTION TIME
          </div>
          {/* Skor */}
          <div style={{ fontSize: 160, fontWeight: 900, color: 'white', lineHeight: 1, marginTop: 20, textShadow: '5px 5px 0 #bc13fe' }}>
            {score}s
          </div>
          {/* Etiket */}
          <div style={{ marginTop: 40, backgroundColor: '#00f3ff', color: 'black', fontSize: 28, padding: '12px 50px', borderRadius: 50, fontWeight: 700, fontFamily: '"Orbitron"' }}>
            CYBERPUNK ELITE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Fontları sisteme tanıtıyoruz
      fonts: [
        { name: 'Orbitron', data: orbitronData, style: 'normal' },
        { name: 'Rajdhani', data: rajdhaniData, style: 'normal' },
      ],
    }
  );
}
