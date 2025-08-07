import { z } from 'zod';

export const TransactionSchema = z.object({
    id: z.string(),
    amount: z.number(),
    description: z.string(),
    category: z.string(),
    date: z.string(),
    type: z.enum(['income', 'expense']),
});

export const AnalyzeTransactionOutputSchema = z.object({
  amount: z.number().describe('The amount of the transaction, always as a positive number.'),
  description: z.string().describe('A description of the transaction.'),
  category: z.string().describe('The category of the transaction.'),
  isRecurring: z
    .boolean()
    .describe(
      'Whether the transaction is a one-time transaction or a recurring bill.'
    ),
});

export const GenerateFinancialInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe("A lista de transações do usuário (receitas e despesas)."),
});

export const GenerateFinancialInsightsOutputSchema = z.string().describe("Um resumo conciso e amigável (em markdown) com insights e dicas sobre as finanças do usuário.");