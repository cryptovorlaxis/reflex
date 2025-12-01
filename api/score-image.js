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
          backgroundImage: 'linear-gradient(to bottom, #050505, #1a0b2e)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a151f',
            border: '4px solid #00f3ff',
            borderRadius: 20,
            padding: '40px 80px',
            boxShadow: '0 0 60px rgba(0, 243, 255, 0.4)',
          }}
        >
          <div
            style={{
              color: '#00f3ff',
              fontSize: 50,
              fontWeight: 'bold',
              marginBottom: 10,
              textShadow: '0 0 20px #00f3ff',
            }}
          >
            REFLEX TEST
          </div>
          
          <div
            style={{
              color: '#bc13fe',
              fontSize: 30,
              letterSpacing: 4,
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            Reaction Time
          </div>

          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              textShadow: '4px 4px 0px #bc13fe',
            }}
          >
            {score}s
          </div>

          <div
             style={{
               marginTop: 30,
               backgroundColor: '#00f3ff',
               color: 'black',
               fontSize: 24,
               padding: '10px 40px',
               borderRadius: 50,
               fontWeight: 'bold',
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
