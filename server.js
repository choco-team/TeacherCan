const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const { readFileSync } = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync('./localhost-key.pem'),
  cert: readFileSync('./localhost.pem'),
};

const PORT = 3000;

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(PORT, () => {
    console.log(`> HTTPS Ready on https://localhost:${PORT}`);
  });
});
