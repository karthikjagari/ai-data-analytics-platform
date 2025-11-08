"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  issueDate: string;
  dueDate?: string;
  status: string;
  total: number;
  currency: string;
}

interface InvoicesTableProps {
  onRefresh?: () => void;
  role?: "admin" | "manager" | "user" | "all";
}

type SortField = "vendor" | "invoiceNumber" | "issueDate" | "total" | "status";
type SortOrder = "asc" | "desc";

export function InvoicesTable({ onRefresh, role = "all" }: InvoicesTableProps = {}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("issueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchInvoices = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("sortBy", sortField);
    params.append("sortOrder", sortOrder);
    if (role !== 'all') params.append("role", role);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    fetch(`${apiBase}/invoices?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch invoices:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, sortField, sortOrder, role]);

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefresh) {
      (window as any).refreshInvoices = fetchInvoices;
    }
  }, [onRefresh]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleExportCSV = () => {
    exportToCSV(invoices, 'invoices');
  };

  const handleExportExcel = () => {
    exportToExcel(invoices, 'invoices');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={invoices.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={invoices.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <ScrollArea className="h-[400px]">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort("vendor")}
                >
                  Vendor
                  {getSortIcon("vendor")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  Invoice Number
                  {getSortIcon("invoiceNumber")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort("issueDate")}
                >
                  Date
                  {getSortIcon("issueDate")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort("total")}
                >
                  Amount
                  {getSortIcon("total")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.vendor}</TableCell>
                  <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
