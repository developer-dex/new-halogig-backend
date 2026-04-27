import swaggerJSDoc from 'swagger-jsdoc';
import env from './env';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HaloGig REST API',
    version: '2.0.0',
    description: 'REST API documentation for the HaloGig platform',
  },
  servers: [
    {
      url: `http://${env.app.swaggerHost}/api`,
      description: 'API Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Scan all docs.js files inside modules for @swagger annotations
  apis: [
    './src/modules/**/*.docs.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
