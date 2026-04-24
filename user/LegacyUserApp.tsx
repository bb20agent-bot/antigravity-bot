import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    User,
    Wallet,
    Trophy,
    Clock,
    CheckCircle,
    MessageSquare,
    LayoutDashboard,
    Gamepad2,
    ShoppingBag,
    FileText,
    ChevronRight,
    Search,
    Play,
    TrendingUp,
    AlertTriangle,
    Copy,
    ShieldCheck,
    Star,
    Globe,
    Coins,
    BarChart3,
    Crown,
    Sword,
    Briefcase,
    Users,
    Video,
    Lock,
    TimerOff,
    ArrowLeftRight,
    Info,
    Camera
} from 'lucide-react';
import { translations, Language } from '../services/i18nService';
import { VoraLogo } from '../components/VoraLogo';
import VoraLivePage from '../pages/VoraLivePage';
import P2PView from './P2PView';
import IdoView from './IdoView';
import { SubscriptionView } from './SubscriptionView';
import BaulOperationsPage from './BaulOperationsPage';

// --- Types & Interfaces ---
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void;
                expand: () => void;
                openTelegramLink?: (url: string) => void;
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
    HOME = 'home',
    LIVE = 'live',
    P2P = 'p2p',
    OFFICE = 'office',
    MARKETPLACE = 'marketplace',
    IDO = 'ido',
    INFO = 'info'
}

// --- Helper Functions ---
const formatUID = (id: string | number) => {
    const str = id.toString();
    const raw = (str + '888888').slice(0, 12);
    return raw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-1.5 transition-all relative ${active ? 'scale-125 text-[#0088cc]' : 'text-gray-500'}`}
    >
        <span className={active ? 'text-[#0088cc]' : ''}>{icon}</span>
        {active && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0088cc] shadow-[0_0_10px_#0088cc]"></span>
        )}
    </button>
);

const LegacyUserApp: React.FC<{ lang?: Language }> = ({ lang = 'ko' }) => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const t = translations[lang] || translations['ko'];

    // State
    const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
    const [telegramUser, setTelegramUser] = useState<any>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-4">
             {/* Balance Card */}
             <div className="bg-gradient-to-br from-blue-900/40 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden mb-6 shadow-2xl">
                <div className="absolute -bottom-8 -left-8 opacity-10"><Coins size={120} /></div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Total Vora Assets</p>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black tracking-tighter text-white">45,000</span>
                    <span className="text-sm font-black text-blue-400">VORA</span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Flywheel Rewards Active</p>
            </div>

            {/* Performance Panel */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-black uppercase text-white">AI Strategy Performance</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time Yield Analysis</p>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Live</div>
                </div>
                <div className="space-y-4">
                     {[
                        { name: 'Quantum Core', roi: '+42.5%', risk: 'Low' },
                        { name: 'Neon Scalper', roi: '+75.1%', risk: 'High' }
                     ].map(strategy => (
                        <div key={strategy.name} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                    <TrendingUp size={18} className="text-blue-400" />
                                </div>
                                <span className="text-sm font-black text-white italic">{strategy.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-blue-400">{strategy.roi}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{strategy.risk} Risk</p>
                            </div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );

    const ProfileView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-4">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/30 mx-auto mb-4 flex items-center justify-center relative group overflow-hidden">
                    <User size={48} className="text-blue-500" />
                    <div className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex">
                        <Camera size={20} className="text-white" />
                    </div>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{telegramUser?.username || 'Vora Trader'}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1 italic tracking-widest">UID: {userUID}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Total Referrals</p>
                    <p className="text-xl font-black text-white">125</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Team Volume</p>
                    <p className="text-xl font-black text-blue-400">12.5K <span className="text-[10px]">TON</span></p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center min-h-screen bg-[#050505]">
            <div className="w-full max-w-[430px] bg-black text-white font-sans select-none pb-32 relative overflow-hidden shadow-2xl border-x border-white/5">
                {/* Header */}
                <div className="relative z-10 px-6 pt-8 pb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <VoraLogo className="w-8 h-8" />
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight leading-none italic">VORA <span className="text-blue-500">LEGACY</span></h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Production Environment</p>
                        </div>
                    </div>
                    <div className="transform scale-75 origin-right">
                        <TonConnectButton />
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 px-6 min-h-[60vh]">
                    <AnimatePresence mode="wait">
                        {activeTab === NavTab.HOME && <HomeView key="home" />}
                        {activeTab === NavTab.LIVE && <div key="live" className="animate-in slide-in-from-right duration-300"><VoraLivePage /></div>}
                        {activeTab === NavTab.P2P && <div key="p2p" className="animate-in slide-in-from-right duration-300"><P2PView /></div>}
                        {activeTab === NavTab.OFFICE && <ProfileView key="office" />}
                        {activeTab === NavTab.MARKETPLACE && <div key="market" className="animate-in slide-in-from-right duration-300"><SubscriptionView /></div>}
                        {activeTab === NavTab.IDO && <div key="ido" className="animate-in slide-in-from-right duration-300"><IdoView /></div>}
                        {activeTab === NavTab.INFO && <div key="info" className="animate-in slide-in-from-right duration-300"><BaulOperationsPage onOpenChat={() => {}} telegramId={telegramUser?.id?.toString() || ''} /></div>}
                    </AnimatePresence>
                </div>

                {/* 3-1-3 Bottom Navigation */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-50 pointer-events-none">
                    <nav className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex justify-between items-center px-4 py-3 shadow-2xl pointer-events-auto relative">
                        {/* Left 3 */}
                        <div className="flex items-center gap-2">
                             <NavItem icon={<LayoutDashboard size={18} />} active={activeTab === NavTab.HOME} onClick={() => setActiveTab(NavTab.HOME)} />
                             <NavItem icon={<Video size={18} />} active={activeTab === NavTab.LIVE} onClick={() => setActiveTab(NavTab.LIVE)} />
                             <NavItem icon={<ArrowLeftRight size={18} />} active={activeTab === NavTab.P2P} onClick={() => setActiveTab(NavTab.P2P)} />
                        </div>

                        {/* Center V */}
                        <div className="relative -top-6">
                            <button
                                onClick={() => setActiveTab(NavTab.OFFICE)}
                                className={`w-14 h-14 rounded-full bg-gradient-to-br border-4 border-[#050505] shadow-[0_4px_25px_rgba(37,99,235,0.5)] flex items-center justify-center transition-transform ${activeTab === NavTab.OFFICE
                                    ? 'from-blue-600 to-blue-900 ring-4 ring-blue-500/50 ring-offset-2 ring-offset-[#050505] scale-110'
                                    : 'from-slate-800 to-black hover:from-blue-800 hover:to-blue-900'
                                    }`}
                            >
                                <span className={`text-2xl font-black italic tracking-tighter ${activeTab === NavTab.OFFICE ? 'text-white drop-shadow-[0_0_10px_white]' : 'text-slate-500'}`}>V</span>
                            </button>
                        </div>

                        {/* Right 3 */}
                        <div className="flex items-center gap-2">
                             <NavItem icon={<ShoppingBag size={18} />} active={activeTab === NavTab.MARKETPLACE} onClick={() => setActiveTab(NavTab.MARKETPLACE)} />
                             <NavItem icon={<Zap size={18} />} active={activeTab === NavTab.IDO} onClick={() => setActiveTab(NavTab.IDO)} />
                             <NavItem icon={<Info size={18} />} active={activeTab === NavTab.INFO} onClick={() => setActiveTab(NavTab.INFO)} />
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default LegacyUserApp;
