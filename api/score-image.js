import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  const { score = "0.000" } = req.query;

  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  // Glow circle
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 200, 0, Math.PI * 2);
  ctx.fillStyle = "#0ff6d133";
  ctx.fill();

  // Title
  ctx.fillStyle = "#0ff6d1";
  ctx.font = "bold 70px Sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Reflex Arcade Score", width / 2, 180);

  // Score
  ctx.font = "bold 150px Sans-serif";
  ctx.fillStyle = "#00ffe1";
  ctx.fillText(`${score}s`, width / 2, 360);

  // Footer
  ctx.font = "40px Sans-serif";
  ctx.fillStyle = "#69f";
  ctx.fillText("reflex-s8dl.vercel.app", width / 2, 500);

  const buffer = canvas.toBuffer("image/png");

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
