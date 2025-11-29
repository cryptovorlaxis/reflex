export default function handler(req, res) {
  const score = req.query.score || "0.000";

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630"
       xmlns="http://www.w3.org/2000/svg" style="background:#000">

    <!-- GLOW GRID -->
    <defs>
      <linearGradient id="gridLine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#00ffe155"/>
        <stop offset="100%" stop-color="#00ffe100"/>
      </linearGradient>
    </defs>

    <!-- Grid Lines -->
    ${Array.from({length: 15})
      .map((_, i) => `<rect x="${i * 80}" y="0" width="2" height="630" fill="url(#gridLine)" />`)
      .join("")}

    <!-- TITLE -->
    <text x="50%" y="140" text-anchor="middle"
      font-family="Orbitron" font-size="72"
      fill="#00ffe1" letter-spacing="5">
      REFLEX SCORE
    </text>

    <!-- BIG SCORE -->
    <text x="50%" y="330" text-anchor="middle"
      font-family="Orbitron" font-size="140"
      fill="#00ffe1" letter-spacing="8">
      ${score}s
    </text>

    <!-- Subtitle -->
    <text x="50%" y="400" text-anchor="middle"
      font-family="Orbitron" font-size="36"
      fill="#00ffe199" letter-spacing="4">
      Can you beat this?
    </text>

    <!-- CYBERPUNK FOOTER LINE -->
    <rect x="150" y="540" width="900" height="3" fill="#00ffe1" opacity="0.45" />

    <!-- CYBERPUNK FOOTER TEXT -->
    <text x="50%" y="595" text-anchor="middle"
      font-family="Orbitron" font-size="40"
      fill="#00ffe1" opacity="0.65" letter-spacing="10">
      REFLEX ARCADE
    </text>

  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
