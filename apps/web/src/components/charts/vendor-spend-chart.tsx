"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface VendorData {
  name: string;
  totalSpend: number;
  percentage: number;
  cumulativePercentage: number;
}

interface VendorSpendChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function VendorSpendChart({ role = "all" }: VendorSpendChartProps) {
  const [data, setData] = useState<VendorData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `?role=${role}`;
    fetch(`${apiBase}/vendors/top10${roleParam}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch vendors:", err));
  }, [role]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
        <YAxis dataKey="name" type="category" width={80} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="totalSpend" fill="#2563eb" name="Vendor Spend" />
      </BarChart>
    </ResponsiveContainer>
  );
}

