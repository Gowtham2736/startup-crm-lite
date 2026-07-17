import getRawBody from 'raw-body';

// Middleware to capture the raw request body (as a string) before JSON parsing.
// This helps identify malformed payloads that cause body‑parser errors.
export const captureRawBody = async (req, res, next) => {
  try {
    const buf = await getRawBody(req);
    req.rawBody = buf.toString();
  } catch (err) {
    // If the request has no body, ignore the error.
    req.rawBody = '';
  }
  next();
};
