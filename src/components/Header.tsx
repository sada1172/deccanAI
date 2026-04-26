/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Brain, RefreshCcw } from 'lucide-react';

export const Header = () => (
  <header className="border-b border-zinc-800 px-8 py-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-100 border border-zinc-700">
        <Brain size={24} />
      </div>
      <div>
        <h1 className="font-serif text-xl tracking-tight text-white">SkillPath AI</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Self-Evolving Learning Agent</p>
      </div>
    </div>
    <div className="flex gap-4">
      <button 
        onClick={() => window.location.reload()}
        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
      >
        <RefreshCcw size={20} />
      </button>
    </div>
  </header>
);
