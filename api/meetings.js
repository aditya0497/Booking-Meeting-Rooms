const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert({
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIRBASE_CLIENT_EMAIL
  }),
});

const db = admin.firestore(); 

module.exports = async (req, res) => {
  try {
    
    const snapshot = await db.collection('meetings').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const meetings = snapshot.docs.map(doc => doc.data());

    res.status(200).json(meetings);
  } catch (err) {
    console.error('Error fetching meetings:', err);
    res.status(500).json({ error: 'Unable to fetch data from Firestore' });
  }
};
