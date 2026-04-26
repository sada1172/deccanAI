/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const rawApiKey = process.env.GEMINI_API_KEY;
    // Remove surrounding quotes if they exist (common issue when manually editing .env files)
    let apiKey = rawApiKey?.trim();
    if (apiKey?.startsWith('"') && apiKey?.endsWith('"')) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    } else if (apiKey?.startsWith("'") && apiKey?.endsWith("'")) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    }

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const extractSkillsFromAI = async (jd: string, resume: string) => {
  const ai = getAI();
  const prompt = `Compare this Job Description and Resume. Extract the key technical and soft skills required by the JD and evaluate their presence in the Resume. 
  Job Description: ${jd}
  Resume: ${resume}
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                proficiency: { type: Type.STRING },
                evidence: { type: Type.STRING }
              },
              required: ["name", "category", "proficiency", "evidence"]
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{\"skills\":[]}");
};

export const getInterviewerResponseFromAI = async (history: any[], currentSkill: any, nextSkill?: any) => {
  const ai = getAI();
  const systemPrompt = `You are an expert interviewer assessing proficiency on: ${currentSkill.name}. 
      Evaluate if they have basic, intermediate or advanced knowledge. 
      Move to next skill: ${nextSkill ? nextSkill.name : 'None'}.
      Ask ONE transition or follow-up. Keep it professional.`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.map(m => ({ 
        role: m.role === 'model' ? 'model' : 'user', 
        parts: [{ text: m.content }] 
      }))
    ]
  });

  return response.text || "";
};

export const generateFinalReportFromAI = async (jd: string, resume: string, chatLog: string) => {
  const ai = getAI();
  const prompt = `Generate a final Skill Assessment Report and Personalised Learning Plan.
  Calculate an overall matchingScore (overallScore) between 0 and 1, where 1 is a perfect match and 0 is no match.

  JD: ${jd}
  Resume: ${resume}
  Interview Log: ${chatLog}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          extractedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                proficiency: { type: Type.STRING },
                evidence: { type: Type.STRING }
              }
            }
          },
          gaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          learningPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                estimate: { type: Type.STRING },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      type: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
