import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    RefreshCcw, 
    ArrowLeftRight, 
    ShieldCheck, 
    Zap,
    Users,
    TrendingUp,
    Store
} from 'lucide-react';

interface P2PViewProps {
    userTier?: string;
}

const P2PView: React.FC<P2PViewProps> = ({ userTier = 'bronze' }) => {
    const [sellAmount, setSellAmount] = useState<number | ''>('');
    const fixedPrice = 0.10;
    const hasGold = userTier === 'gold' || userTier === 'crew' || userTier === 'platinum';

    const handleCreateOrder = () => {
        if (!hasGold) {
            alert("P2P 판매는 Gold 또는 Crew 구독자만 가능합니다! 구독 페이지로 이동하세요.");
            return;
        }
        alert(`$${fixedPrice} 가격으로 ${sellAmount} VORA 판매 주문을 등록합니다.`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 relative">
            {/* Header */}
            <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-400">P2P Hub Live</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase leading-none">
                    INSTANT <br/><span className="text-blue-500">P2P LIQUIDITY.</span>
                </h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Buy/Sell VORA at the official $0.10 floor.</p>
            </div>

            {/* Trading Panel */}
            <div className="bg-[#0a0a0e] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 blur-[60px] pointer-events-none"></div>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2">
                            <Store size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase text-gray-400">Fixed Market Price</span>
                        </div>
                        <p className="text-2xl font-black text-blue-500">$0.10</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Amount to Sell"
                                value={sellAmount}
                                onChange={(e) => setSellAmount(e.target.value ? Number(e.target.value) : '')}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-8 pr-14 text-xl font-black text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase tracking-widest">VORA</div>
                        </div>

                        {!hasGold && (
                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3 items-center">
                                <ShieldCheck className="text-amber-500 shrink-0" size={20} />
                                <p className="text-[9px] text-amber-500/80 font-bold leading-relaxed">
                                    판매 권한이 없습니다. <span className="underline cursor-pointer">Gold/Crew 구독</span>을 활성화하여 2배 수익 실현에 참여하세요.
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={handleCreateOrder}
                            className={`w-full py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
                                hasGold 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-500 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Sell VORA @ $0.10
                        </button>
                    </div>
                </div>
            </div>

            {/* Joy AI Market Guard */}
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 flex gap-5 items-center">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20 shrink-0">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <RefreshCcw className="text-pink-500" size={28} />
                    </motion.div>
                </div>
                <div>
                    <h4 className="font-black uppercase text-sm italic">Joy AI: Market Guard</h4>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed mt-1">
                        담합 방지 시스템 가동 중. 비정상적인 거래 감지 시 즉시 팀 물량을 투입하여 $0.10 가격을 보호합니다.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-blue-500 font-black uppercase mb-1">Buy Volume</p>
                    <p className="text-lg font-black tracking-tighter">1.2M VORA</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-pink-500 font-black uppercase mb-1">Sell Volume</p>
                    <p className="text-lg font-black tracking-tighter">0.4M VORA</p>
                </div>
            </div>
        </div>
    );
};

export default P2PView;
