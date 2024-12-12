const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Function to fetch meetings
async function fetchMeetings() {
  try {
    const { data, error } = await supabase.from('meetings').select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw new Error('Failed to fetch meetings');
  }
}

// Function to create a new meeting
async function createMeeting(meetingData) {
  try {
    const { data, error } = await supabase.from('meetings').insert([meetingData]);
    if (error) throw error;
    return data; 
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw new Error('Failed to create meeting');
  }
}

// Function to delete a meeting by ID
async function deleteMeeting(meetingId) {
  try {
    const { data, error } = await supabase.from('meetings').delete().eq('meetingId', meetingId);
    if (error) throw error;
    return data;
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
      const { id } = req.query;
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
