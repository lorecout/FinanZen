"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Alimentação", expenses: 450.75, fill: "var(--color-alimentacao)" },
  { category: "Transporte", expenses: 200.00, fill: "var(--color-transporte)" },
  { category: "Moradia", expenses: 1250.00, fill: "var(--color-moradia)" },
  { category: "Lazer", expenses: 150.25, fill: "var(--color-lazer)" },
  { category: "Outros", expenses: 70.50, fill: "var(--color-outros)" },
]

const chartConfig = {
  expenses: {
    label: "Despesas",
  },
  alimentacao: {
    label: "Alimentação",
    color: "hsl(var(--chart-1))",
  },
  transporte: {
    label: "Transporte",
    color: "hsl(var(--chart-2))",
  },
  moradia: {
    label: "Moradia",
    color: "hsl(var(--chart-3))",
  },
  lazer: {
    label: "Lazer",
    color: "hsl(var(--chart-4))",
  },
  outros: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function ExpenseChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="expenses"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.category}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
