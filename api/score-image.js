import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get("score") || "0.000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "600px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle at center, #001010, #000)",
          fontSize: 32,
          fontFamily: "Arial",
          color: "#00FFE1",
          border: "4px solid #00FFD5",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 20 }}>
          ⚡ Reflex Test Score
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#00FFE1",
            textShadow: "0 0 12px #00FFD5",
          }}
        >
          {score}s
        </div>

        <div style={{ marginTop: 30, fontSize: 24, opacity: 0.8 }}>
          Can you beat this?
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
