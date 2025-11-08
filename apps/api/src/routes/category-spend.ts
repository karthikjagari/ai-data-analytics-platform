import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const categorySpendRouter = Router();

categorySpendRouter.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    
    const lineItems = await prisma.lineItem.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
        total: true,
        invoice: {
          select: {
            issueDate: true,
          },
        },
      },
    });
    
    // Filter line items by date if role is specified
    let filteredItems = lineItems;
    if (role === 'manager' || role === 'user') {
      const cutoffDate = role === 'manager' 
        ? new Date(new Date().setMonth(new Date().getMonth() - 6))
        : new Date(new Date().setMonth(new Date().getMonth() - 3));
      filteredItems = lineItems.filter(item => 
        item.invoice && new Date(item.invoice.issueDate) >= cutoffDate
      );
    }

    const categorySpend: Record<string, number> = {};
    
    filteredItems.forEach((item) => {
      const category = item.category || 'Uncategorized';
      categorySpend[category] = (categorySpend[category] || 0) + Number(item.total);
    });

    const result = Object.entries(categorySpend).map(([name, total]) => ({
      name,
      total,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    res.status(500).json({ error: 'Failed to fetch category spend' });
  }
});

