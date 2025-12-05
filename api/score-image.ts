import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

function getRankColor(rank: string) {
  if (rank === 'DIAMOND') return '#3cf4ff';    // neon mavi / elmas
  if (rank === 'PLATINUM') return '#E5E4E2';   // platin gümüşü
  if (rank === 'GOLD') return '#FFD700';       // altın
  if (rank === 'SILVER') return '#C0C0C0';     // gümüş
  if (rank === 'BRONZE') return '#CD7F32';     // bronz
  return '#6A6A6A';                            // fallback (IRON gibi)
}

export default function (req: Request) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';
  const rank = searchParams.get('rank') || 'BRONZE';

  const neon = getRankColor(rank);

  return new ImageResponse(
    {
      type: 'div',
      props: {
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
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '900px',
                height: '500px',
                border: `10px solid ${neon}`,
                borderRadius: '40px',
                backgroundColor: '#111',
                boxShadow: `0 0 70px ${neon}`,
                padding: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 46,
                      color: neon,
                      marginBottom: 14,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 4,
                    },
                    children: `${rank} TIER`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 160,
                      fontWeight: 900,
                      color: 'white',
                      lineHeight: 1,
                    },
                    children: `${score}s`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: 10,
                      fontSize: 30,
                      color: '#aaa',
                      fontWeight: 500,
                      letterSpacing: 2,
                    },
                    children: 'REACTION TIME (s)',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
