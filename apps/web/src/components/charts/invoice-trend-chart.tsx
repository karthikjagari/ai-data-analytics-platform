"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface TrendData {
  month: string;
  invoiceCount: number;
  totalSpend: number;
}

interface InvoiceTrendChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function InvoiceTrendChart({ role = "all" }: InvoiceTrendChartProps) {
  const [data, setData] = useState<TrendData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `?role=${role}`;
    fetch(`${apiBase}/invoice-trends${roleParam}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch trends:", err));
  }, [role]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "Total Spend") {
              return formatCurrency(value);
            }
            return value;
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="invoiceCount"
          stroke="#2563eb"
          name="Invoice Count"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="totalSpend"
          stroke="#94a3b8"
          name="Total Spend"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

