"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryData {
  name: string;
  total: number;
}

// Blue, Orange, Light Orange/Peach colors matching Figma design
const COLORS = ["#2563eb", "#f97316", "#fb923c"];

interface CategorySpendChartProps {
  role?: "admin" | "manager" | "user" | "all";
}

export function CategorySpendChart({ role = "all" }: CategorySpendChartProps) {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const roleParam = role === 'all' ? '' : `?role=${role}`;
    fetch(`${apiBase}/category-spend${roleParam}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
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
            label={false}
            outerRadius={80}
            innerRadius={50}
            fill="#2563eb"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
            <span className="font-medium">{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

