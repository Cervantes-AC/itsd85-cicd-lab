import app from './app.js';

const port = process.env.PORT || 3000;

const server = app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Server running at http://localhost:${port}`);
});

// Lets "docker stop" and Ctrl+C shut the server down cleanly.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
