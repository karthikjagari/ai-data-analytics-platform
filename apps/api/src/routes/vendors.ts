import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const vendorsRouter = Router();

// GET /api/vendors - Get all vendors
vendorsRouter.get('/', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

vendorsRouter.get('/top10', async (req, res) => {
  try {
    const { role } = req.query;
    
    // Build date filter based on role
    let invoiceFilter: any = {};
    if (role === 'manager') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      invoiceFilter.issueDate = { gte: sixMonthsAgo };
    } else if (role === 'user') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      invoiceFilter.issueDate = { gte: threeMonthsAgo };
    }
    
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          where: invoiceFilter,
          select: {
            total: true,
          },
        },
      },
    });

    const vendorSpend = vendors.map((vendor) => {
      const totalSpend = vendor.invoices.reduce(
        (sum, invoice) => sum + Number(invoice.total),
        0
      );
      return {
        id: vendor.id,
        name: vendor.name,
        totalSpend,
        invoiceCount: vendor.invoices.length,
      };
    });

    // Sort by total spend and take top 10
    const top10 = vendorSpend
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    // Calculate cumulative percentage
    const totalSpend = top10.reduce((sum, v) => sum + v.totalSpend, 0);
    const top10WithPercentage = top10.map((vendor, index) => {
      const cumulative = top10.slice(0, index + 1).reduce((sum, v) => sum + v.totalSpend, 0);
      return {
        ...vendor,
        percentage: (vendor.totalSpend / totalSpend) * 100,
        cumulativePercentage: (cumulative / totalSpend) * 100,
      };
    });

    res.json(top10WithPercentage);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Failed to fetch top vendors' });
  }
});

