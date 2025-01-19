const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define Passport Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,  // Client ID from Google Developer Console
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Client Secret from Google Developer Console
  callbackURL: process.env.CALLBACK_URL,  // Callback URL that Google redirects to after authentication
}, (accessToken, refreshToken, profile, done) => {
  // Here you can handle user authentication and save the user data (if necessary)
  return done(null, {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
  });
}));

// Serialize and deserialize user (if needed for sessions)
// If you're using JWT, this may not be needed unless you want to store users in the session.
passport.serializeUser((user, done) => {
  done(null, user.id);  // We are only storing the user ID in the session (you can adjust as needed)
});

passport.deserializeUser((id, done) => {
  // Here you would query the database to get the user based on the ID
  done(null, { id });
});

// Export Passport for use in other parts of the application
module.exports = passport;





