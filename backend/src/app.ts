import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { AppError } from './common/errors';
import ruleRoutes from './modules/rules/rule.routes';
import eventRoutes from './modules/events/event.routes';
import notificationRoutes from './modules/notifications/notification.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/rules', ruleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    const errorDetails = err as unknown as { details?: unknown[] };
    const response: Record<string, unknown> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(errorDetails.details ? { details: errorDetails.details } : {}),
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isProduction ? 'An unexpected error occurred' : err.message,
    },
  });
});

export default app;
