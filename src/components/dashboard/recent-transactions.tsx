import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const transactions = [
  {
    description: "Salário - Empresa X",
    amount: 5329.00,
    date: "2024-07-01",
    type: "income",
    category: "Salário"
  },
  {
    description: "Aluguel",
    amount: 1500.00,
    date: "2024-07-05",
    type: "expense",
    category: "Moradia"
  },
  {
    description: "Supermercado Pão de Açúcar",
    amount: 345.50,
    date: "2024-07-06",
    type: "expense",
    category: "Alimentação"
  },
  {
    description: "Cinema - Filme novo",
    amount: 55.00,
    date: "2024-07-07",
    type: "expense",
    category: "Lazer"
  },
  {
    description: "Gasolina Posto Shell",
    amount: 150.00,
    date: "2024-07-10",
    type: "expense",
    category: "Transporte"
  },
  {
    description: "Conta de Luz",
    amount: 120.70,
    date: "2024-07-12",
    type: "expense",
    category: "Moradia"
  },
  {
    description: "Farmácia",
    amount: 75.20,
    date: "2024-07-15",
    type: "expense",
    category: "Saúde"
  }
];


export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Transações Recentes</CardTitle>
        <CardDescription>
          Suas atividades financeiras mais recentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-muted-foreground md:hidden">
                    {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
                  </div>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  <div className="whitespace-nowrap">
                   {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="hidden md:block">
                     <Badge variant="outline" className="mt-1">{tx.category}</Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
