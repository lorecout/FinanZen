"use server";

import { analyzeTransaction, AnalyzeTransactionOutput } from "@/ai/flows/transaction-analyzer";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().min(1, "Por favor, insira uma transação."),
});

type State = {
  success: boolean;
  message: string;
  data?: AnalyzeTransactionOutput;
};

export async function handleTransactionAnalysis(
  prevState: State | undefined,
  formData: FormData
): Promise<State> {
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

    // Here you would typically save the transaction to your database (e.g., Firestore)
    // For now, we just return the parsed data.

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