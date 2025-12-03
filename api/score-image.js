import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export default function GET(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get('score') || "0.000";

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 80,
          background: 'black',
          color: 'white'
        }}
      >
        {score}s
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
