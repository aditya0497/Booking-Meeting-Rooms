const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Function to fetch rooms
async function fetchRooms() {
  try {
    const { data, error } = await supabase.from('rooms').select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
}

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Fetch rooms from Supabase
      const rooms = await fetchRooms();
      res.status(200).json(rooms);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
