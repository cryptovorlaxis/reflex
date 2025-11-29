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
          background: "black",
          color: "#0ff",
          fontSize: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          border: "4px solid #0ff"
        }}
      >
        Reflex Score: {score}s
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
