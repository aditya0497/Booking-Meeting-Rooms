const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore(); 

module.exports = async (req, res) => {
  try {
    
    const snapshot = await db.collection('rooms').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const rooms = snapshot.docs.map(doc => doc.data()); 

    res.status(200).json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Unable to fetch data from Firestore' });
  }
};
