
import React from 'react';
import { CalculationInputs, LayerType } from '../types';
import { Zap, Thermometer, Layers, Ruler } from 'lucide-react';

interface Props {
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

const CalculatorForm: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: name === 'layer' ? value : parseFloat(value) || 0
    });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
        <Zap className="w-5 h-5" /> Parameters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Current (Amps)
          </label>
          <input
            type="number"
            name="current"
            step="0.1"
            value={inputs.current}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" /> Temp Rise (°C)
          </label>
          <input
            type="number"
            name="tempRise"
            step="1"
            value={inputs.tempRise}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-400" /> Thickness (oz/ft²)
          </label>
          <input
            type="number"
            name="thicknessOz"
            step="0.5"
            value={inputs.thicknessOz}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Layer Type
          </label>
          <select
            name="layer"
            value={inputs.layer}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          >
            <option value={LayerType.EXTERNAL}>External (Surface)</option>
            <option value={LayerType.INTERNAL}>Internal (Buried)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;
