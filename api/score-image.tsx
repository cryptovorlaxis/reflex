import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // 1. STANDART FONT YÜKLÜYORUZ (Roboto)
  // Bu olmadan yazı yazılamaz!
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf'
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
          backgroundColor: '#050505',
          fontFamily: '"Roboto"', // İndirdiğimiz fontu kullanıyoruz
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff',
            borderRadius: 20,
            padding: '40px 80px',
            backgroundColor: '#111',
          }}
        >
          <div style={{ color: '#00f3ff', fontSize: 50, marginBottom: 10 }}>
            REFLEX TEST
          </div>
          
          <div style={{ fontSize: 140, color: 'white', lineHeight: 1 }}>
            {score}s
          </div>

          <div style={{ 
            marginTop: 20, 
            color: 'white', 
            fontSize: 30,
            backgroundColor: '#00f3ff',
            padding: '10px 40px',
            borderRadius: 50,
            color: 'black'
          }}>
            CYBERPUNK
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
