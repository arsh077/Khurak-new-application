import React, { useState } from 'react';
import { Search, Utensils, Clock, Flame, ChevronRight, X, ChefHat, Info } from 'lucide-react';

const RECIPES = [
    // --- BREAKFAST ---
    { 
        id: 101, title: 'Idli (Rice & Lentil Cakes)', type: 'Breakfast', cals: 60, protein: 2, time: '25m', tags: ['Gut Health', 'Veg'], color: 'text-white', 
        desc: 'Steamed fluffy cakes, easy to digest.',
        ingredients: ['Rice 50g', 'Urad dal 15g', 'Salt pinch', 'Water'],
        steps: ['Soak rice & urad dal separately for 2-3 hours.', 'Grind into smooth, fluffy batter.', 'Ferment for 6-8 hours.', 'Fill idli molds 3/4 full.', 'Steam for 8-10 minutes until cooked through.']
    },
    { 
        id: 102, title: 'Dosa (Crispy Rice Pancake)', type: 'Breakfast', cals: 120, protein: 2.5, time: '18m', tags: ['Crispy', 'Veg'], color: 'text-yellow-400', 
        desc: 'Thin crispy crepe made from fermented batter.',
        ingredients: ['Dosa batter 150g', 'Oil 1.5 tsp', 'Salt pinch'],
        steps: ['Heat non-stick griddle to medium-high.', 'Pour 1 ladle of batter in center.', 'Spread thin using spatula bottom.', 'Drizzle oil around edges.', 'Cook until golden & crispy.', 'Flip & cook other side.']
    },
    { 
        id: 103, title: 'Medu Vada (Lentil Donuts)', type: 'Breakfast', cals: 100, protein: 3, time: '35m', tags: ['Protein', 'Veg'], color: 'text-orange-400', 
        desc: 'Crispy lentil fritters, excellent for muscle gain.',
        ingredients: ['Urad dal 25g', 'Ginger 1/2 inch', 'Green chili 1', 'Salt pinch', 'Oil 1 tsp'],
        steps: ['Soak urad dal for 4 hours.', 'Grind with ginger, chili, salt to stiff paste (no water).', 'Heat oil.', 'Shape into donuts with hole in center.', 'Fry until golden & crispy.']
    },
    { 
        id: 104, title: 'Ven Pongal', type: 'Breakfast', cals: 150, protein: 4, time: '30m', tags: ['Comfort', 'Veg'], color: 'text-yellow-200', 
        desc: 'Savory rice and lentil porridge with peppercorns.',
        ingredients: ['Rice 25g', 'Moong Dal 10g', 'Ghee 1/2 tsp', 'Cumin', 'Black Pepper'],
        steps: ['Pressure cook rice and moong dal until soft.', 'Heat ghee, temper cumin, pepper, and cashews.', 'Mix tempering with cooked dal-rice.', 'Serve warm.']
    },
    { 
        id: 105, title: 'Uppuma (Semolina Porridge)', type: 'Breakfast', cals: 140, protein: 3, time: '25m', tags: ['Quick', 'Veg'], color: 'text-yellow-100', 
        desc: 'Savory semolina breakfast with vegetables.',
        ingredients: ['Semolina 30g', 'Veggies 50g', 'Oil 1 tsp', 'Mustard seeds'],
        steps: ['Roast semolina.', 'Heat oil, temper spices and sauté veggies.', 'Add water and boil.', 'Slowly add roasted semolina and stir till thick.']
    },
    { 
        id: 107, title: 'Pesarattu (Moong Dal Crepes)', type: 'Breakfast', cals: 100, protein: 4, time: 'Varies', tags: ['High Protein', 'Veg'], color: 'text-green-500', 
        desc: 'Green gram pancakes, very high protein.',
        ingredients: ['Whole Moong Dal 30g', 'Ginger', 'Chili', 'Oil 1 tsp'],
        steps: ['Soak moong dal overnight.', 'Grind with ginger/chili to paste.', 'Spread on hot tawa like dosa.', 'Cook with minimal oil.']
    },
    { 
        id: 108, title: 'Ragi Dosa', type: 'Breakfast', cals: 110, protein: 3, time: '18m', tags: ['Calcium', 'Veg'], color: 'text-red-900', 
        desc: 'Finger millet crepe, great for bones.',
        ingredients: ['Ragi flour 50g', 'Rice flour 25g', 'Water', 'Salt'],
        steps: ['Mix flours with water to make batter.', 'Let rest 5 mins.', 'Pour on hot griddle.', 'Cook until crisp.']
    },
    { 
        id: 110, title: 'Puttu (Steamed Rice Cake)', type: 'Breakfast', cals: 100, protein: 2, time: '30m', tags: ['Oil Free', 'Veg'], color: 'text-white', 
        desc: 'Steamed rice flour and coconut cylinders.',
        ingredients: ['Rice Flour 40g', 'Coconut 20g', 'Salt'],
        steps: ['Mix flour with water to crumbly texture.', 'Layer in mold with coconut.', 'Steam for 10-12 minutes.']
    },
    { 
        id: 113, title: 'Poha (Flattened Rice)', type: 'Breakfast', cals: 120, protein: 2, time: '15m', tags: ['Light', 'Veg'], color: 'text-yellow-300', 
        desc: 'Light, fluffy flattened rice with potatoes and peanuts.',
        ingredients: ['Poha 50g', 'Potatoes 50g', 'Peas 25g', 'Mustard seeds', 'Turmeric', 'Peanuts'],
        steps: ['Rinse poha quickly.', 'Heat oil, add mustard seeds & peanuts.', 'Add potatoes and cook until soft.', 'Add turmeric and peas.', 'Add rinsed poha, mix gently.', 'Steam for 2 mins covered.']
    },
    { 
        id: 125, title: 'Rava Dosa', type: 'Breakfast', cals: 120, protein: 2, time: '18m', tags: ['Crispy', 'Veg'], color: 'text-orange-200', 
        desc: 'Instant semolina crepe.',
        ingredients: ['Semolina 35g', 'Rice Flour 15g', 'Yogurt 25g', 'Jeera'],
        steps: ['Mix ingredients into thin batter.', 'Pour from height onto hot tawa.', 'Drizzle oil.', 'Cook till golden brown.']
    },
    { 
        id: 131, title: 'Aloo Paratha', type: 'Breakfast', cals: 200, protein: 5, time: '35m', tags: ['Filling', 'Veg'], color: 'text-yellow-600', 
        desc: 'Whole wheat bread stuffed with spiced potatoes.',
        ingredients: ['Wheat Flour 50g', 'Potato 75g', 'Spices', 'Ghee 1.5 tsp'],
        steps: ['Make dough.', 'Mash boiled potatoes with spices.', 'Stuff dough with potato mix.', 'Roll out and cook on tawa with ghee.']
    },
    { 
        id: 132, title: 'Methi Paratha', type: 'Breakfast', cals: 180, protein: 4, time: '35m', tags: ['Iron Rich', 'Veg'], color: 'text-green-700', 
        desc: 'Fenugreek leaves flatbread.',
        ingredients: ['Wheat flour 45g', 'Methi leaves 50g', 'Spices'],
        steps: ['Mix chopped methi leaves into flour.', 'Knead dough.', 'Roll and cook with minimal oil.']
    },
    { 
        id: 151, title: 'Oats Upma', type: 'Breakfast', cals: 140, protein: 4, time: '20m', tags: ['Fiber', 'Veg'], color: 'text-stone-300', 
        desc: 'Savoury oats with vegetables.',
        ingredients: ['Rolled Oats 30g', 'Vegetables 50g', 'Spices'],
        steps: ['Toast oats.', 'Sauté veggies in oil.', 'Add water and boil.', 'Add oats and cook till dry.']
    },
    
    // --- LUNCH / DINNER ---
    { 
        id: 201, title: 'Chicken Curry (Home Style)', type: 'Dinner', cals: 400, protein: 25, time: '40m', tags: ['High Protein', 'Non-Veg'], color: 'text-red-400', 
        desc: 'Basic chicken curry with minimal oil.',
        ingredients: ['250g Chicken', '1 tbsp Ginger-Garlic', '2 Onions', '2 Tomatoes', 'Whole Spices'],
        steps: ['Marinate chicken.', 'Sauté onions and spices.', 'Add tomatoes and cook masala.', 'Add chicken and water, cover and cook.', 'Simmer until tender.']
    },
    { 
        id: 202, title: 'Paneer Bhurji', type: 'Lunch', cals: 350, protein: 18, time: '20m', tags: ['High Protein', 'Veg'], color: 'text-orange-400', 
        desc: 'Scrambled paneer with onions and spices.',
        ingredients: ['200g Paneer (crumbled)', '1 Onion', '1 Tomato', 'Spices'],
        steps: ['Heat oil, add cumin.', 'Sauté onions and tomatoes.', 'Add crumbled paneer and mix.', 'Garnish with coriander.']
    },
    { 
        id: 205, title: 'Soya Chunk Pulao', type: 'Lunch', cals: 450, protein: 22, time: '30m', tags: ['High Protein', 'Veg'], color: 'text-green-400', 
        desc: 'Rice dish loaded with soya chunks.',
        ingredients: ['1 cup Rice', '1/2 cup Soya Chunks', 'Whole Spices'],
        steps: ['Boil soya chunks.', 'Heat oil, add spices.', 'Add onions and soya.', 'Add rice and water.', 'Pressure cook.']
    },
    { 
        id: 206, title: 'Egg Curry', type: 'Dinner', cals: 320, protein: 14, time: '25m', tags: ['High Protein', 'Non-Veg'], color: 'text-yellow-200', 
        desc: 'Boiled eggs in a tomato gravy.',
        ingredients: ['2 Boiled Eggs', 'Onion-Tomato paste', 'Spices'],
        steps: ['Prepare gravy with onion-tomato paste.', 'Add water and simmer.', 'Add sliced boiled eggs.', 'Cook for 5 mins.']
    },
    { 
        id: 229, title: 'Curd Rice', type: 'Lunch', cals: 120, protein: 4, time: '5m', tags: ['Probiotic', 'Veg'], color: 'text-white', 
        desc: 'Cooling yogurt rice with tempering.',
        ingredients: ['Cooked Rice', 'Yogurt', 'Mustard seeds', 'Curry leaves'],
        steps: ['Mix rice and yogurt.', 'Temper mustard seeds, curry leaves, and chili in oil.', 'Pour over rice.']
    },
    { 
        id: 230, title: 'Tamarind Rice (Puliyogare)', type: 'Lunch', cals: 140, protein: 2, time: '25m', tags: ['Tangy', 'Veg'], color: 'text-orange-800', 
        desc: 'Spicy and tangy tamarind rice.',
        ingredients: ['Rice', 'Tamarind paste', 'Peanuts', 'Spices'],
        steps: ['Cook rice.', 'Make tamarind paste reduction with spices.', 'Mix paste into rice with roasted peanuts.']
    },
    
    // --- SNACKS / SWEETS ---
    { 
        id: 345, title: 'Sabudana Khichdi', type: 'Snack', cals: 140, protein: 4, time: '15m', tags: ['Fasting', 'Veg'], color: 'text-white', 
        desc: 'Tapioca pearls with peanuts.',
        ingredients: ['Sabudana 40g', 'Potatoes 50g', 'Peanuts 10g'],
        steps: ['Soak sabudana overnight.', 'Sauté boiled potatoes and peanuts.', 'Add drained sabudana and cook till transparent.']
    },
    { 
        id: 347, title: 'Kheer (Rice Pudding)', type: 'Snack', cals: 160, protein: 4, time: '50m', tags: ['Sweet', 'Veg'], color: 'text-yellow-100', 
        desc: 'Traditional rice and milk pudding.',
        ingredients: ['Rice 12g', 'Milk', 'Sugar 8g', 'Cardamom'],
        steps: ['Boil milk.', 'Add rice and cook slowly.', 'Add sugar and cardamom.', 'Simmer until thick.']
    },
    { 
        id: 360, title: 'Corn Flakes with Banana', type: 'Breakfast', cals: 140, protein: 3, time: '2m', tags: ['Quick', 'Veg'], color: 'text-yellow-400', 
        desc: 'Simple cereal bowl.',
        ingredients: ['Corn flakes 30g', 'Milk 200ml', 'Banana 60g'],
        steps: ['Pour corn flakes.', 'Add milk.', 'Top with sliced banana.']
    },
    { 
        id: 366, title: 'Smoothie Bowl', type: 'Breakfast', cals: 200, protein: 6, time: '10m', tags: ['Aesthetic', 'Veg'], color: 'text-pink-400', 
        desc: 'Thick fruit smoothie with toppings.',
        ingredients: ['Berries', 'Banana', 'Yogurt', 'Granola'],
        steps: ['Blend frozen fruits and yogurt.', 'Pour into bowl.', 'Top with granola and nuts.']
    }
];

const RecipeBook: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    const filteredRecipes = filter === 'All' ? RECIPES : RECIPES.filter(r => r.type === filter);

    return (
        <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 shadow-lg h-full relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#32b8c6] font-serif text-2xl uppercase tracking-widest flex items-center gap-2">
                    <Utensils className="w-6 h-6" /> System Recipes
                </h3>
                <div className="bg-gray-800 p-2 rounded-full">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1 rounded text-xs font-bold uppercase tracking-widest transition-colors ${filter === f ? 'bg-[#32b8c6] text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {filteredRecipes.map(recipe => (
                    <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="bg-[#1f2937] border border-gray-700 p-4 rounded-lg hover:border-[#32b8c6] transition-all group cursor-pointer relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-white font-bold text-lg font-serif mb-1 group-hover:text-[#32b8c6] transition-colors">{recipe.title}</h4>
                                <p className="text-gray-500 text-xs mb-3">{recipe.desc}</p>
                                <div className="flex gap-2 mb-2">
                                    {recipe.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300 uppercase tracking-wider">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${recipe.color} text-lg`}>{recipe.cals} kcal</div>
                                <div className="text-gray-500 text-xs uppercase">Per serving</div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 font-mono">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.time}</span>
                                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.protein}g Protein</span>
                            </div>
                            <button className="text-[#32b8c6] group-hover:underline flex items-center">View <ChevronRight className="w-3 h-3" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recipe Detail Modal */}
            {selectedRecipe && (
                <div className="absolute inset-0 bg-[#111827] z-20 p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-10 rounded-xl">
                    <button onClick={() => setSelectedRecipe(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                    
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <ChefHat className="w-6 h-6 text-[#32b8c6]" />
                            <span className="text-[#32b8c6] text-xs font-bold uppercase tracking-widest">{selectedRecipe.type}</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">{selectedRecipe.title}</h2>
                        <p className="text-gray-400 text-sm italic">"{selectedRecipe.desc}"</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-[#1f2937] p-3 rounded text-center border border-gray-700">
                            <div className="text-2xl font-bold text-white">{selectedRecipe.cals}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Calories</div>
                        </div>
                        <div className="bg-[#1f2937] p-3 rounded text-center border border-gray-700">
                            <div className="text-2xl font-bold text-[#32b8c6]">{selectedRecipe.protein}g</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Protein</div>
                        </div>
                        <div className="bg-[#1f2937] p-3 rounded text-center border border-gray-700">
                            <div className="text-2xl font-bold text-white">{selectedRecipe.time}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Prep Time</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Ingredients</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                {selectedRecipe.ingredients.map((ing: string, i: number) => (
                                    <li key={i} className="flex gap-2"><span className="text-[#32b8c6]">•</span> {ing}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Instructions</h4>
                            <ol className="space-y-4 text-sm text-gray-300 list-decimal list-inside marker:text-[#32b8c6] marker:font-bold">
                                {selectedRecipe.steps.map((step: string, i: number) => (
                                    <li key={i} className="pl-2">{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="mt-8 bg-[#32b8c6]/10 p-4 rounded border border-[#32b8c6]/30 flex gap-3">
                        <Info className="w-5 h-5 text-[#32b8c6] flex-shrink-0" />
                        <p className="text-xs text-[#32b8c6]">System Tip: Adjust salt and oil to fit your specific macro requirements. Consuming protein with fiber improves absorption.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeBook;