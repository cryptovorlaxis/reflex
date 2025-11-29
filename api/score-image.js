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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, #041014 0%, #000000 100%)",
          position: "relative",
          fontFamily: "Orbitron, sans-serif",
          color: "#0ff",
        }}
      >

        {/* Cyber grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#00fff533 1px, transparent 1px), linear-gradient(90deg, #00fff533 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.25,
          }}
        ></div>

        {/* Glow ring */}
        <div
          style={{
            position: "absolute",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            boxShadow: "0 0 90px #00fff5aa, 0 0 140px #00fff544 inset",
            opacity: 0.6,
          }}
        ></div>

        {/* Title */}
        <h1
          style={{
            fontSize: "58px",
            margin: "0 0 20px 0",
            textShadow: "0 0 20px #00fff5, 0 0 40px #00fff5",
          }}
        >
          Reflex Test ⚡
        </h1>

        {/* Score */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: "bold",
            color: "#00ffe1",
            textShadow:
              "0 0 25px #00fff5, 0 0 45px #00fff5, 0 0 70px #00fff5",
          }}
        >
          {score}s
        </div>

        {/* Bottom text */}
        <div
          style={{
            marginTop: "30px",
            fontSize: "28px",
            color: "#7ffdf8",
            textShadow: "0 0 15px #00fff5aa",
          }}
        >
          Can you beat this?
        </div>

        {/* Logo */}
        <img
          src="https://reflex-rho.vercel.app/logo.png"
          width="110"
          height="110"
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            borderRadius: "12px",
            boxShadow: "0 0 20px #00fff5aa",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
