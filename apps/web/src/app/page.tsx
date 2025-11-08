"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { OverviewCard } from "@/components/overview-card";
import { InvoiceTrendChart } from "@/components/charts/invoice-trend-chart";
import { VendorSpendChart } from "@/components/charts/vendor-spend-chart";
import { CategorySpendChart } from "@/components/charts/category-spend-chart";
import { CashOutflowChart } from "@/components/charts/cash-outflow-chart";
import { PaymentStatusChart } from "@/components/charts/payment-status-chart";
import { MonthlySpendChart } from "@/components/charts/monthly-spend-chart";
import { InvoicesTable } from "@/components/invoices-table";
import { RoleSelector } from "@/components/role-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalSpendYTD: number;
  totalSpendChange: number;
  totalInvoices: number;
  totalInvoicesChange: number;
  documentsThisMonth: number;
  documentsChange: number;
  averageInvoiceValue: number;
  averageInvoiceValueChange: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<"admin" | "manager" | "user" | "all">("all");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = currentRole === 'all' ? '' : `?role=${currentRole}`;
    fetch(`${apiBase}/stats${roleParam}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setLoading(false);
      });
  }, [currentRole]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header title="Dashboard" />
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Role Selector */}
          <div className="mb-4 flex justify-end">
            <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
          </div>
          
          {/* Overview Cards */}
          <div className="mb-4 sm:mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              title="Total Spend (YTD)"
              value={stats?.totalSpendYTD || 0}
              change={stats?.totalSpendChange || 0}
              formatAsCurrency
            />
            <OverviewCard
              title="Total Invoices Processed"
              value={stats?.totalInvoices || 0}
              change={stats?.totalInvoicesChange || 0}
            />
            <OverviewCard
              title="Documents Uploaded (This Month)"
              value={stats?.documentsThisMonth || 0}
              change={stats?.documentsChange || 0}
              changeLabel={
                stats && stats.documentsChange < 0
                  ? "less from last month"
                  : "more from last month"
              }
            />
            <OverviewCard
              title="Average Invoice Value"
              value={stats?.averageInvoiceValue || 0}
              change={stats?.averageInvoiceValueChange || 0}
              formatAsCurrency
            />
          </div>

          {/* Charts Row 1 */}
          <div className="mb-4 sm:mb-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Volume + Value Trend</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Invoice count and total spend over 12 months.</p>
              </CardHeader>
              <CardContent>
                <InvoiceTrendChart role={currentRole} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spend by Vendor (Top 10)</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Vendor spend with cumulative percentage distribution.</p>
              </CardHeader>
              <CardContent>
                <VendorSpendChart role={currentRole} />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="mb-4 sm:mb-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Spend by Category</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Distribution of spending across different categories.</p>
              </CardHeader>
              <CardContent>
                <CategorySpendChart role={currentRole} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cash Outflow Forecast</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Expected payment obligations grouped by due date ranges.</p>
              </CardHeader>
              <CardContent>
                <CashOutflowChart role={currentRole} />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 3 - Additional Insights */}
          <div className="mb-4 sm:mb-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status Overview</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Breakdown of invoices by payment status.</p>
              </CardHeader>
              <CardContent>
                <PaymentStatusChart role={currentRole} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Spend Trend</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Total spending per month over the last 12 months.</p>
              </CardHeader>
              <CardContent>
                <MonthlySpendChart role={currentRole} />
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Invoices by Vendor</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Top vendors by invoice count and net value.</p>
            </CardHeader>
            <CardContent>
              <InvoicesTable role={currentRole} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

