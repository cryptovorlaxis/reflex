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
          backgroundColor: '#050505', // Düz siyah arka plan
          color: 'white',
          fontFamily: 'sans-serif', // Sistem fontu kullanıyoruz (Garanti çalışır)
        }}
      >
        {/* Basit Cyberpunk Arka Plan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to bottom, #1a0b2e, #000)',
            opacity: 0.8,
          }}
        />
        
        {/* Izgara Çizgileri */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.3,
          }}
        />

        {/* Skor Kutusu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #00f3ff',
            borderRadius: '20px',
            padding: '40px 60px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            boxShadow: '0 0 50px rgba(0, 243, 255, 0.5)',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 30, color: '#00f3ff', fontWeight: 'bold', marginBottom: 10 }}>
            REFLEX TEST
          </div>
          
          <div style={{ fontSize: 24, color: '#bc13fe', letterSpacing: '2px' }}>
            REACTION TIME
          </div>

          <div style={{ fontSize: 120, fontWeight: '900', color: 'white', lineHeight: 1, marginTop: 10 }}>
            {score}s
          </div>

          <div style={{ 
            marginTop: 20, 
            backgroundColor: '#00f3ff', 
            color: 'black', 
            padding: '10px 30px', 
            borderRadius: 50, 
            fontSize: 20,
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
      // Font ayarlarını sildik, sistem fontu kullanacak.
    }
  );
}
