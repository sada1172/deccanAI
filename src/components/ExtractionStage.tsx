/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Skill } from '../types';

interface ExtractionStageProps {
  skills: Skill[];
  onStartAssessment: () => void;
}

export const ExtractionStage = ({ skills, onStartAssessment }: ExtractionStageProps) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h3 className="text-4xl font-serif text-white">Synthesized Skills</h3>
        <p className="text-zinc-500">Mapping {skills.length} critical skills found in the profile nexus.</p>
      </div>
      <button 
        onClick={onStartAssessment}
        className="px-8 py-3 bg-zinc-100 text-black rounded-full font-bold flex items-center gap-2 hover:bg-white transition-colors whitespace-nowrap active:scale-95 translate-y-[-4px]"
      >
        Begin Verification <ChevronRight size={20} />
      </button>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-600 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-800/10 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700">
              {skill.category}
            </span>
            {skill.proficiency !== 'none' ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-zinc-700" />
            )}
          </div>
          <h4 className="font-bold text-xl mb-2 text-zinc-100">{skill.name}</h4>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {skill.proficiency === 'none' ? "Gap detected in current resume" : skill.evidence}
          </p>
        </div>
      ))}
    </div>
  </div>
);
