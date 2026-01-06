import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HeroProps {
  onStart: () => void;
}

const egoQuotes = [
    "The world isn't fair. If you want something, take it.",
    "I am the only one who can level up.",
    "Do not stop when you are tired. Stop when you are done.",
    "Weakness is a sin. Power is necessity.",
    "Your body is the only weapon you truly own."
];

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [quote, setQuote] = useState("");
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
      setQuote(egoQuotes[Math.floor(Math.random() * egoQuotes.length)]);
  }, []);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <div 
        className="relative w-full h-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
        onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,164,239,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,164,239,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
      </div>

      {/* Floating Elements - Dumbbells (Blue Tinted) */}
      <motion.div 
        style={{ rotateX, rotateY, x: useTransform(x, [-0.5, 0.5], [-50, 50]), y: useTransform(y, [-0.5, 0.5], [-50, 50]) }}
        className="absolute z-10 top-1/4 left-[10%] hidden md:block w-64 h-64 pointer-events-none"
      >
         <img 
            src="https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-3d-dumbbell-gym-png-image_11563607.png" 
            alt="Floating Dumbbell" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,164,239,0.5)] filter brightness-50 hue-rotate-180 contrast-150"
         />
      </motion.div>

       <motion.div 
        style={{ rotateX, rotateY, x: useTransform(x, [-0.5, 0.5], [50, -50]), y: useTransform(y, [-0.5, 0.5], [50, -50]) }}
        className="absolute z-10 bottom-1/4 right-[10%] hidden md:block w-48 h-48 pointer-events-none"
      >
         <img 
            src="https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-3d-dumbbell-gym-png-image_11563607.png" 
            alt="Floating Dumbbell" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,164,239,0.5)] transform rotate-180 filter brightness-50 hue-rotate-180 contrast-150"
         />
      </motion.div>

      <div className="relative z-20 container mx-auto px-6 text-center max-w-6xl">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-6 animate-pulse">
                <span className="text-[#00a4ef] font-mono text-xs tracking-[0.3em] uppercase border border-[#00a4ef] px-4 py-1">System Notification</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tight mb-8 leading-[0.9] text-white system-text">
            AWAKEN <br/>
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a4ef] to-white italic pr-4">PLAYER</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto font-light leading-relaxed font-sans">
                "{quote}"
            </p>

            <div className="bg-red-900/20 border border-red-900/50 p-4 max-w-lg mx-auto mb-10 text-red-400 text-xs uppercase tracking-widest font-bold">
                Warning: Only start if you are willing to sacrifice your comfort zone.
            </div>
            
            <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-lg font-bold text-black transition-all duration-300 bg-[#00a4ef] hover:bg-white hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,164,239,0.5)]"
            >
            ACCEPT QUEST
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
