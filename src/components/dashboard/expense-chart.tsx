
"use client"

import * as React from "react"
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts"
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
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
};

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ExpenseChart({ transactions, onCategorySelect, selectedCategory }: ExpenseChartProps) {
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

    const sortedChartData = Object.entries(expenseData).map(([category, expenses]) => ({
      category,
      expenses,
      label: `R$ ${expenses.toFixed(2).replace('.', ',')}`
    })).sort((a,b) => b.expenses - a.expenses);

    const chartConfig: ChartConfig = {
      expenses: {
        label: "Despesas",
      },
    };
    sortedChartData.forEach((item, index) => {
      chartConfig[item.category] = {
        label: item.category,
        color: chartColors[index % chartColors.length],
      };
    });

    return { chartData: sortedChartData, chartConfig };
  }, [transactions]);


  if (chartData.length === 0) {
    return <CardDescription className="text-center h-full flex items-center justify-center py-8">Não há dados de despesa para exibir.</CardDescription>
  }

  const handlePieClick = (data: any) => {
      onCategorySelect(data.category);
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
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
            onClick={handlePieClick}
            activeIndex={chartData.findIndex(d => d.category === selectedCategory)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={chartConfig[entry.category]?.color}
                className="cursor-pointer"
                opacity={selectedCategory && selectedCategory !== entry.category ? 0.3 : 1}
               />
            ))}
          </Pie>
           <Legend
            content={
              <ChartLegendContent 
                className="flex-col items-start"
                nameKey="category"
              />
            }
            verticalAlign="middle"
            align="right"
            layout="vertical"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
