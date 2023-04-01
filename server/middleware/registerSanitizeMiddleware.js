const validator = require("validator");

function registerSanitizeMiddleware(req, res, next) {
  if (req.body.username) {
    req.body.username = validator.trim(req.body.username);
    req.body.username = validator.escape(req.body.username);
    req.body.username = validator.blacklist(req.body.username, " ");
    const minUserNameLength = 5;
    const maxUserNameLength = 20;
    if (!validator.isLength(req.body.username, { min: minUserNameLength, max: maxUserNameLength })) {
      return res.status(400).json({ error: `Username must be between ${minUserNameLength} and ${maxUserNameLength} characters long` });
    }
  }

  // Sanitize the password field
  if (req.body.password) {
    req.body.password = validator.trim(req.body.password);
    req.body.password = validator.escape(req.body.password);
    const minPasswordLength = 5;
    if (!validator.isLength(req.body.password, { min: minPasswordLength })) {
      return res.status(400).json({ error: `Password must be at least ${minPasswordLength} characters long` });
    }
  }

   // Sanitize the body parameters
   Object.keys(req.body).forEach((key) => {
    req.body[key] = validator.escape(req.body[key]);
  });

  next();
}

module.exports = registerSanitizeMiddleware;
