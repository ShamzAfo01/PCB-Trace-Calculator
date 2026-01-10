
import React from 'react';
import { CalculationResults, LayerType } from '../types';

interface Props {
  results: CalculationResults;
  layer: LayerType;
}

const Visualization: React.FC<Props> = ({ results, layer }) => {
  const maxVisWidth = 180; 
  const displayWidth = Math.min(Math.max(results.widthMils * 0.5, 4), maxVisWidth);
  const displayHeight = Math.min(results.thicknessMils * 8, 30);

  return (
    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-full">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Geometric Cross-Section</h2>
      
      <div className="relative flex-1 min-h-[160px] flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden">
        {/* PCB Board Base */}
        <div className="absolute inset-x-0 bottom-10 h-10 bg-emerald-50 border-t-2 border-emerald-100/50" />
        
        {/* The Copper Trace */}
        <div 
          className={`relative transition-all duration-1000 ease-out shadow-[0_15px_40px_-5px_rgba(0,56,223,0.2)]
            ${layer === LayerType.EXTERNAL ? 'top-[-20px]' : 'top-[5px]'}`}
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            backgroundColor: '#0038df',
            borderRadius: '4px',
          }}
        >
          {/* Subtle reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 right-6 text-[10px] text-slate-300 uppercase tracking-widest font-black">
          {layer} trace projection
        </div>
      </div>
    </div>
  );
};

export default Visualization;
