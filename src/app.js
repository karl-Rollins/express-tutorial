import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';

import { ENV } from '#src/config/env.js';
import { logger, morganMiddleware } from '#src/middlewares/logger.js';
import { AppError, errorHandler } from '#src/middlewares/error-handler.js';
import healthcheckRoutes from '#src/modules/healthcheck/healthcheck.route.js';
import userRoutes from '#src/modules/user/user.route.js';
import { db } from './config/db.js';

export const createApp = () => {
  const app = express();

  app.get('/members', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM members');
      res.json(result.rows);
    } catch (error) {
      logger.error('Database query failed: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.use(helmet());
  app.use(hpp());

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.use(morganMiddleware);

  app.use('/api', healthcheckRoutes);
  app.use('/api', userRoutes);

  app.use((_req, _res, next) => {
    next(new AppError('Route not found', 404));
  });

  app.use(errorHandler);

  return app;
};
