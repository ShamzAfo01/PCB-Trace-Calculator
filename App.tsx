
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cpu, ChevronRight, ChevronLeft, CheckCircle2, BrainCircuit, RefreshCcw, Zap, Ruler, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import Visualization from './components/Visualization';
import ComparisonChart from './components/ComparisonChart';
import AnimatedNumber from './components/AnimatedNumber';
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

  const [results, setResults] = useState<CalculationResults>(() => calculateTraceWidth(inputs));
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // For Slider UI manipulation
  const sliderRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(calculateTraceWidth(inputs));
  }, [inputs]);

  // Update slider background gradient and tooltip position
  useEffect(() => {
    if (sliderRef.current && tooltipRef.current) {
      const min = parseFloat(sliderRef.current.min);
      const max = parseFloat(sliderRef.current.max);
      const val = inputs.current;
      const percentage = ((val - min) / (max - min)) * 100;
      
      sliderRef.current.style.background = `linear-gradient(to right, #0038df ${percentage}%, #f1f5f9 ${percentage}%)`;
      
      const thumbSize = 32;
      const rect = sliderRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        const availableWidth = rect.width - thumbSize;
        const left = (percentage / 100) * availableWidth + thumbSize / 2;
        tooltipRef.current.style.left = `${left}px`;
      }
    }
  }, [inputs.current, step]);

  const handleGetAdvice = useCallback(async () => {
    setLoadingAdvice(true);
    const resultAdvice = await getEngineeringAdvice(inputs, results);
    setAdvice(resultAdvice);
    setLoadingAdvice(false);
  }, [inputs, results]);

  const nextStep = () => {
    gsap.to(".step-content", { opacity: 0, x: -30, duration: 0.3, ease: "power2.in", onComplete: () => {
      setStep((prev) => Math.min(prev + 1, 3));
      gsap.fromTo(".step-content", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
    }});
  };

  const prevStep = () => {
    gsap.to(".step-content", { opacity: 0, x: 30, duration: 0.3, ease: "power2.in", onComplete: () => {
      setStep((prev) => Math.max(prev - 1, 1));
      gsap.fromTo(".step-content", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
    }});
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-primary/10">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900">
            TRACE<span className="text-primary">MASTER</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 ${
                  step === s ? "bg-primary/5 text-primary scale-105" : "text-slate-300"
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                    step === s ? "bg-primary border-primary text-white" : 
                    step > s ? "bg-primary/10 border-primary/10 text-primary" : "border-slate-200"
                  }`}>
                    {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {s === 1 ? 'Current' : s === 2 ? 'Stackup' : 'Results'}
                  </span>
                </div>
                {s < 3 && <div className={`w-6 h-0.5 rounded-full ${step > s ? "bg-primary/20" : "bg-slate-100"}`} />}
              </React.Fragment>
            ))}
          </div>
          
          <button 
            onClick={() => { setStep(1); setInputs({ current: 2.0, tempRise: 10, thicknessOz: 1.0, layer: LayerType.EXTERNAL }); setAdvice(''); }}
            className="group p-2 text-slate-300 hover:text-primary transition-all active:scale-90"
            title="Reset All"
          >
            <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 md:py-20">
        <div className="step-content">
          {step === 1 && (
            <div className="space-y-16 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]">Parameter Entry</div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">Define Your Load</h2>
                <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Input the current demand to calculate the minimum copper width required for thermal safety.</p>
              </div>

              <div className="bg-white p-12 md:p-16 rounded-[12px] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-16 relative overflow-hidden">
                <div className="space-y-12 relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Target Current</label>
                        <p className="text-slate-900 font-bold">Standard Amperage Load</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <AnimatedNumber value={inputs.current} decimals={1} className="text-7xl font-black text-primary tracking-tighter" />
                      <span className="text-2xl font-black text-slate-300 uppercase">Amps</span>
                    </div>
                  </div>

                  <div className="relative pt-12 px-2">
                    <div 
                      ref={tooltipRef}
                      className="absolute top-[-10px] -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-black shadow-2xl transition-all pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-slate-900 z-10"
                    >
                      {inputs.current.toFixed(1)}A
                    </div>
                    
                    <input 
                      ref={sliderRef}
                      type="range" 
                      min="0.1" 
                      max="30.0" 
                      step="0.1" 
                      value={inputs.current}
                      onChange={(e) => setInputs({...inputs, current: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Min: 0.1A</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Max: 30A</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Temperature Tolerance</label>
                      <p className="text-slate-900 font-bold">Allowed Heat Increase over Ambient</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[5, 10, 20, 40].map((t) => (
                      <button
                        key={t}
                        onClick={() => setInputs({...inputs, tempRise: t})}
                        className={`relative py-6 rounded-[12px] border-2 text-sm font-black transition-all ${
                          inputs.tempRise === t 
                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105" 
                          : "bg-white text-slate-500 border-slate-100 hover:border-primary/20"
                        }`}
                      >
                        {t}°C Rise
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-primary text-white py-8 rounded-[12px] font-black text-2xl hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-6 group active:scale-[0.98]"
              >
                Physical Specification <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-16 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]">Material Stackup</div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">Board Parameters</h2>
                <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Copper weight and layer placement significantly impact heat dissipation capabilities.</p>
              </div>

              <div className="bg-white p-12 md:p-16 rounded-[12px] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-16">
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Ruler className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Copper Weight</label>
                        <p className="text-slate-900 font-bold">Standard Thickness</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[0.5, 1, 2, 3].map((oz) => (
                        <button
                          key={oz}
                          onClick={() => setInputs({...inputs, thicknessOz: oz})}
                          className={`py-6 rounded-[12px] border-2 text-sm font-black transition-all ${
                            inputs.thicknessOz === oz 
                            ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-primary/20"
                          }`}
                        >
                          {oz} oz/ft²
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Layer Position</label>
                        <p className="text-slate-900 font-bold">Trace Location</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => setInputs({...inputs, layer: LayerType.EXTERNAL})}
                        className={`w-full p-6 rounded-[12px] border-2 flex items-center justify-between transition-all group ${
                          inputs.layer === LayerType.EXTERNAL 
                          ? "bg-primary/5 border-primary text-primary" 
                          : "bg-white border-slate-100 text-slate-500 hover:border-primary/20"
                        }`}
                      >
                        <div className="text-left">
                          <span className="block font-black text-lg">External</span>
                          <span className="text-xs font-medium opacity-50">High heat dissipation (Surface)</span>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${inputs.layer === LayerType.EXTERNAL ? "bg-primary border-white shadow-lg" : "border-slate-50"}`}>
                           {inputs.layer === LayerType.EXTERNAL && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                      <button
                        onClick={() => setInputs({...inputs, layer: LayerType.INTERNAL})}
                        className={`w-full p-6 rounded-[12px] border-2 flex items-center justify-between transition-all group ${
                          inputs.layer === LayerType.INTERNAL 
                          ? "bg-primary/5 border-primary text-primary" 
                          : "bg-white border-slate-100 text-slate-500 hover:border-primary/20"
                        }`}
                      >
                        <div className="text-left">
                          <span className="block font-black text-lg">Internal</span>
                          <span className="text-xs font-medium opacity-50">Limited cooling (Inner layers)</span>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${inputs.layer === LayerType.INTERNAL ? "bg-primary border-white shadow-lg" : "border-slate-50"}`}>
                           {inputs.layer === LayerType.INTERNAL && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button 
                  onClick={prevStep}
                  className="flex-1 bg-slate-100 text-slate-500 py-8 rounded-[12px] font-black text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-4"
                >
                  <ChevronLeft className="w-6 h-6" /> Previous
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] bg-primary text-white py-8 rounded-[12px] font-black text-2xl hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-6 active:scale-[0.98]"
                >
                  Run Calculation <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-16 pb-24 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-10 gap-6">
                <div className="space-y-2">
                  <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]">Validated Output</div>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tight text-center md:text-left">Design Specs</h2>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-[12px] font-black text-sm transition-all flex items-center gap-3 shadow-xl active:scale-95 mx-auto md:mx-0"
                >
                  <RefreshCcw className="w-5 h-5" /> Calculate New Trace
                </button>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Result Card */}
                <div className="lg:col-span-7 bg-primary p-12 md:p-16 rounded-[12px] text-white shadow-[0_40px_80px_-20px_rgba(0,56,223,0.3)] relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                  
                  <div>
                    <p className="text-primary-100/60 text-xs font-black uppercase tracking-[0.25em] mb-8">Minimum Required Width</p>
                    <div className="flex items-baseline gap-4">
                      <AnimatedNumber value={results.widthMm} decimals={3} className="text-8xl md:text-9xl font-black leading-tight tracking-tighter" />
                      <span className="text-4xl font-black opacity-30">MM</span>
                    </div>
                  </div>
                  
                  <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Imperial (Mils)</p>
                      <AnimatedNumber value={results.widthMils} decimals={2} className="text-3xl font-black block" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Input Load</p>
                      <p className="text-3xl font-black">{inputs.current}<span className="text-lg ml-1 opacity-40 font-bold">A</span></p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Temp Rise</p>
                      <p className="text-3xl font-black">{inputs.tempRise}<span className="text-lg ml-1 opacity-40 font-bold">°C</span></p>
                    </div>
                  </div>
                </div>

                {/* Visual Card */}
                <div className="lg:col-span-5 h-full">
                  <Visualization results={results} layer={inputs.layer} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <ComparisonChart inputs={inputs} />
                
                {/* AI Section */}
                <div className="bg-white rounded-[12px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50">
                  <div className="p-12 md:p-16 border-b border-slate-50 flex items-center justify-between flex-wrap gap-10">
                    <div className="flex items-center gap-8">
                      <div className="bg-purple-600 p-6 rounded-[2rem] shadow-2xl shadow-purple-600/30">
                        <BrainCircuit className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">Safety & DFM Audit</h3>
                        <p className="text-slate-400 text-lg font-medium">Senior Hardware Engineering Analysis</p>
                      </div>
                    </div>
                    {!advice && (
                      <button 
                        onClick={handleGetAdvice}
                        disabled={loadingAdvice}
                        className="px-12 py-5 bg-primary text-white rounded-[12px] font-black text-lg hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-4 shadow-xl shadow-primary/20"
                      >
                        {loadingAdvice ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                            Evaluating...
                          </>
                        ) : 'Run AI Analysis'}
                      </button>
                    )}
                  </div>
                  <div className="p-12 md:p-20 bg-slate-50/20">
                    {advice ? (
                      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-xl font-medium">
                        <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }} />
                      </div>
                    ) : (
                      <div className="text-center py-20 space-y-6">
                         <BrainCircuit className="w-16 h-16 text-slate-100 mx-auto" />
                         <p className="text-slate-300 font-black text-2xl italic max-w-lg mx-auto leading-relaxed">
                           "Request an audit to evaluate manufacturing risk, clearance rules, and thermal relief strategies."
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-20 text-center border-t border-slate-50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-slate-900 font-black text-xs uppercase tracking-widest">Engineering Safety Tool</span>
        </div>
        <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">
          IPC-2221 Reference • © {new Date().getFullYear()} TRACEMASTER
        </p>
      </footer>
    </div>
  );
};

export default App;
