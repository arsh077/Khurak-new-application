import React, { useState } from 'react';
import { ChefHat, Loader2, PlayCircle, Scale } from 'lucide-react';
import { generateRecipeFromIngredients } from '../services/geminiService';
import { RecipeResult } from '../types';

interface RecipeMakerProps {
    hormonalIssues: string;
}

const RecipeMaker: React.FC<RecipeMakerProps> = ({ hormonalIssues }) => {
    const [ingredients, setIngredients] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RecipeResult | null>(null);

    const handleGenerate = async () => {
        if (!ingredients.trim()) return;
        setIsLoading(true);
        try {
            const data = await generateRecipeFromIngredients(ingredients, hormonalIssues);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0a0f19] border border-[#1a3a5a] p-8 rounded-lg shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ChefHat className="w-24 h-24 text-[#00a4ef]" />
            </div>

            <h3 className="text-2xl font-serif text-[#00a4ef] mb-2 uppercase tracking-widest">Recipe Synthesis</h3>
            <p className="text-gray-400 text-sm mb-6">Input available ingredients (with grams) to generate a balanced meal.</p>

            <div className="space-y-4">
                <textarea 
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. 200g Potato, 100g Onion, 5g Turmeric, 10ml Oil..."
                    className="w-full h-32 bg-[#050505] border border-[#1a3a5a] text-white p-4 focus:border-[#00a4ef] outline-none text-sm font-mono"
                />
                
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-[#00a4ef] text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    Generate Formula
                </button>
            </div>

            {result && (
                <div className="mt-8 border-t border-[#1a3a5a] pt-6 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="text-xl text-white font-serif mb-4">{result.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#050505] p-4 border border-[#1a3a5a]">
                            <div className="text-gray-500 text-xs uppercase mb-1">Health Score</div>
                            <div className="text-2xl font-bold text-[#00a4ef]">{result.healthScore}/10</div>
                        </div>
                        <div className="bg-[#050505] p-4 border border-[#1a3a5a]">
                            <div className="text-gray-500 text-xs uppercase mb-1">Total Calories</div>
                            <div className="text-2xl font-bold text-orange-500">{result.macros.calories}</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h5 className="text-[#00a4ef] text-xs uppercase tracking-widest mb-3">Preparation Steps</h5>
                        <ul className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
                            {result.steps.map((step, idx) => (
                                <li key={idx} className="pl-2">{step}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#1a3a5a]/30 p-4 border-l-2 border-[#00a4ef]">
                        <h5 className="text-[#00a4ef] text-xs uppercase tracking-widest mb-2">System Monologue</h5>
                        <p className="text-gray-400 italic text-sm">"{result.monologue}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeMaker;
