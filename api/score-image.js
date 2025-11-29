export default function handler(req, res) {
  const score = req.query.score || "0.000";

  const svg = `
  <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="black"/>
    <text x="50%" y="38%" fill="#00fff0" font-size="40" font-family="Arial" text-anchor="middle">
      Reflex Test Score
    </text>
    <text x="50%" y="62%" fill="#0ff" font-size="90" font-family="Arial" text-anchor="middle">
      ${score}s
    </text>
    <text x="50%" y="85%" fill="#00ccc0" font-size="22" font-family="Arial" text-anchor="middle">
      reflex-s8dl.vercel.app
    </text>
  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
