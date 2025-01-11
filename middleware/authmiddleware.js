// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const jwt_secrect="hellodeep";

exports.authenticate = async (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
      const decoded = jwt.verify(token,jwt_secrect);
      req.user = decoded;
      next();
  } catch (err) {
      res.status(400).json({ error: 'Invalid token or not access' });
  }

};

exports.authorize = (role) => {
  return (req, res, next) => {
    if(!role.includes(req.user.userrole))
      return res.status(403).json({ success: false, message: 'not access for you' });
    
    next();
}

};

