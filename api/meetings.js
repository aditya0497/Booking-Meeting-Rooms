const fs = require('fs');
const path = require('path');

const filePath = path.resolve('./db.json');

const readData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Failed to read data');
      }
      resolve(JSON.parse(data));
    });
  });
};

const writeData = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject('Failed to write data');
      }
      resolve();
    });
  });
};

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    const db = await readData();

    if (method === 'GET') {
      res.status(200).json(db.meetings);
    } else if (method === 'POST') {
      const newMeeting = req.body;
      db.meetings.push(newMeeting);
      await writeData(db);
      res.status(201).json(newMeeting);
    } else if (method === 'DELETE') {
      const meetingId = parseInt(req.query.id, 10);
      db.meetings = db.meetings.filter((meeting) => meeting.id !== meetingId);
      await writeData(db);
      res.status(200).json({ message: 'Meeting deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
