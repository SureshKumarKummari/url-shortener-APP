const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  group: {
  type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, 
});

const URL = mongoose.model('urls', urlSchema);

module.exports = URL;
