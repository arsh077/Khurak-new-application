import React, { useState } from 'react';
import { Dumbbell, Flame, Sword, Home as HomeIcon, CheckCircle, Plus, Trash2, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { ExerciseItem, WorkoutCategory, WorkoutSet } from '../types';
import { findHealthyPlaces } from '../services/geminiService';

interface ActivityLogProps {
    onLogExercise: (exercise: ExerciseItem) => void;
}

const categories: { id: WorkoutCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'Push', label: 'Push Day', icon: <Dumbbell className="w-6 h-6" />, desc: 'Chest, Shoulders, Triceps' },
    { id: 'Pull', label: 'Pull Day', icon: <Dumbbell className="w-6 h-6 rotate-90" />, desc: 'Back, Biceps, Rear Delts' },
    { id: 'Legs', label: 'Leg Day', icon: <Dumbbell className="w-6 h-6" />, desc: 'Quads, Hamstrings, Glutes' },
    { id: 'Combat', label: 'Combat', icon: <Sword className="w-6 h-6" />, desc: 'Boxing, MMA, BJJ' },
    { id: 'Home', label: 'Home / Bodyweight', icon: <HomeIcon className="w-6 h-6" />, desc: 'Calisthenics, Yoga' },
    { id: 'Cardio', label: 'Cardio', icon: <Flame className="w-6 h-6" />, desc: 'Running, Cycling' },
];

const exercisesDB: Record<WorkoutCategory, { name: string; calPerRep: number }[]> = {
    'Push': [
        { name: 'Bench Press', calPerRep: 0.4 },
        { name: 'Overhead Press', calPerRep: 0.35 },
        { name: 'Pushups', calPerRep: 0.3 },
        { name: 'Tricep Dips', calPerRep: 0.25 }
    ],
    'Pull': [
        { name: 'Deadlift', calPerRep: 0.6 },
        { name: 'Pull Ups', calPerRep: 0.5 },
        { name: 'Barbell Rows', calPerRep: 0.4 },
        { name: 'Bicep Curls', calPerRep: 0.15 }
    ],
    'Legs': [
        { name: 'Squats', calPerRep: 0.5 },
        { name: 'Leg Press', calPerRep: 0.4 },
        { name: 'Lunges', calPerRep: 0.3 },
        { name: 'Calf Raises', calPerRep: 0.1 }
    ],
    'Combat': [
        { name: 'Heavy Bag Rounds', calPerRep: 10 }, // treated as mins
        { name: 'Sparring', calPerRep: 12 }, // treated as mins
        { name: 'Shadow Boxing', calPerRep: 8 } // treated as mins
    ],
    'Home': [
        { name: 'Burpees', calPerRep: 0.5 },
        { name: 'Situps', calPerRep: 0.2 },
        { name: 'Jumping Jacks', calPerRep: 0.1 }
    ],
    'Cardio': [
        { name: 'Running', calPerRep: 10 }, // mins
        { name: 'Cycling', calPerRep: 8 } // mins
    ],
    'Other': []
};

const ActivityLog: React.FC<ActivityLogProps> = ({ onLogExercise }) => {
    const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<{name: string, calPerRep: number} | null>(null);
    const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 10, weight: 0 }]);
    const [nearbyPlaces, setNearbyPlaces] = useState<string>('');
    const [findingPlaces, setFindingPlaces] = useState(false);

    const addSet = () => setSets([...sets, { reps: 10, weight: 0 }]);
    const removeSet = (idx: number) => setSets(sets.filter((_, i) => i !== idx));
    const updateSet = (idx: number, field: keyof WorkoutSet, val: number) => {
        const newSets = [...sets];
        newSets[idx] = { ...newSets[idx], [field]: val };
        setSets(newSets);
    };

    const handleLog = () => {
        if (!selectedCategory || !selectedExercise) return;
        
        let totalBurn = 0;
        if (selectedCategory === 'Cardio' || selectedCategory === 'Combat') {
            // Treat reps as minutes for cardio
            const totalMins = sets.reduce((acc, s) => acc + s.reps, 0);
            totalBurn = totalMins * selectedExercise.calPerRep;
        } else {
            const totalReps = sets.reduce((acc, s) => acc + s.reps, 0);
            totalBurn = totalReps * selectedExercise.calPerRep; // Simple burn logic
        }

        const exercise: ExerciseItem = {
            id: Date.now().toString(),
            category: selectedCategory,
            name: selectedExercise.name,
            sets: sets,
            caloriesBurned: Math.round(totalBurn)
        };
        onLogExercise(exercise);
        setSelectedExercise(null);
        setSelectedCategory(null);
        setSets([{ reps: 10, weight: 0 }]);
    };

    const handleFindPlaces = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setFindingPlaces(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const result = await findHealthyPlaces(position.coords.latitude, position.coords.longitude);
            setNearbyPlaces(result);
            setFindingPlaces(false);
        }, () => {
            setFindingPlaces(false);
            alert("Unable to retrieve location");
        });
    }

    return (
        <div className="bg-[#0a0f19] p-8 border border-[#1a3a5a] rounded-lg shadow-[0_0_20px_rgba(0,164,239,0.1)] relative">
            <div className="absolute top-0 right-0 p-4">
                <div className="text-[#00a4ef] text-xs font-mono animate-pulse">SYSTEM LOGGING ACTIVE</div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest">Workout Log</h3>
                        <p className="text-gray-500 text-sm">Select discipline. Input Volume. Evolution follows.</p>
                    </div>
                    <button 
                        onClick={handleFindPlaces}
                        disabled={findingPlaces}
                        className="bg-[#050505] border border-[#1a3a5a] px-4 py-2 text-xs text-[#00a4ef] hover:bg-[#00a4ef] hover:text-black transition-colors flex items-center gap-2 rounded uppercase tracking-wider"
                    >
                        {findingPlaces ? <Loader2 className="w-4 h-4 animate-spin"/> : <MapPin className="w-4 h-4"/>}
                        Find Nearby Gyms
                    </button>
                </div>
                {nearbyPlaces && (
                     <div className="mt-4 p-4 bg-[#1a3a5a]/20 border border-[#1a3a5a] rounded text-sm text-gray-300">
                        <div className="text-xs text-[#00a4ef] uppercase font-bold mb-2 flex items-center gap-2"><MapPin className="w-3 h-3"/> Scout Report</div>
                        <div className="whitespace-pre-wrap">{nearbyPlaces}</div>
                     </div>
                )}
            </div>

            {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="bg-[#050505] p-6 border border-[#1a3a5a] hover:border-[#00a4ef] hover:shadow-[0_0_15px_#00a4ef] transition-all text-left group relative"
                        >
                            <div className="mb-4 text-gray-400 group-hover:text-[#00a4ef] transition-colors">
                                {cat.icon}
                            </div>
                            <h4 className="text-xl font-bold font-serif text-white">{cat.label}</h4>
                            <p className="text-xs text-gray-500 mt-2">{cat.desc}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-white mb-6 text-xs uppercase tracking-widest flex items-center">
                        &larr; Back to Disciplines
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                             <h5 className="text-[#00a4ef] text-xs uppercase tracking-widest mb-4 border-b border-[#1a3a5a] pb-2">Select Technique</h5>
                             <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {exercisesDB[selectedCategory].map((ex) => (
                                    <button 
                                        key={ex.name}
                                        onClick={() => setSelectedExercise(ex)}
                                        className={`w-full p-4 text-left flex justify-between items-center transition-all border ${selectedExercise?.name === ex.name ? 'bg-[#00a4ef]/10 border-[#00a4ef] text-[#00a4ef]' : 'bg-[#050505] border-[#1a3a5a] text-gray-400 hover:border-gray-500'}`}
                                    >
                                        <span className="font-bold font-serif">{ex.name}</span>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </button>
                                ))}
                             </div>
                        </div>

                        {selectedExercise && (
                            <div className="bg-[#050505] p-6 border border-[#1a3a5a]">
                                <h5 className="text-[#00a4ef] text-xs uppercase tracking-widest mb-6 flex justify-between">
                                    <span>Volume Entry</span>
                                    <span>{selectedExercise.name}</span>
                                </h5>

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 uppercase text-center mb-2">
                                        <div className="col-span-2">Set</div>
                                        <div className="col-span-4">{selectedCategory === 'Cardio' ? 'Mins' : 'Reps'}</div>
                                        <div className="col-span-4">Kg</div>
                                        <div className="col-span-2"></div>
                                    </div>
                                    {sets.map((set, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-2 text-center text-gray-400 font-mono">{idx + 1}</div>
                                            <div className="col-span-4">
                                                <input 
                                                    type="number" 
                                                    value={set.reps}
                                                    onChange={(e) => updateSet(idx, 'reps', Number(e.target.value))}
                                                    className="w-full bg-[#0a0f19] border border-[#1a3a5a] text-white text-center p-2 focus:border-[#00a4ef] outline-none"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <input 
                                                    type="number" 
                                                    value={set.weight}
                                                    onChange={(e) => updateSet(idx, 'weight', Number(e.target.value))}
                                                    className="w-full bg-[#0a0f19] border border-[#1a3a5a] text-white text-center p-2 focus:border-[#00a4ef] outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <button onClick={() => removeSet(idx)} className="text-red-900 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addSet} className="w-full py-2 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white flex items-center justify-center gap-2 text-sm uppercase">
                                        <Plus className="w-4 h-4" /> Add Set
                                    </button>
                                </div>

                                <button 
                                    onClick={handleLog}
                                    className="w-full py-4 bg-[#00a4ef] text-black font-bold hover:bg-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,164,239,0.4)]"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Complete Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;