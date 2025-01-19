const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  google_id: {
    type: String,
    unique: true,
    required: true,
  },
  name:{
    type:String,
    required:true,
  },
  email: {
    type: String,
    required: true, 
  },
}, {
  timestamps: true, 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
