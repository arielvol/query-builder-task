const validator = require("validator");

function sanitizeMiddleware(req, res, next) {
  const escapeObjectProperties = (obj) => {
    const escapedObj = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        escapedObj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === "object") {
        escapedObj[key] = escapeObjectProperties(obj[key]);
      } else {
        escapedObj[key] = obj[key];
      }
    });
    return escapedObj;
  };

  // Sanitize the body parameters
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = validator.escape(req.body[key]);
    } else if (typeof req.body[key] === "object") {
      req.body[key] = escapeObjectProperties(req.body[key]);
    }
  });

  // Sanitize the query parameters
  Object.keys(req.query).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = validator.escape(req.body[key]);
    } else if (typeof req.body[key] === "object") {
      req.body[key] = escapeObjectProperties(req.body[key]);
    }
  });

  // Sanitize the URL parameters
  Object.keys(req.params).forEach((key) => {
    req.params[key] = validator.escape(req.params[key]);
  });

  next();
}

module.exports = sanitizeMiddleware;
