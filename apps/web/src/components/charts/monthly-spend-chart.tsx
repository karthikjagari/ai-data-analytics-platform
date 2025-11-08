"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MonthlySpendData {
  month: string;
  spend: number;
  invoices: number;
}

interface MonthlySpendChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function MonthlySpendChart({ role = "all" }: MonthlySpendChartProps) {
  const [data, setData] = useState<MonthlySpendData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `?role=${role}`;
    fetch(`${apiBase}/invoice-trends${roleParam}`)
      .then((res) => res.json())
      .then((trends) => {
        const monthlyData: MonthlySpendData[] = trends.map((t: any) => ({
          month: t.month,
          spend: t.totalSpend || 0,
          invoices: t.invoiceCount || 0,
        }));
        setData(monthlyData);
      })
      .catch((err) => console.error("Failed to fetch monthly spend:", err));
  }, [role]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "spend") {
              return [formatCurrency(value), "Total Spend"];
            }
            return [value, "Invoice Count"];
          }}
        />
        <Bar dataKey="spend" fill="#2563eb" name="Total Spend" />
      </BarChart>
    </ResponsiveContainer>
  );
}

