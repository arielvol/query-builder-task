const validator = require("validator");

function registerSanitizeMiddleware(req, res, next) {
  if (req.body.username) {
    req.body.username = validator.trim(req.body.username);
    req.body.username = validator.escape(req.body.username);
    req.body.username = validator.blacklist(req.body.username, " ");
    if (!validator.isLength(req.body.username, { min: 5, max: 20 })) {
      return res.status(400).json({ error: 'Username must be between 5 and 20 characters long' });
    }
  }

  // Sanitize the password field
  if (req.body.password) {
    req.body.password = validator.trim(req.body.password);
    req.body.password = validator.escape(req.body.password);
    if (!validator.isLength(req.body.password, { min: 8 })) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long' });
    }
  }

   // Sanitize the body parameters
   Object.keys(req.body).forEach((key) => {
    req.body[key] = validator.escape(req.body[key]);
  });

  next();
}

module.exports = registerSanitizeMiddleware;
