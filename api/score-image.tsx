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
          backgroundColor: '#050505', // Arka plan: Simsiyah
          fontFamily: 'monospace',    // Font: Sistem Monospace (Hacker tarzı)
        }}
      >
        {/* Neon Kutu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            border: '4px solid #00f3ff', // Mavi Çerçeve
            borderRadius: '20px',
            padding: '40px 80px',
            boxShadow: '0 0 60px #00f3ff', // Mavi Parlama (Basit gölge)
          }}
        >
          {/* Başlık */}
          <div
            style={{
              color: '#00f3ff',
              fontSize: 50,
              fontWeight: 'bold',
              marginBottom: 20,
              letterSpacing: '-2px',
            }}
          >
            REFLEX TEST
          </div>

          {/* Skor */}
          <div
            style={{
              fontSize: 160,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1,
              textShadow: '4px 4px 0px #bc13fe', // Mor gölge (Basit)
            }}
          >
            {score}s
          </div>

          {/* Etiket */}
          <div
            style={{
              marginTop: 40,
              backgroundColor: '#00f3ff',
              color: 'black',
              fontSize: 30,
              padding: '10px 50px',
              borderRadius: '50px',
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
