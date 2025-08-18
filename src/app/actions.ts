"use server";

import { analyzeTransaction, type AnalyzeTransactionOutput } from "@/ai/flows/transaction-analyzer";
import { generateFinancialInsights, type GenerateFinancialInsightsInput, type GenerateFinancialInsightsOutput } from "@/ai/flows/financial-insights-flow";
import { analyzeShoppingList, type AnalyzeShoppingListInput } from "@/ai/flows/shopping-list-analyzer";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().min(1, "Por favor, insira uma transação."),
});

type TransactionState = {
  success: boolean;
  message: string;
  data?: AnalyzeTransactionOutput;
};

export async function handleTransactionAnalysis(
  prevState: TransactionState | undefined,
  formData: FormData
): Promise<TransactionState> {
  try {
    const validatedFields = formSchema.safeParse({
      text: formData.get("text"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Dados inválidos. " + validatedFields.error.flatten().fieldErrors.text?.[0] || "",
      };
    }

    const result = await analyzeTransaction({ text: validatedFields.data.text });

    return {
      success: true,
      message: "Transação analisada com sucesso!",
      data: result,
    };
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      success: false,
      message: `Erro ao analisar a transação: ${errorMessage}`,
    };
  }
}


type InsightState = {
  success: boolean;
  message: string;
  data?: GenerateFinancialInsightsOutput;
}

export async function handleFinancialInsights(
  input: GenerateFinancialInsightsInput
): Promise<InsightState> {
  try {
    const result = await generateFinancialInsights(input);
    return {
      success: true,
      message: "Insights gerados com sucesso!",
      data: result,
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      success: false,
      message: `Erro ao gerar insights: ${errorMessage}`,
    };
  }
}

type ShoppingListAnalysisState = {
    success: boolean;
    message: string;
    data?: {
        estimatedCost: number;
        suggestions: string[];
    };
};

export async function handleShoppingListAnalysis(
    input: AnalyzeShoppingListInput
): Promise<ShoppingListAnalysisState> {
    try {
        if (input.items.length === 0) {
            return {
                success: false,
                message: 'A lista de compras está vazia.',
            };
        }
        const result = await analyzeShoppingList(input);
        return {
            success: true,
            message: 'Análise da lista de compras concluída!',
            data: result,
        };
    } catch (error) {
        console.error('Error analyzing shopping list:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {
            success: false,
            message: `Erro ao analisar a lista de compras: ${errorMessage}`,
        };
    }
}
