const axios = require('axios');

// Airtable API setup
const AIRTABLE_API_URL = process.env.AIRTABLE_API_URL;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;  
const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;

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
