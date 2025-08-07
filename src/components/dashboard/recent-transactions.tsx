
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { type Transaction } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"


type RecentTransactionsProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  selectedCategory: string | null;
  onClearFilter: () => void;
};


export default function RecentTransactions({ transactions, onDelete, selectedCategory, onClearFilter }: RecentTransactionsProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
      <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl">Transações Recentes</CardTitle>
                        <CardDescription>
                            {selectedCategory ? `Exibindo despesas da categoria "${selectedCategory}"` : "Suas atividades financeiras mais recentes."}
                        </CardDescription>
                    </div>
                    {selectedCategory && (
                        <Button variant="ghost" size="sm" onClick={onClearFilter}>
                           Limpar Filtro
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="text-right w-[80px]">Ações</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {sortedTransactions.length > 0 ? sortedTransactions.map((tx) => (
                            <TableRow key={tx.id}>
                            <TableCell>
                                <div className="font-medium">{tx.description}</div>
                                <div className="text-sm text-muted-foreground">
                                {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </TableCell>
                            <TableCell className={cn(
                                "text-right font-medium",
                                tx.type === 'income' ? 'text-emerald-600' : 'text-destructive'
                            )}>
                                <div className="whitespace-nowrap">
                                {tx.type === 'income' ? '+' : '-'} R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                                </div>
                                <div>
                                <Badge variant="outline" className="mt-1">{tx.category}</Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                                </Button>
                            </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                Nenhuma transação encontrada.
                            </TableCell>
                        </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
  )
}
