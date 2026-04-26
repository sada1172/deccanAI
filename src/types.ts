/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Skill {
  name: string;
  category: string;
  proficiency: string;
  evidence: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface AssessmentReport {
  overallScore: number;
  extractedSkills: Skill[];
  gaps: {
    skill: string;
    reason: string;
  }[];
  learningPlan: {
    skill: string;
    estimate: string;
    resources: {
      title: string;
      url: string;
      type: string;
    }[];
  }[];
}

export type Stage = 'input' | 'extraction' | 'assessment' | 'result';
