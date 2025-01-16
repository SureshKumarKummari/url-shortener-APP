const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the URL schema
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId, // Link to user who created the URL
    required: true,
  },
  group: {
  type: String,
    enum: ['acquisition', 'activation', 'retention'],
    required: true,
  },
  analytics: {
    clicks: {
      type: Number,
      default: 0,
    },
    click_details: [{
      referrer: String,
      date: Date,
      ip: String,
    }],
  },
}, {
  timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
});

// Create the Mongoose model
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
