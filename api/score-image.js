export default function handler(req, res) {
  const { score } = req.query;

  const svg = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#000"/>
    <text x="50%" y="40%" font-size="72" fill="#0ff" text-anchor="middle" font-family="Arial">
      Reflex Test Score
    </text>
    <text x="50%" y="55%" font-size="140" fill="#0ff" text-anchor="middle" font-family="Arial" font-weight="bold">
      ${score}s
    </text>
    <text x="50%" y="80%" font-size="48" fill="#0ff" text-anchor="middle" font-family="Arial">
      Can you beat me?
    </text>
  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
