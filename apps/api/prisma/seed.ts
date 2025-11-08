import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

interface InvoiceData {
  invoiceNumber: string;
  vendor: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  customerName?: string;
  issueDate: string;
  dueDate?: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency?: string;
  notes?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    category?: string;
    total: number;
  }>;
  payments?: Array<{
    amount: number;
    paymentDate: string;
    method?: string;
    reference?: string;
  }>;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Read JSON file
  const dataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.warn('⚠️  Analytics_Test_Data.json not found. Creating sample data...');
    await createSampleData();
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  let invoices: InvoiceData[] = JSON.parse(rawData);

  // If we have very few invoices, generate additional sample data for better dashboard visualization
  if (invoices.length < 10) {
    console.log('📊 Generating additional sample data for better visualization...');
    const sampleInvoices = await generateSampleInvoices(invoices.length);
    invoices = [...invoices, ...sampleInvoices];
  }

  // Process invoices
  for (const invoiceData of invoices) {
    // Create or get vendor
    let vendor = await prisma.vendor.findUnique({
      where: { name: invoiceData.vendor.name },
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          name: invoiceData.vendor.name,
          email: invoiceData.vendor.email,
          phone: invoiceData.vendor.phone,
          address: invoiceData.vendor.address,
        },
      });
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: invoiceData.invoiceNumber },
    });

    if (existingInvoice) {
      console.log(`⏭️  Skipping invoice ${invoiceData.invoiceNumber} (already exists)`);
      continue;
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: invoiceData.invoiceNumber,
        vendorId: vendor.id,
        customerName: invoiceData.customerName,
        issueDate: new Date(invoiceData.issueDate),
        dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : null,
        status: invoiceData.status || 'pending',
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax || 0,
        total: invoiceData.total,
        currency: invoiceData.currency || 'EUR',
        notes: invoiceData.notes,
        lineItems: {
          create: invoiceData.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            category: item.category,
            total: item.total,
          })),
        },
        payments: {
          create: (invoiceData.payments || []).map((payment) => ({
            amount: payment.amount,
            paymentDate: new Date(payment.paymentDate),
            method: payment.method,
            reference: payment.reference,
          })),
        },
      },
    });

    console.log(`✅ Created invoice ${invoice.invoiceNumber}`);
  }

  console.log('✨ Seeding completed!');
}

async function generateSampleInvoices(startIndex: number): Promise<InvoiceData[]> {
  const vendors = [
    { name: 'AcmeCorp', email: 'contact@acmecorp.com' },
    { name: 'Test Solutions', email: 'info@testsolutions.com' },
    { name: 'PrimeVendors', email: 'hello@primevendors.com' },
    { name: 'DeltaServices', email: 'contact@deltaservices.com' },
    { name: 'OmegaLtd', email: 'info@omegaltd.com' },
    { name: 'Global Supply', email: 'sales@globalsupply.com' },
  ];

  const categories = ['Operations', 'Marketing', 'Facilities', 'IT', 'HR', 'Sales'];
  const statuses = ['pending', 'paid', 'overdue'];
  
  const sampleInvoices: InvoiceData[] = [];
  const now = new Date();
  
  // Get existing invoice numbers to avoid duplicates
  const existingInvoices = await prisma.invoice.findMany({
    select: { invoiceNumber: true },
  });
  const existingNumbers = new Set(existingInvoices.map(inv => inv.invoiceNumber));
  
  // Generate invoices for the last 12 months
  let invoiceCounter = startIndex + 1;
  for (let i = 0; i < 50; i++) {
    // Generate unique invoice number
    let invoiceNumber = `INV-2025-${String(invoiceCounter).padStart(3, '0')}`;
    while (existingNumbers.has(invoiceNumber)) {
      invoiceCounter++;
      invoiceNumber = `INV-2025-${String(invoiceCounter).padStart(3, '0')}`;
    }
    existingNumbers.add(invoiceNumber);
    invoiceCounter++;
    
    const monthOffset = Math.floor(i / 5); // Spread across months
    const issueDate = new Date(now.getFullYear(), now.getMonth() - (11 - monthOffset), Math.floor(Math.random() * 28) + 1);
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const subtotal = Math.floor(Math.random() * 10000) + 500;
    const tax = subtotal * 0.19;
    const total = subtotal + tax;
    
    sampleInvoices.push({
      invoiceNumber: invoiceNumber,
      vendor: {
        name: vendor.name,
        email: vendor.email,
      },
      customerName: `Customer ${i + 1}`,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: status,
      subtotal: subtotal,
      tax: tax,
      total: total,
      currency: 'EUR',
      lineItems: [
        {
          description: `${category} Services`,
          quantity: Math.floor(Math.random() * 5) + 1,
          unitPrice: subtotal / (Math.floor(Math.random() * 5) + 1),
          category: category,
          total: subtotal,
        },
      ],
      payments: status === 'paid' ? [
        {
          amount: total,
          paymentDate: new Date(dueDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          method: 'bank_transfer',
        },
      ] : [],
    });
  }
  
  return sampleInvoices;
}

async function createSampleData() {
  // Create sample vendor
  const vendor = await prisma.vendor.create({
    data: {
      name: 'Phunix GmbH',
      email: 'contact@phunix.de',
    },
  });

  // Create sample invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-001',
      vendorId: vendor.id,
      customerName: 'Sample Customer',
      issueDate: new Date('2025-01-15'),
      dueDate: new Date('2025-02-15'),
      status: 'pending',
      subtotal: 1000,
      tax: 190,
      total: 1190,
      currency: 'EUR',
      lineItems: {
        create: [
          {
            description: 'Sample Item 1',
            quantity: 1,
            unitPrice: 1000,
            category: 'Operations',
            total: 1000,
          },
        ],
      },
    },
  });

  console.log('✨ Sample data created!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
