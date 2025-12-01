import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';

  // Fontları yükle
  const orbitronFontData = await fetch(
    'https://fonts.gstatic.com/s/orbitron/v25/yMJMMV7293Z09/wtrwa7W5btl98.ttf'
  ).then((res) => res.arrayBuffer());

  const rajdhaniFontData = await fetch(
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
          // Arka plan: Koyu Cyberpunk gradyan
          background: 'linear-gradient(to bottom, #050505, #1a0b2e)',
          fontFamily: '"Rajdhani"',
          position: 'relative',
        }}
      >
        {/* Izgara Efekti (3D yerine 2D Flat Desen) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.2,
          }}
        />

        {/* Ana Kart */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a151f',
            borderRadius: '20px',
            border: '4px solid #00f3ff',
            boxShadow: '0 0 50px rgba(0, 243, 255, 0.4)',
            padding: '40px 80px',
            zIndex: 10,
          }}
        >
          {/* Başlık */}
          <div
            style={{
              fontFamily: '"Orbitron"',
              color: '#00f3ff',
              fontSize: '40px',
              fontWeight: 700,
              marginBottom: '10px',
              textShadow: '0 0 10px #00f3ff',
            }}
          >
            REFLEX TEST
          </div>

          {/* Alt Başlık */}
          <div
            style={{
              color: '#bc13fe',
              fontSize: '28px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            REACTION TIME
          </div>

          {/* Skor */}
          <div
            style={{
              fontSize: '150px',
              fontFamily: '"Rajdhani"',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
              marginTop: '10px',
              textShadow: '4px 4px 0px #bc13fe',
            }}
          >
            {score}s
          </div>

          {/* Etiket */}
          <div
            style={{
              marginTop: '20px',
              backgroundColor: '#00f3ff',
              color: '#000',
              fontSize: '24px',
              padding: '10px 40px',
              borderRadius: '50px',
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
        {
          name: 'Orbitron',
          data: orbitronFontData,
          style: 'normal',
        },
        {
          name: 'Rajdhani',
          data: rajdhaniFontData,
          style: 'normal',
        },
      ],
    }
  );
}
