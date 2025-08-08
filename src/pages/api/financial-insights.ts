// src/pages/api/financial-insights.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateFinancialInsights, GenerateFinancialInsightsInput } from '@/ai/flows/financial-insights-flow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const input: GenerateFinancialInsightsInput = req.body;
    const result = await generateFinancialInsights(input);
    return res.status(200).json({
      success: true,
      message: "Insights gerados com sucesso!",
      data: result,
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      success: false,
      message: `Erro ao gerar insights: ${errorMessage}`,
    });
  }
}
