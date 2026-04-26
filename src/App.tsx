/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { InputStage } from './components/InputStage';
import { ExtractionStage } from './components/ExtractionStage';
import { AssessmentStage } from './components/AssessmentStage';
import { ResultStage } from './components/ResultStage';
import { extractSkills, getChatResponse, generateFinalReport } from './services/aiService';
import { Skill, Message, AssessmentReport, Stage } from './types';

export default function App() {
  const [stage, setStage] = useState<Stage>('input');
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<Skill[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [pdfNames, setPdfNames] = useState({ jd: '', resume: '' });

  const handleStartExtraction = async () => {
    if (!jd || !resume) return;
    setIsProcessing(true);
    setProcessingStep('Mapping skill nexus...');
    try {
      const skills = await extractSkills(jd, resume);
      setExtractedSkills(skills);
      setStage('extraction');
    } catch (error) {
      console.error("Extraction error:", error);
      alert("AI Analysis encountered an issue. Please check your connectivity.");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const startAssessment = () => {
    setStage('assessment');
    const firstSkill = extractedSkills[0];
    const initialMessage = `Hello! I'm your Skills Assessment Agent. I've analyzed the job description and your resume. I want to dive deeper into some specific skills to understand your real-world proficiency. 
    
    Let's start with **${firstSkill?.name || 'your core skills'}**. You've mentioned "${firstSkill?.evidence || 'relevant experience'}" in your resume. Can you describe a specific project where you applied this skill and the challenges you faced?`;
    
    setChatHistory([{ role: 'model', content: initialMessage }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    const newUserMsg: Message = { role: 'user', content: userInput };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setUserInput('');
    setIsProcessing(true);

    try {
      const currentSkill = extractedSkills[currentSkillIndex];
      const nextSkill = extractedSkills[currentSkillIndex + 1];

      const modelResponse = await getChatResponse(updatedHistory, currentSkill, nextSkill);
      setChatHistory(prev => [...prev, { role: 'model', content: modelResponse }]);

      if (updatedHistory.length % 4 === 0 && nextSkill) {
        setCurrentSkillIndex(prev => prev + 1);
      } else if (!nextSkill && updatedHistory.length > 6) {
        handleGenerateReport();
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsProcessing(true);
    setProcessingStep('Generating forensic report...');
    try {
      const chatLog = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');
      const finalReport = await generateFinalReport(jd, resume, chatLog);
      setReport(finalReport);
      setStage('result');
    } catch (error) {
      console.error("Report error:", error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {stage === 'input' && (
          <InputStage 
            jd={jd} setJd={setJd}
            resume={resume} setResume={setResume}
            pdfNames={pdfNames} setPdfNames={setPdfNames}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onAnalyze={handleStartExtraction}
            setIsProcessing={setIsProcessing}
            setProcessingStep={setProcessingStep}
          />
        )}

        {stage === 'extraction' && (
          <ExtractionStage 
            skills={extractedSkills}
            onStartAssessment={startAssessment}
          />
        )}

        {stage === 'assessment' && (
          <AssessmentStage 
            chatHistory={chatHistory}
            userInput={userInput}
            setUserInput={setUserInput}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            currentSkill={extractedSkills[currentSkillIndex]}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {stage === 'result' && report && <ResultStage report={report} />}
      </main>

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-zinc-900/20 rounded-full blur-[120px] -mr-64 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[150px] -ml-96 opacity-30" />
      </div>
    </div>
  );
}
