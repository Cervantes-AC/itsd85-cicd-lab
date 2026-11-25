import express from 'express';
import path from 'node:path';

const publicDir = path.join(import.meta.dirname, '..', 'public');
const version = process.env.APP_VERSION || 'dev';

export function add(a, b) {
  return a + b;
}

// Returns NaN for anything that is not a real number.
// Number('') is 0, so blank values must be rejected first.
function toNumber(value) {
  if (typeof value !== 'string' || value.trim() === '') return NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

const app = express();

// Serves public/index.html at "/" and public/style.css at "/style.css".
app.use(express.static(publicDir));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version });
});

app.get('/api/add', (req, res) => {
  const a = toNumber(req.query.a);
  const b = toNumber(req.query.b);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Parameters "a" and "b" must be valid numbers.' });
  }

  res.json({ result: add(a, b) });
});

export default app;
