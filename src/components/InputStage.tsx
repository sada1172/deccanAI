/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Target, FileText, FileUp, X, Loader2, ArrowRight } from 'lucide-react';
import { extractTextFromPdf } from '../services/pdfService';

interface InputStageProps {
  jd: string;
  setJd: (val: string) => void;
  resume: string;
  setResume: (val: string) => void;
  pdfNames: { jd: string; resume: string };
  setPdfNames: (val: any) => void;
  isProcessing: boolean;
  processingStep: string;
  onAnalyze: () => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingStep: (val: string) => void;
}

export const InputStage = ({
  jd, setJd, 
  resume, setResume, 
  pdfNames, setPdfNames, 
  isProcessing, processingStep, 
  onAnalyze,
  setIsProcessing,
  setProcessingStep
}: InputStageProps) => {

  const handlePdfUpload = async (type: 'jd' | 'resume', file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setProcessingStep('Unlocking PDF structure...');
    try {
      const text = await extractTextFromPdf(file);
      if (type === 'jd') {
        setJd(text);
        setPdfNames((prev: any) => ({ ...prev, jd: file.name }));
      } else {
        setResume(text);
        setPdfNames((prev: any) => ({ ...prev, resume: file.name }));
      }
    } catch (error) {
      console.error("PDF parsing error:", error);
      alert("Failed to parse PDF. Please try copying the text manually.");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const clearFile = (type: 'jd' | 'resume') => {
    if (type === 'jd') {
      setJd('');
      setPdfNames((prev: any) => ({ ...prev, jd: '' }));
    } else {
      setResume('');
      setPdfNames((prev: any) => ({ ...prev, resume: '' }));
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight">
          Bridge the gap <span className="italic text-zinc-400">between</span> potential and performance.
        </h2>
        <p className="text-zinc-400 text-lg">
          Upload your resume and the job description. Our agent will deconstruct your skills and map your trajectory.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* JD Input Area */}
        <div className="bg-zinc-900/50 rounded-3xl p-8 shadow-2xl border border-zinc-800 space-y-4 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-300">
              <Target size={20} className="text-zinc-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Job Description</h3>
            </div>
            <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors group-hover:scale-105 active:scale-95">
              <FileUp size={18} className="text-zinc-300" />
              <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files && handlePdfUpload('jd', e.target.files[0])} />
            </label>
          </div>
          
          {pdfNames.jd ? (
            <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 truncate">
                <FileText className="text-zinc-400 shrink-0" size={20} />
                <span className="text-sm font-medium truncate">{pdfNames.jd}</span>
              </div>
              <button onClick={() => clearFile('jd')} className="p-1 hover:bg-zinc-700 rounded-full transition-colors">
                <X size={16} className="text-zinc-400" />
              </button>
            </div>
          ) : (
            <textarea 
              className="w-full h-64 bg-zinc-950/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-zinc-700/50 resize-none border border-zinc-800 placeholder:text-zinc-700 text-zinc-100"
              placeholder="Paste the job requirements here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          )}
        </div>

        {/* Resume Input Area */}
        <div className="bg-zinc-900/50 rounded-3xl p-8 shadow-2xl border border-zinc-800 space-y-4 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-300">
              <FileText size={20} className="text-zinc-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Your Resume</h3>
            </div>
            <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors group-hover:scale-105 active:scale-95">
              <FileUp size={18} className="text-zinc-300" />
              <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files && handlePdfUpload('resume', e.target.files[0])} />
            </label>
          </div>

          {pdfNames.resume ? (
            <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 truncate">
                <FileText className="text-zinc-400 shrink-0" size={20} />
                <span className="text-sm font-medium truncate">{pdfNames.resume}</span>
              </div>
              <button onClick={() => clearFile('resume')} className="p-1 hover:bg-zinc-700 rounded-full transition-colors">
                <X size={16} className="text-zinc-400" />
              </button>
            </div>
          ) : (
            <textarea 
              className="w-full h-64 bg-zinc-950/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-zinc-700/50 resize-none border border-zinc-800 placeholder:text-zinc-700 text-zinc-100"
              placeholder="Paste your resume context here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onAnalyze}
          disabled={!jd || !resume || isProcessing}
          className="group relative px-12 py-5 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" size={20} />
              <span>{processingStep || 'Processing Data...'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>Synthesize Skills</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
