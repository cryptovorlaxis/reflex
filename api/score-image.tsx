import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '630px',
          width: '1200px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'black', // Arka plan kesin siyah olsun
          color: 'white',
        }}
      >
        {/* Neon Çerçeve */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '900px',
            height: '500px',
            border: '8px solid #00f3ff',
            borderRadius: '40px',
            backgroundColor: '#111',
            boxShadow: '0 0 80px #00f3ff',
          }}
        >
          <div style={{ fontSize: 50, color: '#00f3ff', marginBottom: 20 }}>
            REFLEX TEST
          </div>

          <div style={{ fontSize: 160, fontWeight: 'bold', lineHeight: 1, textShadow: '5px 5px 0 #bc13fe' }}>
            {score}s
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 30,
              backgroundColor: '#00f3ff',
              color: 'black',
              padding: '10px 50px',
              borderRadius: '50px',
            }}
          >
            CYBERPUNK ELITE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
