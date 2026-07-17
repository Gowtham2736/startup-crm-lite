import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Validation execution middleware
 * Takes express-validator validation rules, executes them, and returns formatted errors on failure
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors: array of { field, message }
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return errorResponse(res, 'Validation error occurred', 400, formattedErrors);
  };
};
