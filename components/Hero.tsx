
import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator, RefreshCw, ChevronDown, Activity, Flame } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HeroProps {
  onStart: () => void;
}

const egoQuotes = [
    "The world isn't fair. If you want something, take it.",
    "I am the only one who can level up.",
    "Do not stop when you are tired. Stop when you are done.",
    "Weakness is a sin. Power is necessity.",
    "Your body is the only weapon you truly own."
];

type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  // Hero State
  const [quote, setQuote] = useState("");
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Calculator State
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>(''); // cm
  const [heightFt, setHeightFt] = useState<number | ''>(''); // ft
  const [heightIn, setHeightIn] = useState<number | ''>(''); // in
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [activity, setActivity] = useState<ActivityLevel>('Sedentary');
  const [results, setResults] = useState<{bmr: number, tdee: number} | null>(null);

  useEffect(() => {
      setQuote(egoQuotes[Math.floor(Math.random() * egoQuotes.length)]);
  }, []);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const calculateMetrics = () => {
      let h = Number(height);
      
      // Convert Imperial to Metric for calculation
      if (unit === 'imperial') {
          const ft = Number(heightFt) || 0;
          const inch = Number(heightIn) || 0;
          h = Math.round((ft * 30.48) + (inch * 2.54));
      }

      if(!weight || !h || !age) {
          alert("Input parameters missing. Complete the data fields.");
          return;
      }
      
      let bmr = 0;
      const w = Number(weight);
      const a = Number(age);

      // Mifflin-St Jeor Equation
      if (gender === 'Male') {
          bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
          bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }

      const multipliers: Record<ActivityLevel, number> = {
          'Sedentary': 1.2,
          'Lightly Active': 1.375,
          'Moderately Active': 1.55,
          'Very Active': 1.725,
          'Extra Active': 1.9
      };

      setResults({
          bmr: Math.round(bmr),
          tdee: Math.round(bmr * multipliers[activity])
      });
  };

  return (
    <div className="w-full flex flex-col">
        
      {/* SECTION 1: HERO */}
      <div 
        className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,164,239,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,164,239,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        </div>

        {/* Floating Elements */}
        <motion.div 
            style={{ rotateX, rotateY, x: useTransform(x, [-0.5, 0.5], [-50, 50]), y: useTransform(y, [-0.5, 0.5], [-50, 50]) }}
            className="absolute z-10 top-1/4 left-[10%] hidden md:block w-64 h-64 pointer-events-none"
        >
            <img 
                src="https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-3d-dumbbell-gym-png-image_11563607.png" 
                alt="Floating Dumbbell" 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,164,239,0.5)] filter brightness-50 hue-rotate-180 contrast-150"
            />
        </motion.div>

        <motion.div 
            style={{ rotateX, rotateY, x: useTransform(x, [-0.5, 0.5], [50, -50]), y: useTransform(y, [-0.5, 0.5], [50, -50]) }}
            className="absolute z-10 bottom-1/4 right-[10%] hidden md:block w-48 h-48 pointer-events-none"
        >
            <img 
                src="https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-3d-dumbbell-gym-png-image_11563607.png" 
                alt="Floating Dumbbell" 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,164,239,0.5)] transform rotate-180 filter brightness-50 hue-rotate-180 contrast-150"
            />
        </motion.div>

        <div className="relative z-20 container mx-auto px-6 text-center max-w-6xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-6 animate-pulse">
                    <span className="text-[#00a4ef] font-mono text-xs tracking-[0.3em] uppercase border border-[#00a4ef] px-4 py-1">System Notification</span>
                </div>
                
                <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tight mb-8 leading-[0.9] text-white system-text">
                AWAKEN <br/>
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a4ef] to-white italic pr-4">PLAYER</span>.
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto font-light leading-relaxed font-sans">
                    "{quote}"
                </p>

                <div className="bg-red-900/20 border border-red-900/50 p-4 max-w-lg mx-auto mb-10 text-red-400 text-xs uppercase tracking-widest font-bold">
                    Warning: Only start if you are willing to sacrifice your comfort zone.
                </div>
                
                <button 
                onClick={onStart}
                className="group relative inline-flex items-center justify-center px-12 py-6 text-lg font-bold text-black transition-all duration-300 bg-[#00a4ef] hover:bg-white hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,164,239,0.5)]"
                >
                ACCEPT QUEST
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce"
        >
            <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* SECTION 2: PUBLIC TOOLS */}
      <div className="w-full bg-[#0a0f19] border-t border-[#1a3a5a] py-20 px-6 relative overflow-hidden">
          {/* Decorative Grid */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00a4ef]/5 rounded-full blur-3xl"></div>

          <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white font-serif tracking-widest mb-4 flex items-center justify-center gap-3">
                      <Calculator className="w-8 h-8 text-[#00a4ef]" /> 
                      SYSTEM <span className="text-[#00a4ef]">TOOLS</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm">Access public terminal. Calculate metabolic baseline. No login required.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                  
                  {/* CALCULATOR INPUTS */}
                  <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800 shadow-xl">
                      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                        <h3 className="text-white font-bold uppercase tracking-widest">Input Metrics</h3>
                        <div className="flex bg-[#050505] rounded p-1 border border-gray-700">
                            <button onClick={() => setUnit('metric')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${unit === 'metric' ? 'bg-[#00a4ef] text-black' : 'text-gray-500 hover:text-white'}`}>Metric</button>
                            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${unit === 'imperial' ? 'bg-[#00a4ef] text-black' : 'text-gray-500 hover:text-white'}`}>Imperial</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                              <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">Gender</label>
                              <div className="flex bg-[#050505] p-1 rounded border border-gray-700">
                                  <button onClick={() => setGender('Male')} className={`flex-1 py-2 text-xs font-bold rounded ${gender === 'Male' ? 'bg-[#00a4ef] text-black' : 'text-gray-400'}`}>Male</button>
                                  <button onClick={() => setGender('Female')} className={`flex-1 py-2 text-xs font-bold rounded ${gender === 'Female' ? 'bg-[#00a4ef] text-black' : 'text-gray-400'}`}>Female</button>
                              </div>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">Age</label>
                              <input 
                                  type="number" 
                                  value={age}
                                  onChange={(e) => setAge(Number(e.target.value))}
                                  className="w-full bg-[#050505] border border-gray-700 text-white p-2.5 rounded focus:border-[#00a4ef] outline-none transition-colors"
                                  placeholder="Years"
                              />
                          </div>
                          <div className="col-span-1">
                              <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">Height</label>
                              {unit === 'metric' ? (
                                  <input 
                                      type="number" 
                                      value={height}
                                      onChange={(e) => setHeight(Number(e.target.value))}
                                      className="w-full bg-[#050505] border border-gray-700 text-white p-2.5 rounded focus:border-[#00a4ef] outline-none transition-colors"
                                      placeholder="cm"
                                  />
                              ) : (
                                  <div className="flex gap-2">
                                      <input 
                                          type="number" 
                                          value={heightFt}
                                          onChange={(e) => setHeightFt(Number(e.target.value))}
                                          className="w-full bg-[#050505] border border-gray-700 text-white p-2.5 rounded focus:border-[#00a4ef] outline-none transition-colors"
                                          placeholder="ft"
                                      />
                                      <input 
                                          type="number" 
                                          value={heightIn}
                                          onChange={(e) => setHeightIn(Number(e.target.value))}
                                          className="w-full bg-[#050505] border border-gray-700 text-white p-2.5 rounded focus:border-[#00a4ef] outline-none transition-colors"
                                          placeholder="in"
                                      />
                                  </div>
                              )}
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">Weight (kg)</label>
                              <input 
                                  type="number" 
                                  value={weight}
                                  onChange={(e) => setWeight(Number(e.target.value))}
                                  className="w-full bg-[#050505] border border-gray-700 text-white p-2.5 rounded focus:border-[#00a4ef] outline-none transition-colors"
                                  placeholder="kg"
                              />
                          </div>
                      </div>

                      <div className="mb-8">
                          <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">Activity Level</label>
                          <select 
                              value={activity}
                              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                              className="w-full bg-[#050505] border border-gray-700 text-white p-3 rounded focus:border-[#00a4ef] outline-none transition-colors cursor-pointer text-sm"
                          >
                              <option value="Sedentary">Sedentary (Office Job)</option>
                              <option value="Lightly Active">Lightly Active (1-2 days/week)</option>
                              <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                              <option value="Very Active">Very Active (6-7 days/week)</option>
                              <option value="Extra Active">Extra Active (Physical Job)</option>
                          </select>
                      </div>

                      <button 
                          onClick={calculateMetrics}
                          className="w-full bg-[#00a4ef] text-black font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(0,164,239,0.5)] transition-all flex items-center justify-center gap-2"
                      >
                          <RefreshCw className="w-5 h-5" /> Calculate
                      </button>
                  </div>

                  {/* RESULTS DISPLAY */}
                  <div className="space-y-6">
                      <div className={`bg-[#0f0f1e] p-8 rounded-2xl border-2 transition-all ${results ? 'border-[#00a4ef] shadow-[0_0_30px_rgba(0,164,239,0.1)]' : 'border-gray-800 opacity-50'}`}>
                          <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                              <Activity className="w-5 h-5" /> Analysis Report
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-8 text-center mb-8">
                              <div>
                                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">BMR (Resting)</div>
                                  <div className="text-4xl font-mono font-bold text-white">{results ? results.bmr : '----'}</div>
                                  <div className="text-[10px] text-gray-600">kcal / day</div>
                              </div>
                              <div className="relative">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-gray-800"></div>
                                  <div className="text-xs text-[#00a4ef] uppercase font-bold mb-1">Maintenance (TDEE)</div>
                                  <div className="text-4xl font-mono font-bold text-[#00a4ef]">{results ? results.tdee : '----'}</div>
                                  <div className="text-[10px] text-[#00a4ef]/60">kcal / day</div>
                              </div>
                          </div>

                          <div className="bg-[#050505] p-4 rounded border border-gray-800">
                               <h4 className="text-xs text-white uppercase font-bold mb-3 flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-orange-500" /> Recommended Targets
                               </h4>
                               {results ? (
                                   <div className="space-y-2 text-sm font-mono">
                                       <div className="flex justify-between">
                                           <span className="text-gray-400">Fat Loss</span>
                                           <span className="text-orange-400">{results.tdee - 500} kcal</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="text-gray-400">Extreme Loss</span>
                                           <span className="text-red-400">{results.tdee - 800} kcal</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="text-gray-400">Muscle Gain</span>
                                           <span className="text-green-400">{results.tdee + 300} kcal</span>
                                       </div>
                                   </div>
                               ) : (
                                   <div className="text-xs text-gray-600 text-center py-2">Waiting for input data...</div>
                               )}
                          </div>
                      </div>

                      <div className="bg-[#1a3a5a]/20 border border-[#1a3a5a] p-4 rounded-xl flex gap-4 items-start">
                          <div className="bg-[#00a4ef]/10 p-2 rounded text-[#00a4ef]">
                              <Activity className="w-6 h-6" />
                          </div>
                          <div>
                              <h4 className="text-white font-bold text-sm mb-1">Why this matters?</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                  BMR is what you burn in a coma. TDEE is what you burn living your life. 
                                  To lose weight, you must eat below your TDEE. This is the First Law of Thermodynamics.
                              </p>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Hero;
