import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const paymentStatusRouter = Router();

paymentStatusRouter.get('/', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        status: true,
        total: true,
      },
    });

    const statusMap = new Map<string, { count: number; total: number }>();

    invoices.forEach((invoice) => {
      const status = invoice.status || 'pending';
      const current = statusMap.get(status) || { count: 0, total: 0 };
      statusMap.set(status, {
        count: current.count + 1,
        total: current.total + Number(invoice.total),
      });
    });

    const result = Array.from(statusMap.entries()).map(([status, data]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: data.count,
      total: Number(data.total),
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

