// transaction-analyzer.ts
'use server';

/**
 * @fileOverview An AI agent that extracts transaction details from natural language text in Portuguese.
 *
 * - analyzeTransaction - A function that handles the transaction analysis process.
 * - AnalyzeTransactionInput - The input type for the analyzeTransaction function.
 * - AnalyzeTransactionOutput - The return type for the analyzeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTransactionInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The natural language text describing the transaction in Portuguese.'
    ),
});
export type AnalyzeTransactionInput = z.infer<typeof AnalyzeTransactionInputSchema>;

const AnalyzeTransactionOutputSchema = z.object({
  amount: z.number().describe('The amount of the transaction.'),
  description: z.string().describe('A description of the transaction.'),
  category: z.string().describe('The category of the transaction.'),
  isRecurring: z
    .boolean()
    .describe(
      'Whether the transaction is a one-time transaction or a recurring bill.'
    ),
});
export type AnalyzeTransactionOutput = z.infer<typeof AnalyzeTransactionOutputSchema>;

export async function analyzeTransaction(input: AnalyzeTransactionInput): Promise<AnalyzeTransactionOutput> {
  return analyzeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTransactionPrompt',
  input: {schema: AnalyzeTransactionInputSchema},
  output: {schema: AnalyzeTransactionOutputSchema},
  prompt: `Você é um especialista em finanças pessoais e sua tarefa é extrair detalhes de transações financeiras a partir de texto em português.

  Analise o texto fornecido e identifique o valor da transação, uma descrição concisa, a categoria mais adequada e determine se é uma transação única ou uma conta recorrente.

  Texto: {{{text}}}

  Responda em formato JSON seguindo o schema AnalyzeTransactionOutputSchema.
  {
    "amount": valor da transação (em números),
    "description": descrição concisa da transação,
    "category": categoria da transação,
    "isRecurring": verdadeiro se for uma conta recorrente, falso se for uma transação única
  }`,
});

const analyzeTransactionFlow = ai.defineFlow(
  {
    name: 'analyzeTransactionFlow',
    inputSchema: AnalyzeTransactionInputSchema,
    outputSchema: AnalyzeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
