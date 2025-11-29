export default async function handler(req, res) {
  const { score = "0.000" } = req.query;

  const parsed = parseFloat(score);
  let title = "Reflex Test";
  let subtitle = "";

  if (parsed < 0.200) subtitle = "⚡ Lightning Speed!";
  else if (parsed < 0.300) subtitle = "🚀 Ultra Reflex";
  else if (parsed < 0.500) subtitle = "🔥 Sharp Reflexes";
  else subtitle = "😎 Nice Try!";

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <!-- Neon Glow -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Gradient BG -->
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020b14"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>

      <!-- Neon Grid -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0ff4" stroke-width="2"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <rect width="1200" height="630" fill="url(#grid)" opacity="0.3" />

    <!-- Main Title -->
    <text x="50%" y="150" text-anchor="middle"
      font-family="Orbitron" font-size="90"
      fill="#00ffe1" filter="url(#glow)"
      letter-spacing="3">
      REFLEX TEST
    </text>

    <!-- Subtitle -->
    <text x="50%" y="240" text-anchor="middle"
      font-family="Orbitron" font-size="40"
      fill="#00bfae" opacity="0.85">
      ${subtitle}
    </text>

    <!-- SCORE BOX -->
    <rect x="300" y="280" width="600" height="200" rx="20"
      fill="none" stroke="#00ffe1" stroke-width="6"
      filter="url(#glow)" />

    <!-- SCORE TEXT -->
    <text x="50%" y="400" text-anchor="middle"
      font-family="Orbitron" font-size="110"
      fill="#00fff2" filter="url(#glow)">
      ${score}s
    </text>

    <!-- Footer -->
    <text x="50%" y="560" text-anchor="middle"
      font-family="Orbitron" font-size="32"
      fill="#0ff8" letter-spacing="2">
      reflex-rho.vercel.app
    </text>
  </svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
