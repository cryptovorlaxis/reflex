import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: 'white',
          background: 'red', /* DİKKAT: ARKA PLAN KIRMIZI */
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        SİSTEM ÇALIŞIYOR
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
