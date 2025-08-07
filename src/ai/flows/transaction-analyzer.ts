// transaction-analyzer.ts
'use server';

/**
 * @fileOverview An AI agent that extracts transaction details from natural language text in Portuguese.
 *
 * - analyzeTransaction - A function that handles the transaction analysis process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeTransactionOutputSchema } from '@/types/schemas';

const AnalyzeTransactionInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The natural language text describing the transaction in Portuguese.'
    ),
});
export type AnalyzeTransactionInput = z.infer<typeof AnalyzeTransactionInputSchema>;
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

  O valor da transação ('amount') deve ser sempre um número positivo, mesmo que seja uma despesa.

  Texto: {{{text}}}

  Responda em formato JSON seguindo o schema AnalyzeTransactionOutputSchema.
  {
    "amount": valor da transação (sempre como um número positivo),
    "description": "descrição concisa da transação",
    "category": "categoria da transação",
    "isRecurring": true se for uma conta recorrente, false se for uma transação única
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
