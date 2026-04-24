import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, 
    Users, 
    RefreshCcw, 
    ShieldCheck, 
    Terminal, 
    ChevronRight, 
    Cpu, 
    Database,
    Zap,
    AlertCircle
} from 'lucide-react';

interface BaulOperationsPageProps {
    onOpenChat: (personality: 'brown' | 'joy' | 'baul') => void;
    telegramId: string;
}

const BaulOperationsPage: React.FC<BaulOperationsPageProps> = ({ onOpenChat, telegramId }) => {
    const [stats, setStats] = useState({
        pendingReferrals: 3,
        autoRenewalActive: true,
        voraBalance: 45000,
        tonBalance: 124.52,
        nextRenewalDate: '2026-04-10',
        isRestricted: false
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleAutoPlace = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/user/auto-place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setStats(prev => ({ ...prev, pendingReferrals: 0 }));
            }
        } catch (error) {
            console.error(error);
            alert("Error placing referrals");
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleAutoRenewal = async () => {
        const newState = !stats.autoRenewalActive;
        try {
            const res = await fetch('/api/user/auto-renewal/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId, active: newState })
            });
            const data = await res.json();
            if (data.success) {
                setStats(prev => ({ ...prev, autoRenewalActive: newState }));
            }
        } catch (error) {
            console.error("Failed to toggle renewal status");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans overflow-x-hidden">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 pt-8"
            >
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                        <Cpu className="text-blue-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Baul <span className="text-blue-500">Ops</span></h1>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Technical Engineering Assistant</p>
                    </div>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/50 via-white/10 to-transparent"></div>
            </motion.div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">VORA Assets</p>
                    <p className="text-xl font-black">{stats.voraBalance.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">TON Wallet</p>
                    <p className="text-xl font-black text-blue-400">{stats.tonBalance} T</p>
                </div>
            </div>

            {/* Service 1: Referral Management */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Users size={16} className="text-blue-500" /> Referral Positioning
                    </h2>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded-lg font-black">{stats.pendingReferrals} Pending</span>
                </div>
                
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Database size={120} />
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        신규 파트너를 귀하의 하부 계보 중 수익 극대화가 가능한 최적의 위치에 자동으로 배치합니다.
                    </p>
                    
                    <button 
                        onClick={handleAutoPlace}
                        disabled={stats.pendingReferrals === 0 || isProcessing}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all ${
                            stats.pendingReferrals > 0 
                            ? 'bg-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {isProcessing ? <RefreshCcw className="animate-spin" size={18} /> : <Zap size={18} />}
                        Auto-Place New Member
                    </button>
                    
                    <button 
                        onClick={() => onOpenChat('baul')}
                        className="w-full mt-3 py-3 border border-white/10 rounded-2xl text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        Manual Tree Setup (Talk to Baul)
                    </button>
                </div>
            </section>

            {/* Service 2: Auto-Renewal Proxy */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <RefreshCcw size={16} className="text-green-500" /> Subscription Proxy
                    </h2>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${stats.autoRenewalActive ? 'bg-green-600' : 'bg-gray-800'}`} onClick={toggleAutoRenewal}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${stats.autoRenewalActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-xl">
                                <ShieldCheck className="text-green-500" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
                                <p className="text-xs font-black">{stats.autoRenewalActive ? 'ACTIVE PROTECTION' : 'MANUAL RENEWAL'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Next Check</p>
                            <p className="text-xs font-black text-white">{stats.nextRenewalDate}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={14} className="text-amber-500 mt-1 shrink-0" />
                            <p className="text-[10px] text-gray-400 leading-normal">
                                구독 만료 24시간 전, Baul AI가 TON 또는 VORA 잔액을 확인하여 자동으로 갱신을 실행합니다. 갱신 실패 시 알림을 보내드립니다.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => onOpenChat('baul')}
                        className="w-full py-3 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        Configure Auto-Pay Assets
                    </button>
                </div>
            </section>

            {/* Service 3: MT5 Risk Calculator & Signal Hub */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={16} className="text-purple-500" /> MT5 Risk Calculator (V2)
                    </h2>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] rounded-lg font-black uppercase tracking-widest leading-none flex items-center gap-1">
                        Exness 1:500
                    </span>
                </div>
                
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {(['XAUUSD', 'BTCUSD', 'ETHUSD'] as const).map(asset => (
                            <button 
                                key={asset}
                                className={`py-3 rounded-2xl text-[10px] font-black border transition-all ${asset === 'XAUUSD' ? 'bg-purple-600 text-white border-purple-400' : 'bg-white/5 text-gray-400 border-white/10'}`}
                            >
                                {asset}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-white/5 rounded-3xl border border-white/5 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Account Balance</p>
                            <p className="text-sm font-black text-white">$5,000.00</p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Risk Per Trade (%)</p>
                            <p className="text-sm font-black text-purple-400">1.0% ($50)</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Recommended Lot (0.01 Min)</p>
                            <p className="text-lg font-black text-emerald-400 animate-pulse">0.05 Lot</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-4 bg-white text-black rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.2)]">
                            <Zap size={18} fill="black" />
                            Submit Master Signal
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            Manual Signal Setup
                        </button>
                    </div>
                </div>
            </section>

            {/* Engineer Identity */}
            <div className="mt-12 text-center pb-20">
                <div 
                    onClick={() => onOpenChat('baul')}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full cursor-pointer hover:bg-blue-500/20 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs">B</div>
                    <span className="text-xs font-black text-blue-400">바울 AI에게 기술 문의하기</span>
                    <ChevronRight size={14} className="text-blue-400" />
                </div>
            </div>
        </div>
    );
};

export default BaulOperationsPage;
