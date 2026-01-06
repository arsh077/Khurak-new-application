
import React from 'react';
import { UserProfile, DailyLog } from '../types';
import { Droplets, Moon, Flame, Utensils, Zap, CheckSquare } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  log: DailyLog;
  onUpdateWater: (amount: number) => void;
}

const SIDE_OPS = [
    { id: 1, title: 'Hydration Check', desc: 'Drink 1 glass of water now.', icon: <Droplets className="w-4 h-4 text-blue-400" />, action: 'Drink' },
    { id: 2, title: 'Drop & Give 10', desc: '10 Pushups immediately.', icon: <Zap className="w-4 h-4 text-yellow-400" />, action: 'Done' },
    { id: 3, title: 'Mobility', desc: 'Touch your toes for 30s.', icon: <Flame className="w-4 h-4 text-orange-400" />, action: 'Done' }
];

const Dashboard: React.FC<DashboardProps> = ({ profile, log, onUpdateWater }) => {
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

  return (
    <div className="p-2 md:p-6 space-y-8">
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
        {/* Calorie Summary Card */}
        <div className="bg-[#111827] p-8 rounded-tr-3xl rounded-bl-3xl shadow-[0_0_20px_rgba(50,184,198,0.1)] border border-gray-700 col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#fbbf24]"></div>
            <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
                <div className="space-y-6">
                     <div>
                        <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Energy Remaining</span>
                        <div className="text-5xl font-serif text-white mt-1">{remainingCalories}</div>
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
                        className="w-full h-full rounded-full"
                        style={{
                            background: `conic-gradient(#fbbf24 0% ${eatenPercentage}%, #374151 ${eatenPercentage}% 100%)`
                        }}
                    ></div>
                    <div className="absolute inset-2 bg-[#111827] rounded-full flex items-center justify-center flex-col">
                        <Flame className="w-8 h-8 text-[#fbbf24] mb-1" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
                        <span className="text-white font-bold">{Math.round(eatenPercentage)}%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Side Ops / Mini Quests */}
        <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4 font-serif tracking-widest uppercase flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-500" /> Side Ops
            </h3>
            <div className="space-y-3">
                {SIDE_OPS.map((op) => (
                    <div key={op.id} className="flex items-center justify-between bg-[#111827] p-3 rounded border border-gray-700 hover:border-[#32b8c6] transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-800 p-2 rounded-full">{op.icon}</div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase">{op.title}</p>
                                <p className="text-[10px] text-gray-500">{op.desc}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => op.title === 'Hydration Check' ? onUpdateWater(8) : null}
                            className="text-[10px] font-bold text-[#32b8c6] border border-[#32b8c6] px-2 py-1 rounded hover:bg-[#32b8c6] hover:text-black transition-colors"
                        >
                            {op.action}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Macros Card */}
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
                            <div className={`${m.col} h-full rounded-full`} style={{ width: `${Math.min((m.val / m.target) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Water Tracker */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
            <Droplets className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-serif font-bold text-blue-400 tracking-widest">Hydration</h3>
            <div className="text-5xl font-serif text-blue-500 my-4 flex items-baseline">
                {Math.round(log.waterIntake / 8)}
                <span className="text-lg font-sans text-blue-400 ml-1">Glasses</span>
            </div>
            <p className="text-xs text-blue-300/50 mb-4 uppercase font-bold tracking-widest">({log.waterIntake} oz Total)</p>
            <div className="flex gap-4">
                <button onClick={() => onUpdateWater(8)} className="w-12 h-12 rounded-full bg-white text-blue-600 font-bold shadow-lg hover:bg-blue-500 hover:text-white transition flex items-center justify-center text-xl" title="Add 1 Glass">+</button>
                <button onClick={() => onUpdateWater(-8)} className="w-12 h-12 rounded-full bg-white text-blue-600 font-bold shadow-lg hover:bg-blue-500 hover:text-white transition flex items-center justify-center text-xl" title="Remove 1 Glass">-</button>
            </div>
        </div>
      
       {/* Sleep */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 flex flex-col items-center justify-center text-white shadow-inner">
            <Moon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-serif font-bold text-gray-300 tracking-widest">Recovery</h3>
            <div className="text-5xl font-serif text-purple-400 my-4">{log.sleepHours}<span className="text-lg font-sans text-gray-600 ml-1">hrs</span></div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Deep Sleep Mode</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
