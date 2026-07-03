import { validationResult } from 'express-validator';

export function validateRequest(req, _res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Please check the highlighted fields and try again.');
    error.statusCode = 422;
    error.details = errors.array();
    return next(error);
  }

  return next();
}
