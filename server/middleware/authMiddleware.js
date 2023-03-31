const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

   // TODO: This needs be saved in some sort of an environment variable in Production
   const secretKey = 'ariel_query_builder_secret';
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;

    next();
  });
}

module.exports = authMiddleware;