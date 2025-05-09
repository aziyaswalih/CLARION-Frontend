

// components/ui/chart/Chart.tsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// components/ui/chart/ChartConfig.ts
export interface ChartLineConfig {
    dataKey: string;
    stroke?: string;
    showDots?: boolean;
  }
  
  export interface ChartConfig {
    xKey: string;
    lines: ChartLineConfig[];
  }


  export const ChartContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-4 bg-white shadow-md rounded-xl">{children}</div>
  );

  
  export const ChartTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-black text-white text-sm p-2 rounded">{children}</div>
  );
  
  export const ChartTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div>
          <p>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };
  
  

// import { ChartContainer } from "./ChartContainer";
// import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
// import type { ChartConfig } from "./ChartConfig";

interface ChartProps {
  data: any[];
  config: ChartConfig;
}

const Chart: React.FC<ChartProps> = ({ data, config }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip content={<ChartTooltip><ChartTooltipContent /></ChartTooltip>} />
          {config.lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke || "#8884d8"}
              strokeWidth={2}
              dot={line.showDots}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default Chart;
