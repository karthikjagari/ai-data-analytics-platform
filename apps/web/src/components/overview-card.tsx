import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  formatAsCurrency?: boolean;
}

// Mini line graph component for trend visualization
function MiniTrendGraph({ isPositive }: { isPositive: boolean }) {
  const points = isPositive
    ? [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
    : [75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20];
  const color = isPositive ? "#10b981" : "#ef4444";
  const maxY = 100;
  const width = 60;
  const height = 30;

  const pathData = points
    .map((y, i) => {
      const x = (i / (points.length - 1)) * width;
      const normalizedY = height - (y / maxY) * height;
      return `${i === 0 ? "M" : "L"} ${x} ${normalizedY}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OverviewCard({
  title,
  value,
  change,
  changeLabel,
  formatAsCurrency = false,
}: OverviewCardProps) {
  const isPositive = change >= 0;
  const displayValue = formatAsCurrency && typeof value === "number"
    ? formatCurrency(value)
    : value.toString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{displayValue}</div>
        <div className="flex items-center justify-between">
          <p
            className={`text-xs ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}% {changeLabel || "from last month"}
          </p>
          <MiniTrendGraph isPositive={isPositive} />
        </div>
      </CardContent>
    </Card>
  );
}

