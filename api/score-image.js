export default async function handler(req, res) {
  const { score = "0.000" } = req.query;

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00FFD5"/>
        <stop offset="100%" stop-color="#0088FF"/>
      </linearGradient>
    </defs>

    <rect width="1200" height="630" fill="black"/>

    <text x="600" y="160" font-size="72"
      font-family="Orbitron, sans-serif"
      fill="url(#g)"
      text-anchor="middle">
      Reflex Test
    </text>

    <text x="600" y="330" font-size="180"
      font-family="Orbitron, sans-serif"
      fill="#00FFE1"
      text-anchor="middle">
      ${score}s
    </text>

    <text x="600" y="450" font-size="48"
      font-family="Orbitron, sans-serif"
      fill="#00FFD5"
      text-anchor="middle">
      Can you beat this?
    </text>
  </svg>
  `;

  // ---- CRITICAL FIX ----
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  // -----------------------

  return res.status(200).send(svg);
}
