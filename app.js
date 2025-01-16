const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB  = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const rateLimiter = require('./middleware/rateLimiter');
const path=require('path');
//const fs=require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(rateLimiter);  // Rate limiting middleware

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'views','login.html'));
})

// Routes
app.use('/auth', authRoutes);
app.use('/url', urlRoutes);
app.use('/analytics', analyticsRoutes);



// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
  //await sequelize.sync(); // Sync with DB
});
