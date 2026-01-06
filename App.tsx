
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodLogger from './components/FoodLogger';
import ActivityLog from './components/ActivityLog';
import ChatAssistant from './components/ChatAssistant';
import RecipeMaker from './components/RecipeMaker';
import RecipeBook from './components/RecipeBook';
import QuestWindow from './components/QuestWindow';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { About, HowItWorks, Features, Pricing, SuccessStories } from './components/BookPages';
import { UserProfile, DailyLog, FoodItem, ExerciseItem, Quest, SubscriptionStatus, PaymentInfo, Gender, ActivityLevel, Goal, HormonalIssue, WorkoutPreference } from './types';
import { LayoutDashboard, Camera, MessageCircle, Menu, X, Dumbbell, Home, User, AlertCircle, ChefHat, Trophy, BookOpen } from 'lucide-react';

type PageType = 'home' | 'about' | 'how-it-works' | 'features' | 'pricing' | 'success' | 'contact' | 'dashboard' | 'logger' | 'chat' | 'activity' | 'profile-setup' | 'recipe' | 'profile' | 'recipe-book';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [direction, setDirection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuestWindow, setShowQuestWindow] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Subscription State
  const [subscription, setSubscription] = useState<SubscriptionStatus>({ plan: 'free', isActive: false });

  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    waterIntake: 0,
    sleepHours: 0,
    exerciseCalories: 0,
    exercises: [],
    questsCompleted: 0,
    weeklyXP: 150 // Mocked initial XP
  });

  const navigateTo = (page: PageType) => {
    setDirection(1);
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const handleStart = () => {
    if (isLoggedIn) {
        if(profile) {
            navigateTo('dashboard');
        } else {
            setCurrentPage('profile-setup');
        }
    } else {
        setShowAuthModal(true);
    }
  };
  
  const handleAuthSuccess = (paymentInfo: PaymentInfo) => {
      setShowAuthModal(false);
      setIsLoggedIn(true);
      
      // Set Subscription
      setSubscription({
          plan: paymentInfo.plan,
          isActive: true
      });

      // Initialize profile with payment info and safe default enums
      setProfile({
          name: 'Warrior', // Default until onboarding
          age: 0,
          gender: Gender.Male,
          height: 0,
          weight: 0,
          targetWeight: 0,
          startDate: new Date().toISOString(),
          startWeight: 0,
          activityLevel: ActivityLevel.Sedentary,
          goal: Goal.Lose,
          isVegetarian: false,
          hormonalIssues: HormonalIssue.None,
          workoutPreference: WorkoutPreference.Gym,
          bmr: 0,
          dailyCalorieTarget: 2000,
          proteinTarget: 100,
          rank: 'Copper',
          level: 1,
          totalXP: 0,
          currentStreak: 0,
          bodyweightLevel: 1,
          completedWeeks: 0,
          paymentInfo: paymentInfo
      });

      setCurrentPage('profile-setup');
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setProfile(null);
      setCurrentPage('home');
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    // Merge the new profile details with the existing payment info if it exists
    setProfile(prev => prev ? ({ ...newProfile, paymentInfo: prev.paymentInfo }) : newProfile);
    setCurrentPage('dashboard');
    setShowQuestWindow(true);
  };

  const handleLogFood = (foods: FoodItem[], mealType: 'breakfast'|'lunch'|'dinner'|'snacks') => {
    setDailyLog(prev => ({
        ...prev,
        [mealType]: [...prev[mealType], ...foods]
    }));
    navigateTo('dashboard');
  };

  const handleLogExercise = (exercise: ExerciseItem) => {
      setDailyLog(prev => ({
          ...prev,
          exerciseCalories: prev.exerciseCalories + exercise.caloriesBurned,
          exercises: [...prev.exercises, exercise]
      }));
      navigateTo('dashboard');
  };

  const handleUpdateWater = (amount: number) => {
    setDailyLog(prev => ({
        ...prev,
        waterIntake: Math.max(0, prev.waterIntake + amount)
    }));
  };

  const handleUpgrade = (plan: 'monthly' | 'lifetime') => {
      // In a real scenario, this would trigger the Auth/Payment modal again
      setSubscription({ plan, isActive: true });
      alert(`System Upgraded: ${plan.toUpperCase()} ACCESS GRANTED. Welcome, Player.`);
  };

  const handleQuestComplete = (xp: number, questId?: string) => {
      if(profile) {
          // Increment total XP
          let updatedProfile = { ...profile, totalXP: profile.totalXP + xp };
          
          // If Bodyweight Warrior (ID '1') completed, assume progress in 15-week plan
          if (questId === '1') {
              const newWeeks = (profile.completedWeeks || 0) + 1;
              updatedProfile = { ...updatedProfile, completedWeeks: newWeeks };
          }

          setProfile(updatedProfile);
          setDailyLog(prev => ({...prev, weeklyXP: prev.weeklyXP + xp}));
      }
  };

  const remainingCalories = profile ? (profile.dailyCalorieTarget - ([...dailyLog.breakfast, ...dailyLog.lunch, ...dailyLog.dinner, ...dailyLog.snacks].reduce((acc, item) => acc + item.calories, 0)) + dailyLog.exerciseCalories) : 2000;

  const variants = {
    enter: (direction: number) => ({ opacity: 0, scale: 0.95 }),
    center: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: (direction: number) => ({ opacity: 0, scale: 1.05, transition: { duration: 0.3 } })
  };

  const renderPage = () => {
    switch(currentPage) {
        case 'home': return <Hero onStart={handleStart} />;
        case 'about': return <About />;
        case 'how-it-works': return <HowItWorks />;
        case 'features': return <Features />;
        case 'pricing': return <Pricing />;
        case 'success': return <SuccessStories />;
        case 'profile-setup': return <Onboarding onComplete={handleOnboardingComplete} />;
        case 'dashboard': 
            return isLoggedIn && profile ? <Dashboard profile={profile} log={dailyLog} onUpdateWater={handleUpdateWater} /> : <Hero onStart={handleStart} />;
        case 'logger':
            return <FoodLogger onLogFood={handleLogFood} remainingCalories={remainingCalories} />;
        case 'chat':
            return isLoggedIn && profile ? <ChatAssistant profile={profile} /> : null;
        case 'activity':
            return <ActivityLog onLogExercise={handleLogExercise} />;
        case 'recipe':
            return profile ? <RecipeMaker hormonalIssues={profile.hormonalIssues} /> : null;
        case 'recipe-book':
            return <RecipeBook />;
        case 'profile':
            return profile ? <Profile profile={profile} /> : null;
        default: return <div className="p-10 text-center text-white">System Error: Page Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-gray-200 relative">
      
      {showAuthModal && <Auth onLogin={handleAuthSuccess} onClose={() => setShowAuthModal(false)} />}
      {showQuestWindow && profile && (
        <QuestWindow 
            onClose={() => setShowQuestWindow(false)} 
            weeklyXP={dailyLog.weeklyXP} 
            subscription={subscription} 
            onUpgrade={handleUpgrade} 
            userPreference={profile.workoutPreference}
            rank={profile.rank}
            level={profile.level}
            onQuestComplete={handleQuestComplete}
            streak={profile.currentStreak || 0}
            weeksCompleted={profile.completedWeeks || 0}
        />
      )}

      {/* System Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#050505]/90 backdrop-blur-md border-b border-[#1f2937]">
        <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigateTo('home')}
        >
            <div className="bg-[#32b8c6] text-black w-10 h-10 flex items-center justify-center font-bold text-xl font-serif shadow-[0_0_15px_#32b8c6]">K</div>
            <h1 className="text-2xl font-bold tracking-widest text-white font-serif group-hover:text-[#32b8c6] transition-colors">KHURAK</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            {!isLoggedIn ? (
                <>
                    <button onClick={() => navigateTo('about')} className="hover:text-white transition">System Info</button>
                    <button onClick={() => navigateTo('pricing')} className="hover:text-white transition">Access</button>
                    <button onClick={handleStart} className="text-[#32b8c6] border border-[#32b8c6] px-4 py-2 hover:bg-[#32b8c6] hover:text-black transition rounded">Login</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigateTo('dashboard')} className="hover:text-[#32b8c6] flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> HUD</button>
                    <button onClick={() => navigateTo('logger')} className="hover:text-[#32b8c6] flex items-center gap-2"><Camera className="w-4 h-4"/> Scan</button>
                    <button onClick={() => navigateTo('activity')} className="hover:text-[#32b8c6] flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Train</button>
                    <button onClick={() => navigateTo('recipe')} className="hover:text-[#32b8c6] flex items-center gap-2"><ChefHat className="w-4 h-4"/> Synth</button>
                    <button onClick={() => navigateTo('recipe-book')} className="hover:text-[#32b8c6] flex items-center gap-2"><BookOpen className="w-4 h-4"/> Recipes</button>
                    <button onClick={() => setShowQuestWindow(true)} className="hover:text-[#32b8c6] flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Quests</button>
                    <button onClick={() => navigateTo('profile')} className="hover:text-[#32b8c6] flex items-center gap-2"><User className="w-4 h-4"/> Status</button>
                </>
            )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-8 h-8" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050505] border-l border-[#1f2937] p-8 flex flex-col items-center justify-center space-y-8">
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8 text-white" /></button>
            <h2 className="text-3xl font-serif text-[#32b8c6] mb-8 tracking-widest uppercase">System Menu</h2>
            {!isLoggedIn ? (
                <>
                    <button onClick={() => navigateTo('home')} className="text-xl text-white uppercase tracking-widest">Home</button>
                    <button onClick={() => navigateTo('pricing')} className="text-xl text-white uppercase tracking-widest">Access</button>
                    <button onClick={handleStart} className="bg-[#32b8c6] text-black px-8 py-3 font-bold uppercase tracking-widest">Initialize</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigateTo('dashboard')} className="text-xl text-white uppercase tracking-widest">HUD</button>
                    <button onClick={() => navigateTo('logger')} className="text-xl text-white uppercase tracking-widest">Scanner</button>
                    <button onClick={() => navigateTo('activity')} className="text-xl text-white uppercase tracking-widest">Training</button>
                    <button onClick={() => navigateTo('recipe')} className="text-xl text-white uppercase tracking-widest">Synth</button>
                    <button onClick={() => navigateTo('recipe-book')} className="text-xl text-white uppercase tracking-widest">Recipe Book</button>
                    <button onClick={() => navigateTo('profile')} className="text-xl text-white uppercase tracking-widest">Status</button>
                    <button onClick={() => setShowQuestWindow(true)} className="text-xl text-[#32b8c6] uppercase tracking-widest">Quests</button>
                </>
            )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative w-full max-w-7xl mx-auto pt-24 px-4 pb-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full min-h-[80vh]"
            >
                {renderPage()}
            </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
};

export default App;
