"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoicesTable } from "@/components/invoices-table";
import { FileText, Download, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  customerName?: string;
  issueDate: string;
  dueDate?: string;
  status: string;
  total: number;
  currency: string;
}

interface Vendor {
  id: string;
  name: string;
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vendorId: "",
    customerName: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "pending",
    subtotal: "",
    tax: "",
    currency: "EUR",
  });

  // Fetch invoices and vendors
  useEffect(() => {
    fetchInvoices();
    fetchVendors();
  }, []);

  const fetchInvoices = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/invoices`);
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/vendors`);
      const data = await response.json();
      setVendors(data || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["Invoice Number", "Vendor", "Customer", "Issue Date", "Due Date", "Status", "Total", "Currency"];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      inv.vendor,
      inv.customerName || "",
      inv.issueDate.split("T")[0],
      inv.dueDate?.split("T")[0] || "",
      inv.status,
      inv.total.toString(),
      inv.currency,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `invoices_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import from file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

        const importedInvoices = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const invoice: any = {};
          headers.forEach((header, index) => {
            invoice[header.toLowerCase().replace(/\s+/g, "")] = values[index];
          });
          return invoice;
        });

        // Here you would send to API to create invoices
        console.log("Imported invoices:", importedInvoices);
        alert(`Successfully imported ${importedInvoices.length} invoices!`);
        setIsImportOpen(false);
        fetchInvoices();
      } catch (error) {
        console.error("Import error:", error);
        alert("Failed to import invoices. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  // Create new invoice
  const handleCreateInvoice = async () => {
    if (!formData.invoiceNumber || !formData.vendorId || !formData.subtotal) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const subtotal = parseFloat(formData.subtotal);
      const tax = parseFloat(formData.tax) || subtotal * 0.19;
      const total = subtotal + tax;

      const response = await fetch(`${apiBase}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: formData.invoiceNumber,
          vendorId: formData.vendorId,
          customerName: formData.customerName,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate || null,
          status: formData.status,
          subtotal,
          tax,
          total,
          currency: formData.currency,
        }),
      });

      if (response.ok) {
        alert("Invoice created successfully!");
        setIsNewInvoiceOpen(false);
        setFormData({
          invoiceNumber: "",
          vendorId: "",
          customerName: "",
          issueDate: new Date().toISOString().split("T")[0],
          dueDate: "",
          status: "pending",
          subtotal: "",
          tax: "",
          currency: "EUR",
        });
        fetchInvoices();
      } else {
        const error = await response.json();
        alert(`Failed to create invoice: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Invoices" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Header Actions */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage all your invoices ({invoices.length} total)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={invoices.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsNewInvoiceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                All Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InvoicesTable onRefresh={fetchInvoices} />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* New Invoice Dialog */}
      <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Fill in the details to create a new invoice</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="INV-2025-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorId">Vendor *</Label>
                <select
                  id="vendorId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal (€) *</Label>
                <Input
                  id="subtotal"
                  type="number"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax (€)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  placeholder="Auto (19%)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice} disabled={loading}>
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Invoices</DialogTitle>
            <DialogDescription>
              Upload a CSV file with invoice data. The file should have columns: Invoice Number, Vendor, Customer, Issue Date, Due Date, Status, Total, Currency
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose CSV File
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

