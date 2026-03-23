import { GoogleGenerativeAI } from "@google/generative-ai";

// Standard initialization using @google/generative-ai
const API_KEY = (import.meta as any).env.VITE_GOOGLE_AI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface PestAnalysisResult {
  prediction: string;
  severity: "low" | "medium" | "high";
  treatments: {
    title: string;
    steps: string[];
    priority: "low" | "medium" | "high";
  }[];
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function analyzeCropPest(imageFile: File, language: string = 'en'): Promise<PestAnalysisResult> {
  try {
    const prompt = `
      Analyze this crop image for pests or diseases. 
      Provide the result in the following JSON format:
      {
        "prediction": "Name of the pest or disease and a brief description",
        "severity": "low" | "medium" | "high",
        "treatments": [
          {
            "title": "Category (e.g., Immediate Action, Prevention)",
            "steps": ["Step 1", "Step 2"],
            "priority": "low" | "medium" | "high"
          }
        ]
      }
      If no pests are found, indicate that the crop appears healthy.
      Only return the JSON.
      IMPORTANT: Please provide all text in the JSON (prediction, title, steps) in ${language === 'fr' ? 'French' : language === 'rw' ? 'Kinyarwanda' : 'English'}.
    `;

    // Standard model acquisition
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = await fileToGenerativePart(imageFile);
    
    // Standard generation call
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from AI");
    }
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response: " + text);
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
