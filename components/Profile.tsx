
import React, { useState } from 'react';
import { UserProfile, Rank } from '../types';
import { Trophy, TrendingDown, Calendar, Crown, RefreshCw, AlertTriangle } from 'lucide-react';

interface ProfileProps {
    profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
    const RANKS: Rank[] = ['Copper', 'Silver', 'Gold', 'Diamond', 'Platinum', 'Titanium', 'Antimatter'];
    const currentRankIndex = RANKS.indexOf(profile.rank);

    // Mock history data
    const history = [
        { date: 'Start', weight: profile.startWeight },
        { date: 'Current', weight: profile.weight }
    ];

    const handleRefundRequest = () => {
        if (!profile.paymentInfo) {
            alert("No payment record found.");
            return;
        }

        const daysSincePayment = Math.floor((Date.now() - profile.paymentInfo.paymentDate) / (1000 * 60 * 60 * 24));
        const amount = profile.paymentInfo.amountPaid;

        if (daysSincePayment <= 7) {
            if (confirm(`✅ ELIGIBLE FOR 100% REFUND.\n\nAmount: ₹${amount}\n\nDo you want to proceed with the refund request?`)) {
                alert(`Refund Request Submitted for ₹${amount}. Amount will be credited within 3-5 business days.`);
            }
        } else if (profile.paymentInfo.plan === 'lifetime') {
            if (confirm(`⚠️ ELIGIBLE FOR 50% REFUND (Lifetime Policy).\n\nAmount: ₹${amount / 2}\n\nDo you want to proceed?`)) {
                alert(`Partial Refund Request Submitted for ₹${amount / 2}. Amount will be credited within 3-5 business days.`);
            }
        } else {
             alert(`❌ NOT ELIGIBLE FOR REFUND.\n\nPolicy:\n- Monthly: 100% within 7 days.\n- Lifetime: 50% anytime.\n\nDays active: ${daysSincePayment}`);
        }
    };

    return (
        <div className="bg-[#0a0f19] border border-[#1a3a5a] p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-serif text-[#00a4ef] mb-6 uppercase tracking-widest border-b border-[#1a3a5a] pb-4">Player Status</h3>
            
            {/* Rank Progress Bar */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase text-gray-500 font-bold tracking-widest">Current Rank</span>
                    <span className={`text-xl font-black uppercase ${profile.rank === 'Antimatter' ? 'text-purple-500' : 'text-white'}`}>{profile.rank}</span>
                </div>
                <div className="w-full h-4 bg-gray-900 rounded-full border border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-between px-2 z-10">
                        {RANKS.map((r, i) => (
                            <div key={r} className={`w-1 h-1 rounded-full ${i <= currentRankIndex ? 'bg-white' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>
                    <div className="h-full bg-gradient-to-r from-orange-700 via-yellow-500 to-purple-600 transition-all duration-1000" style={{ width: `${((currentRankIndex + 1) / RANKS.length) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono uppercase">
                    <span>Copper</span>
                    <span>Antimatter</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-[#050505] p-6 border border-[#1a3a5a] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><Crown className="w-8 h-8" /></div>
                    <div className="text-gray-500 text-xs uppercase mb-2">Level</div>
                    <div className="text-4xl font-bold text-white font-mono">{profile.level}</div>
                </div>
                <div className="bg-[#050505] p-6 border border-[#1a3a5a] text-center">
                     <div className="text-gray-500 text-xs uppercase mb-2">Current Weight</div>
                     <div className="text-4xl font-bold text-[#00a4ef] font-mono">{profile.weight} <span className="text-sm text-gray-600">kg</span></div>
                </div>
                <div className="bg-[#050505] p-6 border border-[#1a3a5a] text-center">
                     <div className="text-gray-500 text-xs uppercase mb-2">Total XP</div>
                     <div className="text-4xl font-bold text-yellow-500 font-mono">{profile.totalXP}</div>
                </div>
            </div>

            <div className="w-full bg-[#050505] border border-[#1a3a5a] p-6 relative rounded-xl">
                 <div className="text-xs text-gray-600 uppercase mb-4 font-bold tracking-widest">Weight Log</div>
                 <div className="space-y-3">
                    {history.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-24 text-gray-500 text-xs font-mono">{entry.date}</div>
                            <div className="flex-1 bg-gray-900 h-2 rounded-full overflow-hidden">
                                <div className="bg-[#00a4ef] h-full rounded-full" style={{ width: `${Math.min((entry.weight / 150) * 100, 100)}%` }}></div>
                            </div>
                            <div className="text-white font-bold text-sm">{entry.weight} kg</div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
                <div>
                     <h4 className="text-white text-sm uppercase tracking-widest mb-4">Recent Achievements</h4>
                     <div className="flex gap-4">
                         <div className="flex items-center gap-2 bg-[#1a3a5a]/30 p-3 border border-[#1a3a5a] text-gray-300 text-sm">
                             <Trophy className="w-4 h-4 text-yellow-500" /> System Awakened
                         </div>
                         <div className="flex items-center gap-2 bg-[#1a3a5a]/30 p-3 border border-[#1a3a5a] text-gray-300 text-sm">
                             <TrendingDown className="w-4 h-4 text-green-500" /> First 5kg Lost
                         </div>
                     </div>
                </div>

                {/* Refund Section */}
                {profile.paymentInfo && (
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                        <h4 className="text-red-400 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Subscription & Refund
                        </h4>
                        <div className="text-xs text-gray-400 mb-4 space-y-1">
                            <p>Plan: <span className="text-white font-bold uppercase">{profile.paymentInfo.plan}</span></p>
                            <p>Login ID: <span className="text-[#32b8c6] font-mono">{profile.paymentInfo.loginId}</span></p>
                            <p>Txn ID: <span className="font-mono">{profile.paymentInfo.transactionId}</span></p>
                        </div>
                        <button 
                            onClick={handleRefundRequest}
                            className="w-full py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded hover:bg-red-900/40 hover:text-white transition-colors text-xs font-bold uppercase"
                        >
                            Request Refund
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
