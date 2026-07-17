/**
 * Custom MongoDB Query Injection Sanitization Middleware
 * Bypasses read-only property issues with req.query by editing keys in-place
 */
const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

const customMongoSanitize = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  
  if (req.query) {
    // Sanitize query keys in-place without replacing the read-only query object itself
    const keys = Object.keys(req.query);
    for (const key of keys) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.query[key];
      } else {
        sanitize(req.query[key]);
      }
    }
  }
  
  next();
};

export default customMongoSanitize;
