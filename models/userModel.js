const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  google_id: {
    type: String,
    unique: true,
    required: true, // Ensures google_id is required
  },
  email: {
    type: String,
    required: true, // Ensures email is required
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
