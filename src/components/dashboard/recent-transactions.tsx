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
];


export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Transações Recentes</CardTitle>
        <CardDescription>
          Suas atividades financeiras mais recentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{tx.description}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{tx.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(tx.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2).replace('.', ',')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}