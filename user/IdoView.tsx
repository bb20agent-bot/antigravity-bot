import React, { useState } from 'react';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    ShieldCheck, 
    TrendingUp, 
    Coins, 
    Users, 
    Globe, 
    Lock, 
    RefreshCcw, 
    ArrowRight,
    FileText,
    Rocket,
    BarChart3
} from 'lucide-react';

const MeshBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{
                x: [0, 50, -30, 0],
                y: [0, 40, 20, 0],
                scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]"
        />
        <motion.div
            animate={{
                x: [0, -40, 30, 0],
                y: [0, -30, -50, 0],
                scale: [1, 1.1, 1.2, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[40%] bg-purple-600/10 rounded-full blur-[80px]"
        />
    </div>
);

// [IDO CONFIG] IDO 즉시 개발 자금 및 전략 투입 자금 수령 어드레스
const IDO_STRATEGY_WALLET = "EQDz1fSc2GWw2ub8hhXORnuITdnh02bTVtQI0COkdV2nlcTn";

const IdoView: React.FC = () => {
    const userAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();
    
    // Official Tokenomics: Total 1B, IDO 10% (100M)
    const targetAmount = 5000000; // $5M (100M tokens * $0.05)
    const [raisedAmount, setRaisedAmount] = useState(1254200);
    const progressPercent = Math.min(100, (raisedAmount / targetAmount) * 100);

    const [buyAmountTON, setBuyAmountTON] = useState<number | ''>('');
    const voraPriceUsd = 0.05;
    const tonPriceUsd = 2.5; // Placeholder
    const voraExchangeRate = tonPriceUsd / voraPriceUsd; // 1 TON = 50 VORA

    const handlePurchase = async () => {
        if (!userAddress) {
            await tonConnectUI.connectWallet();
            return;
        }

        if (typeof buyAmountTON !== 'number' || buyAmountTON <= 0) return;

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: IDO_STRATEGY_WALLET,
                    amount: (buyAmountTON * 1000000000).toString(),
                }
            ]
        };

        try {
            await tonConnectUI.sendTransaction(transaction);
            alert(`Successfully purchased ${(buyAmountTON * voraExchangeRate).toLocaleString()} VORA!`);
            setRaisedAmount(prev => prev + (buyAmountTON * 5.5)); 
            setBuyAmountTON('');
        } catch (error) {
            console.error(error);
            alert("Transaction failed.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative px-1">
            <MeshBackground />

            {/* In-App Hero */}
            <div className="relative z-10 text-center py-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Yield IDO Live</span>
                </motion.div>
                <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase leading-none">
                    FUTURE OF <br/><span className="text-blue-500">FLYING YIELD.</span>
                </h1>
                <p className="text-xs text-gray-400 font-bold mb-8 leading-relaxed max-w-[280px] mx-auto">
                    20% AI 수익이 유동성으로 직결되는 <br/> 완벽한 <span className="text-white">경제적 플라이휠</span>에 합류하세요.
                </p>
            </div>

            {/* Participation Card (Mobile Optimized) */}
            <div className="relative z-10 bg-[#0a0a0e] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none"></div>
                
                <div className="space-y-8">
                    {/* Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Amount Raised</p>
                                <p className="text-2xl font-black">${raisedAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Goal</p>
                                <p className="text-sm font-black text-gray-400">${targetAmount.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full p-0.5 border border-white/5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                            ></motion.div>
                        </div>
                        <p className="text-right text-[8px] font-black text-blue-400 uppercase tracking-widest">{progressPercent.toFixed(1)}% Reached</p>
                    </div>

                    {/* Input */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center p-1"><Zap size={12} fill="white" /></div>
                            <input 
                                type="number" 
                                placeholder="10.00"
                                value={buyAmountTON}
                                onChange={(e) => setBuyAmountTON(e.target.value ? Number(e.target.value) : '')}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-xl font-black text-white focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase tracking-widest">TON</div>
                        </div>

                        <div className="px-5 py-3 bg-white/5 border-dashed border border-white/10 rounded-xl flex justify-between items-center">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Receive</p>
                            <p className="text-sm font-black text-blue-400">
                                {typeof buyAmountTON === 'number' && buyAmountTON > 0 ? (buyAmountTON * voraExchangeRate).toLocaleString() : '0'} VORA
                            </p>
                        </div>

                        <button 
                            onClick={handlePurchase}
                            className={`w-full py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                                !userAddress 
                                ? 'bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-500 shadow-[0_10px_30px_rgba(37,99,235,0.3)]'
                            }`}
                        >
                            {!userAddress ? 'Connect Wallet' : 'Contribute NOW'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Flywheel Preview */}
            <div className="relative z-10 bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-4 overflow-hidden group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20"><Rocket className="text-blue-500" size={24} /></div>
                    <div>
                        <h4 className="font-black uppercase text-sm italic">Joy AI: Chief Market Maker</h4>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">P2P stability & anti-collusion</p>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
                    트레이더 Baul이 생성한 수익의 20%는 자동으로 유동성 풀로 향합니다. 당신의 투자는 기술에 의해 지속적으로 보호받습니다.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-[8px] text-blue-500 font-black mb-1">PROTECTION</div>
                        <div className="text-[10px] font-black italic">100% REFUND</div>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-[8px] text-purple-500 font-black mb-1">DISTRIBUTION</div>
                        <div className="text-[10px] font-black italic">INSTANT APY</div>
                    </div>
                </div>
            </div>
            
            <div className="text-center py-4">
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em]">Powered by TON Network & VORA AI</p>
            </div>
        </div>
    );
};

export default IdoView;
