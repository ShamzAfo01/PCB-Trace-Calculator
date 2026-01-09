
import React from 'react';
import { CalculationResults, LayerType } from '../types';

interface Props {
  results: CalculationResults;
  layer: LayerType;
}

const Visualization: React.FC<Props> = ({ results, layer }) => {
  const maxVisWidth = 140; 
  const displayWidth = Math.min(Math.max(results.widthMils * 0.4, 4), maxVisWidth);
  const displayHeight = Math.min(results.thicknessMils * 6, 24);

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Cross-Section Preview</h2>
      
      <div className="relative flex-1 min-h-[120px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
        {/* PCB Board Base */}
        <div className="absolute inset-x-0 bottom-6 h-6 bg-emerald-100 border-t border-emerald-200" />
        
        {/* The Copper Trace */}
        <div 
          className={`relative transition-all duration-700 ease-out shadow-[0_4px_20px_rgba(0,56,223,0.15)]
            ${layer === LayerType.EXTERNAL ? 'top-[-15px]' : 'top-[2px]'}`}
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            backgroundColor: '#0038df', // Primary blue instead of copper for brand alignment
            borderRadius: '2px',
          }}
        >
          {/* Subtle copper sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-4 text-[10px] text-slate-400 uppercase tracking-tighter font-black">
          {layer} trace
        </div>
      </div>
    </div>
  );
};

export default Visualization;
