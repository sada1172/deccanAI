/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Target, ArrowRight, Plus } from 'lucide-react';
import { AssessmentReport } from '../types';

interface ResultStageProps {
  report: AssessmentReport;
}

export const ResultStage = ({ report }: ResultStageProps) => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-zinc-100 text-black rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 relative z-10 text-center">Matching Probability</div>
        <div className="text-[7rem] font-serif leading-none relative z-10">
          {Math.round((report.overallScore > 1 ? report.overallScore / 100 : report.overallScore) * 100)}%
        </div>
        <div className="px-6 py-1.5 bg-black/5 rounded-full text-[10px] font-bold tracking-widest relative z-10">AI VALIDATED REPORT</div>
      </div>

      <div className="md:col-span-2 bg-zinc-900/50 rounded-[2.5rem] p-12 border border-zinc-800 shadow-xl space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
           <Target className="text-zinc-500" size={32} />
           <h3 className="text-3xl font-serif text-white">Identified Skill Gaps</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          {report.gaps.map((gap, i) => (
            <div key={i} className="p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="font-bold text-zinc-100 mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                {gap.skill}
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{gap.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-10">
       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-zinc-800 pb-10">
         <div>
           <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.4em] mb-4 block">Optimization Protocol</span>
           <h3 className="text-5xl font-serif text-white">Evolving Learning Plan</h3>
           <p className="text-zinc-500 max-w-xl mt-4">A hyper-focused roadmap designed to bridge your current proficiency with the role requirements using high-velocity learning materials.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 gap-8">
         {report.learningPlan.map((plan, i) => (
           <div key={i} className="group bg-zinc-900/30 rounded-[3rem] p-10 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-700 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/5 rounded-bl-[10rem] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="lg:w-1/3 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-black font-serif text-3xl font-bold">
                      {i + 1}
                    </div>
                    <div>
                       <h4 className="text-3xl font-bold text-white leading-tight">{plan.skill}</h4>
                       <div className="inline-flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 bg-zinc-950 px-3 py-1 rounded-full">
                          Est: {plan.estimate}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                  {plan.resources.map((res, rIndex) => (
                       <a 
                         key={rIndex}
                         href={res.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl hover:bg-zinc-800 transition-all group/res flex flex-col justify-between min-h-[120px]"
                       >
                         <div>
                           <div className="text-[9px] font-bold text-zinc-500 mb-2 uppercase opacity-60 tracking-widest">{res.type}</div>
                           <div className="font-bold text-base leading-snug text-zinc-300 group-hover/res:text-white transition-colors">{res.title}</div>
                         </div>
                         <div className="flex justify-end mt-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover/res:bg-zinc-100 group-hover/res:text-black transition-all">
                              <ArrowRight size={16} />
                            </div>
                         </div>
                       </a>
                    ))}
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>

    <div className="flex justify-center pt-16">
       <button 
          onClick={() => window.location.reload()}
          className="px-10 py-5 bg-white text-black rounded-full font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
       >
          Initiate New Protocol <Plus size={24} />
       </button>
    </div>
  </div>
);
