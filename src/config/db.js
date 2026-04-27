import Sequelize from 'sequelize';
import env from './env';
import logger from './logger';

const { database } = env;

const sequelize = new Sequelize({
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,
  dialect: database.dialect,
  timezone: database.timezone,
  logging: database.logging,
});

/**
 * Test database connection and log result.
 */
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    console.error('Database connection error:', error.message);
  }
};

export { sequelize, Sequelize, connectDatabase };
