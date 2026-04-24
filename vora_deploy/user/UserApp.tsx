import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Users,
    TrendingUp,
    LayoutDashboard,
    Crown,
    CheckCircle,
    ArrowLeftRight,
    Wallet,
    Shield,
    FileText,
    History,
    Car,
    Gauge,
    Trophy,
    Lock,
    Video,
    MessageSquare,
    ChevronRight,
    Star,
    Globe,
    Search,
    Play,
    TimerOff,
    Cpu,
    Settings,
    Bot,
    Bell,
    ExternalLink
} from 'lucide-react';
import { translations, Language } from '../services/i18nService';
import { VoraLogo } from '../components/VoraLogo';
import { SubscriptionView } from './SubscriptionView';
import BaulOperationsPage from './BaulOperationsPage';

// --- Types & Interfaces ---
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void;
                expand: () => void;
                HapticFeedback: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
                };
                initDataUnsafe?: {
                    user?: {
                        id: number;
                        username?: string;
                    };
                };
            };
        };
    }
}

enum NavTab {
    HOME = 'HOME',
    CREW = 'CREW',
    V_HUB = 'V_HUB',
    ZAP = 'ZAP',
    MY = 'MY'
}

// --- Helper Functions ---
const formatUID = (id: string | number) => {
    // Generate a pseudo-deterministic 12-digit UID from Telegram ID
    const str = id.toString();
    const pad = '000000000000';
    const raw = (str + '888888').slice(0, 12);
    return raw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

const formatCurrency = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

// --- Components ---
const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void; label: string }> = ({ icon, active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-[#22d3ee] scale-110' : 'text-gray-500'}`}
    >
        <div className={`p-2 rounded-xl ${active ? 'bg-[#22d3ee]/10' : ''}`}>
            {icon}
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        {active && (
            <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-[#22d3ee] mt-0.5 shadow-[0_0_10px_#22d3ee]" />
        )}
    </button>
);

const UserApp: React.FC<{ lang?: Language }> = ({ lang = 'ko' }) => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const t = translations[lang] || translations['ko'];

    // State
    const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
    const [telegramUser, setTelegramUser] = useState<any>(null);
    const [assets, setAssets] = useState({
        vora: 0,
        ton: 0,
        level: 1,
        exp: 240,
        maxExp: 1000,
        teamVolume: 125400,
        myLiquidity: 1540
    });

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            setTelegramUser(window.Telegram.WebApp.initDataUnsafe?.user || { id: 12345678, username: 'Guest' });
        }
    }, []);

    const userUID = formatUID(telegramUser?.id || '00000000');

    // --- Views ---

    const HomeView = () => (
        <div className="space-y-6 pt-4 pb-32">
            {/* Bromotion Header Stats */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#22d3ee]/20 flex items-center justify-center border border-[#22d3ee]/30 overflow-hidden">
                       <VoraLogo className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white leading-none uppercase italic">Bromotion <span className="text-[#22d3ee]">V2</span></h1>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest">UID: {userUID}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live Support</span>
                    </div>
                </div>
            </div>

            {/* Trading Overview Panel */}
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-7 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute -top-4 -right-4 opacity-[0.03] select-none pointer-events-none text-9xl font-black italic">BRO</div>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[9px] text-[#22d3ee] font-black uppercase tracking-[0.2em] mb-1 italic">Refuel & Drive Strategy</p>
                        <h3 className="text-xl font-black uppercase italic text-white">Market Dashboard</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded-md font-black uppercase">Leverage 1:500</span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {[
                        { symbol: 'XAUUSD', price: '2,342.50', change: '+1.2%', up: true, label: 'Gold Spot' },
                        { symbol: 'BTCUSD', price: '68,432.10', change: '-0.5%', up: false, label: 'Bitcoin' },
                        { symbol: 'ETHUSD', price: '3,842.15', change: '+0.8%', up: true, label: 'Ethereum' }
                    ].map((asset) => (
                        <div key={asset.symbol} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#22d3ee]/10 rounded-xl flex items-center justify-center border border-[#22d3ee]/20">
                                    <TrendingUp size={18} className={asset.up ? 'text-green-400' : 'text-red-400'} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white italic tracking-tighter">{asset.symbol}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{asset.label}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-white tracking-tighter">$ {asset.price}</p>
                                <p className={`text-[10px] font-black ${asset.up ? 'text-green-500' : 'text-red-500'}`}>{asset.change}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-2xl p-4">
                        <p className="text-[8px] text-[#22d3ee] font-black uppercase mb-1 tracking-widest">Active Multiplier</p>
                        <p className="text-lg font-black text-white italic">1.5x Boost</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                        <p className="text-[8px] text-purple-400 font-black uppercase mb-1 tracking-widest">Team Capacity</p>
                        <p className="text-lg font-black text-white italic">LV 3 / {assets.level}</p>
                    </div>
                </div>
            </div>

            {/* VORA Balance Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute -bottom-8 -left-8 opacity-10"><VoraLogo className="w-24 h-24" /></div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] text-[#22d3ee]">Refuel Yield Status</p>
                    <button onClick={() => alert("Withdrawal to MT5 slave account initialized.")} className="text-[9px] bg-[#22d3ee] text-black px-3 py-1 rounded font-black uppercase italic shadow-[0_0_15px_#22d3ee]">Claim</button>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black tracking-tighter text-white">{formatCurrency(assets.vora)}</span>
                    <span className="text-sm font-black text-[#22d3ee] italic">VO</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Live Bromotion Network Integration</p>
            </div>

            {/* AI Coaching Shortcut */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Bot size={16} className="text-[#22d3ee]" /> Agentic AI Coaching
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { name: 'JOY', role: 'Sales / Team', color: 'pink' },
                        { name: 'BAUL', role: 'Tech / Setup', color: 'blue' }
                    ].map(agent => (
                        <div key={agent.name} className="bg-white/5 border border-white/10 rounded-3xl p-5 group hover:bg-white/10 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 font-black italic mb-3">{agent.name[0]}</div>
                            <h4 className="text-xs font-black text-white uppercase italic mb-1">{agent.name} AI</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{agent.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const CrewView = () => (
        <div className="space-y-6 pt-4 pb-32">
             {/* Team Volume Dashboard */}
             <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-7 relative overflow-hidden">
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                    <Users size={16} className="text-[#22d3ee]" /> My Crew Hub
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Direct Crew</p>
                        <p className="text-xl font-black text-white italic">12 <span className="text-[10px] text-gray-500">Active</span></p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Volume</p>
                        <p className="text-xl font-black text-[#22d3ee] italic">${assets.teamVolume.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-4 bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-2xl mb-6">
                   <p className="text-[10px] text-gray-300 font-bold leading-relaxed italic">
                        팀 볼륨이 $150,000에 도달하면 Crew Level 2로 자동 업그레이드되며 추가 배수 혜택이 활성화됩니다.
                   </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Top Contributors</h4>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/20 flex items-center justify-center font-black text-xs">U{i}</div>
                                <div>
                                    <p className="text-xs font-black text-white">Bromotion_{100 + i}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">UID: {formatUID(100+i)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-[#22d3ee] italic">${(45000 / i).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );

    const MyView = () => (
        <div className="space-y-6 pt-4 pb-32">
            <div className="px-2">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-purple-600 p-1">
                        <div className="w-full h-full bg-black rounded-[0.8rem] flex items-center justify-center">
                            <Users size={32} className="text-[#22d3ee]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Trader Profile</h2>
                        <p className="text-sm font-black text-gray-500 uppercase tracking-widest mt-1">Status: <span className="text-[#22d3ee]">Elite Master</span></p>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">My UID</span>
                        <span className="text-sm font-black text-white tracking-widest">{userUID}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Telegram ID</span>
                        <span className="text-sm font-black text-gray-500">{telegramUser?.id || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Direct Crew Total</span>
                        <span className="text-sm font-black text-[#22d3ee]">14 Members</span>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-6 group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <Settings size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                            <span className="text-xs font-black text-white uppercase italic">Account Settings</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-700" />
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-6 group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <Shield size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                            <span className="text-xs font-black text-white uppercase italic">Security Center</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-700" />
                    </button>
                    <button onClick={() => tonConnectUI.disconnect()} className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center px-6 mt-6">
                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">Disconnect Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col px-4 font-sans select-none">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22d3ee]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Main Scroll Content */}
            <main className="flex-1 relative z-10 no-scrollbar overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeTab === NavTab.HOME && (
                        <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            <HomeView />
                        </motion.div>
                    )}
                    {activeTab === NavTab.CREW && (
                        <motion.div key="crew" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            <CrewView />
                        </motion.div>
                    )}
                    {activeTab === NavTab.V_HUB && (
                        <motion.div key="vhub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                           <SubscriptionView />
                        </motion.div>
                    )}
                     {activeTab === NavTab.ZAP && (
                        <motion.div key="zap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                           <BaulOperationsPage />
                        </motion.div>
                    )}
                    {activeTab === NavTab.MY && (
                        <motion.div key="my" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            <MyView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* SYMMETRIC 2-1-2 NAVIGATION BAR */}
            <nav className="fixed bottom-6 left-6 right-6 z-[100] h-20 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* 2 LEFT ITEMS */}
                <NavItem icon={<LayoutDashboard size={22} />} active={activeTab === NavTab.HOME} onClick={() => setActiveTab(NavTab.HOME)} label="Home" />
                <NavItem icon={<Users size={22} />} active={activeTab === NavTab.CREW} onClick={() => setActiveTab(NavTab.CREW)} label="Crew" />
                
                {/* 1 CENTER ITEM (THE BIG V) */}
                <button 
                    onClick={() => setActiveTab(NavTab.V_HUB)}
                    className={`relative -top-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${activeTab === NavTab.V_HUB ? 'bg-[#22d3ee] shadow-[0_0_30px_#22d3ee] scale-110' : 'bg-gradient-to-tr from-gray-800 to-black border border-white/10'}`}
                >
                    <VoraLogo className={`w-10 h-10 ${activeTab === NavTab.V_HUB ? 'text-black' : 'text-[#22d3ee]'}`} />
                </button>

                {/* 2 RIGHT ITEMS */}
                <NavItem icon={<Gauge size={22} />} active={activeTab === NavTab.ZAP} onClick={() => setActiveTab(NavTab.ZAP)} label="Zap" />
                <NavItem icon={<User size={22} />} active={activeTab === NavTab.MY} onClick={() => setActiveTab(NavTab.MY)} label="My" />
            </nav>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

// Internal NavItem helper needed for lucide
const User = ({ size, className }: { size: number; className?: string }) => <Users size={size} className={className} />;

export default UserApp;
