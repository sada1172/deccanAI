/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { 
  extractSkillsFromAI, 
  getInterviewerResponseFromAI, 
  generateFinalReportFromAI 
} from "./aiService";

const router = Router();

router.post("/extract-skills", async (req, res) => {
  try {
    const { jd, resume } = req.body;
    const result = await extractSkillsFromAI(jd, resume);
    res.json(result);
  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to extract skills" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { history, currentSkill, nextSkill } = req.body;
    const text = await getInterviewerResponseFromAI(history, currentSkill, nextSkill);
    res.json({ text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process message" });
  }
});

router.post("/generate-report", async (req, res) => {
  try {
    const { jd, resume, chatLog } = req.body;
    const report = await generateFinalReportFromAI(jd, resume, chatLog);
    res.json(report);
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate report" });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
