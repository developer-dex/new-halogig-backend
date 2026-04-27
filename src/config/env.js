import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Centralized environment configuration.
 * All process.env access should go through this file.
 */
const env = {
  app: {
    name: process.env.APP_NAME || 'HaloGig',
    port: parseInt(process.env.PORT, 10) || 8080,
    environment: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || '',
    adminUrl: process.env.ADMIN_URL || '',
    swaggerHost: process.env.SWAGGER_HOST || 'localhost:8080',
    cronEnv: process.env.CRON_ENV || 'development',
    mediaStorage: process.env.MEDIA_STORAGE || 'local',
    mediaUploadSizeLimit: 1024 * 1024 * 25,
    languages: ['en'],
    setBaseUrl(url) {
      this.baseUrl = url;
    },
  },

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: 'mysql',
    timezone: '+00:00',
    logging: false,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'hfhyrbhfjj123',
    expiresIn: process.env.JWT_EXPIRE_IN || '24h',
  },

  mail: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_HOST_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    fromName: process.env.SMTP_EMAIL_FROM_NAME || 'HaloGig',
    fromEmail: process.env.SMTP_EMAIL_FROM_EMAIL || '',
  },

  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
    },
  },

  winston: {
    maxSize: process.env.LOGGER_MAX_SIZE || '5m',
    maxFiles: process.env.LOGGER_MAX_FILES || '1d',
  },

  media: {
    staticMediaUrl: process.env.AWS_S3_BUCKET_URL || '',
  },

  region: {
    countryPhoneCode: process.env.COUNTRY_PHONE_CODE || '',
    currencySymbol: process.env.CURRENCY_ABBR || '',
  },

  aws: {
    bucketPrefix: process.env.AWS_BUCKET_PREFIX || '',
    bucketName: process.env.AWS_BUCKET_NAME || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3BucketUrl: process.env.AWS_S3_BUCKET_URL || '',
    region: process.env.AWS_REGION || '',
  },

  firebase: {
    domainUriPrefix: process.env.DOMAIN_URI_PREFIX || '',
    dynamicLink: process.env.DYNAMIC_LINK || '',
    androidPackageName: process.env.ANDROID_PACKAGE_NAME || '',
    androidFallbackLink: process.env.ANDROID_FALLBACK_LINK || '',
    iosBundleId: process.env.IOS_BUNDLE_ID || '',
    passwordToken: process.env.RESET_PASSWORD_TOKEN || '',
  },

  sendGrid: {
    apiKey: process.env.SEND_GRID_SKD || '',
    email: process.env.SEND_GRID_FROM_EMAIL || '',
  },

  supportEmail: process.env.SUPPORT_EMAIL || '',
  supportContactNumber: process.env.SUPPORT_CONTACT_NUMBER || '',

  stripe: {
    secretKey: process.env.SECRETKEY || '',
    publishKey: process.env.PUBLISHKEY || '',
    webHookSecret: process.env.WEBHOOK_SECRET || '',
  },

  socialMediaLogin: {
    googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS || '',
    googleClientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID || '',
    appleAudience: process.env.APPLE_AUDIENCE || '',
  },

  currencyExchange: {
    apiKey: process.env.CURRENCY_API_KEY || '',
  },

  paytm: {
    merchantKey: process.env.PAYTM_MERCHANT_KEY || '',
    mid: process.env.PAYTM_MID || '',
    callbackUrl: process.env.CALLBACK_URL || '',
    paytmHost: process.env.PAYTM_HOST || '',
    paytmWeb: process.env.PAYTMWEB || '',
  },

  razorpay: {
    apiKey: process.env.razorpayApiKey || '',
  },

  frontendUrl: {
    local: process.env.FRONTEND_BASE_URL || '',
    production: process.env.FRONTEND_BASE_URL || '',
    base: process.env.FRONTEND_BASE_URL || '',
  },

  turnstile: {
    secretKey: process.env.CF_TURNSTILE_SECRET || '',
    verifyUrl: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  },

  aiApi: {
    baseUrl: (process.env.AI_API_BASE_URL || '').replace(/\/$/, ''),
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    meetClientId: process.env.GOOGLE_MEET_CLIENT_ID || '',
    meetClientSecret: process.env.GOOGLE_MEET_CLIENT_SECRET || '',
    meetRedirectUri: process.env.GOOGLE_MEET_REDIRECT_URI || process.env.GOOGLE_MEET_REDIRECT_URL || '',
  },

  linkedin: {
    clientId: process.env.LINKEDIN_COMPANY_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_COMPANY_CLIENT_SECRET || process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.LINKEDIN_COMPANY_REDIRECT_URI || process.env.LINKEDIN_REDIRECT_URI || '',
  },

  twitter: {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
  },
};

export default env;
