const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessLogSchema = new Schema({
  urlId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'URL',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: String,
  ip: String,
  geolocation: String,
  deviceType: String,
  osType: String,
});

const AccessLog = mongoose.model('accessLogs', accessLogSchema);

module.exports = AccessLog;
