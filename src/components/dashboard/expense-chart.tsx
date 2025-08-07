"use client"

import * as React from "react"
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from "recharts"
import { type Transaction } from "@/types"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CardDescription } from "../ui/card";

type ExpenseChartProps = {
  transactions: Transaction[];
};

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const expenseData = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    const chartData = Object.entries(expenseData).map(([category, expenses]) => ({
      category,
      expenses,
    }));

    const chartConfig: ChartConfig = {
      expenses: {
        label: "Despesas (R$)",
      },
    };
    chartData.forEach((item, index) => {
      chartConfig[item.category] = {
        label: item.category,
        color: chartColors[index % chartColors.length],
      };
    });

    return { chartData, chartConfig };
  }, [transactions]);


  if (chartData.length === 0) {
    return <CardDescription className="text-center h-full flex items-center justify-center">Não há dados de despesa para exibir.</CardDescription>
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent
              hideLabel
              config={chartConfig}
              formatter={(value) => `R$ ${Number(value).toFixed(2).replace('.',',')}`}
            />}
          />
          <Pie
            data={chartData}
            dataKey="expenses"
            nameKey="category"
            innerRadius="60%"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartConfig[entry.category]?.color} />
            ))}
          </Pie>
           <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
