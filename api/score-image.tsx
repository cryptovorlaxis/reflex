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
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
          fontFamily: 'Courier New, monospace', // Dijital/Hacker Fontu (İndirme gerektirmez)
          position: 'relative',
        }}
      >
        {/* 1. Arka Plan Gradyanı */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to bottom, #020202, #1a0b2e)',
          }}
        />
        
        {/* 2. Izgara Deseni */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.6,
          }}
        />

        {/* 3. Neon Skor Kartı */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '6px solid #00f3ff', // Kalın Neon Çerçeve
            borderRadius: '20px',
            backgroundColor: 'rgba(5, 10, 20, 0.9)',
            padding: '50px 100px',
            boxShadow: '0 0 80px rgba(0, 243, 255, 0.4)', // Mavi Parlama
            zIndex: 10,
          }}
        >
          {/* Başlık */}
          <div
            style={{
              color: '#00f3ff',
              fontSize: 50,
              fontWeight: 'bold',
              marginBottom: 10,
              textShadow: '0 0 20px #00f3ff',
              letterSpacing: '-2px',
            }}
          >
            ⚡ REFLEX TEST ⚡
          </div>

          {/* Alt Başlık */}
          <div
            style={{
              color: '#bc13fe',
              fontSize: 30,
              letterSpacing: '8px',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            REACTION TIME
          </div>

          {/* Skor */}
          <div
            style={{
              fontSize: 160,
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1,
              textShadow: '6px 6px 0px #bc13fe', // Retro Gölge
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
              fontSize: 28,
              padding: '15px 60px',
              borderRadius: '10px',
              fontWeight: 'bold',
              letterSpacing: '2px',
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
      // NOT: fonts: [] kısmını bilerek sildik.
    }
  );
}
