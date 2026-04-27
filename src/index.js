import http from 'http';
import https from 'https';
import fs from 'fs';
// import schedule from 'node-schedule';
import app from './app';
import env from './config/env';
import logger from './config/logger';
import { connectDatabase } from './config/db';
// import socketService from './services/socket.service';
// import scheduleJobService from './services/scheduleJob.service';

// --------------- Uncaught Error Handlers ---------------
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`unhandledRejection: ${reason}`);
  console.error('unhandledRejection', reason, promise);
});

process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: ${err}`);
  console.error('uncaughtException', err);
  process.exit(1);
});

// --------------- Start Server ---------------
const startServer = async () => {
  // Connect to database
  await connectDatabase();

  const port = env.app.port;
  let server;

  if (env.app.environment === 'production') {
    const sslOptions = {
      key: fs.readFileSync('/var/www/html/ssl/privkey.pem'),
      cert: fs.readFileSync('/var/www/html/ssl/cert.pem'),
    };
    server = https.createServer(sslOptions, app);
  } else {
    server = http.createServer(app);
  }

  // Initialize Socket.IO (uncomment when socket service is built)
  // socketService.initialize(server);

  server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
    logger.info(`Server started on port ${port}`);
  });

  // Register cron jobs (uncomment when scheduleJob service is built)
  // schedule.scheduleJob('* */1 * * *', scheduleJobService.everyMinute);
  // schedule.scheduleJob('* */5 * * *', scheduleJobService.everyFiveMinute);
  // schedule.scheduleJob('0 0 * * *', scheduleJobService.everyDay);
  // schedule.scheduleJob('* */6 * * *', scheduleJobService.everyThreeHour);
  // schedule.scheduleJob('0 10 * * *', scheduleJobService.notifyFreelancersAt10AM.bind(scheduleJobService));
  // schedule.scheduleJob('0 14 * * *', scheduleJobService.notifyFreelancersAt2PM.bind(scheduleJobService));
  // schedule.scheduleJob('0 20 * * *', scheduleJobService.notifyFreelancersAt8PM.bind(scheduleJobService));
};

startServer();
