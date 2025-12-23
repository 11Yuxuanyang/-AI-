import React from 'react';
import { Settings2, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GenerationModel } from '../types';

interface SidebarProps {
  prompt: string;
  setPrompt: (s: string) => void;
  aspectRatio: string;
  setAspectRatio: (s: string) => void;
  model: GenerationModel;
  setModel: (m: GenerationModel) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  layers: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  model,
  setModel,
  onGenerate,
  isGenerating,
  layers
}) => {
  return (
    <div className="w-80 h-full bg-surface border-l border-white/10 flex flex-col shadow-2xl z-40">
      
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold flex items-center gap-2 text-white">
          <Sparkles className="text-primary w-5 h-5" />
          Generation
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prompt</label>
          <textarea
            className="w-full h-32 bg-background border border-slate-600 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-primary resize-none placeholder-slate-600"
            placeholder="Describe your imagination... e.g., 'A futuristic city with flying cars, cyberpunk style'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model</label>
           <div className="grid grid-cols-1 gap-2">
             <button
                onClick={() => setModel(GenerationModel.NANO_BANANA_PRO)}
                className={`p-3 rounded-lg border text-left transition-all ${model === GenerationModel.NANO_BANANA_PRO ? 'border-primary bg-primary/10' : 'border-slate-700 bg-background hover:border-slate-500'}`}
             >
                <div className="font-bold text-sm text-white">Nano Banana Pro</div>
                <div className="text-xs text-slate-400">Gemini 3 Pro - Best Quality, 2K/4K</div>
             </button>
             <button
                onClick={() => setModel(GenerationModel.NANO_BANANA)}
                className={`p-3 rounded-lg border text-left transition-all ${model === GenerationModel.NANO_BANANA ? 'border-primary bg-primary/10' : 'border-slate-700 bg-background hover:border-slate-500'}`}
             >
                <div className="font-bold text-sm text-white">Nano Banana</div>
                <div className="text-xs text-slate-400">Gemini 2.5 Flash - Faster</div>
             </button>
           </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {['1:1', '16:9', '9:16', '3:4', '4:3'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-2 px-1 rounded-md text-xs font-medium border ${
                  aspectRatio === ratio 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-background text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
            isGenerating || !prompt.trim()
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary to-accent hover:shadow-primary/50'
          }`}
        >
          {isGenerating ? 'Dreaming...' : 'Generate Image'}
        </button>

        {/* Layers (Mini view) */}
        <div className="pt-4 border-t border-white/10 space-y-2">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Layers size={14} /> Layers ({layers.length})
           </label>
           <div className="space-y-1 max-h-40 overflow-y-auto">
             {layers.map((layer, i) => (
               <div key={layer.id} className="flex items-center gap-2 p-2 rounded bg-background border border-slate-700">
                 <img src={layer.src} alt="layer thumbnail" className="w-8 h-8 rounded object-cover" />
                 <span className="text-xs text-slate-300 truncate">Layer {i + 1}</span>
               </div>
             ))}
             {layers.length === 0 && <div className="text-xs text-slate-500 italic p-2">No layers yet</div>}
           </div>
        </div>

      </div>
    </div>
  );
};