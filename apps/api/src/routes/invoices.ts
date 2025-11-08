import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const invoicesRouter = Router();

invoicesRouter.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '50',
      search = '',
      status,
      vendorId,
      role,
      sortBy = 'issueDate',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Add role-based date filtering
    if (role === 'manager') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      where.issueDate = { gte: sixMonthsAgo };
    } else if (role === 'user') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      where.issueDate = { gte: threeMonthsAgo };
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { vendor: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.invoice.count({ where }),
    ]);

    const result = invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendor: invoice.vendor.name,
      vendorId: invoice.vendor.id,
      customerName: invoice.customerName,
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate?.toISOString(),
      status: invoice.status,
      total: Number(invoice.total),
      currency: invoice.currency,
    }));

    res.json({
      invoices: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/:id - Get single invoice with line items and payments
invoicesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        lineItems: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        payments: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendor: {
        id: invoice.vendor.id,
        name: invoice.vendor.name,
        email: invoice.vendor.email,
        phone: invoice.vendor.phone,
        address: invoice.vendor.address,
      },
      customerName: invoice.customerName,
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate?.toISOString(),
      status: invoice.status,
      subtotal: Number(invoice.subtotal),
      tax: Number(invoice.tax),
      total: Number(invoice.total),
      currency: invoice.currency,
      notes: invoice.notes,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      lineItems: invoice.lineItems.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        category: item.category,
        total: Number(item.total),
        createdAt: item.createdAt.toISOString(),
      })),
      payments: invoice.payments.map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        paymentDate: payment.paymentDate.toISOString(),
        method: payment.method,
        reference: payment.reference,
        createdAt: payment.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

invoicesRouter.post('/', async (req, res) => {
  try {
    const {
      invoiceNumber,
      vendorId,
      customerName,
      issueDate,
      dueDate,
      status = 'pending',
      subtotal,
      tax = 0,
      total,
      currency = 'EUR',
    } = req.body;

    if (!invoiceNumber || !vendorId || subtotal === undefined) {
      return res.status(400).json({ error: 'Missing required fields: invoiceNumber, vendorId, subtotal' });
    }

    // Calculate total if not provided
    const calculatedTotal = total || (parseFloat(subtotal) + parseFloat(tax || 0));

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        vendorId,
        customerName: customerName || null,
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax || 0),
        total: calculatedTotal,
        currency,
        lineItems: {
          create: [{
            description: 'Invoice Item',
            quantity: 1,
            unitPrice: parseFloat(subtotal),
            total: parseFloat(subtotal),
          }],
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendor: invoice.vendor.name,
      vendorId: invoice.vendor.id,
      customerName: invoice.customerName,
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate?.toISOString(),
      status: invoice.status,
      total: Number(invoice.total),
      currency: invoice.currency,
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Invoice number already exists' });
    }
    res.status(500).json({ error: 'Failed to create invoice', details: error.message });
  }
});

