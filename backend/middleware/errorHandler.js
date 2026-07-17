import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 'Validation Error', 400, messages);
  }

  // Mongoose Bad ObjectId (Cast Error)
  if (err.name === 'CastError') {
    return errorResponse(res, 'Resource not found', 404);
  }

  // MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    return errorResponse(res, 'Email already exists', 409);
  }
// Handle malformed JSON body errors from body‑parser
  if (err.type === 'entity.parse.failed') {
    return errorResponse(
      res,
      'Invalid JSON payload – please ensure the request body is valid JSON.',
      400,
      [{ field: 'body', message: err.message }]
    );
  }
  // JWT Token Invalid
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Token is invalid', 401);
  }

  // JWT Token Expired
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token has expired, please login again', 401);
  }

  // Default Server Error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
