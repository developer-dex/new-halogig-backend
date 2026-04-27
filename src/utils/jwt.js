import jwt from 'jsonwebtoken';
import env from '../config/env';

const { secret, expiresIn } = env.jwt;

/**
 * JWT utility — create, verify, and decode tokens.
 * Secret is loaded from env.js (centralized), not hardcoded.
 */
export default {
  createToken(payload) {
    return jwt.sign(payload, secret, { expiresIn });
  },

  verifyToken(token) {
    return jwt.verify(token, secret);
  },

  decodeToken(token) {
    return jwt.decode(token, { complete: true });
  },
};
