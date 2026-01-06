import React, { useState, useRef } from 'react';
import { Camera, Loader2, Plus, Trash2, CheckCircle, Scan, Type, Keyboard, Scale, Info, Calculator } from 'lucide-react';
import { analyzeFoodImage, analyzeFoodText, suggestNextMeal, calculateMacrosFromGrams } from '../services/geminiService';
import { FoodItem } from '../types';

interface FoodLoggerProps {
  onLogFood: (foods: FoodItem[], mealType: 'breakfast'|'lunch'|'dinner'|'snacks') => void;
  remainingCalories?: number;
}

const EGO_QUOTES = [
    "jitna le rahe ho utna gram hi dalna km naho agar ek baap ke bete ho.",
    "Don't cheat. The System sees everything.",
    "Is this fuel or failure? Log accurately.",
    "Weakness disgusts me. Be precise.",
    "A King eats with purpose. Do you?",
    "Every gram counts. Do not lie to yourself."
];

const FoodLogger: React.FC<FoodLoggerProps> = ({ onLogFood, remainingCalories = 2000 }) => {
  const [mode, setMode] = useState<'camera' | 'text' | 'manual'>('camera');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState<'breakfast'|'lunch'|'dinner'|'snacks'>('lunch');
  const [textInput, setTextInput] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  // Manual Input States
  const [manualName, setManualName] = useState('');
  const [manualGrams, setManualGrams] = useState<number>(100);
  // Auto-calculated fields
  const [manualCals, setManualCals] = useState<number>(0);
  const [manualProtein, setManualProtein] = useState<number>(0);
  const [manualFiber, setManualFiber] = useState<number>(0);
  const [manualMicros, setManualMicros] = useState('');
  const [manualCarbs, setManualCarbs] = useState<number>(0);
  const [manualFats, setManualFats] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [randomQuote, setRandomQuote] = useState(EGO_QUOTES[0]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setDetectedFoods([]);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const foods = await analyzeFoodImage(base64Data);
        setDetectedFoods(foods);
        checkSuggestion(foods);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error analyzing image", error);
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalyze = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    try {
        const foods = await analyzeFoodText(textInput);
        setDetectedFoods(foods);
        checkSuggestion(foods);
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleCalculateMacros = async () => {
      if(!manualName || !manualGrams) return;
      setIsAnalyzing(true);
      try {
          const result = await calculateMacrosFromGrams(manualName, manualGrams);
          setManualCals(result.calories);
          setManualProtein(result.protein);
          setManualCarbs(result.carbs);
          setManualFats(result.fats);
          setManualFiber(result.fiber || 0);
          setManualMicros(result.micronutrients || '');
      } catch (e) {
          console.error(e);
          alert("Could not calculate macros. Check internet connection.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleManualAdd = () => {
      if(!manualName) return;
      const food: FoodItem = {
          name: manualName,
          quantity: `${manualGrams}g`,
          grams: manualGrams,
          calories: manualCals,
          protein: manualProtein,
          carbs: manualCarbs,
          fats: manualFats,
          fiber: manualFiber,
          micronutrients: manualMicros,
      };
      setDetectedFoods([...detectedFoods, food]);
      // Reset
      setManualName('');
      setManualGrams(100);
      setManualCals(0);
      setManualProtein(0);
      setManualCarbs(0);
      setManualFats(0);
      setManualFiber(0);
      setManualMicros('');
  };

  const checkSuggestion = async (currentFoods: FoodItem[]) => {
      const mealCals = currentFoods.reduce((a,b) => a + b.calories, 0);
      const newRemaining = remainingCalories - mealCals;
      
      if (newRemaining > 0 && (mealType === 'lunch' || mealType === 'snacks')) {
          const nextMeal = mealType === 'lunch' ? 'dinner' : 'dinner';
          const sugg = await suggestNextMeal(newRemaining, nextMeal, "Vegetarian preference");
          setSuggestion(sugg);
      }
  };

  const handleConfirm = () => {
    onLogFood(detectedFoods, mealType);
    setDetectedFoods([]);
    setSuggestion(null);
    setTextInput('');
  };

  const removeFood = (index: number) => {
    const newFoods = [...detectedFoods];
    newFoods.splice(index, 1);
    setDetectedFoods(newFoods);
  };

  return (
    <div className="bg-[#111827] rounded-xl shadow-[0_0_20px_rgba(50,184,198,0.1)] border border-gray-700 p-6 relative overflow-hidden transition-all h-full">
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-serif font-bold text-white flex items-center uppercase tracking-widest">
                <Scan className="w-6 h-6 mr-3 text-[#32b8c6]" />
                Food Analyzer
            </h3>
            <div className="flex bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setMode('camera')} className={`p-2 rounded-md transition-all ${mode === 'camera' ? 'bg-[#32b8c6] text-black' : 'text-gray-400'}`}><Camera className="w-4 h-4" /></button>
                <button onClick={() => setMode('text')} className={`p-2 rounded-md transition-all ${mode === 'text' ? 'bg-[#32b8c6] text-black' : 'text-gray-400'}`}><Keyboard className="w-4 h-4" /></button>
                <button onClick={() => setMode('manual')} className={`p-2 rounded-md transition-all ${mode === 'manual' ? 'bg-[#32b8c6] text-black' : 'text-gray-400'}`}><Scale className="w-4 h-4" /></button>
            </div>
        </div>

        <div className="bg-red-900/20 border-l-2 border-red-500 p-3 mb-6">
            <p className="text-red-400 text-xs font-mono italic">"{randomQuote}"</p>
        </div>

        <div className="mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                {['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => (
                    <button 
                        key={type}
                        onClick={() => setMealType(type as any)}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${mealType === type ? 'bg-[#32b8c6] text-black border-[#32b8c6]' : 'bg-transparent text-gray-500 border-gray-600 hover:border-gray-400'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>

        {mode === 'camera' && (
            <div 
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#32b8c6] hover:bg-[#32b8c6]/5 transition-all group min-h-[200px]"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {isAnalyzing ? (
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 text-[#32b8c6] animate-spin mx-auto mb-4" />
                        <p className="text-[#32b8c6] font-mono text-sm animate-pulse">Scanning Molecular Structure...</p>
                    </div>
                ) : (
                    <div className="text-center group-hover:scale-105 transition-transform">
                        <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#32b8c6] transition-colors">
                            <Camera className="w-8 h-8 text-[#32b8c6] group-hover:text-black" />
                        </div>
                        <p className="text-lg font-bold text-white font-serif">Scan Meal</p>
                        <p className="text-xs text-gray-500 mt-2">AI detection active</p>
                    </div>
                )}
            </div>
        )}

        {mode === 'text' && (
            <div className="min-h-[200px] flex flex-col">
                <textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="e.g. 200g Chicken Breast, 150g Rice..."
                    className="w-full h-32 p-4 rounded-xl bg-gray-800 border border-gray-600 text-white focus:border-[#32b8c6] outline-none font-mono text-sm resize-none mb-4"
                />
                <button onClick={handleTextAnalyze} disabled={isAnalyzing || !textInput.trim()} className="w-full py-3 bg-[#32b8c6] text-black rounded font-bold hover:bg-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                    {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4"/> : <Type className="w-4 h-4" />} Analyze
                </button>
            </div>
        )}

        {mode === 'manual' && (
            <div className="space-y-4">
                <input type="text" placeholder="Food Name (e.g. Boiled Rice)" value={manualName} onChange={(e) => setManualName(e.target.value)} className="w-full bg-gray-800 p-3 rounded border border-gray-600 text-white text-sm" />
                
                <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 block mb-1">Grams</label>
                        <input type="number" value={manualGrams} onChange={(e) => setManualGrams(Number(e.target.value))} className="w-full bg-gray-800 p-3 rounded border border-gray-600 text-white text-sm" />
                    </div>
                    <button onClick={handleCalculateMacros} disabled={isAnalyzing || !manualName} className="bg-[#32b8c6] text-black font-bold p-3 rounded h-[46px] flex items-center gap-2 text-xs uppercase tracking-wider hover:bg-white transition-colors">
                        {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <Calculator className="w-4 h-4" />} Compute
                    </button>
                </div>

                <div className="p-4 bg-gray-800 rounded border border-gray-700">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Calculated Macros (Editable)</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <div className="text-[10px] text-gray-400">Cal</div>
                            <input type="number" value={manualCals} onChange={(e) => setManualCals(Number(e.target.value))} className="w-full bg-transparent text-white text-center border-b border-gray-600 focus:border-[#32b8c6] outline-none" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400">Prot</div>
                            <input type="number" value={manualProtein} onChange={(e) => setManualProtein(Number(e.target.value))} className="w-full bg-transparent text-white text-center border-b border-gray-600 focus:border-[#32b8c6] outline-none" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400">Carb</div>
                            <input type="number" value={manualCarbs} onChange={(e) => setManualCarbs(Number(e.target.value))} className="w-full bg-transparent text-white text-center border-b border-gray-600 focus:border-[#32b8c6] outline-none" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400">Fat</div>
                            <input type="number" value={manualFats} onChange={(e) => setManualFats(Number(e.target.value))} className="w-full bg-transparent text-white text-center border-b border-gray-600 focus:border-[#32b8c6] outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                         <div>
                            <label className="text-xs text-gray-500">Fiber (g)</label>
                            <input type="number" value={manualFiber} onChange={(e) => setManualFiber(Number(e.target.value))} className="w-full bg-transparent text-white border-b border-gray-600 text-sm py-1" />
                         </div>
                         <div>
                            <label className="text-xs text-gray-500">Micro Nutrients</label>
                            <input type="text" value={manualMicros} onChange={(e) => setManualMicros(e.target.value)} className="w-full bg-transparent text-white border-b border-gray-600 text-sm py-1" />
                         </div>
                    </div>
                </div>

                <button onClick={handleManualAdd} className="w-full py-3 border border-[#32b8c6] text-[#32b8c6] rounded font-bold hover:bg-[#32b8c6] hover:text-black transition-colors uppercase text-xs">Add To List</button>
            </div>
        )}

        {detectedFoods.length > 0 && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                     <h4 className="font-serif font-bold text-white text-lg">Inventory</h4>
                     <span className="text-[#32b8c6] font-bold text-sm">{detectedFoods.reduce((acc, curr) => acc + curr.calories, 0)} kcal</span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {detectedFoods.map((food, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                            <div>
                                <div className="font-bold text-white text-sm capitalize">{food.name}</div>
                                <div className="text-xs text-gray-500">{food.quantity} ({food.grams}g)</div>
                                {(food.fiber || food.micronutrients) && (
                                    <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
                                        {food.fiber ? <span>Fiber: {food.fiber}g</span> : null}
                                        {food.micronutrients ? <span>{food.micronutrients}</span> : null}
                                    </div>
                                )}
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <div>
                                    <div className="text-[#32b8c6] font-bold text-sm">{food.calories}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">kcal</div>
                                </div>
                                <button onClick={() => removeFood(idx)} className="text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleConfirm} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-500 transition-colors uppercase tracking-widest flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> Commit to Log
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogger;