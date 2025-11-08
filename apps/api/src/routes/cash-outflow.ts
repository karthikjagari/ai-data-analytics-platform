import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const cashOutflowRouter = Router();

cashOutflowRouter.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Build date filter based on role
    const where: any = {
      status: {
        in: ['pending', 'overdue'],
      },
    };
    
    if (role === 'manager') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      where.issueDate = { gte: sixMonthsAgo };
    } else if (role === 'user') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      where.issueDate = { gte: threeMonthsAgo };
    }
    
    const invoices = await prisma.invoice.findMany({
      where,
      select: {
        total: true,
        dueDate: true,
      },
    });

    const ranges = {
      '0-7': { start: today, end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
      '8-30': { start: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) },
      '31-60': { start: new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000) },
      '60+': { start: new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000), end: null },
    };

    const result: Record<string, number> = {
      '0-7 days': 0,
      '8-30 days': 0,
      '31-60 days': 0,
      '60+ days': 0,
    };

    invoices.forEach((invoice) => {
      if (!invoice.dueDate) return;
      
      const dueDate = new Date(invoice.dueDate);
      const amount = Number(invoice.total);

      if (dueDate >= ranges['0-7'].start && dueDate <= ranges['0-7'].end) {
        result['0-7 days'] += amount;
      } else if (dueDate >= ranges['8-30'].start && dueDate <= ranges['8-30'].end) {
        result['8-30 days'] += amount;
      } else if (dueDate >= ranges['31-60'].start && dueDate <= ranges['31-60'].end) {
        result['31-60 days'] += amount;
      } else if (ranges['60+'].end === null || dueDate > ranges['60+'].start) {
        result['60+ days'] += amount;
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching cash outflow:', error);
    res.status(500).json({ error: 'Failed to fetch cash outflow' });
  }
});

