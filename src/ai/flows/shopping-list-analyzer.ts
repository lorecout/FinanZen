'use server';

/**
 * @fileOverview An AI agent that analyzes a user's shopping list.
 *
 * - analyzeShoppingList - A function that handles the shopping list analysis process.
 * - AnalyzeShoppingListInput - The input type for the analyzeShoppingList function.
 * - AnalyzeShoppingListOutput - The return type for the analyzeShoppingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeShoppingListInputSchema, AnalyzeShoppingListOutputSchema } from '@/types/schemas';

export type AnalyzeShoppingListInput = z.infer<typeof AnalyzeShoppingListInputSchema>;
export type AnalyzeShoppingListOutput = z.infer<typeof AnalyzeShoppingListOutputSchema>;

export async function analyzeShoppingList(input: AnalyzeShoppingListInput): Promise<AnalyzeShoppingListOutput> {
  return analyzeShoppingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeShoppingListPrompt',
  input: {schema: AnalyzeShoppingListInputSchema},
  output: {schema: AnalyzeShoppingListOutputSchema},
  prompt: `Você é um assistente de compras especialista em mercado brasileiro. Sua tarefa é analisar uma lista de compras e fornecer uma estimativa de custo total em Reais (BRL) e sugestões de itens relacionados.

Use seu conhecimento sobre preços médios no Brasil para a estimativa de custo. Para as sugestões, pense em itens que combinam ou que são comumente comprados juntos.

A lista de compras é a seguinte:
{{#each items}}
- {{name}}
{{/each}}

Gere a resposta no formato JSON.`,
});

const analyzeShoppingListFlow = ai.defineFlow(
  {
    name: 'analyzeShoppingListFlow',
    inputSchema: AnalyzeShoppingListInputSchema,
    outputSchema: AnalyzeShoppingListOutputSchema,
  },
  async input => {
    if (input.items.length === 0) {
      return {
        estimatedCost: 0,
        suggestions: [],
      };
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
