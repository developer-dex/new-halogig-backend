# HaloGig Backend Restructure Plan

## 2a. Current Codebase Audit

### Entry Points & Config

| File | What It Does | Issues | Maps To |
|------|-------------|--------|---------|
| `src/index.js` | Express app entry point, loads dotenv, creates Bootstrap instance | Mixes server creation with app setup; unhandledRejection handler is good | `server.js` |
| `src/bootstrap.js` | Class that wires middleware, DB, routes, server start, cron jobs | God class — does too much (middleware, DB, routes, server, cron, swagger, static files all in one); CORS origins hardcoded; helmet called twice; `console.log(req.headers)` on every request | `src/app.js` + `src/config/swagger.js` + `src/config/db.js` |
| `src/config/index.js` | Centralized config object reading from `process.env` | Logs DB credentials to console on import; JWT secret hardcoded in jwt.service.js not here; shipping/paytm config unused; `process.env` scattered elsewhere too | `src/config/env.js` |
| `config/database.js` | Sequelize CLI config | Fine as-is, just needs env.js reference | `src/config/db.js` |
| `.babelrc` | Babel preset-env targeting current Node | Will be removed — new project uses native ES modules or modern Node | N/A |
| `.sequelizerc` | Sequelize CLI paths | Needs updating for new structure | `.sequelizerc` |
| `.eslintrc.js` | ESLint airbnb-base config | Fine, will be carried over | `.eslintrc.js` |
| `package.json` | Dependencies and scripts | Uses Babel transpilation (unnecessary for Node 18+); nodemon in dependencies not devDependencies; many unused deps (shipping, paytm stuff) | `package.json` |

### Route Files

| File | What It Does | Issues | Maps To |
|------|-------------|--------|---------|
| `src/routes/index.js` | Central router, mounts all sub-routers under `/api`, global error handler, 404 handler | Standalone GET `/api/admin/referral-partners` registered outside router; error handler is good but duplicated logic | `src/routes/index.js` + `src/middlewares/error.middleware.js` + `src/middlewares/notFound.middleware.js` |
| `src/routes/admin.route.js` | All admin endpoints (~100+ routes) | Massive file (300+ lines); no validation on any route; no auth middleware on most routes; mixes admin CRUD, blog, website data, LinkedIn, Twitter, Google Meet, web rot data | Split into: `admin`, `blog`, `websiteData`, `webRotData`, `linkedInMarketing`, `twitterMarketing`, `googleMeet`, `categoryManagement`, `adminAuth` modules |
| `src/routes/adminAuth.route.js` | Admin auth (login, profile, CRUD admins) | Duplicates some routes from admin.route.js (admin CRUD exists in both) | `modules/adminAuth/` |
| `src/routes/chat.route.js` | Chat rooms and messages for admin and user | Clean structure, good separation of admin/user/common | `modules/chat/` |
| `src/routes/contact.routes.js` | Single POST `/contact-us` | Fine, just needs validation | `modules/contact/` |
| `src/routes/country.route.js` | Country, designation, technology lookups | No auth on POST; mixed concerns (country + designation + technology) | `modules/country/` |
| `src/routes/howItWorks.route.js` | Empty — all routes commented out | Dead code, skip | N/A |
| `src/routes/logManager.route.js` | Log management CRUD | Uses user auth but should use admin auth; not mounted in routes/index.js | `modules/logManager/` |
| `src/routes/payment.route.js` | Razorpay orders, PayPal webhook, transactions | No validation; inconsistent auth (some routes unprotected) | `modules/payment/` |
| `src/routes/user.route.js` | All user endpoints (~120+ routes) | Massive file (400+ lines); no validation; mixes auth, profile, projects, bids, SOW, billing, website data, blog, payments, disputes, testimonials | Split into: `auth`, `user`, `project`, `bid`, `sow`, `billing`, `freelancer`, `client`, `websiteDataPublic` modules |

### Controller Files

| File | What It Does | Issues | Maps To |
|------|-------------|--------|---------|
| `src/controllers/account.controller.js` | Signup, login, logout, password reset, profile | Not used in any route (dead code — routes use user.controller instead) | Skip or merge into `auth` module |
| `src/controllers/admin.controller.js` | ~80+ admin methods (users, projects, bids, blogs, billing, categories, etc.) | 2000+ line god file; no validation; repetitive try-catch pattern; `console.log` scattered; inconsistent response formats (some use `status: 200`, others use `success: true`) | Split across multiple modules |
| `src/controllers/adminAuth.controller.js` | Admin login, CRUD, password change | Good structure; generates temp passwords; sends emails | `modules/adminAuth/` |
| `src/controllers/aiDraft.controller.js` | Proxy to AI/email service | Clean, has inline validation | `modules/aiDraft/` |
| `src/controllers/chat.controller.js` | Chat room CRUD, messaging, Google Meet | Good structure; directly imports models (should use service) | `modules/chat/` |
| `src/controllers/contact.controller.js` | Create contact, send notification email | Has inline validation; fire-and-forget email is good pattern | `modules/contact/` |
| `src/controllers/country.controller.js` | Country, technology, designation CRUD | Simple pass-through to repository | `modules/country/` |
| `src/controllers/googleMeet.controller.js` | Google Meet OAuth flow, token management | Returns raw HTML pages for OAuth callbacks; directly uses Token model | `modules/googleMeet/` |
| `src/controllers/industry.controller.js` | Industry CRUD | Simple, clean | `modules/industry/` |
| `src/controllers/linkedInMarketing.controller.js` | LinkedIn OAuth, token management, posting toggle | Returns raw HTML for callbacks; good error handling | `modules/linkedInMarketing/` |
| `src/controllers/logManager.controller.js` | Log CRUD, statistics, cleanup | Uses service layer (good); test endpoint should be dev-only | `modules/logManager/` |
| `src/controllers/payment.controller.js` | Razorpay orders, PayPal webhook, transactions | Simple pass-through; error messages reference "Industry" (copy-paste bug) | `modules/payment/` |
| `src/controllers/twitterMarketing.controller.js` | Twitter token management, posting toggle, test connection | Clean structure | `modules/twitterMarketing/` |
| `src/controllers/user.controller.js` | ~100+ user methods (auth, profile, projects, bids, SOW, billing, etc.) | 3700+ line god file; no validation; massive OAuth callback handlers with inline HTML; repetitive patterns | Split across multiple modules |
| `src/controllers/webRotData.controller.js` | Web rotation data queries | Clean, simple | `modules/webRotData/` |
| `src/controllers/websiteData.controller.js` | Website data CRUD, Excel upload/download, bulk update | Has inline validation; good structure | `modules/websiteData/` |

### Model Files (75 models)

| Model | Maps To Module |
|-------|---------------|
| `Activity.model.js` | timeTracker |
| `Admin.model.js` | adminAuth |
| `Blog.model.js` | blog |
| `CampaignBatch.model.js` | emailCampaign |
| `CandidateProfile.model.js` | user |
| `Category.model.js` | category |
| `CategoryDatabase.model.js` | category |
| `Certificate.model.js` | user |
| `ChatMeeting.model.js` | chat |
| `ChatMessage.model.js` | chat |
| `ChatMessageRead.model.js` | chat |
| `ChatRoom.model.js` | chat |
| `ChatRoomMember.model.js` | chat |
| `ClientBillingDetails.model.js` | billing |
| `ClientProject.model.js` | project |
| `ClientProjectSubCategory.model.js` | project |
| `contactUs.model.js` | contact |
| `Country.model.js` | country |
| `CustomerIndustries.model.js` | industry |
| `Designation.model.js` | country |
| `Device.model.js` | timeTracker |
| `Dispute.model.js` | dispute |
| `Education.model.js` | user |
| `EmailCampaign.model.js` | emailCampaign |
| `EmailDomainAnalysis.model.js` | emailCampaign |
| `Feedback.model.js` | feedback |
| `FreelancerCurrentCountryPreference.model.js` | user |
| `FreelancerCv.model.js` | user |
| `generatedBill.model.ts` | billing (TypeScript file — needs conversion) |
| `HalogigTestimonial.model.js` | testimonial |
| `HowItWorks.model.js` | skip (unused) |
| `HtmlTemplate.model.js` | emailCampaign |
| `InAppNotification.model.js` | notification |
| `Industry.js` | industry |
| `InternalData.model.js` | user |
| `InternalImage.model.js` | user |
| `InternalPage.model.js` | user |
| `LogManager.model.js` | logManager |
| `PasswordResetToken.model.js` | auth |
| `Payment.model.js` | payment |
| `ProcessingBatch.model.js` | emailCampaign |
| `ProfessionalDetail.model.js` | user |
| `ProfessionalDetailSubCategory.model.js` | user |
| `ProfileCompleteReminder.model.js` | user |
| `Project.model.js` | project |
| `ProjectBid.model.js` | bid |
| `ProjectBidMilestone.model.js` | bid |
| `ProjectDetail.model.js` | project |
| `ReportProblem.model.js` | support |
| `SaleOrderAndInvoices.model.js` | billing |
| `SalesReferralLead.model.js` | salesReferral |
| `SavedProject.model.js` | project |
| `Screenshot.model.js` | timeTracker |
| `Sow.model.js` | sow |
| `SowInput.model.js` | sow |
| `SubCategory.model.js` | category |
| `Technology.model.js` | category |
| `Thumbnail.model.js` | user |
| `ThumbnailImage.model.js` | user |
| `Token.model.js` | auth |
| `Transaction.model.js` | payment |
| `User.model.js` | user |
| `userActivity.model.js` | analytics |
| `UserDevice.model.js` | user |
| `UserFunction.model.js` | user |
| `Video.model.js` | user |
| `WebRotData.model.js` | webRotData |
| `WebRotHistory.model.js` | webRotData |
| `WebRotJob.model.js` | webRotData |
| `WebRotJobResult.model.js` | webRotData |
| `WebsiteData.model.js` | websiteData |
| `WorkSession.model.js` | timeTracker |

### Middleware Files

| File | What It Does | Issues | Maps To |
|------|-------------|--------|---------|
| `auth.middleware.js` | JWT user auth + optional auth | Good; console.log in optional auth | `src/middlewares/auth.middleware.js` |
| `adminAuth.middleware.js` | Admin JWT auth + role check | Good structure | `src/middlewares/adminAuth.middleware.js` |
| `combinedAuth.middleware.js` | Tries admin then user token | Good pattern for shared routes | `src/middlewares/combinedAuth.middleware.js` |
| `validate.middleware.js` | Joi schema validation runner | Good — already exists, just underused | `src/middlewares/validate.middleware.js` |
| `rbac.middleware.js` | Module-level permission check | Good | `src/middlewares/rbac.middleware.js` |
| `appVersion.middleware.js` | Mobile app version check | References non-existent settings; mostly no-op | `src/middlewares/appVersion.middleware.js` |
| `errorLogger.middleware.js` | Auto-log errors to LogManager | Good pattern | `src/middlewares/errorLogger.middleware.js` |
| `fileUpload.middleware.js` | Multer upload handlers for various file types | Repetitive code; each handler is nearly identical | `src/middlewares/fileUpload.middleware.js` |
| `formDataParser.middleware.js` | Manual multipart parser | Fragile custom implementation; should use multer | `src/middlewares/formDataParser.middleware.js` |
| `resourceAccess.middleware.js` | Role-based route guard | Uses bitwise NOT trick (confusing) | `src/middlewares/resourceAccess.middleware.js` |
| `account.middleware.js` | Password checks, email checks, OTP verify | Mostly commented out in user.middleware.js; some used | Keep relevant parts |
| `user.middleware.js` | Entirely commented out | Dead code | Skip |
| `media.middleware.js` | Media path validation | References non-existent mediaRepository | Skip or simplify |
| `customNotifications.middleware.js` | Check notification exists | Simple, keep | Keep if needed |

### Service Files

| File | What It Does | Maps To |
|------|-------------|---------|
| `jwt.service.js` | JWT create/verify/decode | `src/utils/jwt.js` — **CRITICAL: hardcoded secret `hfhyrbhfjj123`** |
| `logger.service.js` | Winston daily rotate logger | `src/config/logger.js` |
| `socket.service.js` | Socket.IO server + event handlers | `src/services/socket.service.js` |
| `email.service.js` | Nodemailer send email | `src/services/email.service.js` |
| `ejs.service.js` | EJS template renderer | `src/services/ejs.service.js` |
| `emailTemplate.service.js` | Email template orchestrator | `src/services/emailTemplate.service.js` |
| `notification.service.js` | Push notification service | `src/services/notification.service.js` |
| `baseNotification.service.js` | Base notification class | `src/services/baseNotification.service.js` |
| `inAppNotification.service.js` | In-app notification CRUD | `src/services/inAppNotification.service.js` |
| `platformNotification.service.js` | Platform-wide notification orchestrator | `src/services/platformNotification.service.js` |
| `onboardingEmail.service.js` | Onboarding email flows | `src/services/onboardingEmail.service.js` |
| `payment.service.js` | Payment processing logic | `modules/payment/payment.service.js` |
| `paypal.service.js` | PayPal integration | `modules/payment/paypal.service.js` |
| `linkedInMarketing.service.js` | LinkedIn API integration | `modules/linkedInMarketing/linkedInMarketing.service.js` |
| `twitterMarketing.service.js` | Twitter API integration | `modules/twitterMarketing/twitterMarketing.service.js` |
| `googleCalendar.service.js` | Google Calendar/Meet API | `modules/googleMeet/googleCalendar.service.js` |
| `logManager.service.js` | Log management business logic | `modules/logManager/logManager.service.js` |
| `scheduleJob.service.js` | Cron job handlers | `src/services/scheduleJob.service.js` |
| `aiApiProxy.service.js` | AI API proxy | `modules/aiDraft/aiApiProxy.service.js` |

### Utility & Helper Files

| File | What It Does | Issues | Maps To |
|------|-------------|--------|---------|
| `src/utils/index.js` | HTTP status, hashing, dates, OTP, messages, Turnstile | God utility file; mixes unrelated concerns | `src/utils/` (split) |
| `src/utils/ValidationError.js` | Custom validation error class | Good | `src/utils/ApiError.js` (merge) |
| `src/utils/privacyMask.js` | Email/phone masking for chat | Good, standalone | `src/utils/privacyMask.js` |
| `src/helper/constants.js` | File path constants | Good | `src/config/paths.js` |
| `src/helper/enums.js` | User registration enums | Good | `src/constants/enums.js` |
| `src/helper/utils.js` | Multer factory, pagination, device detection | Good utilities | `src/utils/` |
| `src/helper/rbac.js` | Permission normalization | Good | `src/utils/rbac.js` |
| `src/helper/subQuery.js` | Sequelize literal sub-queries | Good | `src/utils/subQuery.js` |
| `src/helper/linkedInPostFormatter.js` | LinkedIn post text builder | Good | `modules/linkedInMarketing/` |
| `src/helper/twitterPostFormatter.js` | Twitter post text builder | Good | `modules/twitterMarketing/` |
| `src/language/en.js` | English message strings | Good | `src/language/en.js` |
| `src/language/index.js` | Language loader | Good | `src/language/index.js` |
| `src/constants/inAppNotificationTypes.js` | Notification type definitions | Good | `src/constants/inAppNotificationTypes.js` |


---

## 2b. All API Endpoints Inventory

### Country Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/country` | countryController.createCountry | Create a country | Body: country data | `{ success, data, message }` |
| GET | `/country` | countryController.getAllCountry | Get all countries | None | `{ success, data, message }` |
| GET | `/designation` | countryController.getDesignation | Get all designations | None | `{ success, data, message }` |
| GET | `/technology` | countryController.getTechnology | Get all technologies | None | `{ success, data, message }` |

### User Auth Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/user/create-user` | userController.createNewUser | Register new user | Body: user details | `{ success, data, message }` |
| POST | `/user/check-user-exist` | userController.checkUserExist | Send OTP if user doesn't exist | Body: `{ phoneNumber/email }` | `{ success, data, message }` |
| POST | `/user/google-signup` | userController.googleSignup | Google signup | Body: google token data | `{ success, data, message }` |
| GET | `/auth/google/url` | userController.getGoogleAuthUrl | Get Google OAuth URL | None | `{ success, url }` |
| GET | `/auth/google/callback` | userController.googleOAuthCallback | Google OAuth callback | Query: `{ code }` | Redirect/HTML |
| GET | `/auth/google/url/login` | userController.getGoogleAuthUrlForLogin | Google login OAuth URL | None | `{ success, url }` |
| GET | `/auth/google/callback/login` | userController.googleOAuthCallbackForLogin | Google login callback | Query: `{ code }` | Redirect/HTML |
| GET | `/auth/linkedin/url` | userController.getLinkedInAuthUrl | LinkedIn OAuth URL | None | `{ success, url }` |
| GET | `/auth/linkedin/callback` | userController.linkedInOAuthCallback | LinkedIn OAuth callback | Query: `{ code }` | Redirect/HTML |
| GET | `/auth/linkedin/url/login` | userController.getLinkedInAuthUrlForLogin | LinkedIn login OAuth URL | None | `{ success, url }` |
| GET | `/auth/linkedin/callback/login` | userController.linkedInOAuthCallbackForLogin | LinkedIn login callback | Query: `{ code }` | Redirect/HTML |
| GET | `/auth/facebook/url` | userController.getFacebookAuthUrl | Facebook OAuth URL | None | `{ success, url }` |
| GET | `/auth/facebook/callback` | userController.facebookOAuthCallback | Facebook OAuth callback | Query: `{ code }` | Redirect/HTML |
| POST | `/auth/resendotp` | userController.resendOtp | Resend OTP | Body: `{ phoneNumber }` | `{ success, data, message }` |
| PUT | `/user/otp-verify` | userController.verifyUserOtp | Verify OTP | Body: `{ otp, phoneNumber }` | `{ success, data, message }` |
| POST | `/login` | userController.login | User login | Body: `{ email, password }` | `{ success, data, message }` |
| POST | `/auth/forgot-password` | userController.requestPasswordReset | Request password reset | Body: `{ email }` | `{ success, data, message }` |
| GET | `/auth/reset-token/:token/validate` | userController.validatePasswordResetToken | Validate reset token | Params: `token` | `{ success, data, message }` |
| POST | `/auth/set-new-password` | userController.setNewPasswordByToken | Set new password | Body: `{ token, password }` | `{ success, data, message }` |
| POST | `/auth/reset-password` | userController.resetPasswordByToken | Reset password by token | Body: `{ token, password }` | `{ success, data, message }` |

### User Profile Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| PUT | `/user/registration` | userController.userRegistration | Complete user registration | Body: registration data | `{ success, data, message }` |
| PUT | `/public/user/registration/:token/update` | userController.userRegistrationByToken | Update registration by token (no auth) | Params: `token`, Body: data | `{ success, data, message }` |
| PUT | `/user/update-details` | userController.updateUser | Update user details | Body: user data | `{ success, data, message }` |
| PUT | `/admin/update-details` | userController.adminUpdateUser | Admin update user (no auth) | Body: user data | `{ success, data, message }` |
| POST | `/user/details` | userController.addOrUpdateReadyMadeApp | Add/update ready-made app | Body: app data | `{ success, data, message }` |
| GET | `/user/details` | userController.getUserDetail | Get user details | None | `{ success, data, message }` |
| GET | `/public/profile/:token/info` | userController.getUserDetailByToken | Get profile by token (no auth) | Params: `token` | `{ success, data, message }` |
| PATCH | `/user/readymad/publish` | userController.publishReadyMadeApp | Publish ready-made app | Body: publish data | `{ success, data, message }` |
| PATCH | `/user/profile-publish` | userController.publishUserProfile | Publish user profile | Body: publish data | `{ success, data, message }` |
| POST | `/user/details/thumbnail` | userController.userThumbnail | Upload thumbnail | Files + Body | `{ success, data, message }` |
| POST | `/user/profile-image` | userController.updateProfileImage | Upload profile image | File: `profile_image` | `{ success, data, message }` |
| POST | `/user/profile-image/:token/upload` | userController.updateProfileImageByToken | Upload profile image by token (no auth) | File: `profile_image` | `{ success, data, message }` |
| POST | `/user/details/video` | userController.userVideo | Upload video | Files | `{ success, data, message }` |
| PUT | `/user/details/thumbnail/:id` | userController.updateThumbnail | Update thumbnail | Params: `id`, Body | `{ success, data, message }` |
| PUT | `/user/details/internal-data/:id` | userController.updateInternalData | Update internal data | Params: `id`, Body | `{ success, data, message }` |
| POST | `/user/details/internal-pages` | userController.userIntenalData | Upload internal pages | Files + Body | `{ success, data, message }` |
| POST | `/user/details/internal-pages-image-remove` | userController.deleteInternalImage | Delete internal image | Body: image data | `{ success, data, message }` |
| POST | `/user/details/education` | userController.userEducation | Add education | Body: education data | `{ success, data, message }` |
| GET | `/user/details/education` | userController.getEducation | Get education | None | `{ success, data, message }` |
| POST | `/user/details/certificate` | userController.userCertificate | Add certificate | Body: cert data | `{ success, data, message }` |
| GET | `/user/details/certificate` | userController.getCertificate | Get certificates | None | `{ success, data, message }` |
| DELETE | `/user/details/certificate` | userController.deleteUserCertificate | Delete certificate | Body: `{ id }` | `{ success, data, message }` |
| POST | `/user/details/professional-detail` | userController.userProfessionalDetail | Add professional detail | Body: detail data | `{ success, data, message }` |
| GET | `/user/details/professional-detail` | userController.getProfessionalDetail | Get professional details | None | `{ success, data, message }` |
| PUT | `/user/professional-detail/:id` | userController.updateProfessionalDetail | Update professional detail | Params: `id`, Body | `{ success, data, message }` |
| POST | `/user/details/project` | userController.addUserProject | Add user project | FormData | `{ success, data, message }` |
| GET | `/user/details/project` | userController.getUserProject | Get user projects | None | `{ success, data, message }` |
| DELETE | `/user/details/project` | userController.deleteUserProject | Delete user project | Body: `{ id }` | `{ success, data, message }` |
| PUT | `/user/project/:id` | userController.updateUserProject | Update user project | Params: `id`, Body | `{ success, data, message }` |
| GET | `/user/details/application` | userController.userApplication | Get user applications | None | `{ success, data, message }` |
| GET | `/user/details/application/:id` | userController.userApplicationDetail | Get application detail | Params: `id` | `{ success, data, message }` |

### Category & Industry Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| GET | `/category` | userController.getAllCategory | Get all categories (public) | None | `{ success, data, message }` |
| GET | `/user/category` | userController.getAllCategory | Get all categories (auth) | None | `{ success, data, message }` |
| GET | `/sub-category` | userController.getAllSubCategory | Get all sub-categories | None | `{ success, data, message }` |
| GET | `/user/sub-category/:id` | userController.getAllSubCategory | Get sub-categories by category | Params: `id` | `{ success, data, message }` |
| GET | `/professional-detail` | userController.getAllProfessionalDetail | Get all professional details (public) | None | `{ success, data, message }` |
| GET | `/industry` | industryController.getIndustry | Get industries | None | `{ success, data, message }` |
| POST | `/industry` | industryController.createIndustry | Create industry (auth) | Body: industry data | `{ success, data, message }` |
| GET | `/customerIndustry` | industryController.getCustomerIndustries | Get customer industries (auth) | None | `{ success, data, message }` |

### Client Project Routes (prefix: `/api`, auth required unless noted)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/client-project` | userController.createClientProject | Create client project | Body: project data | `{ success, data, message }` |
| GET | `/client-project` | userController.getUserClientProject | Get user's client projects | None | `{ success, data, message }` |
| GET | `/client-project/:id/details` | userController.getUserClientprojectDetailsbyId | Get project details (no auth) | Params: `id` | `{ success, data, message }` |
| PUT | `/client-project/:id/details` | userController.updateUserClientprojectDetailsbyId | Update project details | Params: `id`, Body | `{ success, data, message }` |
| PUT | `/client-project/:id/status` | userController.updateUserClientprojectStatusbyId | Update project status | Params: `id`, Body | `{ success, data, message }` |
| GET | `/client-project/:id` | userController.getUserClientProjectDetail | Get client project detail | Params: `id` | `{ success, data, message }` |
| GET | `/client-projects` | userController.getClientProjectsListing | List client projects (optional auth) | Query: filters | `{ success, data, message }` |
| PATCH | `/user/client-project/publish` | userController.updatePublishClientProject | Publish client project (no auth) | Body: publish data | `{ success, data, message }` |

### Bid & SOW Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/freelancer/bids` | userController.createProjectBid | Create project bid | Files + Body | `{ success, data, message }` |
| PUT | `/bids/:id/update` | userController.updateProjectBid | Update project bid | Params: `id`, Body | `{ success, data, message }` |
| GET | `/freelancer/bids` | userController.getUserBid | Get freelancer bids | Query: `page, limit` | `{ success, data, message }` |
| GET | `/freelancer/bids/:id` | userController.getUserBidDetail | Get bid detail | Params: `id` | `{ success, data, message }` |
| GET | `/bid/:id` | userController.getUserDetailData | Get user detail data for bid | Params: `id` | `{ success, data, message }` |
| GET | `/client/my-project` | userController.getClientBid | Get client projects with bids | Query: `page, limit, project_id, type` | `{ success, data, message }` |
| PATCH | `/candidate-profile/:id/status` | userController.updateCandidateProfileStatus | Update candidate profile status | Params: `id`, Body | `{ success, data, message }` |
| POST | `/sow` | userController.createSow | Create SOW | Body: SOW data | `{ success, data, message }` |
| PUT | `/sow/:id/update` | userController.UpdateSow | Update SOW | Params: `id`, Body | `{ success, data, message }` |
| GET | `/sow/:id` | userController.getSowDetail | Get SOW detail | Params: `id` | `{ success, data, message }` |
| GET | `/sow` | userController.getAllSow | Get all SOWs | None | `{ success, data, message }` |
| GET | `/user/sow` | userController.getAllUserSow | Get user's SOWs | None | `{ success, data, message }` |
| DELETE | `/sow/:id` | userController.deleteSow | Delete SOW | Params: `id` | `{ success, data, message }` |
| GET | `/saved-project` | userController.getSavedProject | Get saved projects | None | `{ success, data, message }` |
| POST | `/saved-project` | userController.savedProject | Save/unsave project | Body: project data | `{ success, data, message }` |
| GET | `/project-details-count` | userController.getProjectDetailsCount | Get project details count | None | `{ success, data, message }` |

### Notification Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| GET | `/user/in-app-notifications/unread-count` | userController.getMyInAppNotificationsUnreadCount | Get unread notification count | None | `{ success, data, message }` |
| GET | `/user/in-app-notifications` | userController.getMyInAppNotifications | Get in-app notifications | Query: pagination | `{ success, data, message }` |
| PATCH | `/user/in-app-notifications/read-all` | userController.markAllMyInAppNotificationsAsSeen | Mark all as read | None | `{ success, data, message }` |
| PATCH | `/user/in-app-notifications/:id/read` | userController.markMyInAppNotificationAsSeen | Mark one as read | Params: `id` | `{ success, data, message }` |

### Billing & Payment Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/add-billing-details` | userController.addBillingDetails | Add billing details | Body: billing data | `{ success, data, message }` |
| POST | `/add-gst-details` | userController.addGstDetails | Add GST details | Files + Body | `{ success, data, message }` |
| PUT | `/update-billing-details` | userController.updateBillingDetails | Update billing details | Body: billing data | `{ success, data, message }` |
| PUT | `/bid/:bidId/gst-details` | userController.updateGstDetails | Update GST details for bid | Params: `bidId`, Files + Body | `{ success, data, message }` |
| GET | `/billing-information` | userController.getBillingInformation | Get billing information | None | `{ success, data, message }` |
| GET | `/client-county-city-state` | userController.getClientCountyCityState | Get client location data | None | `{ success, data, message }` |
| POST | `/create-payment` | userController.createPayment | Create payment | Body: payment data | `{ success, data, message }` |
| PUT | `/change-payment-status` | userController.changePaymentStatus | Change payment status | Body: status data | `{ success, data, message }` |
| GET | `/freelancer/payment-dashboard` | userController.getFreelancerPaymentDashboard | Get payment dashboard | None | `{ success, data, message }` |
| GET | `/freelancer/payment-list` | userController.getFreelancerPaymentList | Get payment list | Query: pagination | `{ success, data, message }` |

### Delivery & Milestone Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| GET | `/freelancer/delivery-project` | userController.getFreelancerDeliveryProject | Get freelancer delivery projects | None | `{ success, data, message }` |
| GET | `/client/delivery-project` | userController.getClientDeliveryProject | Get client delivery projects | None | `{ success, data, message }` |
| PUT | `/freelancer/milestone/:id/send-to-client` | userController.sendMilestoneToClient | Send milestone to client | Params: `id`, Body | `{ success, data, message }` |
| PUT | `/client/milestone/:id/send-to-freelancer` | userController.sendMilestoneToFreelancer | Send milestone to freelancer | Params: `id`, Body | `{ success, data, message }` |

### Feedback, Dispute & Support Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/client/feedback` | userController.createFeedback | Create feedback | Body: feedback data | `{ success, data, message }` |
| GET | `/freelancer/feedback` | userController.getFreelancerFeedback | Get freelancer feedback | None | `{ success, data, message }` |
| POST | `/dispute` | userController.createDispute | Create dispute | Body: dispute data | `{ success, data, message }` |
| POST | `/ongoing-projects` | userController.getOngoingProjects | Get ongoing projects | Body: filter data | `{ success, data, message }` |
| POST | `/disputes` | userController.getDisputes | Get disputes | Body: filter data | `{ success, data, message }` |
| POST | `/report-problem` | userController.createReportProblem | Report a problem | Body: problem data | `{ success, data, message }` |

### Sales Referral Routes (prefix: `/api`, auth required)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/sales-referral-lead` | userController.createSalesReferralLead | Create sales referral lead | Body: lead data | `{ success, data, message }` |
| GET | `/sales-referral-leads` | userController.getSalesReferralLeads | Get sales referral leads | None | `{ success, data, message }` |
| GET | `/sales-referral-leads/:id` | userController.getSalesReferralLeadDetail | Get lead detail | Params: `id` | `{ success, data, message }` |

### Public Routes (prefix: `/api`, no auth)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/page-wise-engagement` | userController.pageWiseEngagement | Track page engagement | Body: engagement data | `{ success, data, message }` |
| POST | `/contact-us` | contactController.createContact | Create contact inquiry | Body: contact data | `{ success, data, message }` |
| GET | `/website-data/service/:serviceName/:ipAddress` | userController.getWebsiteDataByServiceName | Get website data by service | Params: `serviceName, ipAddress` | `{ success, data, message }` |
| GET | `/website-data/category/:categoryName` | userController.getWebsiteDataByCategory | Get website data by category | Params: `categoryName` | `{ success, data, message }` |
| POST | `/data-by-industry` | userController.getDataByIndustry | Get data by industry | Body: industry filter | `{ success, data, message }` |
| POST | `/verify-turnstile` | userController.verifyTurnstileToken | Verify Cloudflare Turnstile | Body: `{ token }` | `{ success, data, message }` |
| POST | `/user-function` | userController.createUserFunction | Create user function | Body: function data | `{ success, data, message }` |
| GET | `/blog/:blog_slug` | userController.getBlogBySlug | Get blog by slug | Params: `blog_slug` | `{ success, data, message }` |
| GET | `/testimonials` | userController.getAllTestimonials | Get all testimonials | None | `{ success, data, message }` |

### Payment Gateway Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/order` | paymentController.createRazorpayOrder | Create Razorpay order (auth) | Body: order data | `{ success, data, message }` |
| GET | `/order` | paymentController.getRazorpayOrderDetails | Get order details (no auth) | Query: order params | `{ success, data, message }` |
| POST | `/order-status` | paymentController.updatePaymentStatus | Update payment status (no auth) | Body: status data | `{ success, data, message }` |
| GET | `/user-order` | paymentController.getAllTransaction | Get all transactions (auth) | None | `{ success, data, message }` |
| GET | `/transaction-status` | paymentController.getTransactionStatus | Get transaction status (auth) | Query: params | `{ success, data, message }` |
| POST | `/paypal/webhook` | paymentController.paypalWebhook | PayPal webhook (no auth) | Body: webhook payload | `{ success, data, message }` |

### Chat Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/admin/chat/rooms` | chatController.createChatRoom | Create chat room (admin) | Body: room data | `{ success, data, message }` |
| GET | `/admin/chat/rooms` | chatController.getAdminChatRooms | Get admin chat rooms | Query: pagination | `{ success, data, message }` |
| GET | `/admin/chat/rooms/:roomId/messages` | chatController.getAdminChatRoomMessages | Get room messages (admin) | Params: `roomId` | `{ success, data, message }` |
| PATCH | `/admin/chat-room/:chatRoomId/status` | chatController.updateChatRoomStatusByAdmin | Update room status (admin) | Params: `chatRoomId`, Body | `{ success, data, message }` |
| GET | `/user/chat/rooms` | chatController.getUserChatRooms | Get user chat rooms | Query: pagination | `{ success, data, message }` |
| GET | `/user/chat/rooms/:roomId/messages` | chatController.getUserChatRoomMessages | Get room messages (user) | Params: `roomId` | `{ success, data, message }` |
| POST | `/user/chat/individual` | chatController.createIndividualChatRoom | Create individual chat | Body: `{ other_user_id }` | `{ success, data, message }` |
| POST | `/chat/rooms/:roomId/messages` | chatController.sendMessage | Send message (combined auth) | Params: `roomId`, Body | `{ success, data, message }` |
| DELETE | `/chat/messages/:messageId` | chatController.deleteMessage | Delete message (combined auth) | Params: `messageId` | `{ success, data, message }` |
| GET | `/chat/rooms/:roomId` | chatController.getChatRoomDetails | Get room details (combined auth) | Params: `roomId` | `{ success, data, message }` |
| POST | `/chat/rooms/:roomId/read` | chatController.markMessagesAsRead | Mark messages read (combined auth) | Params: `roomId` | `{ success, data, message }` |
| POST | `/chat/rooms/:roomId/meetings/google` | chatController.createGoogleMeetMeeting | Create Google Meet (combined auth) | Params: `roomId`, Body | `{ success, data, message }` |

### Admin Auth Routes (prefix: `/api`)

| Method | Route | Controller Function | What it does | Request Body/Params | Response Structure |
|--------|-------|-------------------|-------------|--------------------|--------------------|
| POST | `/admin/auth/login` | adminAuthController.adminLogin | Admin login | Body: `{ email, password }` | `{ success, data, message }` |
| GET | `/admin/auth/profile` | adminAuthController.getAdminProfile | Get admin profile (admin auth) | None | `{ success, data, message }` |
| POST | `/admin/auth/change-password` | adminAuthController.changePassword | Change admin password (admin auth) | Body: `{ currentPassword, newPassword }` | `{ success, data, message }` |
| POST | `/admin/auth/create` | adminAuthController.createAdmin | Create admin (admin auth) | Body: admin data | `{ success, data, message }` |
| GET | `/admin/auth/admins` | adminAuthController.getAllAdmins | Get all admins (admin auth) | None | `{ success, data, message }` |
| GET | `/admin/auth/admins/:adminId` | adminAuthController.getAdminById | Get admin by ID (admin auth) | Params: `adminId` | `{ success, data, message }` |
| PUT | `/admin/auth/admins/:adminId` | adminAuthController.updateAdmin | Update admin (admin auth) | Params: `adminId`, Body | `{ success, data, message }` |
| DELETE | `/admin/auth/admins/:adminId` | adminAuthController.deleteAdmin | Delete admin (admin auth) | Params: `adminId` | `{ success, data, message }` |

### Admin Management Routes (prefix: `/api`) — Too many to list individually (~100+ routes)

The admin routes cover: user management, freelancer management, client management, project management, project bids, billing, blogs, website data, categories, sub-categories, technologies, email campaigns, LinkedIn marketing, Twitter marketing, Google Meet, web rotation data, testimonials, disputes, log management, referral partners, sales referral leads, profile reminders, and more.

All admin routes follow the same response pattern: `{ success: true/false, data: result|null, message: string }`

Some admin routes use a different format: `{ status: 200|404, message: string, data: result }` — these inconsistencies will be normalized.


---

## 2c. All Database Models Inventory

There are 75 Sequelize models. Key models with their fields are documented below. All models use auto-loading via `fs.readdirSync` in `models/index.js` and export as CommonJS `module.exports = (sequelize, DataTypes) => {}`.

Models will be kept in their current form (Sequelize define pattern) and placed alongside their respective modules. The `models/index.js` auto-loader pattern will be preserved but updated to scan module directories.

Key models include: User, Admin, ClientProject, ProjectBid, ProjectBidMilestone, ChatRoom, ChatMessage, ChatRoomMember, ChatMeeting, Sow, SowInput, Category, SubCategory, Technology, Blog, WebsiteData, Payment, Transaction, Token, InAppNotification, and 55+ others.

All model relationships (associations) are defined via `Model.associate(db)` and will be preserved exactly as-is.

---

## 2d. Proposed New Folder Structure

```
new-backend-halogig/
├── src/
│   ├── config/
│   │   ├── db.js                          # Sequelize connection (from config/index.js database section)
│   │   ├── env.js                         # Centralized env variable loader & validator
│   │   ├── swagger.js                     # Swagger/OpenAPI config
│   │   ├── logger.js                      # Winston logger setup
│   │   └── paths.js                       # File path constants (from helper/constants.js)
│   ├── models/                            # All Sequelize models (flat, auto-loaded)
│   │   ├── index.js                       # Auto-loader (scans this directory)
│   │   ├── User.model.js
│   │   ├── Admin.model.js
│   │   ├── ... (all 75 models, same filenames)
│   ├── modules/
│   │   ├── auth/                          # User authentication (login, signup, OAuth, OTP, password reset)
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.docs.js
│   │   ├── adminAuth/                     # Admin authentication & CRUD
│   │   │   ├── adminAuth.routes.js
│   │   │   ├── adminAuth.controller.js
│   │   │   ├── adminAuth.service.js
│   │   │   ├── adminAuth.validation.js
│   │   │   └── adminAuth.docs.js
│   │   ├── user/                          # User profile, education, certificates, professional details
│   │   │   ├── user.routes.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.validation.js
│   │   │   └── user.docs.js
│   │   ├── admin/                         # Admin management (users, freelancers, clients, analytics)
│   │   │   ├── admin.routes.js
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   ├── admin.validation.js
│   │   │   └── admin.docs.js
│   │   ├── project/                       # Client projects, saved projects, project listings
│   │   │   ├── project.routes.js
│   │   │   ├── project.controller.js
│   │   │   ├── project.service.js
│   │   │   ├── project.validation.js
│   │   │   └── project.docs.js
│   │   ├── bid/                           # Project bids, milestones, delivery
│   │   │   ├── bid.routes.js
│   │   │   ├── bid.controller.js
│   │   │   ├── bid.service.js
│   │   │   ├── bid.validation.js
│   │   │   └── bid.docs.js
│   │   ├── sow/                           # Statement of Work
│   │   │   ├── sow.routes.js
│   │   │   ├── sow.controller.js
│   │   │   ├── sow.service.js
│   │   │   ├── sow.validation.js
│   │   │   └── sow.docs.js
│   │   ├── chat/                          # Chat rooms, messages, meetings
│   │   │   ├── chat.routes.js
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   ├── chat.validation.js
│   │   │   └── chat.docs.js
│   │   ├── payment/                       # Razorpay, PayPal, transactions, freelancer payments
│   │   │   ├── payment.routes.js
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.service.js
│   │   │   ├── payment.validation.js
│   │   │   └── payment.docs.js
│   │   ├── billing/                       # Billing details, GST, invoices, sale orders
│   │   │   ├── billing.routes.js
│   │   │   ├── billing.controller.js
│   │   │   ├── billing.service.js
│   │   │   ├── billing.validation.js
│   │   │   └── billing.docs.js
│   │   ├── blog/                          # Blog CRUD
│   │   │   ├── blog.routes.js
│   │   │   ├── blog.controller.js
│   │   │   ├── blog.service.js
│   │   │   ├── blog.validation.js
│   │   │   └── blog.docs.js
│   │   ├── contact/                       # Contact us
│   │   │   ├── contact.routes.js
│   │   │   ├── contact.controller.js
│   │   │   ├── contact.service.js
│   │   │   ├── contact.validation.js
│   │   │   └── contact.docs.js
│   │   ├── country/                       # Countries, designations, technologies (lookup data)
│   │   │   ├── country.routes.js
│   │   │   ├── country.controller.js
│   │   │   ├── country.service.js
│   │   │   └── country.docs.js
│   │   ├── industry/                      # Industries
│   │   │   ├── industry.routes.js
│   │   │   ├── industry.controller.js
│   │   │   ├── industry.service.js
│   │   │   └── industry.docs.js
│   │   ├── category/                      # Category, SubCategory, Technology management (admin)
│   │   │   ├── category.routes.js
│   │   │   ├── category.controller.js
│   │   │   ├── category.service.js
│   │   │   ├── category.validation.js
│   │   │   └── category.docs.js
│   │   ├── websiteData/                   # Website data CRUD, Excel import/export
│   │   │   ├── websiteData.routes.js
│   │   │   ├── websiteData.controller.js
│   │   │   ├── websiteData.service.js
│   │   │   ├── websiteData.validation.js
│   │   │   └── websiteData.docs.js
│   │   ├── webRotData/                    # Web rotation data
│   │   │   ├── webRotData.routes.js
│   │   │   ├── webRotData.controller.js
│   │   │   ├── webRotData.service.js
│   │   │   └── webRotData.docs.js
│   │   ├── linkedInMarketing/             # LinkedIn OAuth, posting
│   │   │   ├── linkedInMarketing.routes.js
│   │   │   ├── linkedInMarketing.controller.js
│   │   │   ├── linkedInMarketing.service.js
│   │   │   ├── linkedInPostFormatter.js
│   │   │   └── linkedInMarketing.docs.js
│   │   ├── twitterMarketing/              # Twitter/X token management, posting
│   │   │   ├── twitterMarketing.routes.js
│   │   │   ├── twitterMarketing.controller.js
│   │   │   ├── twitterMarketing.service.js
│   │   │   ├── twitterPostFormatter.js
│   │   │   └── twitterMarketing.docs.js
│   │   ├── googleMeet/                    # Google Meet OAuth, token management
│   │   │   ├── googleMeet.routes.js
│   │   │   ├── googleMeet.controller.js
│   │   │   ├── googleMeet.service.js
│   │   │   └── googleMeet.docs.js
│   │   ├── notification/                  # In-app notifications
│   │   │   ├── notification.routes.js
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   └── notification.docs.js
│   │   ├── feedback/                      # Feedback
│   │   │   ├── feedback.routes.js
│   │   │   ├── feedback.controller.js
│   │   │   ├── feedback.service.js
│   │   │   └── feedback.docs.js
│   │   ├── dispute/                       # Disputes
│   │   │   ├── dispute.routes.js
│   │   │   ├── dispute.controller.js
│   │   │   ├── dispute.service.js
│   │   │   └── dispute.docs.js
│   │   ├── testimonial/                   # Testimonials
│   │   │   ├── testimonial.routes.js
│   │   │   ├── testimonial.controller.js
│   │   │   ├── testimonial.service.js
│   │   │   └── testimonial.docs.js
│   │   ├── salesReferral/                 # Sales referral leads
│   │   │   ├── salesReferral.routes.js
│   │   │   ├── salesReferral.controller.js
│   │   │   ├── salesReferral.service.js
│   │   │   └── salesReferral.docs.js
│   │   ├── logManager/                    # Log management
│   │   │   ├── logManager.routes.js
│   │   │   ├── logManager.controller.js
│   │   │   ├── logManager.service.js
│   │   │   └── logManager.docs.js
│   │   ├── analytics/                     # Page analytics, IP analytics
│   │   │   ├── analytics.routes.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── analytics.service.js
│   │   │   └── analytics.docs.js
│   │   ├── emailCampaign/                 # Email campaigns, batches
│   │   │   ├── emailCampaign.routes.js
│   │   │   ├── emailCampaign.controller.js
│   │   │   ├── emailCampaign.service.js
│   │   │   └── emailCampaign.docs.js
│   │   ├── aiDraft/                       # AI draft proxy
│   │   │   ├── aiDraft.routes.js
│   │   │   ├── aiDraft.controller.js
│   │   │   ├── aiDraft.service.js
│   │   │   └── aiDraft.docs.js
│   │   └── support/                       # Report problems
│   │       ├── support.routes.js
│   │       ├── support.controller.js
│   │       ├── support.service.js
│   │       └── support.docs.js
│   ├── middlewares/
│   │   ├── auth.middleware.js             # User JWT auth
│   │   ├── adminAuth.middleware.js        # Admin JWT auth
│   │   ├── combinedAuth.middleware.js     # Combined admin/user auth
│   │   ├── error.middleware.js            # Global error handler
│   │   ├── errorLogger.middleware.js      # Error logging to DB
│   │   ├── validate.middleware.js         # Generic Joi validation runner
│   │   ├── notFound.middleware.js         # 404 handler
│   │   ├── rbac.middleware.js             # Role-based access control
│   │   ├── appVersion.middleware.js       # Mobile app version check
│   │   ├── fileUpload.middleware.js       # Multer file upload handlers
│   │   └── formDataParser.middleware.js   # Form data parser
│   ├── services/                          # Shared services (cross-module)
│   │   ├── email.service.js               # Nodemailer
│   │   ├── ejs.service.js                 # EJS template renderer
│   │   ├── emailTemplate.service.js       # Email template orchestrator
│   │   ├── socket.service.js              # Socket.IO
│   │   ├── notification.service.js        # Push notifications
│   │   ├── baseNotification.service.js    # Base notification class
│   │   ├── inAppNotification.service.js   # In-app notification service
│   │   ├── platformNotification.service.js # Platform notification orchestrator
│   │   ├── onboardingEmail.service.js     # Onboarding emails
│   │   ├── scheduleJob.service.js         # Cron job handlers
│   │   └── googleCalendar.service.js      # Google Calendar API
│   ├── utils/
│   │   ├── ApiResponse.js                 # Standardized response helper
│   │   ├── ApiError.js                    # Custom error class (replaces ValidationError)
│   │   ├── asyncHandler.js                # Async try-catch wrapper
│   │   ├── httpStatus.js                  # HTTP status helper
│   │   ├── jwt.js                         # JWT create/verify (secret from env.js)
│   │   ├── hash.js                        # Password hashing
│   │   ├── date.js                        # Date utilities (moment wrappers)
│   │   ├── otp.js                         # OTP generation
│   │   ├── message.js                     # i18n message helper
│   │   ├── pagination.js                  # Pagination helper
│   │   ├── privacyMask.js                 # Email/phone masking
│   │   ├── rbac.js                        # Permission normalization
│   │   └── subQuery.js                    # Sequelize sub-queries
│   ├── constants/
│   │   ├── enums.js                       # Application enums
│   │   └── inAppNotificationTypes.js      # Notification type definitions
│   ├── language/
│   │   ├── en.js                          # English messages
│   │   └── index.js                       # Language loader
│   ├── ejs/                               # Email templates (all .ejs files)
│   │   └── ... (all 26 .ejs templates)
│   ├── routes/
│   │   └── index.js                       # Central router that mounts all module routes
│   └── app.js                             # Express app setup (middlewares, routes, swagger, static files)
├── config/
│   ├── database.js                        # Sequelize CLI config
│   └── seeders/                           # Database seeders
├── public/                                # Static files
├── server.js                              # Entry point — only starts the server
├── .env.example
├── .eslintrc.js
├── .sequelizerc
├── package.json
└── README.md
```

### Modules Identified (30 modules)

| Module | Description |
|--------|-------------|
| `auth` | User authentication: login, signup, OAuth (Google, LinkedIn, Facebook), OTP, password reset |
| `adminAuth` | Admin authentication: login, CRUD admins, password change, RBAC |
| `user` | User profile management: details, education, certificates, professional details, thumbnails, videos |
| `admin` | Admin operations: user management, freelancer/client management, project approval |
| `project` | Client projects: CRUD, listings, saved projects, publishing |
| `bid` | Project bids: create, update, milestones, delivery tracking |
| `sow` | Statement of Work: CRUD |
| `chat` | Chat system: rooms, messages, Google Meet integration |
| `payment` | Payment gateway: Razorpay orders, PayPal webhooks, transactions |
| `billing` | Billing: details, GST, invoices, sale orders |
| `blog` | Blog: CRUD with image uploads |
| `contact` | Contact us form |
| `country` | Lookup data: countries, designations, technologies |
| `industry` | Industry management |
| `category` | Category/SubCategory/Technology management (admin CRUD) |
| `websiteData` | Website data: CRUD, Excel import/export, bulk update |
| `webRotData` | Web rotation data queries |
| `linkedInMarketing` | LinkedIn: OAuth, token management, auto-posting |
| `twitterMarketing` | Twitter/X: token management, auto-posting |
| `googleMeet` | Google Meet: OAuth, token management |
| `notification` | In-app notifications: CRUD, read status |
| `feedback` | Client-to-freelancer feedback |
| `dispute` | Dispute management |
| `testimonial` | Testimonial CRUD |
| `salesReferral` | Sales referral leads |
| `logManager` | Application log management |
| `analytics` | Page and IP analytics |
| `emailCampaign` | Email campaigns and batches |
| `aiDraft` | AI draft proxy (campaign names, follow-up) |
| `support` | Report problems |

---

## 2e. Validation Plan

Validation will use **Joi** (already a dependency in the current project). Every endpoint will have a validation schema applied via the existing `validate.middleware.js`.

### Key Validation Rules by Module

**auth module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/user/create-user` | `email`: string, email format, required; `phoneNumber`: string, 4-15 digits, required; `password`: string, min 8, required; `firstName`: string, max 255, required; `lastName`: string, max 255, required; `userRole`: string, valid enum |
| POST | `/login` | `email`: string, required; `password`: string, required |
| PUT | `/user/otp-verify` | `otp`: number, 4 digits, required; `phoneNumber`: string, required |
| POST | `/auth/forgot-password` | `email`: string, email format, required |
| POST | `/auth/set-new-password` | `token`: string, required; `password`: string, min 8, required; `confirmPassword`: string, must match password |
| POST | `/auth/resendotp` | `phoneNumber`: string, required |

**adminAuth module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/admin/auth/login` | `email`: string, email format, required; `password`: string, required |
| POST | `/admin/auth/create` | `email`: string, email format, required; `role`: string, valid enum, required; `permissions`: object, optional |
| POST | `/admin/auth/change-password` | `currentPassword`: string, required; `newPassword`: string, min 8, required |

**contact module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/contact-us` | `firstName`: string, max 255, required; `lastName`: string, max 255, required; `email`: string, email format, required; `mobile`: string, required; `companyName`: string, optional; `requirements`: string, optional |

**project module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/client-project` | `project_title`: string, required; `project_summary`: string, optional; `category_id`: number, required; `project_amount_min`: number, optional; `project_amount_max`: number, optional |

**bid module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/freelancer/bids` | `project_id`: number, required; `bid_amount`: number, required; `delivery_time`: string, optional; `cover_letter`: string, optional |

**chat module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/admin/chat/rooms` | `name`: string, required; `member_ids`: array of numbers, required |
| POST | `/chat/rooms/:roomId/messages` | `message`: string, required; `message_type`: string, optional |

**websiteData module:**
| Method | Route | Validation Rules |
|--------|-------|-----------------|
| POST | `/admin/website-data` | `serviceName`: string, required; `categoryName`: string, optional; `slugLink`: string, optional |

All other endpoints will follow similar patterns — validate required fields, enforce types, and constrain lengths. Validation will NEVER change the response structure.

---

## 2f. Swagger Documentation Plan

Every endpoint will be documented using `swagger-jsdoc` JSDoc comments in each module's `.docs.js` file. The Swagger UI will be served at `/api-docs`.

Swagger config:
- OpenAPI 3.0 spec
- Bearer token authentication
- Grouped by module tags
- Request body schemas matching validation rules
- Response schemas matching current response structures exactly

Each module's `.docs.js` file will contain JSDoc `@swagger` annotations for all its routes.

---

## 2g. Dependencies Plan

### Keep (all still needed):
All current dependencies from `package.json` will be retained since the business logic is unchanged. Key ones:
- `express`, `cors`, `helmet`, `compression`, `method-override`
- `sequelize`, `mysql2`
- `jsonwebtoken`, `bcryptjs`
- `joi`, `@joi/date`
- `swagger-jsdoc`, `swagger-ui-express` (already present)
- `multer`, `multer-s3`, `multer-s3-transform`
- `nodemailer`, `@sendgrid/mail`
- `socket.io`
- `razorpay`, `stripe`, `paytmchecksum`
- `aws-sdk`, `aws-cloudfront-sign`
- `firebase-admin`
- `google-auth-library`, `googleapis`
- `twitter-api-v2`
- `winston`, `winston-daily-rotate-file`
- `ejs`, `easyinvoice`
- `moment`, `moment-timezone`
- `axios`, `lodash`, `uuid`
- `node-schedule`
- `rate-limiter-flexible`
- `semver`, `http-status`
- `xlsx`
- `twilio`
- `verify-apple-id-token`
- `dotenv`

### Remove:
- `@babel/cli`, `@babel/core`, `@babel/node`, `@babel/preset-env`, `@babel/register` — No longer needed if using Node 18+ with native ES modules or CommonJS
- `body-parser` — Built into Express 4.16+

### Move to devDependencies:
- `nodemon` — Currently in dependencies, should be devDependencies

### Add:
- None needed — `joi` and `swagger-jsdoc`/`swagger-ui-express` are already present

### Decision: Babel vs Native
The new project will **drop Babel** and use CommonJS (`require`/`module.exports`) to match the Sequelize model pattern already in use, OR use Node 18+ with `"type": "module"` in package.json. Given that models use `module.exports` and the codebase mixes `import`/`require`, the safest approach is to **keep using Babel** initially for zero-risk migration, then optionally remove it later.

**Recommendation: Keep Babel for Phase 1** to ensure zero behavioral changes. Remove in a future phase.

---

## 2h. Migration Notes / Risks

### Critical Risks

1. **JWT Secret Hardcoded**: The current `jwt.service.js` has the secret `hfhyrbhfjj123` hardcoded. The new project MUST use the same secret (from `env.js`) to avoid invalidating all existing user sessions. This is a security issue to address later but MUST NOT change during migration.

2. **Response Format Inconsistency**: Some admin endpoints return `{ status: 200, message, data }` while most return `{ success: true, data, message }`. The new project must preserve BOTH formats exactly as-is for each endpoint.

3. **Model Auto-Loading**: The current `models/index.js` uses `fs.readdirSync` to auto-load all `.js` files in the models directory. The new structure keeps models in a flat `src/models/` directory to preserve this pattern.

4. **Sequelize Associations**: Model associations are defined in `Model.associate(db)`. These must be preserved exactly. Moving models to module directories would break the auto-loader — hence models stay in `src/models/`.

5. **Static File Serving**: The bootstrap.js serves 12+ static directories with specific CORS headers. These must be replicated exactly in `app.js`.

6. **Socket.IO**: The socket service is initialized with the HTTP server instance. The new `server.js` must pass the server to `socketService.initialize()` the same way.

7. **Cron Jobs**: `node-schedule` jobs are registered in `bootstrap.js`. These must be moved to a dedicated setup function called from `server.js`.

8. **SSL in Production**: The current code reads SSL certs from `/var/www/html/ssl/`. This must be preserved in the new `server.js`.

9. **EJS Templates**: All 26 `.ejs` email templates must be copied exactly. The `ejs.service.js` resolves paths relative to `__dirname`.

10. **File Upload Paths**: Upload destinations use `path.join(process.cwd(), '..', 'public', ...)` — these resolve to a `public/` directory OUTSIDE the project root. This must be preserved.

11. **Dead Code**: `account.controller.js` is not used in any route. `howItWorks.route.js` is empty. `user.middleware.js` is entirely commented out. `logManager.route.js` is defined but never mounted in `routes/index.js`. These will be excluded.

12. **TypeScript Model**: `generatedBill.model.ts` is a TypeScript file in a JavaScript project. It needs to be converted to `.js` or the project needs TS support.

13. **Console.log Everywhere**: The current code has `console.log` statements throughout (including logging DB credentials on startup). These should be replaced with the logger service, but this is cosmetic and won't affect behavior.

### Implementation Order

1. Project scaffolding (package.json, folder structure, server.js, app.js, config files)
2. Database connection (`src/config/db.js` + `src/config/env.js`)
3. All models copied to `src/models/` with auto-loader
4. Shared utilities (asyncHandler, ApiError, ApiResponse, jwt, hash, date, otp, message)
5. Shared middlewares (error handler, validate runner, auth, adminAuth, combinedAuth, 404)
6. Swagger setup (`src/config/swagger.js`)
7. Shared services (email, ejs, socket, notification, logger, scheduleJob)
8. Then each module one by one: model → validation → service → controller → routes → swagger docs
9. Central route index (`src/routes/index.js`)
10. Static file serving in `app.js`
11. `.env.example` and `README.md`

---

**END OF RESTRUCTURE PLAN — AWAITING REVIEW AND APPROVAL BEFORE IMPLEMENTATION**
