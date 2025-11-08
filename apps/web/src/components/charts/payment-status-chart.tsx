"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PaymentStatusData {
  status: string;
  count: number;
  total: number;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // green, yellow, red

interface PaymentStatusChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function PaymentStatusChart({ role = "all" }: PaymentStatusChartProps) {
  const [data, setData] = useState<PaymentStatusData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `&role=${role}`;
    fetch(`${apiBase}/invoices?limit=1000${roleParam}`)
      .then((res) => res.json())
      .then((result) => {
        const invoices = result.invoices || [];
        
        // Group by status
        const statusMap = new Map<string, { count: number; total: number }>();
        
        invoices.forEach((inv: any) => {
          const status = inv.status || 'pending';
          const current = statusMap.get(status) || { count: 0, total: 0 };
          statusMap.set(status, {
            count: current.count + 1,
            total: current.total + (inv.total || 0),
          });
        });

        const statusData: PaymentStatusData[] = Array.from(statusMap.entries()).map(([status, data]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count: data.count,
          total: data.total,
        }));

        setData(statusData);
      })
      .catch((err) => console.error("Failed to fetch payment status:", err));
  }, [role]);

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, count }) => `${status}: ${count}`}
            outerRadius={80}
            innerRadius={50}
            fill="#2563eb"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.status}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{item.count} invoices</div>
              <div className="text-xs text-gray-500">{formatCurrency(item.total)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

