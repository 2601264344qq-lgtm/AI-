import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisData, ChatMessage, UploadedFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToPart = (dataUrl: string, mimeType: string) => {
    return {
        inlineData: {
            mimeType,
            data: dataUrl.split(',')[1]
        }
    };
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    params: {
      type: Type.OBJECT,
      properties: {
        partType: { type: Type.STRING, description: "零件类型 (e.g., 轴, 齿轮)" },
        materialType: { type: Type.STRING, description: "材料类型 (e.g., 钢, 铝合金)" },
        outerDia: { type: Type.NUMBER, description: "外径 (mm)" },
        innerDia: { type: Type.NUMBER, description: "内径 (mm)" },
        length: { type: Type.NUMBER, description: "长度 (mm)" },
      },
      required: ["partType", "materialType", "outerDia", "innerDia", "length"]
    },
    visualData: {
      type: Type.OBJECT,
      properties: {
        stress: {
          type: Type.OBJECT,
          properties: {
            max: { type: Type.NUMBER, description: "最大应力 (MPa)" },
            location: { type: Type.STRING, description: "最大应力位置" }
          },
          required: ["max", "location"]
        },
        deformation: {
          type: Type.OBJECT,
          properties: {
            max: { type: Type.NUMBER, description: "最大变形 (mm)" },
            location: { type: Type.STRING, description: "最大变形位置" }
          },
          required: ["max", "location"]
        },
        utilization: { type: Type.NUMBER, description: "材料利用率 (0-1)" }
      },
      required: ["stress", "deformation", "utilization"]
    }
  },
  required: ["params", "visualData"]
};

export const getAiAnalysis = async (prompt: string, files: UploadedFile[]): Promise<AnalysisData | null> => {
  try {
    const parts: any[] = [
      { text: `从以下用户输入和文件中提取工程参数并进行初步分析。如果缺少某些参数，请根据常识进行合理的估算。用户输入: "${prompt}"` }
    ];

    for (const file of files) {
      parts.push(fileToPart(file.base64, file.type));
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error getting AI analysis:", error);
    return null;
  }
};

export const getSimpleChatResponse = async (prompt: string, history: ChatMessage[], files: UploadedFile[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }))
    });

    const messageParts: any[] = [{ text: prompt }];
    for (const file of files) {
        messageParts.push(fileToPart(file.base64, file.type));
    }
    
    const response = await chat.sendMessage({ message: messageParts });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "抱歉，我遇到了一些问题，请稍后再试。";
  }
};

export const getTestResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting test response:", error);
    if (error instanceof Error) {
        return `API 调用失败: ${error.message}`;
    }
    return "抱歉，发生未知错误，请检查控制台。";
  }
};

export const getCalculationResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一位专业的机械工程专家助手。请根据用户提供的参数，提供详细的计算过程，包括所使用的公式、分步计算流程、最终结果，并在适用时给出专业建议。请使用 Markdown 清晰地格式化您的回答。",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting calculation response:", error);
    if (error instanceof Error) {
        return `计算失败: ${error.message}`;
    }
    return "抱歉，计算时发生未知错误。";
  }
};
