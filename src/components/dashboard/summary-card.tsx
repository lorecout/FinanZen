import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  percentageChange?: number;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, percentageChange, className }) => {
  const isPositive = percentageChange !== undefined && percentageChange >= 0;
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {percentageChange !== undefined && (
           <p className={cn("text-xs text-muted-foreground", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? '+' : ''}{percentageChange.toFixed(1)}% vs. mês passado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

    