const axios = require('axios');

// Airtable API setup
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const AIRTABLE_BASE_ID = "appS7jaWw1Sg2Or0r"  // Ensure to set this in your .env file
const AIRTABLE_PERSONAL_ACCESS_TOKEN = "patYX75s1NFVkuInZ.10299e6d713d032637142c2c0e5baee36ec5f4f0b1abf7757e60b80b37f36795"; // Ensure to set this in your .env file

// Function to fetch rooms from Airtable
async function fetchRooms() {
  try {
    const response = await axios.get(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/rooms`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      },
    });
    return response.data.records.map(record => record.fields);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
}

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Fetch rooms from Airtable
      const rooms = await fetchRooms();
      res.status(200).json(rooms);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
