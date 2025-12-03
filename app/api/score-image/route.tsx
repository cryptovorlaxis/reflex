import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

function getRankColor(rank) {
  if (rank.includes('SINGULARITY')) return '#ffffff';
  if (rank.includes('DEMON')) return '#ff003c';
  if (rank.includes('OPERATIVE')) return '#00f3ff';
  if (rank.includes('SAMURAI')) return '#ffaa00';
  return '#bc13fe';
}

export default async function GET(req) {
  const { searchParams } = new URL(req.url);

  const score = searchParams.get('score') || '0.000';
  const rank  = searchParams.get('rank')  || 'UNRANKED GLITCH';

  const neonColor = getRankColor(rank);

  try {
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
            fontFamily: 'sans-serif'
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
              border: `10px solid ${neonColor}`,
              borderRadius: '40px',
              backgroundColor: '#111',
              boxShadow: `0 0 70px ${neonColor}`,
              padding: '40px'
            }}
          >
            <div
              style={{
                fontSize: 40,
                color: neonColor,
                marginBottom: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {rank}
            </div>

            <div
              style={{
                fontSize: 160,
                fontWeight: '900',
                color: 'white',
                lineHeight: 1
              }}
            >
              {score}s
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 30,
                color: '#aaa',
                fontWeight: '500',
                letterSpacing: 2
              }}
            >
              REACTION TIME (s)
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=600, must-revalidate'
        }
      }
    );
  } catch (e) {
    console.error('OG render error:', e);
    return new Response('OG IMAGE ERROR', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
