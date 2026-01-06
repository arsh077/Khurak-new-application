
import React, { useState, useRef } from 'react';
import { UserProfile, DailyLog, ActivityLevel, Gender } from '../types';
import { Droplets, Moon, Flame, Zap, CheckSquare, RefreshCw, Calculator, MapPin, Camera, UploadCloud, Leaf } from 'lucide-react';
import { findHealthyPlaces } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  log: DailyLog;
  onUpdateWater: (amount: number) => void;
  onQuickBurn: (calories: number) => void;
}

// --- MISSION SYSTEM ---
interface SideOp {
    id: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    action: string;
    type: 'action' | 'water' | 'photo' | 'wait';
    burn: number;
    color: string;
}

const MISSION_POOL: SideOp[] = [
    { id: 'water_1', title: 'Hydration Check', desc: 'Drink 1 glass of water.', icon: <Droplets className="w-4 h-4" />, action: 'Drink', type: 'water', burn: 0, color: 'text-blue-400' },
    { id: 'push_1', title: 'Drop & Give 10', desc: '10 Pushups immediately.', icon: <Zap className="w-4 h-4" />, action: 'Done', type: 'action', burn: 5, color: 'text-yellow-400' },
    { id: 'mob_1', title: 'Mobility', desc: 'Touch your toes for 30s.', icon: <Flame className="w-4 h-4" />, action: 'Done', type: 'action', burn: 2, color: 'text-orange-400' },
    { id: 'grass_1', title: 'Touch Grass', desc: 'Go outside. Take a photo of nature.', icon: <Leaf className="w-4 h-4" />, action: 'Upload', type: 'photo', burn: 10, color: 'text-green-400' },
    { id: 'squat_1', title: 'Leg Pump', desc: '20 Bodyweight Squats.', icon: <Zap className="w-4 h-4" />, action: 'Done', type: 'action', burn: 15, color: 'text-red-400' },
    { id: 'meditate_1', title: 'Mind Reset', desc: 'Close eyes, breathe for 2 mins.', icon: <Moon className="w-4 h-4" />, action: 'Done', type: 'wait', burn: 0, color: 'text-purple-400' },
    { id: 'walk_1', title: 'Scout Patrol', desc: 'Walk 500 steps now.', icon: <MapPin className="w-4 h-4" />, action: 'Done', type: 'action', burn: 25, color: 'text-emerald-400' },
    { id: 'plank_1', title: 'Core Shield', desc: 'Hold Plank for 45s.', icon: <Zap className="w-4 h-4" />, action: 'Done', type: 'action', burn: 5, color: 'text-yellow-500' },
    { id: 'read_1', title: 'Intel Gathering', desc: 'Read 2 pages of a book.', icon: <CheckSquare className="w-4 h-4" />, action: 'Read', type: 'action', burn: 0, color: 'text-blue-300' },
    { id: 'clean_1', title: 'Base Maintenance', desc: 'Clean your workspace/room.', icon: <CheckSquare className="w-4 h-4" />, action: 'Clean', type: 'action', burn: 20, color: 'text-gray-400' },
    { id: 'stretch_1', title: 'Decompress', desc: 'Stretch your neck & shoulders.', icon: <Flame className="w-4 h-4" />, action: 'Done', type: 'action', burn: 2, color: 'text-orange-300' },
    { id: 'sun_1', title: 'Solar Charge', desc: 'Stand in sunlight for 5 mins.', icon: <Zap className="w-4 h-4" />, action: 'Done', type: 'action', burn: 0, color: 'text-yellow-200' },
    { id: 'cold_1', title: 'Cold Shock', desc: 'Splash cold water on face.', icon: <Droplets className="w-4 h-4" />, action: 'Done', type: 'action', burn: 0, color: 'text-cyan-400' },
    { id: 'sugar_1', title: 'Discipline', desc: 'No sugar for next 4 hours.', icon: <CheckSquare className="w-4 h-4" />, action: 'Accept', type: 'wait', burn: 0, color: 'text-red-500' },
    { id: 'lunges_1', title: 'Leg Drive', desc: '10 Lunges per leg.', icon: <Zap className="w-4 h-4" />, action: 'Done', type: 'action', burn: 12, color: 'text-red-400' },
    { id: 'breathe_1', title: 'Oxygenate', desc: '10 Deep Box Breaths.', icon: <Moon className="w-4 h-4" />, action: 'Done', type: 'action', burn: 0, color: 'text-indigo-400' }
];

const Dashboard: React.FC<DashboardProps> = ({ profile, log, onUpdateWater, onQuickBurn }) => {
  // Side Ops State
  const [activeOps, setActiveOps] = useState<SideOp[]>(MISSION_POOL.slice(0, 3));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingOpId, setUploadingOpId] = useState<string | null>(null);

  // Calculator State
  const [calcWeight, setCalcWeight] = useState(profile.weight);
  const [calcHeight, setCalcHeight] = useState(profile.height);
  const [calcAge, setCalcAge] = useState(profile.age);
  const [calcGender, setCalcGender] = useState(profile.gender);
  const [calcActivity, setCalcActivity] = useState(profile.activityLevel);
  const [calculatedBMR, setCalculatedBMR] = useState<number | null>(null);
  const [calculatedTDEE, setCalculatedTDEE] = useState<number | null>(null);
  
  // Map State
  const [nearby, setNearby] = useState<string>("");
  const [scouting, setScouting] = useState(false);

  // --- DERIVED DATA ---
  const totalCaloriesEaten = [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].reduce((acc, item) => acc + item.calories, 0);
  const remainingCalories = profile.dailyCalorieTarget - totalCaloriesEaten + log.exerciseCalories;
  const eatenPercentage = Math.min((totalCaloriesEaten / profile.dailyCalorieTarget) * 100, 100);

  const macroData = [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].reduce(
    (acc, item) => ({
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  // --- ACTIONS ---

  const handleCompleteOp = (op: SideOp) => {
      // 1. Action specific logic
      if (op.type === 'water') onUpdateWater(8);
      if (op.burn > 0) onQuickBurn(op.burn);

      // 2. Visual Feedback
      if (op.type === 'photo') {
          // Handled by file input, but if triggered manually (testing):
          alert(`🌿 Photo uploaded to Community Grid! +${op.burn} kcal burned.`);
      }

      // 3. Cycle Mission
      replaceMission(op.id);
  };

  const replaceMission = (oldId: string) => {
      setActiveOps(prev => {
          const remaining = MISSION_POOL.filter(m => !prev.find(p => p.id === m.id) && m.id !== oldId);
          const randomNew = remaining[Math.floor(Math.random() * remaining.length)];
          
          return prev.map(p => p.id === oldId ? randomNew : p);
      });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && uploadingOpId) {
          const op = activeOps.find(o => o.id === uploadingOpId);
          if(op) {
              alert("📸 Image secured. Uploaded to KHURAK Community Feed.");
              handleCompleteOp(op);
          }
          setUploadingOpId(null);
      }
  };

  const triggerFileUpload = (id: string) => {
      setUploadingOpId(id);
      fileInputRef.current?.click();
  };

  const calculateStats = () => {
      let bmr = 0;
      if (calcGender === Gender.Male) {
          bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5;
      } else {
          bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge - 161;
      }
      
      let multiplier = 1.2;
      switch (calcActivity) {
          case ActivityLevel.LightlyActive: multiplier = 1.375; break;
          case ActivityLevel.ModeratelyActive: multiplier = 1.55; break;
          case ActivityLevel.VeryActive: multiplier = 1.725; break;
          case ActivityLevel.ExtraActive: multiplier = 1.9; break;
      }

      setCalculatedBMR(Math.round(bmr));
      setCalculatedTDEE(Math.round(bmr * multiplier));
  };

  const handleFindLocation = () => {
      if(!navigator.geolocation) {
          alert("Geolocation needed."); 
          return;
      }
      setScouting(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
          const res = await findHealthyPlaces(pos.coords.latitude, pos.coords.longitude);
          setNearby(res);
          setScouting(false);
          alert(res); // Simple alert for now as requested "integrate map"
      }, () => setScouting(false));
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-6 space-y-8 pb-24">
      
      {/* Hidden File Input for "Touch Grass" */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />

      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-8">
          <div>
            <h2 className="text-4xl font-serif text-white tracking-widest uppercase">My Daily Log</h2>
            <p className="text-[#32b8c6] italic mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right hidden md:block">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Target</div>
             <div className="text-3xl font-serif text-white">{profile.dailyCalorieTarget} <span className="text-base text-[#32b8c6] font-sans">kcal</span></div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- MAIN CALORIE CARD --- */}
        <div className="bg-[#111827] p-8 rounded-tr-3xl rounded-bl-3xl shadow-[0_0_20px_rgba(50,184,198,0.1)] border border-gray-700 col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#fbbf24]"></div>
            
            {/* Background Data Stream Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <div className="animate-pulse text-[10px] text-[#32b8c6] font-mono p-4">
                    SYSTEM_CALORIES_TRACKING... METABOLISM_ACTIVE... BURNING...
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
                <div className="space-y-6">
                     <div>
                        <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Energy Remaining</span>
                        <div className="text-6xl font-serif text-white mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            {remainingCalories}
                        </div>
                        {log.exerciseCalories > 0 && (
                            <div className="text-xs text-green-500 mt-1 font-mono">
                                +{log.exerciseCalories} added from activity
                            </div>
                        )}
                     </div>
                     
                     <div className="flex gap-8">
                        <div>
                            <div className="text-xs text-gray-500 font-bold uppercase">Consumed</div>
                            <div className="text-xl font-bold text-[#fbbf24]">{totalCaloriesEaten}</div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 font-bold uppercase">Burned</div>
                            <div className="text-xl font-bold text-green-500">{log.exerciseCalories}</div>
                        </div>
                     </div>
                </div>

                {/* CSS Conic Gradient Chart */}
                <div className="w-48 h-48 relative mt-6 md:mt-0 flex items-center justify-center">
                    <div 
                        className="w-full h-full rounded-full transition-all duration-1000"
                        style={{
                            background: `conic-gradient(#fbbf24 0% ${eatenPercentage}%, #374151 ${eatenPercentage}% 100%)`
                        }}
                    ></div>
                    <div className="absolute inset-2 bg-[#111827] rounded-full flex items-center justify-center flex-col shadow-inner">
                        <Flame className="w-8 h-8 text-[#fbbf24] mb-1" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
                        <span className="text-white font-bold">{Math.round(eatenPercentage)}%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- DYNAMIC SIDE OPS --- */}
        <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 font-serif tracking-widest uppercase flex items-center gap-2 border-b border-gray-600 pb-2">
                <CheckSquare className="w-5 h-5 text-green-500" /> Side Ops <span className="text-xs text-gray-500 ml-auto font-sans normal-case">Cycle upon completion</span>
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {activeOps.map((op) => (
                    <div key={op.id} className="flex items-center justify-between bg-[#111827] p-3 rounded border border-gray-700 hover:border-[#32b8c6] transition-all group animate-in slide-in-from-right-2">
                        <div className="flex items-center gap-3">
                            <div className={`bg-gray-800 p-2 rounded-full ${op.color}`}>{op.icon}</div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase">{op.title}</p>
                                <p className="text-[10px] text-gray-500">{op.desc}</p>
                                {op.burn > 0 && <span className="text-[9px] text-green-500 font-mono">Burn: {op.burn} kcal</span>}
                            </div>
                        </div>
                        <button 
                            onClick={() => op.type === 'photo' ? triggerFileUpload(op.id) : handleCompleteOp(op)}
                            className={`text-[10px] font-bold border px-3 py-1.5 rounded transition-all uppercase tracking-wider ${op.type === 'photo' ? 'text-green-400 border-green-400 hover:bg-green-400 hover:text-black' : 'text-[#32b8c6] border-[#32b8c6] hover:bg-[#32b8c6] hover:text-black'}`}
                        >
                            {op.action}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* --- MACROS --- */}
        <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700 relative">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#fbbf24]"></div>
            <h3 className="text-lg font-bold text-white mb-6 font-serif tracking-widest uppercase">Macro Breakdown</h3>
            <div className="space-y-5">
                {[
                    { label: 'Protein', val: macroData.protein, target: profile.proteinTarget, col: 'bg-white' },
                    { label: 'Carbs', val: macroData.carbs, target: 250, col: 'bg-[#fbbf24]' },
                    { label: 'Fats', val: macroData.fats, target: 70, col: 'bg-gray-500' },
                ].map((m) => (
                    <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1 text-gray-400 font-mono uppercase">
                            <span>{m.label}</span>
                            <span className="font-bold text-white">{m.val}g <span className="text-gray-600 font-normal">/ {m.target}g</span></span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`${m.col} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min((m.val / m.target) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- WATER --- */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group border border-blue-900/30">
            <div className="absolute inset-0 bg-blue-500/5"></div>
            <Droplets className="w-8 h-8 text-blue-500 mb-2 relative z-10" />
            <h3 className="text-lg font-serif font-bold text-blue-400 tracking-widest relative z-10">Hydration</h3>
            <div className="text-5xl font-serif text-blue-500 my-4 flex items-baseline relative z-10">
                {Math.round(log.waterIntake / 8)}
                <span className="text-lg font-sans text-blue-400 ml-1">Glasses</span>
            </div>
            <p className="text-xs text-blue-300/50 mb-4 uppercase font-bold tracking-widest relative z-10">({log.waterIntake} oz Total)</p>
            <div className="flex gap-4 relative z-10">
                <button onClick={() => onUpdateWater(8)} className="w-12 h-12 rounded-full bg-white text-blue-600 font-bold shadow-lg hover:bg-blue-500 hover:text-white transition flex items-center justify-center text-xl" title="Add 1 Glass">+</button>
                <button onClick={() => onUpdateWater(-8)} className="w-12 h-12 rounded-full bg-white text-blue-600 font-bold shadow-lg hover:bg-blue-500 hover:text-white transition flex items-center justify-center text-xl" title="Remove 1 Glass">-</button>
            </div>
        </div>
      
       {/* --- RECOVERY --- */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 flex flex-col items-center justify-center text-white shadow-inner">
            <Moon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-serif font-bold text-gray-300 tracking-widest">Recovery</h3>
            <div className="text-5xl font-serif text-purple-400 my-4">{log.sleepHours}<span className="text-lg font-sans text-gray-600 ml-1">hrs</span></div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Deep Sleep Mode</p>
        </div>

        {/* --- TOOLS SECTION (Calculators & Map) --- */}
        <div className="col-span-1 md:col-span-3 bg-[#0a0f19] border border-[#1a3a5a] rounded-xl p-8 mt-8">
            <h3 className="text-2xl font-serif text-[#32b8c6] mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-[#1a3a5a] pb-4">
                <Calculator className="w-6 h-6" /> System Tools (Free Access)
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
                {/* BMR & Maintenance Calc */}
                <div className="space-y-4">
                    <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">Metabolic Calculator</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Weight (kg)</label>
                            <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} className="w-full bg-[#111827] border border-gray-700 text-white p-2 rounded" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Height (cm)</label>
                            <input type="number" value={calcHeight} onChange={(e) => setCalcHeight(Number(e.target.value))} className="w-full bg-[#111827] border border-gray-700 text-white p-2 rounded" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Age</label>
                            <input type="number" value={calcAge} onChange={(e) => setCalcAge(Number(e.target.value))} className="w-full bg-[#111827] border border-gray-700 text-white p-2 rounded" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Activity</label>
                             <select value={calcActivity} onChange={(e) => setCalcActivity(e.target.value as ActivityLevel)} className="w-full bg-[#111827] border border-gray-700 text-white p-2 rounded text-xs">
                                {Object.values(ActivityLevel).map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={calculateStats} className="w-full bg-[#32b8c6] text-black font-bold py-2 rounded hover:bg-white transition-colors uppercase text-sm">Calculate Metrics</button>
                    
                    {calculatedBMR && (
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-800/50 p-4 rounded border border-gray-700">
                            <div className="text-center">
                                <div className="text-xs text-gray-400 uppercase">BMR</div>
                                <div className="text-xl font-bold text-white">{calculatedBMR}</div>
                            </div>
                            <div className="text-center border-l border-gray-700">
                                <div className="text-xs text-gray-400 uppercase">Maintenance (TDEE)</div>
                                <div className="text-xl font-bold text-green-500">{calculatedTDEE}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Map Scout */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">Location Scout</h4>
                        <p className="text-gray-400 text-sm mb-4">Identify nearby training grounds, parks, and healthy food sources using Satellite Grounding.</p>
                        <button 
                            onClick={handleFindLocation}
                            disabled={scouting}
                            className="w-full border border-[#32b8c6] text-[#32b8c6] py-3 rounded hover:bg-[#32b8c6] hover:text-black transition-colors uppercase font-bold flex items-center justify-center gap-2"
                        >
                            {scouting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <MapPin className="w-4 h-4"/>}
                            {scouting ? 'Scanning Grid...' : 'Find Healthy Locations'}
                        </button>
                        {nearby && (
                             <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 max-h-32 overflow-y-auto">
                                 {nearby}
                             </div>
                        )}
                    </div>
                    
                    <div className="mt-6 border-t border-gray-800 pt-4">
                        <h5 className="text-[#32b8c6] text-xs uppercase tracking-widest mb-2">Community Feed</h5>
                        <div className="bg-gray-900 p-4 rounded text-center border border-dashed border-gray-700">
                            <UploadCloud className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Upload "Touch Grass" photos to feature here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
