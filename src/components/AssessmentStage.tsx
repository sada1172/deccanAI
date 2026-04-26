/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowRight } from 'lucide-react';
import { Message, Skill } from '../types';

interface AssessmentStageProps {
  chatHistory: Message[];
  userInput: string;
  setUserInput: (val: string) => void;
  onSendMessage: () => void;
  isProcessing: boolean;
  currentSkill: Skill;
  onGenerateReport: () => void;
}

export const AssessmentStage = ({
  chatHistory,
  userInput,
  setUserInput,
  onSendMessage,
  isProcessing,
  currentSkill,
  onGenerateReport
}: AssessmentStageProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800 flex flex-col h-[75vh]">
        <div className="px-6 py-5 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center text-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-widest uppercase text-zinc-400">Verifying Proficiency</span>
          </div>
          <div className="text-xs font-mono text-zinc-500 uppercase">Token Session 01</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#09090b]">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl text-base leading-relaxed break-words overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-zinc-100 text-black font-medium' 
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-lg'
              }`}>
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed break-words">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start">
                <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 flex items-center gap-3">
                   <Loader2 className="animate-spin text-zinc-500" size={18} />
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agent Reasoning...</span>
                </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          <div className="flex gap-3">
            <input 
              type="text"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-700/50 placeholder:text-zinc-700 text-zinc-100"
              placeholder="Convey your experience..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            />
            <button 
              onClick={onSendMessage}
              disabled={!userInput.trim() || isProcessing}
              className="w-14 h-14 bg-zinc-100 text-black rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
     
      <div className="flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 bg-zinc-700 rounded-full" />
           <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Skill Anchor: {currentSkill?.name}</span>
        </div>
        <button 
           onClick={onGenerateReport}
           className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
           Finalize Analysis
        </button>
      </div>
    </div>
  );
};
