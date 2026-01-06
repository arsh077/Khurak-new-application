
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, CreditCard, CheckCircle, Lock, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { PaymentInfo } from '../types';

interface AuthProps {
    onLogin: (paymentInfo: PaymentInfo) => void;
    onClose: () => void;
}

type AuthStep = 'signin' | 'otp' | 'plan' | 'payment' | 'success';

const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
    const [step, setStep] = useState<AuthStep>('signin');
    const [loading, setLoading] = useState(false);
    
    // Form Data
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'phonepe' | 'gpay'>('razorpay');
    
    // Result Data
    const [generatedId, setGeneratedId] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const handleGetOTP = () => {
        if (phone.length !== 10) {
            alert("❌ Please enter a valid 10-digit mobile number.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            // Simulation
            alert(`OTP Sent to ${phone}: 1234`);
        }, 1500);
    };

    const handleVerifyOTP = () => {
        if (otp === '1234') {
            setStep('plan');
        } else {
            alert("❌ Invalid OTP. Try '1234' for demo.");
        }
    };

    const handleProcessPayment = () => {
        setLoading(true);
        
        setTimeout(() => {
            const txnId = `TXN_${Date.now()}`;
            const loginId = `WARRIOR_${phone.slice(-4)}_${selectedPlan === 'monthly' ? 'MTH' : 'LFT'}`;
            
            setTransactionId(txnId);
            setGeneratedId(loginId);
            setLoading(false);
            setStep('success');
        }, 2000);
    };

    const handleFinalize = () => {
        const paymentInfo: PaymentInfo = {
            transactionId: transactionId,
            loginId: generatedId,
            paymentDate: Date.now(),
            amountPaid: selectedPlan === 'monthly' ? 399 : 3999,
            method: paymentMethod,
            plan: selectedPlan,
            isRefunded: false
        };
        onLogin(paymentInfo);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose}></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0f0f1e] w-full max-w-md rounded-[2rem] shadow-[0_0_50px_rgba(0,164,239,0.2)] overflow-hidden relative border border-[#1a3a5a]"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
                    <X className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                        className="h-full bg-gradient-to-r from-[#32b8c6] to-blue-600 transition-all duration-500"
                        style={{ width: step === 'signin' ? '20%' : step === 'otp' ? '40%' : step === 'plan' ? '60%' : step === 'payment' ? '80%' : '100%' }}
                    ></div>
                </div>

                <div className="p-8 md:p-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-black text-white mb-2 tracking-wide">SYSTEM ACCESS</h2>
                        <p className="text-[#32b8c6] uppercase tracking-widest text-xs font-bold">Secure Gateway</p>
                    </div>

                    {/* STEP 1: PHONE */}
                    {step === 'signin' && (
                        <div className="space-y-6">
                             <div className="bg-[#1a1a2e] border border-gray-700 p-4 rounded-xl flex items-center gap-3">
                                <Smartphone className="text-gray-400 w-5 h-5" />
                                <div className="text-gray-400 font-mono">+91</div>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Mobile Number" 
                                    className="bg-transparent outline-none text-white font-mono text-lg w-full placeholder:text-gray-600"
                                    autoFocus
                                />
                             </div>
                             <button 
                                onClick={handleGetOTP} 
                                disabled={loading || phone.length < 10}
                                className="w-full bg-[#32b8c6] hover:bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,184,198,0.3)] disabled:opacity-50"
                             >
                                {loading ? 'Processing...' : 'Get Security Code'} <ArrowRight className="w-4 h-4" />
                             </button>
                             <p className="text-center text-xs text-gray-500 mt-4">By continuing, you accept the Warrior Code.</p>
                        </div>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 'otp' && (
                        <div className="space-y-6 text-center">
                            <p className="text-gray-400 text-sm">Enter the code sent to <span className="text-white font-mono">+91 {phone}</span></p>
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                                placeholder="----" 
                                className="bg-[#1a1a2e] border border-gray-700 text-white font-mono text-4xl w-full py-4 text-center rounded-xl tracking-[1em] focus:border-[#32b8c6] outline-none transition-colors"
                                autoFocus
                            />
                            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-3 rounded text-xs font-mono">
                                DEMO CODE: 1234
                            </div>
                            <button 
                                onClick={handleVerifyOTP} 
                                className="w-full bg-[#32b8c6] hover:bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(50,184,198,0.3)]"
                            >
                                Verify Access
                            </button>
                            <button onClick={() => setStep('signin')} className="text-gray-500 hover:text-white text-xs underline">Change Number</button>
                        </div>
                    )}

                    {/* STEP 3: PLAN */}
                    {step === 'plan' && (
                        <div className="space-y-4">
                            <div 
                                onClick={() => setSelectedPlan('monthly')}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${selectedPlan === 'monthly' ? 'bg-[#32b8c6]/10 border-[#32b8c6] shadow-[0_0_20px_rgba(50,184,198,0.2)]' : 'bg-[#1a1a2e] border-gray-700 hover:border-gray-500'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-white font-bold uppercase">Monthly Warrior</h3>
                                    <div className="text-[#32b8c6] font-bold text-xl">₹399<span className="text-xs text-gray-400">/mo</span></div>
                                </div>
                                <p className="text-gray-400 text-xs">Full Access • Cancel Anytime</p>
                            </div>

                            <div 
                                onClick={() => setSelectedPlan('lifetime')}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${selectedPlan === 'lifetime' ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-[#1a1a2e] border-gray-700 hover:border-gray-500'}`}
                            >
                                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">BEST VALUE</div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-white font-bold uppercase">Lifetime Access</h3>
                                    <div className="text-yellow-500 font-bold text-xl">₹3999<span className="text-xs text-gray-400">/once</span></div>
                                </div>
                                <p className="text-gray-400 text-xs">One Time Payment • Future Updates Free</p>
                            </div>

                            <button 
                                onClick={() => setStep('payment')} 
                                className="w-full bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors mt-4"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {/* STEP 4: PAYMENT */}
                    {step === 'payment' && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-400 text-sm uppercase mb-1">Total Amount</p>
                                <div className="text-4xl font-bold text-white">₹{selectedPlan === 'monthly' ? '399' : '3999'}</div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'razorpay', label: 'Razorpay / UPI / Cards', icon: <CreditCard className="w-5 h-5"/> },
                                    { id: 'phonepe', label: 'PhonePe', icon: <Smartphone className="w-5 h-5"/> },
                                    { id: 'gpay', label: 'Google Pay', icon: <Wallet className="w-5 h-5"/> }
                                ].map((method) => (
                                    <button 
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id as any)}
                                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === method.id ? 'bg-[#32b8c6] text-black border-[#32b8c6] font-bold' : 'bg-[#1a1a2e] border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                                    >
                                        {method.icon}
                                        {method.label}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={handleProcessPayment} 
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                                {loading ? 'Processing...' : `Pay ₹${selectedPlan === 'monthly' ? '399' : '3999'} Securely`}
                            </button>
                            <button onClick={() => setStep('plan')} className="w-full text-center text-gray-500 text-xs hover:text-white mt-2">Change Plan</button>
                        </div>
                    )}

                    {/* STEP 5: SUCCESS */}
                    {step === 'success' && (
                        <div className="text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                                <p className="text-gray-400 text-sm">Welcome to the elite rank, Warrior.</p>
                            </div>

                            <div className="bg-[#1a1a2e] border border-gray-700 p-6 rounded-xl">
                                <p className="text-gray-500 text-xs uppercase mb-2">Your Login ID</p>
                                <div className="text-2xl font-mono font-bold text-[#32b8c6] tracking-widest select-all">{generatedId}</div>
                                <p className="text-[10px] text-gray-600 mt-2">Save this ID. You will need it to login next time.</p>
                            </div>

                            <button 
                                onClick={handleFinalize} 
                                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg"
                            >
                                Initialize Training
                            </button>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
