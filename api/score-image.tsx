import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // NOT: Font yüklemeyi (fetch) kaldırdık. Sistem fontu kullanacağız.
  
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
          backgroundColor: '#050505',
          fontFamily: 'sans-serif', // Standart font
          position: 'relative',
        }}
      >
        {/* Arka Plan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(#1a0b2e, #000)',
            opacity: 0.9,
          }}
        />
        
        {/* Izgara Deseni */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.5,
          }}
        />

        {/* Skor Kartı */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff',
            borderRadius: '30px',
            backgroundColor: 'rgba(10, 21, 31, 0.9)',
            padding: '40px 80px',
            boxShadow: '0 0 60px rgba(0, 243, 255, 0.3)',
            zIndex: 10,
          }}
        >
          <div style={{ color: '#00f3ff', fontSize: 40, marginBottom: 10, fontWeight: 700 }}>
            REFLEX TEST
          </div>
          <div style={{ color: '#bc13fe', fontSize: 30, letterSpacing: 4, textTransform: 'uppercase' }}>
            REACTION TIME
          </div>
          <div style={{ fontSize: 140, fontWeight: 900, color: 'white', lineHeight: 1, marginTop: 15, textShadow: '4px 4px 0 #bc13fe' }}>
            {score}s
          </div>
          <div style={{ marginTop: 30, backgroundColor: '#00f3ff', color: 'black', fontSize: 24, padding: '10px 40px', borderRadius: 50, fontWeight: 700 }}>
            CYBERPUNK ELITE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Font ayarlarını kaldırdık
    }
  );
}
