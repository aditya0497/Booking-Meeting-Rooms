const axios = require('axios');

// Airtable API setup
const AIRTABLE_API_URL = process.env.AIRTABLE_API_URL;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;  
const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;

// Function to fetch meetings from Airtable
async function fetchMeetings() {
  try {
    const response = await axios.get(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/meetings`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      },
    });
    return response.data.records.map(record => ({
      id: record.id,
      ...record.fields
    })); // Only return fields (with fields.id included)
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw new Error('Failed to fetch meetings');
  }
}

// Function to create a new meeting in Airtable
async function createMeeting(meetingData) {
  try {
    const response = await axios.post(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/meetings`,
      {
        fields: meetingData, // The data you want to save in Airtable
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data.records.map(record => record.fields);  
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw new Error('Failed to create meeting');
  }
}

// Function to delete a meeting from Airtable
async function deleteMeeting(meetingId) {
  console.log(meetingId);
  try {
    // Fetch all meetings and find the meeting by your custom `meetingId`
    const meetings = await fetchMeetings();
    const meetingToDelete = meetings.find(meeting => meeting.meetingId === meetingId).id;

    if (!meetingToDelete) {
      throw new Error('Meeting not found');
    }

    // Use Airtable's record ID for deletion
    const response = await axios.delete(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/meetings/${meetingToDelete}`,  // Use the Airtable record ID here
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw new Error('Failed to delete meeting');
  }
}

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const meetings = await fetchMeetings();
      res.status(200).json(meetings);
    } else if (method === 'POST') {
      const newMeeting = req.body;
      const createdMeeting = await createMeeting(newMeeting);
      res.status(201).json(createdMeeting);
    } else if (method === 'DELETE') {
     
      const { id } = req.params;  

      const deletedMeeting = await deleteMeeting(id);
      res.status(200).json({ message: 'Meeting deleted successfully', deletedMeeting });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in handler:', error.message);
    res.status(500).json({ error: error.message });
  }
};
