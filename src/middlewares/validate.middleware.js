import Joi from 'joi';
import pick from '../utils/pick';
import getMessage from '../utils/message';
import getHttpStatus from '../utils/httpStatus';
import ApiError from '../utils/ApiError';

/**
 * Generic request validation middleware using Joi.
 * Validates headers, params, query, and/or body against the provided schema.
 *
 * @param {Object} schema - Joi schema object with optional keys: headers, params, query, body
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['headers', 'params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (!error) return next();

  const firstError = error.details[0];
  const message = getMessage({}, false, firstError.message) || firstError.message;

  return next(new ApiError(getHttpStatus('BAD_REQUEST'), message));
};

export default validate;
