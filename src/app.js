import express from 'express';
import cors from 'cors';
import compression from 'compression';
import methodOverride from 'method-override';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import env from './config/env';
import appVersionMiddleware from './middlewares/appVersion.middleware';
import errorHandler from './middlewares/error.middleware';
import notFoundHandler from './middlewares/notFound.middleware';
import registerRoutes from './routes';

const app = express();

// --------------- CORS ---------------
app.use(cors({
  origin: env.app.environment === 'production'
    ? [
      process.env.FRONTEND_URL || 'https://halogig.com',
      'https://uat.admin.halogig.com',
      'http://uat.admin.halogig.com',
      'https://admin.halogig.com',
      'http://admin.halogig.com',
    ]
    : ['http://uat.halogig.com'], // allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
}));

// --------------- Trust Proxy ---------------
app.set('trust proxy', true);

// --------------- Body Parsers ---------------
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.text({ type: 'text/plain' }));

// --------------- Compression & Security ---------------
app.use(compression());
app.use(methodOverride());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));
app.use(helmet({ referrerPolicy: { policy: 'no-referrer' } }));

// --------------- Static File Serving ---------------
const staticCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
};

const parentPublic = path.join(process.cwd(), '..', 'public');

app.use('/public', express.static(path.join(__dirname, '..', 'public'), { setHeaders: staticCorsHeaders }));
app.use('/thumbnails', express.static(path.join(parentPublic, 'thumbnails'), { setHeaders: staticCorsHeaders }));
app.use('/userProfileImages', express.static(path.join(parentPublic, 'userProfileImages'), { setHeaders: staticCorsHeaders }));
app.use('/customerResume', express.static(path.join(parentPublic, 'customerResume'), { setHeaders: staticCorsHeaders }));
app.use('/gstImages', express.static(path.join(parentPublic, 'gstImages'), { setHeaders: staticCorsHeaders }));
app.use('/invoices', express.static(path.join(parentPublic, 'invoices'), { setHeaders: staticCorsHeaders }));
app.use('/saleOrders', express.static(path.join(parentPublic, 'saleOrders'), { setHeaders: staticCorsHeaders }));
app.use('/blogImages', express.static(path.join(parentPublic, 'blogImages'), { setHeaders: staticCorsHeaders }));
app.use('/emailImages', express.static(path.join(__dirname, '..', 'public', 'emailImages'), { setHeaders: staticCorsHeaders }));
app.use('/blogThumbnails', express.static(path.join(parentPublic, 'blogThumbnails'), { setHeaders: staticCorsHeaders }));
app.use('/videoThumbnailWebsiteData', express.static(path.join(parentPublic, 'videoThumbnailWebsiteData'), { setHeaders: staticCorsHeaders }));
app.use('/videoWebsiteData', express.static(path.join(parentPublic, 'videoWebsiteData'), { setHeaders: staticCorsHeaders }));
app.use('/assets', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// --------------- Swagger ---------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Base URL Detection ---------------
app.use((req, res, next) => {
  const protocol = req.secure ? 'https' : 'http';
  env.app.setBaseUrl(`${protocol}://${req.headers.host}/`);
  next();
});

// --------------- App Version Check ---------------
app.use('/api/', appVersionMiddleware);

// --------------- Routes ---------------
registerRoutes(app);

// --------------- Error Handling ---------------
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
