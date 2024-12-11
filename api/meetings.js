const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});
}

const db = admin.firestore();

module.exports = async (req, res) => {
  try {
    const meetingsCollection = db.collection('meetings');

    switch (req.method) {
      case 'GET': {
        // Fetch all meetings
        const snapshot = await meetingsCollection.get();
        if (snapshot.empty) {
          return res.status(200).json([]);
        }

        const meetings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return res.status(200).json(meetings);
      }

      case 'POST': {
        // Add a new meeting
        const meetingData = req.body;
        if (!meetingData || Object.keys(meetingData).length === 0) {
          return res.status(400).json({ error: 'Invalid meeting data' });
        }

        const newMeetingRef = await meetingsCollection.add(meetingData);
        return res.status(201).json({ id: newMeetingRef.id, ...meetingData });
      }

      case 'PUT': {
        // Update an existing meeting
        const { id, ...updateData } = req.body;
        if (!id || Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: 'Invalid update data or missing ID' });
        }

        const meetingRef = meetingsCollection.doc(id);
        await meetingRef.update(updateData);
        return res.status(200).json({ id, ...updateData });
      }

      case 'DELETE': {
        // Delete a meeting
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Missing meeting ID' });
        }

        const meetingRef = meetingsCollection.doc(id);
        await meetingRef.delete();
        return res.status(200).json({ success: true, id });
      }

      default: {
        // Unsupported HTTP method
        return res.status(405).json({ error: 'Method not allowed' });
      }
    }
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
