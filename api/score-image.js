export default function handler(req, res) {
  const score = req.query.score || "0.000";

  const svg = `
  <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="black"/>
    <text x="50%" y="40%" fill="#00fff0" font-size="42" font-family="Arial" text-anchor="middle">
      Reflex Test Score
    </text>
    <text x="50%" y="60%" fill="#0ff" font-size="80" font-family="Arial" text-anchor="middle">
      ${score}s
    </text>
  </svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
