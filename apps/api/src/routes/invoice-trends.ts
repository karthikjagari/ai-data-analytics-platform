import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const invoiceTrendsRouter = Router();

invoiceTrendsRouter.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const currentDate = new Date();
    let startDate = new Date();
    
    // Adjust date range based on role
    if (role === 'manager') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (role === 'user') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else {
      startDate.setMonth(startDate.getMonth() - 12);
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        issueDate: {
          gte: startDate,
          lte: currentDate,
        },
      },
      select: {
        issueDate: true,
        total: true,
      },
    });

    // Group by month
    const monthlyData: Record<string, { count: number; total: number }> = {};
    
    invoices.forEach((invoice) => {
      const monthKey = `${invoice.issueDate.getFullYear()}-${String(invoice.issueDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, total: 0 };
      }
      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].total += Number(invoice.total);
    });

    // Generate all 12 months
    const months: Array<{ month: string; invoiceCount: number; totalSpend: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      months.push({
        month: monthName,
        invoiceCount: monthlyData[monthKey]?.count || 0,
        totalSpend: monthlyData[monthKey]?.total || 0,
      });
    }

    res.json(months);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});

