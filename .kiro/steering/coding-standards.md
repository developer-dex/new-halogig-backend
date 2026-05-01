---
inclusion: auto
---

# Halogig New Backend — Coding Standards & Architecture Rules

This document defines the coding conventions, architecture patterns, and rules for the `new-backend-halogig` codebase. All code changes and new code MUST follow these rules to maintain consistency.

## Tech Stack

- Node.js with Express.js
- ES Modules via Babel (`import`/`export` syntax, transpiled with `@babel/preset-env`)
- Sequelize 6 ORM with MySQL
- Joi for request validation
- Winston for logging
- Swagger (swagger-jsdoc + swagger-ui-express) for API documentation
- JWT (jsonwebtoken) for authentication
- Multer for file uploads
- ESLint with airbnb-base config

## Project Structure

```
src/
├── config/          # App config (env, db, logger, swagger, paths)
├── constants/       # Enums and constant values
├── ejs/             # Email templates (EJS)
├── language/        # i18n message files (en.js)
├── logs/            # Winston log output (gitignored)
├── middlewares/     # Express middlewares (auth, validation, error, file upload)
├── models/          # Sequelize model definitions (one file per model)
├── modules/         # Feature modules (controller, service, routes, validation, docs)
├── routes/          # Central route registration (index.js)
├── services/        # Shared cross-module services (email, notifications)
├── utils/           # Utility functions (ApiError, asyncHandler, pagination, etc.)
├── app.js           # Express app setup (middleware, cors, swagger, routes)
└── index.js         # Server entry point (http/https, DB connect, process handlers)
```

## Module Structure (CRITICAL)

Every feature lives in `src/modules/{moduleName}/` with these files:

| File | Purpose | Naming |
|------|---------|--------|
| `{module}.controller.js` | HTTP request handling, calls service, sends response | camelCase module name |
| `{module}.service.js` | Business logic, DB queries via Sequelize models | camelCase module name |
| `{module}.routes.js` | Express Router with route definitions | camelCase module name |
| `{module}.validation.js` | Joi schemas for request validation | camelCase module name |
| `{module}.docs.js` | Swagger JSDoc annotations | camelCase module name |

Module directory names use camelCase (e.g., `salesReferral`, `adminAuth`, `emailCampaign`).

### Adding a New Module

1. Create directory: `src/modules/{moduleName}/`
2. Create all 5 files following the naming convention above
3. Register routes in `src/routes/index.js` — import and add to the `router.use('/api', [...])` array
4. All routes are mounted under `/api` prefix automatically


## Controller Pattern

Controllers handle HTTP concerns only. They:
- Use `asyncHandler` wrapper (no manual try/catch needed)
- Extract data from `req` and pass to service
- Return responses using helper functions `ok()` and `bad()`
- Never contain business logic or direct DB queries

```javascript
import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import myService from './my.service';

const ok = (req, res, data, msgKey = 'SIGNUP') =>
  res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, msgKey) });

const bad = (req, res, msgKey = 'FALSE_RESPONSE') =>
  res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });

const myAction = asyncHandler(async (req, res) => {
  const result = await myService.doSomething({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

export default { myAction };
```

### Response Format

All API responses MUST follow this shape:

```json
{
  "success": true | false,
  "data": <result or null>,
  "message": "<localized message string>"
}
```

Error responses from the global error middleware also include an `error` object with `name`, `message`, and optionally `stack` (non-production only).

## Service Pattern

Services contain all business logic and database operations. They:
- Import Sequelize models directly from `../../models`
- Throw `ApiError` for expected errors (the error middleware catches these)
- Return data objects (not HTTP responses)
- Are the ONLY layer that talks to the database

```javascript
import { User, Project } from '../../models';
import ApiError from '../../utils/ApiError';

const getUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export default { getUser };
```

### Error Handling in Services

- Use `ApiError` static methods: `ApiError.badRequest()`, `ApiError.notFound()`, `ApiError.unauthorized()`, `ApiError.forbidden()`, `ApiError.internal()`
- Thrown errors are caught by `asyncHandler` and forwarded to the global error middleware
- Do NOT use `res.status()` in services — that belongs in controllers

## Route Pattern

Routes define Express routes with middleware chain:

```javascript
import { Router } from 'express';
import controller from './my.controller';
import validate from '../../middlewares/validate.middleware';
import validation from './my.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

// Middleware order: auth → file upload (if needed) → validation → controller
router.post('/my-resource', authMiddleware, validate(validation.create), controller.create);
router.get('/my-resource/:id', authMiddleware, validate(validation.idParam), controller.getById);

export default router;
```

### Route Rules

- All admin routes MUST have `adminAuthMiddleware` (except `POST /admin/login` and `POST /admin/verify-otp`)
- All authenticated user routes MUST have `authMiddleware`
- Public routes that optionally use auth use `optionalAuthMiddleware`
- `adminAuthMiddleware` MUST come BEFORE `fileUpload` middleware (auth check before file processing)
- Specific string routes MUST be registered BEFORE parameterized `:id` routes to avoid shadowing
- Validation middleware (`validate(schema)`) should come after auth middleware and before the controller


## Validation Pattern (Joi)

Validation schemas are defined as objects with keys matching request parts (`body`, `params`, `query`, `headers`):

```javascript
import Joi from 'joi';

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(1).optional(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const list = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null).optional(),
  }),
};

export default { create, idParam, list };
```

### Validation Rules

- Always validate `params.id` as `Joi.number().integer().required()` for ID-based routes
- Pagination defaults: `page` defaults to 1, `limit` defaults to 10, max limit 100
- Use `.unknown(true)` on body schemas only when the endpoint accepts dynamic/extra fields
- Use `.allow('', null)` for optional string fields that may come as empty
- The `validate` middleware runs Joi with `abortEarly: false` and returns the first error via `ApiError`

## Model Pattern (Sequelize)

Models are defined in `src/models/` using the factory function pattern:

```javascript
module.exports = (sequelize, DataTypes) => {
  const MyModel = sequelize.define('MyModel', {
    field_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // ... fields
  }, {
    tableName: 'my_table_name',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  MyModel.associate = (models) => {
    MyModel.belongsTo(models.User, { foreignKey: 'user_id' });
    MyModel.hasMany(models.OtherModel, { foreignKey: 'my_model_id', onDelete: 'cascade' });
  };

  return MyModel;
};
```

### Model Rules

- File naming: `{ModelName}.model.js` (PascalCase model name)
- Use `module.exports` (CommonJS) for model files — they are loaded dynamically by `models/index.js`
- All other files use ES Module `import`/`export` syntax
- Table names use snake_case
- Column names use snake_case
- Model names use PascalCase
- Always define `tableName` explicitly
- Always set `timestamps: true` with explicit `createdAt`/`updatedAt`
- Define associations in the `associate` static method
- After creating a model file, export it from `src/models/index.js` as a named export

## Swagger Documentation Pattern

Each module has a `*.docs.js` file with JSDoc-style Swagger annotations:

```javascript
/**
 * @swagger
 * tags:
 *   name: MyModule
 *   description: Description of this module's endpoints
 */

/**
 * @swagger
 * /my-resource:
 *   post:
 *     summary: Create a resource
 *     tags: [MyModule]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
```

### Swagger Rules

- Every endpoint MUST have a corresponding Swagger entry in the module's `*.docs.js` file
- When fixing or changing an endpoint (field names, required fields, response codes, request body), ALWAYS update the Swagger docs to match
- Use `BearerAuth` security scheme for authenticated endpoints
- Document request body schemas, query parameters, path parameters, and response codes
- Swagger scans `./src/modules/**/*.docs.js` automatically


## Middleware Reference

| Middleware | File | Purpose |
|-----------|------|---------|
| `authMiddleware` | `middlewares/auth.middleware.js` | Verifies user JWT, sets `req.user` |
| `optionalAuthMiddleware` | `middlewares/auth.middleware.js` | Sets `req.user` if token present, doesn't block |
| `adminAuthMiddleware` | `middlewares/adminAuth.middleware.js` | Verifies admin JWT, sets `req.admin` and `req.user` |
| `requireAdminRole(roles)` | `middlewares/adminAuth.middleware.js` | Checks admin role after `adminAuthMiddleware` |
| `validate(schema)` | `middlewares/validate.middleware.js` | Validates request against Joi schema |
| `errorHandler` | `middlewares/error.middleware.js` | Global error handler (registered last) |
| `notFoundHandler` | `middlewares/notFound.middleware.js` | Catches unmatched routes |
| `fileUpload.*` | `middlewares/fileUpload.middleware.js` | Multer-based file upload handlers |

## Utility Reference

| Utility | File | Usage |
|---------|------|-------|
| `ApiError` | `utils/ApiError.js` | Custom error class with static factory methods |
| `asyncHandler` | `utils/asyncHandler.js` | Wraps async controllers to catch errors |
| `getHttpStatus` | `utils/httpStatus.js` | Maps status names to codes (e.g., `'OK'` → 200) |
| `getMessage` | `utils/message.js` | Gets localized message by key from `language/` |
| `calculatePagination` | `utils/pagination.js` | Computes `offset` and `parsedLimit` from page/limit |
| `pick` | `utils/pick.js` | Picks specified keys from an object |
| `jwtUtil` | `utils/jwt.js` | JWT sign/verify helpers |

## Shared Services

Cross-module services live in `src/services/` (not inside a module):
- `email.service.js` — Sending emails via SMTP/SendGrid
- `ejs.service.js` — Rendering EJS email templates
- `emailTemplate.service.js` — Email template management
- `inAppNotification.service.js` — In-app notification creation
- `adminNotification.service.js` — Admin notification creation
- `platformNotification.service.js` — Platform-wide notifications

Module-specific services (e.g., `razorpay.service.js`, `paypal.service.js`) live inside their module directory.

## Error Handling Rules

1. Controllers use `asyncHandler` — no manual try/catch needed in controllers
2. Services throw `ApiError` for expected errors
3. The global `errorHandler` middleware catches all errors and returns a consistent JSON response
4. For 500 errors, the error message is replaced with a generic `INTERNAL_ERROR` message (from language file)
5. Non-500 errors pass through the original `error.message`
6. Never swallow errors silently — always throw or log

## Null Safety & Defensive Coding

- Always check for null/undefined before accessing properties on DB query results
- Use optional chaining (`?.`) when accessing nested properties that may be null
- When a `findByPk` or `findOne` returns null, throw `ApiError.notFound()` or return null to the controller
- Validate required request fields before passing to service layer (prefer Joi validation in the validation file)
- Default pagination params to safe values: `page = 1`, `limit = 10`

## Security Rules

- All admin routes MUST have `adminAuthMiddleware` (except login/OTP endpoints)
- Auth middleware MUST come BEFORE file upload middleware in the route chain
- Sanitize user-generated text fields (use `xss` package) before storing in DB
- Validate and cap password length (max 128 chars) before bcrypt hashing
- Body parser size limit should be `10mb` (not `500mb`)
- Use `rate-limiter-flexible` for rate limiting on sensitive endpoints (login, OTP, forgot-password)

## Import Style

- Use ES Module syntax (`import`/`export`) for all files except model definitions
- Model files use `module.exports` (CommonJS) because they are loaded dynamically by `models/index.js`
- Import order convention:
  1. Node built-in modules (`path`, `fs`, `http`)
  2. Third-party packages (`express`, `sequelize`, `joi`)
  3. Internal config/utils (`../../config/env`, `../../utils/ApiError`)
  4. Internal modules (`./my.service`, `../../models`)

## Constants & Enums

- Define enums in `src/constants/enums.js`
- Use UPPER_CASE for enum object names and values
- Import and use enum constants instead of magic strings in code

## Localization

- All user-facing messages go through `getMessage(req, false, 'MESSAGE_KEY')`
- Message keys are defined in `src/language/en.js`
- Add new message keys to the language file when creating new endpoints

## Configuration

- All environment variables are accessed through `src/config/env.js` — never use `process.env` directly in modules
- Database config is in `src/config/db.js`
- Logger config is in `src/config/logger.js`
- File upload paths are in `src/config/paths.js`

## Git & Code Quality

- ESLint config extends `airbnb-base` with `plugin:node/recommended`
- Run `npm run lint` before committing
- No `console.log` in production code (use `logger` from `config/logger.js`)
- Babel transpiles ES modules for Node.js compatibility
