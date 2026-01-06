
import React from 'react';
import { Check, Star, ArrowRight, Activity, Smartphone, Utensils, Zap, Shield, Crown } from 'lucide-react';

export const About: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="mb-12">
        <span className="bg-[#00a4ef] text-white px-4 py-1 text-sm font-bold uppercase tracking-widest inline-block mb-4 transform -skew-x-12">Chapter 2: The Story</span>
        <h2 className="text-4xl md:text-5xl font-black text-white italic font-serif tracking-wide">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a4ef] to-[#32b8c6]">ORIGIN</span>
        </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8 text-lg leading-relaxed text-gray-400 font-sans">
        <p>
          <span className="text-6xl font-serif text-[#00a4ef] float-left mr-4 mt-[-12px]">I</span>
          t began with a simple realization: <span className="text-white bg-[#00a4ef]/20 border-b-2 border-[#00a4ef] px-1 font-bold">Body develops in the kitchen.</span>
        </p>
        <p>
          Founder <span className="text-white font-bold">Arshad</span> faced a daunting reality at <span className="text-red-400 font-bold">155kg</span>. Conventional advice—expensive gyms, crash diets, and foreign superfoods—felt impossible to sustain.
        </p>
        <p>
          The solution wasn't found in a gym, but in simple, home-cooked meals. By understanding local ingredients and portion control, Arshad transformed his life, <span className="text-green-400 font-bold">losing 85kg in one year.</span>
        </p>
        <div className="bg-[#111827] border-l-4 border-[#32b8c6] p-6 shadow-[0_0_20px_rgba(50,184,198,0.1)]">
            <p className="font-bold text-white italic">
            "KHURAK was born to share this secret: Health is practical, affordable, and starts at home."
            </p>
        </div>
      </div>
      
      <div className="relative flex justify-center md:justify-end group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00a4ef] to-[#32b8c6] rounded-tr-[4rem] rounded-bl-[4rem] transform rotate-3 scale-95 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
        {/* 
            Ensure 'arshad.jpg' is in the public folder.
        */}
        <img 
          src="/arshad.jpg" 
          onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=2187&auto=format&fit=crop"; 
          }}
          alt="Arshad - Founder" 
          className="relative z-10 w-full max-w-sm h-auto object-cover rounded-tr-[4rem] rounded-bl-[4rem] shadow-2xl border-2 border-[#1a3a5a] group-hover:scale-[1.02] transition-transform duration-500 grayscale hover:grayscale-0"
        />
        <div className="absolute bottom-8 -left-4 bg-[#050505] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl border border-[#32b8c6] z-20 animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-4 text-2xl font-black text-white font-mono">
                <span className="text-red-500 line-through decoration-2">155kg</span> 
                <ArrowRight className="w-6 h-6 text-[#32b8c6]"/> 
                <span className="text-green-500">70kg</span>
            </div>
            <p className="text-[10px] text-[#32b8c6] uppercase tracking-[0.2em] font-bold mt-1">System Evolution Complete</p>
        </div>
      </div>
    </div>
  </div>
);

export const HowItWorks: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-12">
    <h2 className="text-4xl font-bold mb-16 text-center text-white font-serif tracking-widest">SYSTEM <span className="text-[#32b8c6]">PROTOCOL</span></h2>
    <div className="grid md:grid-cols-3 gap-8">
        {[
            { icon: <Activity className="w-8 h-8"/>, title: "1. Profile Analysis", desc: "Input body metrics, hormonal data, and dietary preferences for system calibration." },
            { icon: <Utensils className="w-8 h-8"/>, title: "2. Macro Allocation", desc: "Receive a precise, calorie-smart meal plan tailored to Indian cuisine." },
            { icon: <Smartphone className="w-8 h-8"/>, title: "3. Neural Tracking", desc: "Snap photos. AI identifies nutritional content instantly." },
        ].map((step, idx) => (
            <div key={idx} className="bg-[#111827] p-8 rounded-2xl border border-gray-800 hover:border-[#32b8c6] transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#32b8c6]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 text-black bg-[#32b8c6] w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(50,184,198,0.4)]">
                    {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10 text-white font-serif tracking-wide">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed relative z-10 text-sm">{step.desc}</p>
            </div>
        ))}
    </div>
  </div>
);

export const Features: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-12">
     <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
             <div>
                 <h2 className="text-4xl font-bold mb-6 text-white font-serif">WEAPONS OF <br/><span className="text-[#32b8c6]">TRANSFORMATION</span></h2>
                 <p className="text-gray-400">Advanced tools designed to hack your biology and optimize performance.</p>
             </div>
             
             <div className="space-y-6">
                 {[
                     { title: "AI Food Scanner", desc: "Point camera at Dal, Roti, or Salad. AI calculates macros." },
                     { title: "Indian Recipe DB", desc: "Access thousands of culturally relevant recipes." },
                     { title: "Smart Reminders", desc: "Water and sleep trackers that nudge you at the right time." },
                     { title: "Gamified Quests", desc: "Earn XP, Rank up from Copper to Antimatter." }
                 ].map((f, i) => (
                     <div key={i} className="flex gap-4 group">
                         <div className="mt-1 min-w-[24px]"><Check className="text-[#32b8c6] w-6 h-6 group-hover:scale-110 transition-transform" /></div>
                         <div>
                             <h4 className="text-lg font-bold text-white group-hover:text-[#32b8c6] transition-colors">{f.title}</h4>
                             <p className="text-gray-500 text-sm">{f.desc}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
        <div className="relative h-[500px] bg-[#111827] rounded-3xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
             <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="App Feature" />
             <div className="absolute bottom-0 left-0 p-8 z-20">
                 <p className="text-[#32b8c6] font-mono text-xs uppercase tracking-[0.3em] mb-2">System Interface</p>
                 <p className="text-white text-2xl font-serif italic">"Technology meets tradition."</p>
             </div>
        </div>
     </div>
  </div>
);

export const Pricing: React.FC = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white font-serif tracking-widest">ACCESS <span className="text-[#32b8c6]">LEVELS</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Select your clearance level. Health shouldn't be a luxury.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Free Tier */}
            <div className="bg-[#111827] p-8 rounded-3xl border border-gray-800 hover:border-gray-600 transition-all relative group">
                <h3 className="text-lg font-bold text-gray-400 mb-2 uppercase tracking-widest">Rookie</h3>
                <div className="text-4xl font-bold mb-6 text-white">Free</div>
                <ul className="space-y-4 text-gray-400 mb-8 text-sm">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-gray-600" /> BMR Calculator</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-gray-600" /> Basic Food Log</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-gray-600" /> Water Tracker</li>
                </ul>
                <button className="w-full py-4 rounded-xl border border-gray-700 font-bold text-gray-300 hover:bg-white hover:text-black hover:border-white transition uppercase tracking-widest text-xs">Initialize</button>
            </div>

            {/* Monthly Tier */}
            <div className="bg-[#0f0f1e] p-8 rounded-3xl border-2 border-[#32b8c6] shadow-[0_0_30px_rgba(50,184,198,0.15)] transform md:-translate-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#32b8c6] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Recommended</div>
                <h3 className="text-lg font-bold text-[#32b8c6] mb-2 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4"/> Warrior</h3>
                <div className="text-4xl font-bold mb-6 text-white">₹399<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 text-gray-300 mb-8 text-sm">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-[#32b8c6]" /> All Basic Features</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-[#32b8c6]" /> AI Food Scanner</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-[#32b8c6]" /> Personalized Meal Plans</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-[#32b8c6]" /> AI Nutritionist Chat</li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-[#32b8c6] text-black font-bold hover:bg-white hover:shadow-[0_0_20px_white] transition-all uppercase tracking-widest text-xs">Grant Access</button>
            </div>

            {/* Lifetime Tier */}
            <div className="bg-[#111827] p-8 rounded-3xl border border-yellow-600/50 hover:border-yellow-500 transition-all relative">
                <div className="absolute top-0 right-0 bg-yellow-600/20 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest border-l border-b border-yellow-600/50">Elite</div>
                <h3 className="text-lg font-bold text-yellow-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Crown className="w-4 h-4"/> Legend</h3>
                <div className="text-4xl font-bold mb-6 text-white">₹3999<span className="text-lg text-gray-500 font-normal">/once</span></div>
                <ul className="space-y-4 text-gray-400 mb-8 text-sm">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-yellow-500" /> One-time payment</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-yellow-500" /> Lifetime Access</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-yellow-500" /> Early Beta Features</li>
                </ul>
                <button className="w-full py-4 rounded-xl border border-yellow-600/50 text-yellow-500 font-bold hover:bg-yellow-500 hover:text-black transition-all uppercase tracking-widest text-xs">Permanent Access</button>
            </div>
        </div>
    </div>
);

export const SuccessStories: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-12 text-center text-white font-serif tracking-widest">PLAYER <span className="text-[#32b8c6]">LOGS</span></h2>
        
        <div className="grid gap-6">
             <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-8 items-center hover:border-[#32b8c6]/50 transition-colors">
                 <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop" className="w-24 h-24 rounded-full object-cover border-2 border-[#32b8c6]" alt="User" />
                 <div className="flex-1 text-center md:text-left">
                     <div className="flex justify-center md:justify-start text-yellow-500 mb-2 gap-1">
                         <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                     </div>
                     <p className="text-lg italic text-gray-300 mb-4 font-serif">"I used to think diet meant starving. KHURAK showed me I could eat my favorite curries and still lose weight. Down 12kg in 3 months!"</p>
                     <p className="font-bold text-[#32b8c6] uppercase text-xs tracking-widest">- Rahul S. <span className="text-gray-600">|</span> Lvl 5 Warrior</p>
                 </div>
             </div>

             <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-8 items-center hover:border-[#32b8c6]/50 transition-colors">
                 <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop" className="w-24 h-24 rounded-full object-cover border-2 border-[#32b8c6]" alt="User" />
                 <div className="flex-1 text-center md:text-left">
                     <div className="flex justify-center md:justify-start text-yellow-500 mb-2 gap-1">
                         <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                     </div>
                     <p className="text-lg italic text-gray-300 mb-4 font-serif">"The AI scanner is a game changer for homemade food. Finally, I know what's in my plate. Managing my PCOS has never been easier."</p>
                     <p className="font-bold text-[#32b8c6] uppercase text-xs tracking-widest">- Priya M. <span className="text-gray-600">|</span> Lvl 3 Scout</p>
                 </div>
             </div>
        </div>
    </div>
);
