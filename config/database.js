const mongoose = require("mongoose");

const connectDB = async () => {
 const uri = "mongodb+srv://newuser:P2kSFyK8NBcwPQla@cluster0.e0b6htt.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
};

module.exports = connectDB;