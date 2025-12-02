import { ImageResponse } from '@vercel/og';

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
          backgroundColor: 'black', // Kırmızı yerine Siyah
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff', // Mavi Çerçeve
            borderRadius: 20,
            padding: '40px 80px',
            backgroundColor: '#111',
          }}
        >
          <div style={{ color: '#00f3ff', fontSize: 50, fontWeight: 'bold', marginBottom: 20 }}>
            REFLEX TEST
          </div>

          <div style={{ fontSize: 140, fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
            {score}s
          </div>

          <div style={{ 
            marginTop: 40, 
            backgroundColor: '#00f3ff', 
            color: 'black', 
            fontSize: 30, 
            padding: '10px 50px',
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
