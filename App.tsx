
import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, ChevronRight, ChevronLeft, CheckCircle2, BrainCircuit, RefreshCcw, Zap, Ruler } from 'lucide-react';
import CalculatorForm from './components/CalculatorForm';
import Visualization from './components/Visualization';
import ComparisonChart from './components/ComparisonChart';
import { CalculationInputs, CalculationResults, LayerType } from './types';
import { calculateTraceWidth } from './utils/math';
import { getEngineeringAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<CalculationInputs>({
    current: 2.0,
    tempRise: 10,
    thicknessOz: 1.0,
    layer: LayerType.EXTERNAL
  });

  const [results, setResults] = useState<CalculationResults>(() => calculateTraceWidth({
    current: 2.0,
    tempRise: 10,
    thicknessOz: 1.0,
    layer: LayerType.EXTERNAL
  }));

  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    setResults(calculateTraceWidth(inputs));
  }, [inputs]);

  const handleGetAdvice = useCallback(async () => {
    setLoadingAdvice(true);
    const resultAdvice = await getEngineeringAdvice(inputs, results);
    setAdvice(resultAdvice);
    setLoadingAdvice(false);
  }, [inputs, results]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Trace<span className="text-primary">Master</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400">
            <span className={step >= 1 ? "text-primary" : ""}>Inputs</span>
            <ChevronRight className="w-4 h-4" />
            <span className={step >= 2 ? "text-primary" : ""}>Config</span>
            <ChevronRight className="w-4 h-4" />
            <span className={step >= 3 ? "text-primary" : ""}>Result</span>
          </div>
          <button 
            onClick={() => { setStep(1); setInputs({ current: 2.0, tempRise: 10, thicknessOz: 1.0, layer: LayerType.EXTERNAL }); setAdvice(''); }}
            className="p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:py-12">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900">Let's start with the electricals.</h2>
              <p className="text-slate-500 text-lg">How much power are we pushing through this trace?</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Current (Amps)
                </label>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" 
                    min="0.1" 
                    max="30" 
                    step="0.1" 
                    value={inputs.current}
                    onChange={(e) => setInputs({...inputs, current: parseFloat(e.target.value)})}
                    className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="w-32">
                    <input 
                      type="number" 
                      value={inputs.current}
                      onChange={(e) => setInputs({...inputs, current: parseFloat(e.target.value) || 0})}
                      className="w-full text-right text-3xl font-black text-primary bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  Temperature Rise (°C)
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[5, 10, 20, 40].map((t) => (
                    <button
                      key={t}
                      onClick={() => setInputs({...inputs, tempRise: t})}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        inputs.tempRise === t 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
                      }`}
                    >
                      {t}°C
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={nextStep}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
            >
              Next Step <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Physical Constraints</h2>
              <p className="text-slate-500 text-lg">What does your PCB stackup look like?</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-emerald-500" /> Copper Weight
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[0.5, 1, 2, 3].map((oz) => (
                      <button
                        key={oz}
                        onClick={() => setInputs({...inputs, thicknessOz: oz})}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          inputs.thicknessOz === oz 
                          ? "bg-primary text-white border-primary" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {oz} oz/ft²
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Layer Location
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setInputs({...inputs, layer: LayerType.EXTERNAL})}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                        inputs.layer === LayerType.EXTERNAL 
                        ? "bg-primary/5 border-primary text-primary" 
                        : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="font-bold">External (Top/Bottom)</span>
                      {inputs.layer === LayerType.EXTERNAL && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setInputs({...inputs, layer: LayerType.INTERNAL})}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                        inputs.layer === LayerType.INTERNAL 
                        ? "bg-primary/5 border-primary text-primary" 
                        : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="font-bold">Internal (Inner)</span>
                      {inputs.layer === LayerType.INTERNAL && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                Calculate Now <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">Your Results</h2>
              <button 
                onClick={() => setStep(1)}
                className="text-primary font-bold hover:underline"
              >
                Start Over
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-center">
                <p className="text-primary-100/70 text-sm font-bold uppercase tracking-widest mb-1">Required Width</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black">{results.widthMm.toFixed(3)}</span>
                  <span className="text-2xl font-medium text-primary-100/80">mm</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4 text-primary-100/90 text-sm">
                   <div>{results.widthMils.toFixed(2)} mils</div>
                   <div className="w-1 h-1 bg-white/40 rounded-full" />
                   <div>{inputs.current} Amps</div>
                </div>
              </div>
              <Visualization results={results} layer={inputs.layer} />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <ComparisonChart inputs={inputs} />
              
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <BrainCircuit className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Expert AI Analysis</h3>
                      <p className="text-slate-500 text-sm">Get manufacturing insights for these specs.</p>
                    </div>
                  </div>
                  {!advice && (
                    <button 
                      onClick={handleGetAdvice}
                      disabled={loadingAdvice}
                      className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {loadingAdvice ? 'Analyzing...' : 'Generate Insights'}
                    </button>
                  )}
                </div>
                <div className="p-8 bg-slate-50/50">
                  {advice ? (
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }} />
                    </div>
                  ) : loadingAdvice ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                      <p className="text-slate-400 font-medium">Reviewing your parameters...</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center italic py-8">
                      Click the button above to analyze manufacturing feasibility and thermal safety.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <p>Built with IPC-2221 Standards. Professional Hardware Engineering Tools.</p>
      </footer>
    </div>
  );
};

export default App;
