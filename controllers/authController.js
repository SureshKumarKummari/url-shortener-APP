const { verifyGoogleToken } = require('../config/googleAuth');
const User = require('../models/userModel');

async function googleSignIn(req, res) {
  try {
    const { idToken } = req.body;
    const payload = await verifyGoogleToken(idToken);

    let user = await User.findOne({ where: { google_id: payload.sub } });

    if (!user) {
      user = await User.create({ google_id: payload.sub, email: payload.email });
    }

    res.status(200).json({ userId: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ message: 'Invalid Google token' });
  }
}

module.exports = { googleSignIn };
