const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel'); 

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function googleCallback(req, res) {
  try {
    
    const { idToken } = req.body;

    //console.log(idToken);
  
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    console.log(payload);

    //res.send();
    let existingUser = await User.findOne({ google_id: sub });

    if (!existingUser) {
      existingUser = new User({
        google_id: sub,
        name,
        email,
      });

      await existingUser.save(); 
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      token: token,
      user: existingUser,
    });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    return res.status(400).json({ success: false, message: 'Error during authentication' });
  }
}

module.exports = { googleCallback };
