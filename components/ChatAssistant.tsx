import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { getNutritionistResponse } from '../services/geminiService';

interface ChatAssistantProps {
    profile: UserProfile;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ profile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'model',
            text: `Hi ${profile.name}! I'm your KHURAK AI Nutritionist. I have access to real-time data to answer your fitness questions.`,
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const context = `User is ${profile.age} years old ${profile.gender}, ${profile.weight}kg, Goal: ${profile.goal}, Veg: ${profile.isVegetarian}.`;

        const responseText = await getNutritionistResponse(
            [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
            context
        );

        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 h-[600px] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <div className="p-6 border-b border-stone-100 bg-[#fdfbf7] flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg">AI Nutritionist</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-widest">Powered by Google Search</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fffdfa]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-stone-800 text-white rounded-br-none' 
                                : 'bg-white border border-stone-100 text-stone-700 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-white border border-stone-100 p-4 rounded-2xl rounded-bl-none flex gap-1 shadow-sm">
                            <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-stone-100">
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question..."
                        className="flex-1 px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-orange-200 transition-all font-sans"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-stone-900 hover:bg-orange-600 text-white p-4 rounded-2xl transition-colors disabled:opacity-50 shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAssistant;