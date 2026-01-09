
import { GoogleGenAI } from "@google/genai";
import { CalculationInputs, CalculationResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getEngineeringAdvice = async (
  inputs: CalculationInputs,
  results: CalculationResults
): Promise<string> => {
  if (!process.env.API_KEY) return "AI Assistant unavailable without API key.";

  const prompt = `
    I am designing a PCB. 
    Inputs:
    - Current: ${inputs.current}A
    - Temp Rise: ${inputs.tempRise}°C
    - Copper Weight: ${inputs.thicknessOz} oz/ft²
    - Layer: ${inputs.layer}
    
    Calculated Results (IPC-2221):
    - Width: ${results.widthMils.toFixed(2)} mils (${results.widthMm.toFixed(2)} mm)
    - Area: ${results.areaSqMils.toFixed(2)} sq mils
    
    As a senior PCB engineer, please provide a brief (max 150 words) analysis. 
    Address:
    1. Manufacturing feasibility (is it too thin or too wide?).
    2. Recommendations for trace clearances.
    3. Potential thermal issues or if a polygon pour/thermal relief is better.
    4. Keep it professional and concise. Format using markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate advice.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant encountered an error. Please check your results manually.";
  }
};
