import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const statsRouter = Router();

statsRouter.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    
    // Build date filter based on role
    let dateFilter: any = {};
    if (role === 'manager') {
      // Manager: Last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      dateFilter.gte = sixMonthsAgo;
    } else if (role === 'user') {
      // User: Last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      dateFilter.gte = threeMonthsAgo;
    } else {
      // Admin or all: Full year
      dateFilter.gte = startOfYear;
    }
    
    // Total Spend (YTD or based on role)
    const totalSpendYTD = await prisma.invoice.aggregate({
      where: {
        issueDate: dateFilter,
      },
      _sum: {
        total: true,
      },
    });

    const totalSpendLastMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    const spendChange = totalSpendLastMonth._sum.total 
      ? ((Number(totalSpendYTD._sum.total || 0) - Number(totalSpendLastMonth._sum.total)) / Number(totalSpendLastMonth._sum.total)) * 100
      : 0;

    // Total Invoices Processed
    const totalInvoices = await prisma.invoice.count({
      where: {
        issueDate: dateFilter,
      },
    });

    const invoicesLastMonth = await prisma.invoice.count({
      where: {
        issueDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const invoiceChange = invoicesLastMonth > 0 
      ? ((totalInvoices - invoicesLastMonth) / invoicesLastMonth) * 100
      : 0;

    // Documents Uploaded (This Month)
    const currentMonth = new Date();
    const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const documentsThisMonth = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    });

    const documentsLastMonth = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const documentsChange = documentsLastMonth - documentsThisMonth;

    // Average Invoice Value
    const avgInvoiceValue = await prisma.invoice.aggregate({
      where: {
        issueDate: dateFilter,
      },
      _avg: {
        total: true,
      },
    });

    const avgInvoiceValueLastMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _avg: {
        total: true,
      },
    });

    const avgChange = avgInvoiceValueLastMonth._avg.total
      ? ((Number(avgInvoiceValue._avg.total || 0) - Number(avgInvoiceValueLastMonth._avg.total)) / Number(avgInvoiceValueLastMonth._avg.total)) * 100
      : 0;

    res.json({
      totalSpendYTD: Number(totalSpendYTD._sum.total || 0),
      totalSpendChange: spendChange,
      totalInvoices,
      totalInvoicesChange: invoiceChange,
      documentsThisMonth,
      documentsChange,
      averageInvoiceValue: Number(avgInvoiceValue._avg.total || 0),
      averageInvoiceValueChange: avgChange,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

