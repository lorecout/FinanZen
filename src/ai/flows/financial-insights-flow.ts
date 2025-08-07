'use server';

/**
 * @fileOverview An AI agent that analyzes a user's transactions and provides financial insights.
 *
 * - generateFinancialInsights - A function that handles the financial insights generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { TransactionSchema } from '@/types/schemas';
import { GenerateFinancialInsightsInputSchema, GenerateFinancialInsightsOutputSchema } from '@/types/schemas';

export type GenerateFinancialInsightsInput = z.infer<typeof GenerateFinancialInsightsInputSchema>;
export type GenerateFinancialInsightsOutput = z.infer<typeof GenerateFinancialInsightsOutputSchema>;

export async function generateFinancialInsights(input: GenerateFinancialInsightsInput): Promise<GenerateFinancialInsightsOutput> {
  return generateFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: {schema: GenerateFinancialInsightsInputSchema},
  output: {schema: GenerateFinancialInsightsOutputSchema},
  prompt: `Você é um assistente financeiro pessoal amigável e proativo. Sua tarefa é analisar a lista de transações de um usuário e gerar um resumo com insights e dicas valiosas em português.

Seja conciso, use uma linguagem fácil de entender e formate sua resposta usando markdown.

Seu resumo deve incluir:
1.  Uma breve saudação e um panorama geral.
2.  Um ou dois insights interessantes sobre os padrões de gastos (ex: maiores categorias de despesa, aumento em algum gasto específico).
3.  Uma dica prática e acionável para ajudar o usuário a economizar ou a gerenciar melhor seu dinheiro.
4.  Uma palavra de encorajamento.

Aqui estão as transações:
{{#each transactions}}
- Descrição: {{description}}, Valor: R$ {{amount}}, Tipo: {{type}}, Categoria: {{category}}, Data: {{date}}
{{/each}}

Gere os insights a partir desses dados.
`,
});

const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: GenerateFinancialInsightsOutputSchema,
  },
  async input => {
    if (input.transactions.length === 0) {
      return "Não há transações suficientes para gerar insights. Adicione mais algumas e tente novamente!";
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
