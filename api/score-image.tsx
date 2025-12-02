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
          backgroundColor: 'black', // Düz Siyah
          fontFamily: 'sans-serif', // Standart Font
        }}
      >
        {/* Dış Çerçeve */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '900px',
            height: '500px',
            border: '10px solid #00FFFF', // Düz Mavi Çizgi
            borderRadius: '0px', // Köşe yuvarlama bile yok (Garanti olsun)
            backgroundColor: '#111111',
          }}
        >
          {/* Başlık */}
          <div
            style={{
              fontSize: 60,
              color: '#00FFFF', // Camgöbeği
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            REFLEX TEST
          </div>

          {/* Skor */}
          <div
            style={{
              fontSize: 150,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1,
            }}
          >
            {score}s
          </div>

          {/* Alt Etiket */}
          <div
            style={{
              marginTop: 40,
              fontSize: 30,
              backgroundColor: '#00FFFF',
              color: 'black',
              padding: '10px 50px',
              fontWeight: 'bold',
            }}
          >
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
