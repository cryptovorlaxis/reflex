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
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'black', // Düz Siyah (Risk yok)
          fontFamily: 'monospace',
        }}
      >
        {/* Ana Kutu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '900px',
            height: '500px',
            backgroundColor: '#111111', // Koyu Gri Zemin
            border: '8px solid #00f3ff', // Mavi Çerçeve
            borderRadius: '40px',
            // Basit Kutu Gölgesi (Karmaşık değil)
            boxShadow: '0 0 50px #00f3ff', 
          }}
        >
          {/* Başlık */}
          <div style={{ 
            color: '#00f3ff', 
            fontSize: 60, 
            fontWeight: 'bold', 
            marginBottom: 20 
          }}>
            REFLEX TEST
          </div>

          {/* Skor */}
          <div style={{ 
            fontSize: 160, 
            fontWeight: 'bold', 
            color: 'white', 
            lineHeight: 1 
          }}>
            {score}s
          </div>

          {/* Etiket */}
          <div style={{ 
            marginTop: 40, 
            backgroundColor: '#00f3ff', 
            color: 'black', 
            fontSize: 30, 
            padding: '15px 60px', 
            borderRadius: 50, 
            fontWeight: 'bold' 
          }}>
            CYBER ELITE
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
