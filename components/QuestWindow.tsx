import React, { useState } from 'react';
import { Quest, SubscriptionStatus, WorkoutPreference, QuestConfig, Rank } from '../types';
import { motion } from 'framer-motion';
import { X, Crown, Lock, CheckCircle, Trophy, Calendar, ChevronRight, Play, Info, Dumbbell, Shield, Zap, Activity } from 'lucide-react';

interface QuestWindowProps {
    onClose: () => void;
    weeklyXP: number;
    subscription: SubscriptionStatus;
    onUpgrade: (plan: 'monthly' | 'lifetime') => void;
    userPreference?: WorkoutPreference;
    rank: Rank;
    level: number;
    onQuestComplete: (xp: number, questId?: string) => void;
    streak?: number;
    weeksCompleted?: number;
}

// Data Structure mimicking the provided HTML content
const WARRIOR_PROGRAM = {
    1: {
        name: 'BODYWEIGHT WARRIOR',
        totalWeeks: 15,
        desc: 'Master your own weight.',
        xp: 50,
        difficulty: '2/5',
        duration: '30 min',
        days: {
            'Monday': [
                { title: '🔥 Push-ups Training', desc: '3 Sets × 10-15 Reps', details: ['Standard Push-ups (उठक-बैठक)', 'Chest को मजबूत करेगा', 'Arms और Shoulders को develop करेगा', 'Rest: 60s'] },
                { title: '🦵 Bodyweight Squats', desc: '3 Sets × 15-20 Reps', details: ['Standard Squats (उकड़ू बैठना)', 'Legs को मजबूत करेगा', 'Glutes को काम में लाएगा', 'Rest: 60s'] },
                { title: '⏱️ Plank Hold', desc: '3 Sets × 20-30 seconds', details: ['Core Stability Position', 'Back posture सुधारेगा', 'Rest: 45s'] },
                { title: '🧘 Stretching', desc: '5-10 minutes', details: ['Light stretching', 'Flexibility बढ़ाएगा', 'Soreness कम करेगा'] }
            ],
            'Tuesday': [
                { title: '🔥 Pull-ups / Rows', desc: '3 Sets × 5-10 Reps', details: ['Back muscles को मजबूत करने के लिए', 'Posture improve होगा', 'Rest: 90s'] },
                { title: '💪 Dips / Diamond Push-ups', desc: '3 Sets × 8-12 Reps', details: ['Triceps को target करेगा', 'Arms को define करेगा', 'Rest: 60s'] },
                { title: '🦵 Lunges', desc: '3 Sets × 12 Reps/leg', details: ['Leg Strength बढ़ाएगा', 'Balance improve होगा', 'Rest: 60s'] }
            ],
            'Wednesday': [
                { title: '🏃 Light Cardio', desc: '15-20 minutes', details: ['Walking, Jogging', 'Cardiovascular Health', 'Fat burning'] },
                { title: '🔄 Burpees', desc: '3 Sets × 5-10 Reps', details: ['Full body workout', 'Stamina बढ़ाएगा', 'Rest: 90s'] },
                { title: '🦵 Calf Raises', desc: '3 Sets × 15-20 Reps', details: ['Lower leg strength', 'Ankle stability', 'Rest: 45s'] }
            ],
            'Thursday': [
                { title: '🔥 Explosive Push-ups', desc: '3 Sets × 8-10 Reps', details: ['Explosive strength', 'Fast twitch fibers', 'Rest: 90s'] },
                { title: '💪 Mountain Climbers', desc: '3 Sets × 30 seconds', details: ['Core focus', 'Cardio intense', 'Rest: 60s'] },
                { title: '🦵 Single Leg Squats', desc: '3 Sets × 5-8 Reps', details: ['Advanced leg strength', 'Balance', 'Rest: 90s'] }
            ],
            'Friday': [
                { title: '🔥 Pike Push-ups', desc: '3 Sets × 8-12 Reps', details: ['Shoulder strength', 'Upper body power', 'Rest: 75s'] },
                { title: '💪 Hollow Body Hold', desc: '3 Sets × 15-20 seconds', details: ['Core strength', 'Body awareness', 'Rest: 60s'] },
                { title: '🦵 Jump Squats', desc: '3 Sets × 10-15 Reps', details: ['Leg power', 'High intensity', 'Rest: 75s'] }
            ],
            'Saturday': [
                { title: '🔥 Push-up Pyramid', desc: '1-5-1 Reps', details: ['Endurance build', 'Heart rate boost', 'Rest: 30s'] },
                { title: '💪 Handstand Wall Hold', desc: '3 Sets × 10-20s', details: ['Balance', 'Shoulder strength', 'Rest: 90s'] },
                { title: '🦵 Wall Sits', desc: '3 Sets × 20-30s', details: ['Leg endurance', 'Quad strength', 'Rest: 60s'] }
            ],
            'Sunday': [
                { title: '🏃 Active Recovery', desc: '30 minutes', details: ['Light walking', 'Blood flow', 'Recovery'] },
                { title: '🧘 Meditation', desc: '10-15 minutes', details: ['Deep breathing', 'Mental health'] },
                { title: '🎯 Plan Next Week', desc: '20 minutes', details: ['Meal prep', 'Goal setting'] }
            ]
        }
    },
    2: {
        name: 'STRENGTH BUILDER',
        totalWeeks: 2, // Weeks 16-17 roughly
        desc: 'Forge steel muscles.',
        xp: 60,
        difficulty: '3/5',
        duration: '40 min',
        days: {
            'Monday': [{ title: '🏋️ Weighted Push-ups', desc: '4 Sets × 8-12 Reps', details: ['Add backpack weight', 'Muscle mass build'] }],
            'Tuesday': [{ title: '🦵 Weighted Squats', desc: '4 Sets × 10-15 Reps', details: ['Heavy load', 'Leg strength'] }],
            'Wednesday': [{ title: '🔄 HIIT Training', desc: '20 minutes', details: ['30s on / 30s off', 'Endurance'] }],
            'Thursday': [{ title: '🔥 Explosive Training', desc: '3 Sets × 8 Reps', details: ['Power development'] }],
            'Friday': [{ title: '🏋️ Strength Circuits', desc: '3 Rounds', details: ['Full body circuit'] }],
            'Saturday': [{ title: '🔥 Heavy Training', desc: 'Max Effort', details: ['Peak strength'] }],
            'Sunday': [{ title: '🧘 Rest', desc: 'Full Recovery', details: ['Sleep & Eat'] }]
        }
    },
    3: {
        name: 'IRON MASTER',
        totalWeeks: 5, // Weeks 18-22
        desc: 'Worship at the altar of gains.',
        xp: 100,
        difficulty: '4/5',
        duration: '50 min',
        days: {
            'Monday': [{ title: '🔥 Advanced Push-ups', desc: '5 Sets × 10 Reps', details: ['Pseudo planche', 'Elite strength'] }],
            'Tuesday': [{ title: '💪 Weighted Pull-ups', desc: '5 Sets × 5 Reps', details: ['Maximum back width'] }],
            'Wednesday': [{ title: '🦵 Pistol Squats', desc: '4 Sets × 5 Reps', details: ['Single leg mastery'] }],
            'Thursday': [{ title: '🔄 Power Day', desc: '4 Sets × 8 Reps', details: ['Explosive movement'] }],
            'Friday': [{ title: '🧘 Skill Day', desc: '30 mins', details: ['Muscle ups / Handstands'] }],
            'Saturday': [{ title: '🏋️ 1RM Testing', desc: 'Test Max', details: ['Find your limits'] }],
            'Sunday': [{ title: '🧘 Deep Recovery', desc: '45 mins', details: ['Yoga & Massage'] }]
        }
    }
};

const LEVELS = [
    { id: 1, name: 'BODYWEIGHT WARRIOR', weeks: '1-15', diff: '2/5', status: 'active' },
    { id: 2, name: 'STRENGTH BUILDER', weeks: '16-17', diff: '3/5', status: 'locked' },
    { id: 3, name: 'IRON MASTER', weeks: '18-22', diff: '4/5', status: 'locked' },
    { id: 4, name: 'ZEN MASTER', weeks: '23-26', diff: '3/5', status: 'locked' },
    { id: 5, name: 'PATH WALKER', weeks: '27-30', diff: '2/5', status: 'locked' }
];

const QuestWindow: React.FC<QuestWindowProps> = ({ onClose, weeklyXP, subscription, rank, level, onQuestComplete, streak = 0, weeksCompleted = 0 }) => {
    const [view, setView] = useState<'levels' | 'quest_detail'>('levels');
    const [activeLevelId, setActiveLevelId] = useState<number>(1);
    const [selectedDay, setSelectedDay] = useState<string>('Monday');
    const [completedTasks, setCompletedTasks] = useState<string[]>([]); // Track daily tasks

    // Check unlock status based on weeksCompleted
    const isLevelUnlocked = (lvlId: number) => {
        if (lvlId === 1) return true;
        // Simple logic: Level 2 unlocks after 15 weeks, Level 3 after 17, etc.
        if (lvlId === 2) return (weeksCompleted || 0) >= 15;
        if (lvlId === 3) return (weeksCompleted || 0) >= 17;
        return false;
    };

    const handleLevelClick = (lvl: any) => {
        if (!isLevelUnlocked(lvl.id)) {
            alert("🔒 Locked! Complete previous weeks to unlock.");
            return;
        }
        setActiveLevelId(lvl.id);
        setView('quest_detail');
        setSelectedDay('Monday'); // Reset to Monday on open
    };

    const handleTaskToggle = (taskTitle: string) => {
        if (completedTasks.includes(taskTitle)) {
            setCompletedTasks(prev => prev.filter(t => t !== taskTitle));
        } else {
            setCompletedTasks(prev => [...prev, taskTitle]);
        }
    };

    const handleCompleteDay = () => {
        const program = WARRIOR_PROGRAM[activeLevelId as keyof typeof WARRIOR_PROGRAM];
        onQuestComplete(program.xp, activeLevelId.toString());
        // Simple animation or alert could go here
        if (activeLevelId === 1 && (weeksCompleted || 0) >= 14) {
             alert("🎉 CONGRATULATIONS! You have completed The Path of Iron. IRON MASTER Unlocked.");
        } else {
             alert(`✅ ${selectedDay} Training Logged! +${program.xp} XP`);
        }
        setView('levels');
    };

    const activeProgram = WARRIOR_PROGRAM[activeLevelId as keyof typeof WARRIOR_PROGRAM];
    const daysList = activeProgram ? Object.keys(activeProgram.days) : [];
    const currentDayData = activeProgram ? activeProgram.days[selectedDay as keyof typeof activeProgram.days] : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-[#0f0f1e] border border-[#2086B4] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col h-full md:h-[90vh] md:rounded-xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. HEADER (Sticky) */}
                <div className="bg-gradient-to-r from-[#134252] to-[#1f2937] p-4 flex justify-between items-center border-b-2 border-[#2086B4] shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-[#2086B4]" />
                        <h1 className="text-xl md:text-2xl font-black text-[#2086B4] tracking-widest uppercase italic">Warrior Training System</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-2 rounded-full text-black font-bold text-sm items-center gap-2 shadow-lg">
                            <Crown className="w-4 h-4" /> {weeklyXP} Coins
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-colors">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0f0f1e] to-[#1a1a2e]">
                    
                    {/* VIEW: LEVELS GRID */}
                    {view === 'levels' && (
                        <div className="p-4 md:p-8 animate-in fade-in">
                            {/* Current Status Card */}
                            <div className="bg-gradient-to-br from-[#2086B4]/20 to-[#134252]/20 border-2 border-[#2086B4] rounded-xl p-6 mb-8 shadow-[0_8px_24px_rgba(32,134,180,0.2)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-[#2086B4] uppercase italic mb-1">Current Objective</h2>
                                        <div className="flex gap-2 text-sm">
                                            <span className="bg-black/30 px-3 py-1 rounded border border-white/10 text-[#2086B4]">Week {(weeksCompleted || 0) + 1} of 15</span>
                                            <span className="bg-black/30 px-3 py-1 rounded border border-white/10 text-yellow-500">Rank: {rank}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white">{(weeksCompleted || 0)}/15</div>
                                        <div className="text-xs text-gray-400 uppercase">Weeks Complete</div>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-black/50 h-3 rounded-full border border-[#2086B4]/50 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#2086B4] to-[#32b8c6] transition-all duration-1000" 
                                        style={{ width: `${Math.min(((weeksCompleted || 0) / 15) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-xs text-[#2086B4] mt-2">Finish Bodyweight Warrior to unlock Iron Master</p>
                            </div>

                            {/* Levels Grid */}
                            <div>
                                <h3 className="text-xl font-bold text-[#2086B4] mb-4 pb-2 border-b-2 border-[#2086B4] inline-block">THE PATH OF IRON</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {LEVELS.map((lvl) => {
                                        const unlocked = isLevelUnlocked(lvl.id);
                                        const completed = unlocked && lvl.id === 1 && (weeksCompleted || 0) >= 15; // Simplified logic

                                        return (
                                            <div 
                                                key={lvl.id} 
                                                onClick={() => handleLevelClick(lvl)}
                                                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden ${
                                                    completed ? 'border-green-500 bg-green-900/10' :
                                                    unlocked ? 'border-[#2086B4] bg-white/5 hover:bg-[#2086B4]/10 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(32,134,180,0.3)]' : 
                                                    'border-gray-800 bg-black/40 opacity-60'
                                                }`}
                                            >
                                                {/* Status Icon */}
                                                <div className="absolute top-4 right-4">
                                                    {completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : 
                                                     !unlocked ? <Lock className="w-6 h-6 text-gray-600" /> : 
                                                     <Play className="w-6 h-6 text-[#2086B4]" />}
                                                </div>

                                                <div className="text-xs font-bold text-gray-500 mb-2">LEVEL {lvl.id}</div>
                                                <h4 className={`text-xl font-black uppercase mb-4 ${unlocked ? 'text-white' : 'text-gray-600'}`}>{lvl.name}</h4>
                                                
                                                <div className="space-y-2 text-sm text-gray-400">
                                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                                        <span>Weeks</span>
                                                        <span className={unlocked ? 'text-[#2086B4]' : ''}>{lvl.weeks}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                                        <span>Difficulty</span>
                                                        <span className="text-yellow-500">{lvl.diff}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Status</span>
                                                        <span className={`font-bold ${completed ? 'text-green-500' : unlocked ? 'text-[#2086B4] animate-pulse' : 'text-gray-600'}`}>
                                                            {completed ? 'COMPLETED' : unlocked ? 'IN PROGRESS' : 'LOCKED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: QUEST DETAIL (Tabbed Interface) */}
                    {view === 'quest_detail' && activeProgram && (
                        <div className="flex flex-col min-h-full">
                            {/* Sub-Header / Back Button */}
                            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/20">
                                <button onClick={() => setView('levels')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Map
                                </button>
                                <div className="text-right">
                                    <h2 className="text-white font-black uppercase italic text-lg">{activeProgram.name}</h2>
                                    <div className="flex gap-3 text-[10px] text-[#2086B4] justify-end">
                                        <span className="border border-[#2086B4] px-2 py-0.5 rounded">{activeProgram.difficulty} Diff</span>
                                        <span className="border border-[#2086B4] px-2 py-0.5 rounded">{activeProgram.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 15-Week Progress Grid (Only for Bodyweight Warrior) */}
                            {activeLevelId === 1 && (
                                <div className="px-4 py-6 bg-[#0a0f19]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">15-Week Progression</span>
                                        <span className="text-xs text-[#2086B4]">{(weeksCompleted || 0)}/15 Done</span>
                                    </div>
                                    <div className="grid grid-cols-5 md:grid-cols-15 gap-1.5">
                                        {[...Array(15)].map((_, i) => {
                                            const w = i + 1;
                                            const done = w <= (weeksCompleted || 0);
                                            const current = w === (weeksCompleted || 0) + 1;
                                            return (
                                                <div key={i} className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold border ${
                                                    done ? 'bg-green-900/50 border-green-600 text-green-400' :
                                                    current ? 'bg-[#2086B4] text-white border-[#2086B4] shadow-[0_0_10px_#2086B4]' :
                                                    'bg-black/40 border-gray-800 text-gray-600'
                                                }`}>
                                                    {w}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Days Tabs (Sticky below header) */}
                            <div className="sticky top-0 z-10 bg-[#0f0f1e]/95 backdrop-blur border-b border-gray-800 overflow-x-auto">
                                <div className="flex px-4 min-w-max">
                                    {daysList.map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDay(day)}
                                            className={`px-6 py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-all ${
                                                selectedDay === day 
                                                ? 'text-[#2086B4] border-[#2086B4] bg-[#2086B4]/5' 
                                                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Exercises List (Scrollable) */}
                            <div className="p-4 md:p-8 space-y-4 pb-24">
                                <h3 className="text-2xl font-bold text-[#2086B4] mb-4 flex items-center gap-2">
                                    <Calendar className="w-6 h-6" /> {selectedDay} Protocol
                                </h3>

                                {currentDayData.map((item: any, idx: number) => {
                                    const isDone = completedTasks.includes(item.title);
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => handleTaskToggle(item.title)}
                                            className={`p-4 rounded-lg border-l-4 transition-all cursor-pointer relative group ${
                                                isDone 
                                                ? 'bg-green-900/10 border-green-500' 
                                                : 'bg-[#2086B4]/10 border-[#2086B4] hover:bg-[#2086B4]/20'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`text-lg font-bold mb-1 ${isDone ? 'text-green-400 line-through' : 'text-white'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm font-mono text-[#2086B4] mb-3">{item.desc}</p>
                                                    <ul className="space-y-1">
                                                        {item.details.map((detail: string, dIdx: number) => (
                                                            <li key={dIdx} className="text-xs text-gray-400 flex items-start gap-2">
                                                                <span className="mt-1 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                    isDone ? 'border-green-500 bg-green-500 text-black' : 'border-gray-600 group-hover:border-[#2086B4]'
                                                }`}>
                                                    {isDone && <CheckCircle className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER (Fixed for Quest Detail) */}
                {view === 'quest_detail' && (
                    <div className="bg-[#0f0f1e] border-t border-gray-800 p-4 md:p-6 shrink-0 z-20 flex justify-end gap-4 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                        <button onClick={() => setView('levels')} className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 font-bold transition-colors">
                            Close
                        </button>
                        <button 
                            onClick={handleCompleteDay}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#2086B4] to-[#1A6FA0] text-white font-bold hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(32,134,180,0.4)] transition-all flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" /> Complete Day
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QuestWindow;