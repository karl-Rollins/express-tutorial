import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from '#src/middlewares/logger.js';

dotenv.config();

const { Pool } = pg;

export const db = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the connection
db.connect()
    .then(() => logger.info('connected to postgresql database'))
    .catch((err) => logger.error('connection error', err.stack));


