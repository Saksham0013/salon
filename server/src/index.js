import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database.js';
import appointmentRoutes from './routes/appointments.js';
import contactRoutes from './routes/contact.js';
import { notFound, errorHandler } from './middleware/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = process.env.CLIENT_URL;

try {
  await connectDatabase();
} catch (error) {
  console.error('MongoDB connection failed:', error.message);

  if (isProduction) {
    process.exit(1);
  }
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  clientUrl
].filter(Boolean);

app.set('trust proxy', 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
            frameSrc: ['https://maps.google.com'],
            connectSrc: ["'self'", ...allowedOrigins]
          }
        }
      : false
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'luxe-salon-api' });
});

app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);

const clientDist = path.resolve(__dirname, '../../client/dist');
const hasClientBuild = fs.existsSync(path.join(clientDist, 'index.html'));

if (isProduction || hasClientBuild) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Luxe Salon API listening on port ${port}`);
});
