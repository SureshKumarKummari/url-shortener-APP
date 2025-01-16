const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {OAuth2Client} = require('google-auth-library'); // Google OAuth Client
const shortid = require('shortid');
const path = require('path');

const app = express();
const port = 5000;

// Store users in memory (for testing only, replace with a database in production)
const users = [];
const urlDatabase = {};

// Google OAuth Client to verify ID token
const client = new OAuth2Client('744400210883-p47l84bgrlq1khvcgp4ga343cvs2p5so.apps.googleusercontent.com'); // Replace with your actual client ID

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Passport Strategy (for Backend)
passport.use(new GoogleStrategy({
  clientID: '744400210883-p47l84bgrlq1khvcgp4ga343cvs2p5so.apps.googleusercontent.com',  
  clientSecret: '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',  
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    let user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
    users.push(user);
    console.log(user);
  //}
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);  // Store only the user id in the session (to keep it small)
});

// Deserialize the user when reading from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = users.filter((user)=>user.id==id)[0];//await User.findById(id); // Assuming you're storing the user in the database
    done(null, user);  // Passing the user object to the session
  } catch (err) {
    done(err, null);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'views', 'login.html'));
});

// Google login route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/shortener');
  }
);

// Verify Google ID token (from frontend)
app.post('/auth/google/callback', async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verify the ID token using the Google OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: '744400210883-p47l84bgrlq1khvcgp4ga343cvs2p5so.apps.googleusercontent.com', // Replace with your actual client ID
    });
    
    // Get the user information from the ID token
    const payload = ticket.getPayload();
    const user = { id: payload.sub, name: payload.name, email: payload.email };
    
    // Save user info to session
    req.session.user = user;

    // After successful login, redirect to the shortener page
    res.json({ success: true, message: 'Authenticated successfully' });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(400).json({ success: false, message: 'Authentication failed' });
  }
});

// URL shortener page (only accessible after login)
app.get('/shortener', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','index.html'));
});

// Endpoint to shorten URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!urlPattern.test(longUrl)) {
    return res.status(400).send('Invalid URL format');
  }

  const shortUrl = shortid.generate();
  urlDatabase[shortUrl] = longUrl;

  res.send(`
    <h2>Shortened URL:</h2>
    <a href="/${shortUrl}" target="_blank">/${shortUrl}</a>
  `);
});

// Redirect to the original URL based on short URL
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];
  if (!longUrl) {
    return res.status(404).send('URL not found');
  }
  res.redirect(longUrl);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
