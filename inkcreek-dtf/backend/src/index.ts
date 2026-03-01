import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { orderRoutes } from './routes/orders';
import { adminRoutes } from './routes/admin';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
});
app.use('/api', limiter);

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.listen(config.port, () => {
  console.log(`InkCreek DTF API listening on port ${config.port}`);
});
