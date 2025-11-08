import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { statsRouter } from './routes/stats';
import { invoiceTrendsRouter } from './routes/invoice-trends';
import { vendorsRouter } from './routes/vendors';
import { categorySpendRouter } from './routes/category-spend';
import { cashOutflowRouter } from './routes/cash-outflow';
import { invoicesRouter } from './routes/invoices';
import { paymentStatusRouter } from './routes/payment-status';
import { chatWithDataRouter } from './routes/chat-with-data';
import { chatHistoryRouter } from './routes/chat-history';
import { filesRouter } from './routes/files';
import { departmentsRouter } from './routes/departments';
import { usersRouter } from './routes/users';
import { settingsRouter } from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/stats', statsRouter);
app.use('/api/invoice-trends', invoiceTrendsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/category-spend', categorySpendRouter);
app.use('/api/cash-outflow', cashOutflowRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/payment-status', paymentStatusRouter);
app.use('/api/chat-with-data', chatWithDataRouter);
app.use('/api/chat-history', chatHistoryRouter);
app.use('/api/files', filesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});

