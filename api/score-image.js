import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // JSX (<div...>) yerine Saf React.createElement kullanıyoruz.
  // Bu yöntem derleme gerektirmez, her ortamda çalışır.
  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#050505',
          fontFamily: 'sans-serif',
        },
      },
      [
        // Dış Kutu
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #00f3ff',
              borderRadius: '20px',
              padding: '40px 80px',
              backgroundColor: '#111',
              boxShadow: '0 0 60px #00f3ff',
            },
          },
          [
            // Başlık
            React.createElement(
              'div',
              {
                style: {
                  fontSize: 60,
                  color: '#00f3ff',
                  marginBottom: 20,
                  fontWeight: 'bold',
                },
              },
              'REFLEX TEST'
            ),
            // Skor
            React.createElement(
              'div',
              {
                style: {
                  fontSize: 160,
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: 1,
                  textShadow: '4px 4px 0px #bc13fe',
                },
              },
              score + 's'
            ),
            // Etiket
            React.createElement(
              'div',
              {
                style: {
                  marginTop: 40,
                  backgroundColor: '#00f3ff',
                  color: 'black',
                  fontSize: 30,
                  padding: '10px 50px',
                  borderRadius: 50,
                  fontWeight: 'bold',
                },
              },
              'CYBER ELITE'
            ),
          ]
        ),
      ]
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
