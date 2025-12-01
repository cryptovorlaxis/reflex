import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Fontları Google Fonts'tan çekiyoruz
const orbitronFont = fetch(
  new URL('https://fonts.gstatic.com/s/orbitron/v25/yMJMMV7293Z09/wtrwa7W5btl98.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const rajdhaniFont = fetch(
  new URL('https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-WT7F0cxTs.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req) {
  const [orbitronData, rajdhaniData] = await Promise.all([orbitronFont, rajdhaniFont]);
  
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

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
          background: 'radial-gradient(circle at 50% 120%, #1a0b2e 0%, #000000 50%, #0a151f 100%)',
          fontFamily: '"Rajdhani"',
          position: 'relative',
        }}
      >
        {/* Cyber Grid Arka Plan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(transparent 0%, rgba(0, 243, 255, 0.15) 1px, transparent 2px), linear-gradient(90deg, transparent 0%, rgba(188, 19, 254, 0.15) 1px, transparent 2px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(60deg) scale(1.5)',
            opacity: 0.5,
          }}
        />

        {/* Camsı Kart */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(20, 20, 30, 0.8)',
            borderRadius: '24px',
            border: '2px solid rgba(0, 243, 255, 0.4)',
            boxShadow: '0 0 60px rgba(0, 243, 255, 0.15)',
            padding: '40px 60px',
          }}
        >
          <div
            style={{
              fontFamily: '"Orbitron"',
              color: '#00f3ff',
              fontSize: '32px',
              letterSpacing: '2px',
              marginBottom: '10px',
              textShadow: '0 0 15px rgba(0, 243, 255, 0.6)',
            }}
          >
            REFLEX TEST ⚡
          </div>

          <div
            style={{
              color: '#bc13fe',
              fontSize: '24px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            REACTION TIME
          </div>

          <div
            style={{
              fontSize: '130px',
              fontFamily: '"Rajdhani"',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
              marginTop: '10px',
              textShadow: '0 0 30px #00f3ff',
            }}
          >
            {score}s
          </div>

          <div
            style={{
              marginTop: '30px',
              color: '#000',
              backgroundColor: '#00f3ff',
              fontSize: '20px',
              padding: '10px 30px',
              borderRadius: '50px',
              fontFamily: '"Orbitron"',
              fontWeight: 700,
            }}
          >
            BEAT MY SCORE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Orbitron', data: orbitronData, style: 'normal' },
        { name: 'Rajdhani', data: rajdhaniData, style: 'normal' },
      ],
    }
  );
}
