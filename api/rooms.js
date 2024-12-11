const fs = require('fs');
const path = require('path');

const filePath = path.resolve('./db.json');

const readData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Failed to read mock data');
      }
      resolve(JSON.parse(data));
    });
  });
};

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    const db = await readData();

    if (method === 'GET') {
      // Return all rooms
      res.status(200).json(db.rooms);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
