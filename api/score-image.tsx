import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // 1. Fontları Yüklüyoruz
  const orbitronData = await fetch(
    'https://fonts.gstatic.com/s/orbitron/v25/yMJMMV7293Z09/wtrwa7W5btl98.ttf'
  ).then((res) => res.arrayBuffer());

  const rajdhaniData = await fetch(
    'https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-WT7F0cxTs.ttf'
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
          fontFamily: '"Rajdhani"',
          position: 'relative',
        }}
      >
        {/* Arka Plan Gradyanı */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to bottom, #1a0b2e, #000)',
            opacity: 0.9,
          }}
        />
        
        {/* Izgara Deseni */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.4,
          }}
        />

        {/* Neon Kart */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff',
            borderRadius: '30px',
            backgroundColor: 'rgba(10, 21, 31, 0.9)',
            padding: '40px 80px',
            boxShadow: '0 0 70px rgba(0, 243, 255, 0.25)',
            zIndex: 10,
          }}
        >
          {/* Başlık */}
          <div
            style={{
              fontFamily: '"Orbitron"',
              color: '#00f3ff',
              fontSize: 40,
              fontWeight: 700,
              marginBottom: 10,
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(0, 243, 255, 0.5)',
            }}
          >
            REFLEX TEST
          </div>

          {/* Alt Başlık */}
          <div
            style={{
              color: '#bc13fe',
              fontSize: 28,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            REACTION TIME
          </div>

          {/* Skor */}
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              textShadow: '4px 4px 0 #bc13fe',
            }}
          >
            {score}s
          </div>

          {/* Etiket */}
          <div
            style={{
              marginTop: 30,
              backgroundColor: '#00f3ff',
              color: 'black',
              fontSize: 24,
              padding: '10px 40px',
              borderRadius: 50,
              fontFamily: '"Orbitron"',
              fontWeight: 700,
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
      fonts: [
        { name: 'Orbitron', data: orbitronData, style: 'normal' },
        { name: 'Rajdhani', data: rajdhaniData, style: 'normal' },
      ],
    }
  );
}
