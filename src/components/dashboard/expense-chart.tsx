"use client"

import * as React from "react"
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Alimentação", expenses: 450.75, fill: "hsl(var(--chart-1))" },
  { category: "Transporte", expenses: 200.00, fill: "hsl(var(--chart-2))" },
  { category: "Moradia", expenses: 1250.00, fill: "hsl(var(--chart-3))" },
  { category: "Lazer", expenses: 150.25, fill: "hsl(var(--chart-4))" },
  { category: "Outros", expenses: 70.50, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  expenses: {
    label: "Despesas (R$)",
  },
  Alimentação: {
    label: "Alimentação",
    color: "hsl(var(--chart-1))",
  },
  Transporte: {
    label: "Transporte",
    color: "hsl(var(--chart-2))",
  },
  Moradia: {
    label: "Moradia",
    color: "hsl(var(--chart-3))",
  },
  Lazer: {
    label: "Lazer",
    color: "hsl(var(--chart-4))",
  },
  Outros: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function ExpenseChart() {
  const totalExpenses = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.expenses, 0)
  }, [])

  return (
    <div className="mx-auto aspect-square max-h-[250px] h-[250px] w-[250px]">
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
               <Cell key="cell-0" fill={chartConfig.Alimentação.color} />
               <Cell key="cell-1" fill={chartConfig.Transporte.color} />
               <Cell key="cell-2" fill={chartConfig.Moradia.color} />
               <Cell key="cell-3" fill={chartConfig.Lazer.color} />
               <Cell key="cell-4" fill={chartConfig.Outros.color} />
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ResponsiveContainer>
    </div>
  )
}
