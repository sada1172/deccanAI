/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skill, AssessmentReport, Message } from "../types";

export const extractSkills = async (jd: string, resume: string): Promise<Skill[]> => {
  const response = await fetch("/api/extract-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd, resume }),
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Backend extraction failed");
  }
  const result = await response.json();
  return result.skills || [];
};

export const getChatResponse = async (
  history: Message[], 
  currentSkill: Skill, 
  nextSkill?: Skill
): Promise<string> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, currentSkill, nextSkill }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Backend chat failed");
  }
  const result = await response.json();
  return result.text || "I see. Let's move on.";
};

export const generateFinalReport = async (
  jd: string, 
  resume: string, 
  chatLog: string
): Promise<AssessmentReport> => {
  const response = await fetch("/api/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd, resume, chatLog }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Backend report generation failed");
  }
  return await response.json();
};
