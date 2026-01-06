import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Goal, HormonalIssue, WorkoutPreference } from '../types';
import { Calculator, ArrowRight, Check, ArrowLeft, Activity, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 30,
    gender: Gender.Male,
    height: 170,
    weight: 70,
    activityLevel: ActivityLevel.Sedentary,
    goal: Goal.Lose,
    isVegetarian: false,
    hormonalIssues: HormonalIssue.None,
    workoutPreference: WorkoutPreference.Gym
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    let bmr = 0;
    let finalHeight = formData.height || 170;

    // Convert Height if Imperial
    if (unitSystem === 'imperial') {
        finalHeight = Math.round(((heightFeet * 12) + heightInches) * 2.54);
    }

    const { weight, age, gender, activityLevel, goal, hormonalIssues } = formData as UserProfile;

    if (gender === Gender.Male) {
      bmr = 88.362 + (13.397 * weight) + (4.799 * finalHeight) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * finalHeight) - (4.330 * age);
    }

    if (hormonalIssues === HormonalIssue.Thyroid || hormonalIssues === HormonalIssue.PCOS) {
        bmr = bmr * 0.95;
    }

    let multiplier = 1.2;
    switch (activityLevel) {
      case ActivityLevel.LightlyActive: multiplier = 1.375; break;
      case ActivityLevel.ModeratelyActive: multiplier = 1.55; break;
      case ActivityLevel.VeryActive: multiplier = 1.725; break;
      case ActivityLevel.ExtraActive: multiplier = 1.9; break;
    }

    const tdee = bmr * multiplier;
    let dailyCalorieTarget = tdee;

    if (goal === Goal.Lose) dailyCalorieTarget -= 500;
    if (goal === Goal.Gain) dailyCalorieTarget += 500;

    const proteinTarget = Math.round(weight * 1.5); 

    const fullProfile: UserProfile = {
      ...(formData as UserProfile),
      height: finalHeight,
      bmr: Math.round(bmr),
      dailyCalorieTarget: Math.round(dailyCalorieTarget),
      proteinTarget,
      startDate: new Date().toISOString(),
      startWeight: weight,
      targetWeight: goal === Goal.Lose ? weight - 10 : weight + 5,
      workoutPreference: formData.workoutPreference || WorkoutPreference.Gym,
      rank: 'Copper',
      level: 1,
      totalXP: 0
    };

    onComplete(fullProfile);
  };

  const stepTitle = ["Identity", "Physique", "Health & Style", "Directives"];

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-gray-200">
       {/* System Background */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-teal-900 via-[#32b8c6] to-teal-900 shadow-[0_0_20px_rgba(50,184,198,0.8)]"></div>

      <div className="max-w-2xl w-full bg-[#1f2937] border border-[#32b8c6]/30 shadow-[0_0_50px_rgba(50,184,198,0.1)] p-8 relative z-10 system-glow rounded-xl">
        <div className="flex items-center justify-between mb-8 border-b border-[#32b8c6]/30 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-[#32b8c6] tracking-widest uppercase font-serif">System Initialization</h2>
                <p className="text-gray-500 text-xs mt-1">Step {step}: {stepTitle[step-1]}</p>
            </div>
            <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 w-8 ${i <= step ? 'bg-[#32b8c6] shadow-[0_0_10px_#32b8c6]' : 'bg-gray-700'}`}></div>
                ))}
            </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Player Name</label>
              <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] focus:shadow-[0_0_10px_#32b8c6] outline-none transition-all rounded placeholder-gray-500" placeholder="Enter Name" />
            </div>
             <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Age</label>
                    <input type="number" value={formData.age} onChange={(e) => handleChange('age', Number(e.target.value))} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] focus:shadow-[0_0_10px_#32b8c6] outline-none transition-all rounded" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                    <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded">
                        <option value={Gender.Male}>Male</option>
                        <option value={Gender.Female}>Female</option>
                    </select>
                </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#32b8c6] text-black font-bold py-3 mt-4 hover:bg-white transition-colors uppercase tracking-widest rounded shadow-lg shadow-[#32b8c6]/20">Confirm Identity</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-center mb-4">
                <div className="flex bg-[#111827] rounded p-1 border border-gray-600">
                    <button onClick={() => setUnitSystem('metric')} className={`px-4 py-1 rounded text-xs font-bold ${unitSystem === 'metric' ? 'bg-[#32b8c6] text-black' : 'text-gray-400'}`}>CM / KG</button>
                    <button onClick={() => setUnitSystem('imperial')} className={`px-4 py-1 rounded text-xs font-bold ${unitSystem === 'imperial' ? 'bg-[#32b8c6] text-black' : 'text-gray-400'}`}>FT / KG</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Height</label>
                    {unitSystem === 'metric' ? (
                        <input type="number" value={formData.height} onChange={(e) => handleChange('height', Number(e.target.value))} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded" placeholder="cm" />
                    ) : (
                        <div className="flex gap-2">
                            <input type="number" value={heightFeet} onChange={(e) => setHeightFeet(Number(e.target.value))} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded" placeholder="ft" />
                            <input type="number" value={heightInches} onChange={(e) => setHeightInches(Number(e.target.value))} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded" placeholder="in" />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={(e) => handleChange('weight', Number(e.target.value))} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded" />
                </div>
            </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Activity Level</label>
                <select value={formData.activityLevel} onChange={(e) => handleChange('activityLevel', e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-gray-600 text-white focus:border-[#32b8c6] outline-none rounded">
                    {Object.values(ActivityLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-between gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-white uppercase text-xs tracking-widest rounded">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#32b8c6] text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest rounded shadow-lg shadow-[#32b8c6]/20">Next Phase</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hormonal Profile (Critical for AI)</label>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.values(HormonalIssue).map(issue => (
                             <button 
                                key={issue}
                                onClick={() => handleChange('hormonalIssues', issue)}
                                className={`px-4 py-3 border text-left flex items-center justify-between transition-all rounded ${formData.hormonalIssues === issue ? 'border-[#32b8c6] bg-[#32b8c6]/10 text-[#32b8c6] shadow-[0_0_10px_rgba(50,184,198,0.3)]' : 'border-gray-600 text-gray-500 hover:border-gray-400'}`}
                             >
                                <span className="font-sans font-medium">{issue}</span>
                                {formData.hormonalIssues === issue && <Activity className="w-4 h-4" />}
                             </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Workout Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(WorkoutPreference).map(style => (
                             <button 
                                key={style}
                                onClick={() => handleChange('workoutPreference', style)}
                                className={`px-4 py-3 border text-left flex items-center justify-between transition-all rounded ${formData.workoutPreference === style ? 'border-[#fbbf24] bg-[#fbbf24]/10 text-[#fbbf24]' : 'border-gray-600 text-gray-500 hover:border-gray-400'}`}
                             >
                                <span className="font-sans font-medium text-xs">{style}</span>
                                {formData.workoutPreference === style && <Dumbbell className="w-3 h-3" />}
                             </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-white uppercase text-xs tracking-widest rounded">Back</button>
                    <button onClick={() => setStep(4)} className="flex-1 bg-[#32b8c6] text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest rounded shadow-lg shadow-[#32b8c6]/20">Final Phase</button>
                </div>
             </motion.div>
        )}

        {step === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Objective</label>
                    <div className="grid grid-cols-1 gap-3">
                         {Object.values(Goal).map(goal => (
                             <button 
                                key={goal}
                                onClick={() => handleChange('goal', goal)}
                                className={`px-4 py-3 border text-left flex items-center justify-between transition-all rounded ${formData.goal === goal ? 'border-[#32b8c6] bg-[#32b8c6]/10 text-[#32b8c6] shadow-[0_0_10px_rgba(50,184,198,0.3)]' : 'border-gray-600 text-gray-500 hover:border-gray-400'}`}
                             >
                                <span className="font-sans font-medium">{goal}</span>
                                {formData.goal === goal && <Check className="w-4 h-4" />}
                             </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dietary Preference</label>
                     <div className="flex gap-4">
                        <button 
                            onClick={() => handleChange('isVegetarian', true)}
                            className={`flex-1 py-3 border text-center transition-all rounded ${formData.isVegetarian ? 'border-green-500 text-green-500 bg-green-900/10' : 'border-gray-600 text-gray-500'}`}
                        >
                            Vegetarian
                        </button>
                        <button 
                            onClick={() => handleChange('isVegetarian', false)}
                            className={`flex-1 py-3 border text-center transition-all rounded ${!formData.isVegetarian ? 'border-red-500 text-red-500 bg-red-900/10' : 'border-gray-600 text-gray-500'}`}
                        >
                            Non-Veg
                        </button>
                    </div>
                </div>

                <button onClick={calculateResults} className="w-full bg-[#32b8c6] text-black font-bold py-4 mt-2 hover:bg-white hover:shadow-[0_0_20px_white] transition-all uppercase tracking-widest flex items-center justify-center rounded shadow-lg shadow-[#32b8c6]/20">
                    <Calculator className="w-4 h-4 mr-2" />
                    Initialize System
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;