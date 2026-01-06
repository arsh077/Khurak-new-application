
export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active',
  ExtraActive = 'Extra Active'
}

export enum Goal {
  Lose = 'Lose Weight',
  Maintain = 'Maintain Weight',
  Gain = 'Gain Weight'
}

export enum HormonalIssue {
    None = 'None',
    PCOS = 'PCOS/PCOD',
    Thyroid = 'Thyroid',
    Diabetes = 'Diabetes/Insulin Resistance',
    Other = 'Other'
}

export enum WorkoutPreference {
    Home = 'Home Workout',
    Bodyweight = 'Bodyweight Only',
    HomeDumbbell = 'Home + Dumbbells',
    Gym = 'Gym / Iron Temple',
    Walk = 'Walking Only',
    Yoga = 'Yoga Only'
}

export type Rank = 'Copper' | 'Silver' | 'Gold' | 'Diamond' | 'Platinum' | 'Titanium' | 'Antimatter';

export interface PaymentInfo {
    transactionId: string;
    loginId: string; // e.g. KHURAK_WARRIOR_1234
    paymentDate: number; // Timestamp
    amountPaid: number;
    method: 'razorpay' | 'phonepe' | 'gpay';
    plan: 'monthly' | 'lifetime';
    isRefunded: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // stored in cm
  weight: number; // in kg
  targetWeight: number;
  startDate: string; // ISO Date
  startWeight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  isVegetarian: boolean;
  hormonalIssues: HormonalIssue;
  workoutPreference: WorkoutPreference;
  bmr: number;
  dailyCalorieTarget: number;
  proteinTarget: number;
  rank: Rank;
  level: number;
  totalXP: number;
  questConfig?: QuestConfig;
  
  // Progression System
  currentStreak: number; // 0-7
  bodyweightLevel: number; // For scaling intensity
  completedWeeks: number; // For unlocking Iron Master (Need 15)

  // Payment System
  paymentInfo?: PaymentInfo;
}

export interface QuestConfig {
    hasDumbbells: boolean;
    hasPullUpBar: boolean;
    hasResistanceBands: boolean;
    injuries: string[]; // 'Shoulder', 'Knee', 'Back'
    weekNumber: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  micronutrients?: string;
  quantity: string;
  grams?: number;
}

export interface RecipeResult {
    title: string;
    steps: string[];
    macros: { calories: number, protein: number, carbs: number, fats: number };
    healthScore: number; // 1-10
    monologue: string; // "How to fit this into diet"
}

export type WorkoutCategory = 'Push' | 'Pull' | 'Legs' | 'Combat' | 'Cardio' | 'Home' | 'Other';

export interface WorkoutSet {
    reps: number;
    weight: number; // in kg, 0 if bodyweight
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: WorkoutCategory;
  sets: WorkoutSet[];
  caloriesBurned: number; // Calculated
}

export interface DailyLog {
  date: string;
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
  waterIntake: number; // in ounces
  sleepHours: number;
  exerciseCalories: number;
  exercises: ExerciseItem[];
  questsCompleted: number;
  weeklyXP: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type QuestType = 'bodyweight' | 'dumbbell' | 'yoga' | 'walk' | 'run' | 'gym' | 'mixed';

export interface QuestTask {
    name: string;
    reps: string;
    sets: number;
}

export interface Quest {
    id: string;
    type: QuestType;
    title: string;
    description: string;
    target: string;
    current: number;
    xp: number;
    difficulty: number; // 1-5 stars
    duration: number; // minutes
    isCompleted: boolean;
    isLocked: boolean; // For free tier
    tasks?: QuestTask[];
    egoMessage?: string;
}

export interface SubscriptionStatus {
    plan: 'free' | 'monthly' | 'lifetime';
    isActive: boolean;
}
