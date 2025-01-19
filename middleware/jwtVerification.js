const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    console.log("In authentication");
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = { id: user.id, email: user.email, name: user.name }; 
    console.log("In authentication calling next")
    next(); // Pass control to the next middleware function
  });
}

module.exports = authenticateToken;
