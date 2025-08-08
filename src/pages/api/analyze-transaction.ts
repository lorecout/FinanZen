// src/pages/api/analyze-transaction.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeTransaction, AnalyzeTransactionInput } from '@/ai/flows/transaction-analyzer';
import { z } from 'zod';

const formSchema = z.object({
  text: z.string().min(1, "Por favor, insira uma transação."),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const validatedFields = formSchema.safeParse(req.body);

    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos. " + validatedFields.error.flatten().fieldErrors.text?.[0] || "",
      });
    }

    const result = await analyzeTransaction({ text: validatedFields.data.text });

    return res.status(200).json({
      success: true,
      message: "Transação analisada com sucesso!",
      data: result,
    });
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      success: false,
      message: `Erro ao analisar a transação: ${errorMessage}`,
    });
  }
}
