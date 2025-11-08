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

interface OutflowData {
  range: string;
  amount: number;
}

interface CashOutflowChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function CashOutflowChart({ role = "all" }: CashOutflowChartProps) {
  const [data, setData] = useState<OutflowData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `?role=${role}`;
    fetch(`${apiBase}/cash-outflow${roleParam}`)
      .then((res) => res.json())
      .then((outflow) => {
        const formatted = Object.entries(outflow).map(([range, amount]) => ({
          range,
          amount: amount as number,
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Failed to fetch cash outflow:", err));
  }, [role]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="amount" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}

