const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const dbPath = path.resolve(__dirname, '../db.json');
  
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read db.json file' });
    }

    const db = JSON.parse(data);
    res.status(200).json(db.meetings || []);
  });
};
