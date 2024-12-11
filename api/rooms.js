const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  const dbPath = path.join(__dirname, '../db.json');

  // Check if db.json exists
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ error: 'Database file not found' });
  }

  const server = jsonServer.create();
  const router = jsonServer.router(dbPath);
  const middlewares = jsonServer.defaults();

  server.use(middlewares);

  server.use(router);

  server.use((req, res, next) => {
    if (req.url.startsWith('/rooms')) {
      return next();
    }
    return res.status(404).send('Not Found');
  });

  server(req, res);
};
