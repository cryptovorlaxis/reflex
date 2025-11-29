export const config = {
  runtime: "edge",
};

import { ImageResponse } from "@vercel/og";

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get("score") || "0.000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          color: "#0ff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 20 }}>
          ⚡ Reflex Test
        </div>
        <div>Your Reaction Time</div>
        <div style={{ fontSize: 84, marginTop: 10 }}>
          {score}s
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
