import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

function getRankColor(rank) {
  if (rank.includes('SINGULARITY')) return '#ffffff';
  if (rank.includes('DEMON')) return '#ff003c';
  if (rank.includes('OPERATIVE')) return '#00f3ff';
  if (rank.includes('SAMURAI')) return '#ffaa00';
  return '#bc13fe';
}

export default function (req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || '0.000';
  const rank = searchParams.get('rank') || 'UNRANKED GLITCH';

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
                      fontSize: 40,
                      color: neon,
                      marginBottom: 10,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    },
                    children: rank,
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
