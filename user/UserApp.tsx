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
    TimerOff
} from 'lucide-react';
import { translations, Language } from '../services/i18nService';
import { protocolService } from '../services/protocolService';
import { VoraLogo } from '../components/VoraLogo';

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
            };
        };
    }
}

enum NavTab {
    HOME = 'home',
    GAME = 'game',
    CREW = 'crew',
    OFFICE = 'office',
    MARKETPLACE = 'marketplace',
    COMMUNITY = 'community',
    LIVE = 'live',
    INFO = 'info'
}

// --- Components ---

const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-2 transition-all relative ${active ? 'scale-125 text-[#0088cc]' : 'text-gray-600'}`}
    >
        <span className={active ? 'text-[#0088cc]' : ''}>{icon}</span>
        {active && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0088cc] shadow-[0_0_15px_#0088cc]"></span>
        )}
    </button>
);

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const StrategyVideoCard: React.FC<{ strategy: any; onClick?: () => void }> = ({ strategy, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden group transition-colors hover:border-cyan-500/50 mb-4 cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 255, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="relative aspect-video bg-black">
                {strategy.videoUrl ? (
                    <video
                        src={strategy.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                ) : (
                    <img src={strategy.thumbnail} alt={strategy.name} className="w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="px-2 py-1 bg-red-500/80 rounded text-[8px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">Live Coaching</div>
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
                        <Users size={8} className="inline mr-1" /> {strategy.viewers}
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-sm font-black uppercase tracking-tight mb-1">{strategy.name}</h4>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-400 font-bold">AI Agent: {strategy.trader}</p>
                        <div className="flex items-center gap-1 text-green-500 font-black text-xs">
                            <TrendingUp size={12} /> {strategy.roi}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 flex items-center justify-between bg-white/5">
                <div className="flex gap-3">
                    <div className="text-center">
                        <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Win Rate (Improved)</p>
                        <p className="text-[10px] font-black text-white">{strategy.winRate}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Risk</p>
                        <p className={`text-[10px] font-black ${strategy.riskLevel === 'High' ? 'text-red-500' : 'text-green-500'}`}>{strategy.riskLevel}</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-[#0088cc] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00aaff] transition-colors">
                    View AI Report
                </button>
            </div>
        </motion.div>
    );
};

// Import VoraLivePage component here
import VoraLivePage from '../pages/VoraLivePage';
import { FandomSubscriptionPage } from '../src/pages/FandomSubscriptionPage';

const UserApp: React.FC<{ lang?: Language }> = ({ lang = 'ko' }) => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    const handleCopyLink = () => {
        const link = `t.me/Vora_Brown_bot?start=${(window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id || 'TESTUSER'}`;

        // Fallback for Telegram Mini App
        const textArea = document.createElement("textarea");
        textArea.value = link;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const handlePurchase = async (pkg: any) => {
        if (!wallet) {
            alert("Please connect your TON wallet first!");
            return;
        }

        if (pkg.id === 'pkg_fandom') {
            try {
                // Send 100 TON transaction
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 360,
                    messages: [
                        {
                            address: "0QDQv-uJ7vO8Z1c_tQp3oO1eA9tFtz37yOov__t587hS_Yn4", // Mock Treasury Address or any recipient
                            amount: "100000000000", // 100 TON in nanoTON
                        }
                    ]
                };

                await tonConnectUI.sendTransaction(transaction);

                let telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "dev_user_123";

                await fetch('http://localhost:3001/api/user/stake', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        telegramId,
                        walletAddress: wallet.account.address,
                        amount: 100
                    })
                });

                alert("Successfully purchased Vora Fandom! You now have Level 2 Unilevel access and 2x T2E Boost.");
            } catch (error) {
                console.error("Transaction failed:", error);
                alert("Transaction failed or rejected.");
            }
        } else {
            alert(`Purchase flow for ${pkg.title} initiated.`);
        }
    };

    const handleMockUpload = (type: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : '*/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                alert(`[System] Uploading ${file.name}...\n\nPlease wait while the file is processed and synced with the Vora network.`);
                setTimeout(() => {
                    alert(`✅ Successfully uploaded ${file.name} to the ${type.toUpperCase()} repository!`);
                }, 1500);
            }
        };
        input.click();
    };
    const t = translations[lang] || translations['ko'];

    // State
    const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
    const [officeSubTab, setOfficeSubTab] = useState<'profile' | 'community' | 'dnft'>('profile');
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Protocol State
    const [protocolConfig, setProtocolConfig] = useState({ t2eTimerEnd: 0 });
    const [isTimerActive, setIsTimerActive] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/config');
                const data = await res.json();
                setProtocolConfig(data);
                setIsTimerActive(data.t2eTimerEnd ? data.t2eTimerEnd > Date.now() : false);
            } catch (error) {
                console.error("Timer check failed", error);
            }
        };

        fetchConfig();
        const interval = setInterval(fetchConfig, 10000);
        return () => clearInterval(interval);
    }, []);

    // Game State
    const [energy, setEnergy] = useState(1000);
    const [points, setPoints] = useState(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
    const [isAttacking, setIsAttacking] = useState(false);
    const [combo, setCombo] = useState(0);

    // Community State
    const [communitySubTab, setCommunitySubTab] = useState<'docs' | 'dao' | 'media'>('docs');
    const [selectedCrew, setSelectedCrew] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([
        { id: 1, user: 'Manager Brown', text: 'Welcome to the crew!', time: '10:00' },
        { id: 2, user: 'ShadowDucker', text: 'Let\'s hunt some points!', time: '10:05' },
    ]);
    const [chatInput, setChatInput] = useState('');

    // Mock Data State for Dashboard & Store
    const [assets, setAssets] = useState<any>({
        ton: 124.52,
        vora: 45000,
        totalSubscriptionFee: 500,
        accumulatedBenefits: 520,  // Set over fee to show Phase 2 logic
        lastActiveTime: Date.now() - 172800000, // 48 hours ago
        currentTier: 'Starter',
        energy: 1000,
        maxEnergy: 1000,
        hasSubscription: false, // Defines if they can watch videos
        dnftLevel: 0 // Defines max capable T2E cube level
    });

    const [referrals, setReferrals] = useState({ l1: 0, l2: 0, shadowVolume: 0 });

    useEffect(() => {
        const fetchReferrals = async () => {
            let telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "dev_user_123";
            try {
                const res = await fetch(`http://localhost:3001/api/user/${telegramId}/referrals`);
                const data = await res.json();
                setReferrals(data);
            } catch (e) {
                console.error("Failed to fetch referrals", e);
            }
        };
        fetchReferrals();
    }, []);

    // 7-Day Free Trial Logic
    const [trialStartDate, setTrialStartDate] = useState<number | null>(Date.now() - (3 * 24 * 60 * 60 * 1000)); // Test: 3 days ago.
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const TRIAL_DURATION = 7 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        if (!trialStartDate) return;
        const interval = setInterval(() => {
            const passed = Date.now() - trialStartDate;
            const remaining = Math.max(0, TRIAL_DURATION - passed);
            setTimeRemaining(remaining);
        }, 1000);
        return () => clearInterval(interval);
    }, [trialStartDate]);

    const isTrialActive = trialStartDate !== null && timeRemaining > 0;
    const isSubscribed = assets.hasSubscription || isTrialActive;

    const [adminStrategies] = useState<any[]>([
        {
            id: 's1',
            name: "VORA_Pro_v6_Champion",
            trader: "Manager Brown",
            roi: "+42.5%",
            winRate: "78%",
            status: "Live",
            exchange: "Binance",
            thumbnail: "/assets/strategy.jpg",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-financial-charts-on-a-computer-monitor-4326-large.mp4",
            viewers: "1.2K",
            riskLevel: 'Medium'
        },
        {
            id: 's2',
            name: "lijimaescalper",
            trader: "Manager Brown",
            roi: "+75.1%",
            winRate: "88%",
            status: "Live",
            exchange: "Binance",
            thumbnail: "/assets/strategy.jpg",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-tablet-screen-4327-large.mp4",
            viewers: "856",
            riskLevel: 'High'
        },
        {
            id: 's3',
            name: "lijimaeswinger",
            trader: "Manager Brown",
            roi: "+120.4%",
            winRate: "65%",
            status: "Live",
            exchange: "Binance",
            thumbnail: "/assets/strategy.jpg",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-financial-charts-on-a-computer-monitor-4326-large.mp4",
            viewers: "3.4K",
            riskLevel: 'Extreme'
        },
        {
            id: 's4',
            name: "Coming Soon (준비중...)",
            trader: "VORA AI Engine",
            roi: "N/A",
            winRate: "N/A",
            status: "Offline",
            exchange: "TBD",
            thumbnail: "/assets/strategy.jpg",
            videoUrl: "",
            viewers: "0",
            riskLevel: 'TBD'
        }
    ]);

    // Dynamic Engine Logic
    const isBreakEvenReached = assets.accumulatedBenefits >= assets.totalSubscriptionFee;
    const timeSinceLastActive = Date.now() - assets.lastActiveTime;
    const safeTimeLeft = Math.max(0, 259200000 - timeSinceLastActive); // 72h limit
    const isUserActive = safeTimeLeft > 0;
    const activityMultiplier = (isBreakEvenReached && !isUserActive) ? 0.3 : 1.0;
    const currentTotalMultiplier = (1.0 * activityMultiplier).toFixed(2); // Assuming Started tier = 1.0

    // Marketplace Mock Data
    const [storePackages] = useState([
        {
            id: 'pkg_standard',
            title: 'Standard Lucky Boost',
            subtitle: '3 Months / Long Only',
            price: '300 TON',
            features: ['T2E Airdrop (40%)', 'Video Coaching Access', 'Lucky Group Telegram'],
            type: 'dnft'
        },
        {
            id: 'pkg_active',
            title: 'Active Lucky Boost',
            subtitle: '6 Months / Long & Short',
            price: '500 TON',
            features: ['T2E Airdrop Base + 5%', 'Video Coaching Access', 'Lucky Group Telegram'],
            type: 'dnft'
        },
        {
            id: 'pkg_prestige',
            title: 'Prestige Lucky Boost',
            subtitle: '1 Year / All Positions',
            price: '777 TON',
            features: ['T2E Airdrop Base + 10%', 'Fandom Migration Option', 'Lucky Group Telegram'],
            type: 'dnft'
        },
        {
            id: 'pkg_founding',
            title: 'Founding Lucky Boost',
            subtitle: '3 Years / Lucky Exclusive',
            price: '1,500 TON',
            features: ['T2E Airdrop Base + 25%', 'Fandom Migration Option', 'Lucky Group Telegram'],
            type: 'dnft'
        },
        {
            id: 'pkg_fandom',
            title: 'Vora Fandom Crew',
            subtitle: '3 Years / Full Fandom Ecosystem',
            price: '724 TON',
            features: ['T2E Airdrop Base + 30%', 'Uni-level & Team Building', 'dNFT Brokerage Rights'],
            type: 'bundle'
        }
    ]);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }, []);

    const handleProfileClick = () => {
        if (assets.dnftLevel === 0) {
            alert(t.profile_dnft_required || "You can upload a custom profile image after purchasing a DNFT package!");
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfileImg(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (energy > 0) {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

            // Add Click Particle
            const id = Date.now();
            setClicks(prev => [...prev, { id, x: clientX, y: clientY, value: 1 + Math.floor(combo / 10) }]);
            setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 800);

            // Game Logic
            setPoints(prev => prev + 1 + Math.floor(combo / 10));
            setEnergy(prev => prev - 1);
            setCombo(prev => prev + 1);
            setIsAttacking(true);
            setTimeout(() => setIsAttacking(false), 80);

            // Debounce combo reset
            clearTimeout((window as any).comboTimer);
            (window as any).comboTimer = setTimeout(() => setCombo(0), 2000);

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        }
    };

    // --- Views ---

    const HomeView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative h-full min-h-[500px]">
            {/* 7-Day Free Trial Banner */}
            {isTrialActive && (
                <div className="mx-5 mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-purple-400" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-tight">7-Day Free Trial Active</p>
                            <p className="text-sm font-black text-white tracking-tight">{formatTime(Math.floor(timeRemaining / 1000))} Left</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab(NavTab.MARKETPLACE)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all shadow-lg shadow-purple-500/20 shadow-inner">
                        Upgrade
                    </button>
                </div>
            )}

            {/* Dynamic Engine Dashboard Section */}
            <section className="px-5 py-2 space-y-4 pt-4">
                <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-7 backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/5 shadow-2xl">
                    {/* Background Text for Aesthetic */}
                    <div className="absolute -top-4 -right-4 opacity-[0.03] select-none pointer-events-none">
                        <span className="text-9xl font-black italic">SIMBORA</span>
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Benefit Engine Mode</p>
                            <h3 className={`text-xl font-black uppercase italic ${isBreakEvenReached ? 'text-amber-500' : 'text-[#0088cc]'}`}>
                                {isBreakEvenReached ? 'Phase 2: Dynamic Pool' : 'Phase 1: Accumulation'}
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Efficiency</p>
                            <div className="flex items-center gap-2 justify-end">
                                <Zap size={14} className={isUserActive ? 'text-green-500' : 'text-red-500'} fill="currentColor" />
                                <span className={`text-xl font-black ${isUserActive ? 'text-white' : 'text-red-500'}`}>{currentTotalMultiplier}x</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Progress Gauge */}
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Subscription Fee Status</p>
                                <p className="text-sm font-black tracking-tight text-white">{assets.accumulatedBenefits.toFixed(1)} / {assets.totalSubscriptionFee} <span className="text-[9px] text-gray-500 ml-1">TON EQ.</span></p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Break-even</p>
                                <p className={`text-sm font-black ${isBreakEvenReached ? 'text-amber-500' : 'text-white'}`}>
                                    {Math.min(100, (assets.accumulatedBenefits / assets.totalSubscriptionFee) * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${isBreakEvenReached ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-r from-[#0088cc] to-cyan-400'}`}
                                style={{ width: `${Math.min(100, (assets.accumulatedBenefits / assets.totalSubscriptionFee) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* 7:3 Dynamic Distribution Info (Only visible after break-even) */}
                    {isBreakEvenReached && (
                        <div className="grid grid-cols-2 gap-3 mb-6 animate-in slide-in-from-top-4 duration-500">
                            <div className={`p-4 rounded-3xl border transition-all ${isUserActive ? 'bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20' : 'bg-white/5 border-white/10 opacity-40'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy size={14} className={isUserActive ? 'text-green-500' : 'text-gray-500'} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Active (70%)</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 leading-tight">72시간 내 활동 유지 중. 최대 배율 적용.</p>
                            </div>
                            <div className={`p-4 rounded-3xl border transition-all ${!isUserActive ? 'bg-red-500/10 border-red-500/30 ring-2 ring-red-500/20' : 'bg-white/5 border-white/10 opacity-40'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={14} className={!isUserActive ? 'text-red-500' : 'text-gray-500'} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Inactive (30%)</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 leading-tight">활동 미달. 혜택 속도가 0.3배로 제한됨.</p>
                            </div>
                        </div>
                    )}

                    {/* Activity Safeguard Timer */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${isUserActive ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex items-center gap-3">
                            <Clock size={18} className={isUserActive ? 'text-green-500' : 'text-red-500'} />
                            <div>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">72H Activity Safeguard</p>
                                <p className={`text-xs font-black tracking-widest ${isUserActive ? 'text-white' : 'text-red-500'}`}>
                                    {formatTime(Math.floor(safeTimeLeft / 1000))}
                                </p>
                            </div>
                        </div>
                        {isUserActive ? (
                            <CheckCircle size={20} className="text-green-500" />
                        ) : (
                            <button onClick={() => setActiveTab(NavTab.GAME)} className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all">Re-Activate Now</button>
                        )}
                    </div>
                </div>
            </section>

            <div className="px-5 pb-6">
                {/* VORA Balance Card */}
                <div className="bg-gradient-to-br from-purple-900/40 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden mb-6">
                    <div className="absolute -bottom-8 -left-8 opacity-10"><Coins size={120} /></div>
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Total Accumulated Benefits</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black tracking-tighter text-white">{assets.vora.toLocaleString()}</span>
                        <span className="text-sm font-black text-purple-400">VORA</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">≈ {assets.accumulatedBenefits.toFixed(2)} TON EQ.</p>
                </div>

                {/* Agentic AI Coaching & Backtesting Videos */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-4">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                                <Video size={16} className="text-purple-400" /> Agentic AI Coaching
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[90%]">Watch strategy backtesting. Our AI identifies weaknesses and dynamically adjusts parameters to boost your win rate.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {adminStrategies.map(strategy => (
                            <div key={strategy.id} className="relative group">
                                <StrategyVideoCard strategy={strategy} onClick={() => { if (strategy.status === 'Live') setActiveTab(NavTab.LIVE); }} />
                                {!isSubscribed && (
                                    <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center border border-white/10 p-6 text-center">
                                        <Lock size={32} className="text-amber-500 mb-3" />
                                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Subscriber Access Only</h4>
                                        <p className="text-[10px] text-gray-400 font-bold mb-4">You need a VORA Fandom Boost subscription to watch Live Backtesting Coachings.</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveTab(NavTab.MARKETPLACE); }}
                                            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-full font-black text-xs uppercase shadow-xl hover:scale-105 transition-transform"
                                        >
                                            Unlock Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const getCubeLevel = (pts: number) => {
        if (pts >= 1000) return 5;
        if (pts >= 500) return 4;
        if (pts >= 200) return 3;
        if (pts >= 50) return 2;
        return 1;
    };

    const getCubeStyle = (level: number) => {
        switch (level) {
            case 5: return "bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_40px_rgba(253,224,71,0.5)] scale-150";
            case 4: return "bg-gradient-to-br from-purple-400 to-purple-700 shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-125";
            case 3: return "bg-gradient-to-br from-blue-500 to-blue-800 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110";
            case 2: return "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105";
            default: return "bg-gradient-to-br from-cyan-200 to-cyan-400 shadow-[0_0_10px_rgba(165,243,252,0.3)]";
        }
    };

    const GameView = () => {
        const cubeLevel = getCubeLevel(points);
        return (
            <div className="flex flex-col items-center justify-between h-full pb-32 pt-6 px-4 relative min-h-[600px]">
                {/* Dynamically traveling background (Spaceship Interior moving slowly towards Earth) */}
                <div
                    className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] bg-cover bg-left-top brightness-75 animate-pan-slow"
                    style={{ backgroundImage: "url('/assets/backgrounds/spaceship_bg.png')" }}
                >
                </div>

                {/* Header / Stats */}
                <div
                    className="absolute top-6 left-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-center space-y-1"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/30">
                            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Vora Pulse Active</span>
                            <span className="text-[10px] font-mono font-bold text-white ml-2">29:45</span>
                        </div>
                        <div className="flex items-center bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/30">
                            <Users size={12} className="text-purple-400 mr-1" />
                            <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">Resonance +15%</span>
                        </div>
                    </div>

                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
                        {points.toLocaleString()} <span className="text-lg text-purple-400">VORA</span>
                    </h2>
                    {points > 0 && (
                        <button
                            onClick={async () => {
                                let telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "dev_user_123";
                                try {
                                    const res = await fetch('http://localhost:3001/api/user/withdraw', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ telegramId, walletAddress: wallet?.account.address, amount: points })
                                    });
                                    const data = await res.json();
                                    alert(data.message);
                                    setPoints(0);
                                } catch (e) {
                                    alert("Withdrawal failed");
                                }
                            }}
                            className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-[10px] uppercase shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105"
                        >Withdraw VORA</button>
                    )}
                    <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 mt-2">
                        <div className={`px-2 py-1 rounded border ${cubeLevel === 5 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-black' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
                            CUBE LV. {cubeLevel}
                        </div>
                        <div className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-black tracking-widest">
                            <Zap size={10} className="inline mr-1" />x{(1 + cubeLevel * 0.2).toFixed(1)} Yield
                        </div>
                        {combo > 5 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-black tracking-widest capitalize"
                            >
                                Combo x{combo}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Character & Cube Area */}
                <div className="relative flex-1 flex flex-col items-center justify-center w-full my-4 z-10">
                    {isTimerActive ? (
                        <motion.div
                            className="relative w-80 h-80 cursor-pointer z-10 flex flex-col items-center justify-center"
                            onMouseDown={handleTap}
                            onTouchStart={handleTap}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Interactive Character: Chunsam */}
                            <motion.div
                                className="relative flex flex-col items-center"
                                animate={isAttacking ? { y: [0, 5, 0], scale: [1, 1.05, 1] } : {}}
                                transition={isAttacking ? { duration: 0.1 } : { duration: 0 }}
                            >
                                <div className="w-48 h-48 rounded-full bg-white/10 p-1 flex items-center justify-center relative z-20 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                                    <motion.img
                                        src="/assets/characters/chunsam.png"
                                        alt="Robot Mining"
                                        className="w-full h-full object-top scale-125 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                                        animate={isAttacking ? { y: [-2, 2, -2] } : {}}
                                        transition={{ duration: 0.1 }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                </div>
                                <div className="absolute -bottom-4 bg-black/60 px-4 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md z-30">
                                    <span className="text-xs font-black text-cyan-300 uppercase tracking-widest">Captain Chunsam</span>
                                </div>
                            </motion.div>

                            {/* Evolving Tendency Cube Asset */}
                            <motion.div
                                className={`absolute z-40 flex items-center justify-center transition-all duration-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    top: '75%',
                                    transformOrigin: 'center center',
                                    filter: cubeLevel === 1 ? 'hue-rotate(0deg) brightness(1)'
                                        : cubeLevel === 2 ? 'hue-rotate(90deg) brightness(1.2)'
                                            : cubeLevel === 3 ? 'hue-rotate(180deg) brightness(1.5)'
                                                : cubeLevel === 4 ? 'hue-rotate(270deg) brightness(1.8)'
                                                    : 'hue-rotate(300deg) brightness(2.5) contrast(1.5)',
                                    scale: 1 + (cubeLevel * 0.15),
                                }}
                                animate={isAttacking ? { scale: [1 + (cubeLevel * 0.15), 1.2 + (cubeLevel * 0.15), 1 + (cubeLevel * 0.15)], rotate: [0, 15, -15, 0] } : {}}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.img
                                    src="/assets/cubes/tendency_cube.png"
                                    alt="Tendency Cube"
                                    className="w-full h-full object-cover rounded-[3rem] mix-blend-screen opacity-90 transition-opacity"
                                    whileHover={{ scale: 1.05, filter: "brightness(1.2) drop-shadow(0 0 40px rgba(0,255,255,0.4))" }}
                                    whileTap={{ scale: 0.95 }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </motion.div>

                            {/* Smooth Glow for Level 5 */}
                            {cubeLevel === 5 && (
                                <div className="absolute inset-0 pointer-events-none z-50">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={`glow-${i}`} className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-300/40 blur-sm rounded-full" style={{ transform: `rotate(${i * 30}deg) translateY(-140px)` }}></div>
                                    ))}
                                </div>
                            )}

                            {/* Floating Coins (VORA Tokens) */}
                            <AnimatePresence>
                                {clicks.map((click) => (
                                    <motion.div
                                        key={click.id}
                                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                        animate={{ opacity: 0, y: -200, scale: 1.5 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute pointer-events-none z-[100] flex items-center justify-center"
                                        style={{
                                            left: click.x - 40, // Centered better around the tap
                                            top: click.y - 40,
                                            position: 'fixed'
                                        }}
                                    >
                                        <div className="flex flex-col items-center z-10">
                                            <span className="text-3xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,1)]" style={{ WebkitTextStroke: '1px white' }}>
                                                +{click.value}
                                            </span>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">VORA</span>
                                        </div>
                                        {/* Fibonacci Resonance Rings (Gentle Glow instead of Ping) */}
                                        <div className="absolute inset-0 flex items-center justify-center z-0">
                                            <div className="w-12 h-12 rounded-full border border-purple-500/30 opacity-50 scale-150 transition-transform duration-1000"></div>
                                            <div className="w-20 h-20 rounded-full border border-cyan-400/10 opacity-30 scale-125 transition-transform duration-1000 absolute"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-sm">
                            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 relative overflow-hidden">
                                <TimerOff size={32} className="text-slate-500 relative z-10" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-800"></div>
                            </div>
                            <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2">Event Offline</h3>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
                                The Tap-to-Earn Resonance Event is currently offline. <br />
                                Next event starts during the upcoming VORA Community milestone.
                            </p>
                            <button onClick={() => setActiveTab(NavTab.COMMUNITY)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white tracking-widest transition-colors">
                                Check Channel
                            </button>
                        </div>
                    )}
                </div>

                {/* Energy Bar */}
                <div
                    className="absolute bottom-12 left-4 right-4 z-10 bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/5 space-y-2"
                >
                    <div className="flex justify-between text-[11px] font-black text-cyan-300 uppercase tracking-widest">
                        <span className="flex items-center"><Zap size={14} className="mr-1 text-yellow-400 fill-yellow-400" /> Cubical Energy</span>
                        <span>{energy} / 1000</span>
                    </div>
                    <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner relative">
                        <div
                            className={`h-full bg-gradient-to-r shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 ${cubeLevel >= 4 ? 'from-purple-500 to-yellow-400' : 'from-cyan-500 to-blue-600'}`}
                            style={{ width: `${(energy / 1000) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <style>{`
                    @keyframes slideDown {
                        from { transform: translateY(-100px); opacity: 0; }
                        50% { opacity: 1; }
                        to { transform: translateY(400px); opacity: 0; }
                    }
                `}</style>
            </div>
        );
    };

    const VoteView = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-4">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black uppercase tracking-tight">Active Proposals</h3>
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[9px] font-black rounded uppercase">Live</span>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-sm mb-2">Proposal #102: Increase Yield for Active Users</h4>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 w-[75%]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black">
                            <span>Yes: 75%</span>
                            <span>No: 25%</span>
                        </div>
                        <button className="w-full mt-3 py-2 bg-[#0088cc] text-black text-xs font-black uppercase rounded-xl">Vote</button>
                    </div>
                </div>
            </div>
        </div>
    );
    const MilestoneView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-10 min-h-[600px] flex flex-col items-center justify-center relative">
            {/* Gangnam Background (CSS representation) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#1a0b2e] to-[#040b16]">
                {/* City skyline silhouettes */}
                <div className="absolute bottom-0 w-full h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMTAwIEwwIDYwIEwxMCA2MCBMMTAgNDAgTDI1IDQwIEwyNSA3MCBMNDAgNzAgTDQwIDMwIEw1NSAzMCBMNTUgNTAgTDcwIDUwIEw3MCAyMCBMODUgMjAgTDg1IDgwIEwxMDAgODAgTDEwMCAxMDBaIiBmaWxsPSIjMGEwYTJhIi8+PC9zdmc+')] bg-repeat-x bg-bottom" style={{ backgroundSize: '200px 100%' }}></div>
                {/* Neon lights */}
                <div className="absolute bottom-20 left-10 w-2 h-10 bg-pink-500/40 rounded-full blur-[4px]"></div>
                <div className="absolute bottom-32 right-16 w-1 h-8 bg-cyan-400/40 rounded-full blur-[4px]"></div>
                <div className="absolute bottom-10 right-1/3 w-3 h-12 bg-yellow-400/40 rounded-full blur-[6px]"></div>
            </div>

            <div className="relative z-10 w-full px-6 flex flex-col items-center text-center space-y-8">
                {/* Celebration Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`confetti-${i}`}
                            className={`absolute w-2 h-6 ${['bg-pink-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-purple-500'][i % 4]} rounded-full`}
                            initial={{ top: '-10%', left: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
                            animate={{ top: '110%', rotate: Math.random() * 720 }}
                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay: Math.random() }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 p-1 shadow-[0_0_50px_rgba(251,191,36,0.6)]"
                >
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-4 border-yellow-500/50">
                        <Crown size={64} className="text-yellow-400" />
                    </div>
                </motion.div>

                <div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2"
                    >
                        Crew Level 1<br />Unlocked!
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-bold text-slate-300 tracking-widest leading-relaxed"
                    >
                        Welcome to Gangnam.<br />
                        Your galactic journey continues on Earth.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                >
                    <h3 className="text-[10px] font-black uppercase text-yellow-500 tracking-widest mb-4">Milestone Rewards</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="flex items-center gap-2"><Trophy size={16} className="text-cyan-400" /> VORA Bonus</span>
                            <span className="text-cyan-400">+50,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="flex items-center gap-2"><Zap size={16} className="text-purple-400" /> Efficiency Multiplier</span>
                            <span className="text-purple-400">1.2x</span>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={() => setActiveTab(NavTab.HOME)}
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                    Claim & Continue
                </motion.button>
            </div>
        </div>
    );

    const MarketplaceView = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-500 h-full flex flex-col pt-8 px-5 pb-28">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                    Galactic Store
                </h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-2 uppercase">Unlock Your Full Potential</p>
                <p className="text-xs text-slate-400 mt-2">Purchase a DNFT package to evolve your T2E cube and access premium AI Coaching.</p>
            </div>

            <div className="space-y-6 w-full flex-1">
                {storePackages.map((pkg, idx) => (
                    <div key={pkg.id} className="w-full bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">

                        {/* Background Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity ${pkg.type === 'bundle' ? 'from-amber-600 to-yellow-400' : 'from-cyan-600 to-blue-400'}`}></div>

                        {/* Type Badge */}
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest ${pkg.type === 'bundle' ? 'bg-amber-500 text-black' : 'bg-cyan-500 text-black'}`}>
                            {pkg.type === 'bundle' ? 'Best Value' : 'Starter'}
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">{pkg.title}</h3>
                            <p className="text-xs text-gray-400 font-bold mb-4">{pkg.subtitle}</p>

                            <ul className="space-y-2 mb-6">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[11px] text-gray-300 font-medium">
                                        <CheckCircle size={14} className={pkg.type === 'bundle' ? 'text-amber-500' : 'text-cyan-500'} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Price</p>
                                    <p className="text-xl font-black text-white">{pkg.price}</p>
                                </div>
                                <button onClick={() => handlePurchase(pkg)} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl transform transition-transform hover:scale-105 ${pkg.type === 'bundle' ? 'bg-gradient-to-r from-amber-600 to-yellow-400 text-black' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}>
                                    Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center mt-auto">
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                    If you are an Admin, you can upload new DNFT series from the Desktop Admin Dashboard.
                </p>
            </div>
        </div>
    );

    const CommunityView = () => (
        <div className="space-y-6 pt-4 px-1">
            {/* Context from parent: Community & Governance Hub */}
            <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar px-2 border-b border-white/5 pb-0">
                {['docs', 'dao', 'media'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCommunitySubTab(tab as any)}
                        className={`relative pb-3 text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap ${communitySubTab === tab ? 'text-white' : 'text-slate-600 hover:text-slate-400'
                            }`}
                    >
                        {tab === 'docs' && 'Docs & Social'}
                        {tab === 'dao' && 'DAO Voting'}
                        {tab === 'media' && 'Running Crew Upload'}

                        {communitySubTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_10px_#a855f7]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    {communitySubTab === 'docs' && (
                        <motion.div
                            key="docs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <a href="#" className="bg-[#111] border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                                    <FileText size={18} className="text-slate-400 group-hover:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase">Whitepaper v2.1</h4>
                                    <p className="text-[10px] text-slate-500">Technical documentation & Tokenomics</p>
                                </div>
                                <ChevronRight className="ml-auto text-slate-600" size={16} />
                            </a>

                            <a href="http://t.me/voraboost" target="_blank" rel="noreferrer" className="bg-[#111] border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-[#0088cc]/50 transition-colors">
                                    <MessageSquare size={18} className="text-slate-400 group-hover:text-[#0088cc]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase">Official Telegram</h4>
                                    <p className="text-[10px] text-slate-500">t.me/voraboost</p>
                                </div>
                                <ChevronRight className="ml-auto text-slate-600" size={16} />
                            </a>

                            <a href="https://github.com/vora-admin" target="_blank" rel="noreferrer" className="bg-[#111] border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/50 transition-colors">
                                    <Globe size={18} className="text-slate-400 group-hover:text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase">GitHub Repository</h4>
                                    <p className="text-[10px] text-slate-500">Open source & Contracts</p>
                                </div>
                                <ChevronRight className="ml-auto text-slate-600" size={16} />
                            </a>
                        </motion.div>
                    )}


                    {communitySubTab === 'dao' && (
                        <motion.div
                            key="dao"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {VoteView()}
                        </motion.div>
                    )}

                    {communitySubTab === 'media' && (
                        <motion.div
                            key="media"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center space-y-4">
                                <Video size={32} className="mx-auto text-purple-400" />
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase mb-1">Upload Running Crew Media</h4>
                                    <p className="text-xs text-slate-500">Share your gameplay videos or crew images to earn extra community points!</p>
                                </div>
                                <div className="flex gap-3 justify-center pt-2">
                                    <button onClick={() => handleMockUpload('video')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-lg">
                                        Upload Video
                                    </button>
                                    <button onClick={() => handleMockUpload('image')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-xl border border-white/10 transition-colors">
                                        Upload Image
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    const CrewRankingView = () => {
        if (selectedCrew) {
            return (
                <div className="space-y-4 pt-4 px-1 pb-24 h-full flex flex-col">
                    <div className="px-2 flex items-center gap-3">
                        <button className="text-slate-400 hover:text-white" onClick={() => setSelectedCrew(null)}>
                            <ChevronRight size={24} className="rotate-180" />
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter leading-none">{selectedCrew.name}</h2>
                            <p className="text-[10px] text-slate-500 font-bold">Rank {selectedCrew.rank} • {selectedCrew.members} / 30 Members</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#111] border border-white/10 rounded-[2rem] p-4 flex flex-col mb-4 overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-2 flex flex-col justify-end">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black text-amber-500 uppercase">{msg.user}</span>
                                        <span className="text-[8px] text-slate-600 font-bold">{msg.time}</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-none p-3 max-w-[85%] self-start">
                                        <p className="text-xs text-white leading-relaxed font-medium">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2 pt-3 border-t border-white/10 relative z-10">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && chatInput.trim()) {
                                        const userMsg = chatInput;
                                        setChatMessages(prev => [...prev, { id: Date.now(), user: 'You', text: userMsg, time: 'Just now' }]);
                                        setChatInput('');

                                        try {
                                            const response = await fetch('http://localhost:3001/api/chat/brown', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ message: userMsg })
                                            });
                                            const data = await response.json();
                                            setChatMessages(prev => [...prev, { id: Date.now() + 1, user: 'Manager Brown', text: data.reply, time: 'Just now' }]);
                                        } catch (error) {
                                            console.error("Chat error", error);
                                        }
                                    }
                                }}
                                placeholder="Team Chat or ask Manager Brown..."
                                className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                            />
                            <button
                                onClick={async () => {
                                    if (chatInput.trim()) {
                                        const userMsg = chatInput;
                                        setChatMessages(prev => [...prev, { id: Date.now(), user: 'You', text: userMsg, time: 'Just now' }]);
                                        setChatInput('');

                                        try {
                                            const response = await fetch('http://localhost:3001/api/chat/brown', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ message: userMsg })
                                            });
                                            const data = await response.json();
                                            setChatMessages(prev => [...prev, { id: Date.now() + 1, user: 'Manager Brown', text: data.reply, time: 'Just now' }]);
                                        } catch (error) {
                                            console.error("Chat error", error);
                                        }
                                    }
                                }}
                                className="bg-amber-500 text-black p-2 rounded-xl"
                            >
                                <Play size={16} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 pt-4 px-1 pb-24">
                <div className="px-2">
                    <h2 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">Crew Ranking</h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[90%]">
                        Coordinate with your team, climb the ranks, and earn crew rewards.
                    </p>
                </div>

                <div className="px-2 space-y-4">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-5 relative overflow-hidden flex items-center justify-between group cursor-pointer transition-colors hover:bg-white/5"
                        onClick={() => alert("크루 생성 화면으로 이동. (Crew Level 1 required)")}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-bl-full group-hover:from-amber-500/20 transition-colors"></div>
                        <div className="z-10 w-2/3">
                            <h3 className="text-lg font-black text-amber-500 leading-tight mb-2">Join a Crew <br />or Create One</h3>
                            <p className="text-[10px] text-slate-400 font-bold mb-4">Play with friends to earn rewards and climb the ranks.</p>
                            <button className="bg-white text-black px-4 py-2 font-black text-[10px] uppercase rounded-lg shadow-md hover:bg-slate-200 transition-colors">
                                Go to Crew Creation
                            </button>
                        </div>
                        <div className="z-10 w-1/3 flex justify-end">
                            <Trophy size={56} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-3xl p-5">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-base font-black text-white">Top 20 Crews</h4>
                            <Search size={16} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                        </div>

                        <div className="space-y-3 mt-4">
                            <div className="grid grid-cols-12 gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5">
                                <div className="col-span-6">Crew</div>
                                <div className="col-span-3 text-center">Members</div>
                                <div className="col-span-3 text-right">Power</div>
                            </div>
                            <div className="space-y-2">
                                {Array.from({ length: 20 }).map((_, i) => {
                                    const names = ['Donat Duck', 'Specialists', 'ShadowDuckers', 'Duck Hunters', 'DMD BREED...', 'DuckNoSkam', 'Lucky Duck', 'Fearless...', 'Swag', 'Greedy Duck'];
                                    const rank = i + 1;
                                    const name = names[(i * 3) % 10] + (i > 9 ? ` ${rank}` : '');
                                    const members = 20 + (i % 10);
                                    const power = Math.floor(113799 / rank) + Math.floor((20 - i) * 1000);
                                    return (
                                        <div key={i} onClick={() => setSelectedCrew({ name, rank, members, power })} className="grid grid-cols-12 gap-2 items-center py-1.5 hover:bg-white/5 rounded-lg px-1 transition-colors cursor-pointer group">
                                            <div className="col-span-6 flex items-center gap-2">
                                                <span className={`text-xs font-black w-4 text-center ${rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : rank === 2 ? 'text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.8)]' : rank === 3 ? 'text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.8)]' : 'text-slate-500'}`}>{rank}</span>
                                                <div className="w-7 h-7 rounded-lg bg-slate-800 overflow-hidden relative border border-white/5">
                                                    <img src={`https://picsum.photos/50/50?sig=${rank + 100}`} className="w-full h-full object-cover" alt="" />
                                                    {rank <= 3 && <div className="absolute inset-0 border border-white/20 rounded-lg"></div>}
                                                </div>
                                                <span className={`text-[11px] font-bold truncate group-hover:text-amber-400 transition-colors ${rank <= 3 ? (rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : 'text-amber-600') : 'text-purple-300'}`}>{name}</span>
                                            </div>
                                            <div className="col-span-3 text-center text-[10px] text-slate-400 font-mono">
                                                {members} <span className="text-slate-600 text-[9px]">/ 30</span>
                                            </div>
                                            <div className="col-span-3 text-right text-[11px] font-black text-pink-500 tracking-tight">
                                                {power.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MyOfficeView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-4 px-1">
            <div className="px-2">
                <h2 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">My Page</h2>
                <div className="flex items-center space-x-6 border-b border-white/10 pb-0 mt-4">
                    <button
                        onClick={() => setOfficeSubTab('profile')}
                        className={`relative pb-3 text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap ${officeSubTab === 'profile' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        Office (Profile)
                        {officeSubTab === 'profile' && (
                            <motion.div layoutId="officeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
                        )}
                    </button>
                    <button
                        onClick={() => setOfficeSubTab('community')}
                        className={`relative pb-3 text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap ${officeSubTab === 'community' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        Community (Crew)
                        {officeSubTab === 'community' && (
                            <motion.div layoutId="officeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
                        )}
                    </button>
                    <button
                        onClick={() => setOfficeSubTab('dnft')}
                        className={`relative pb-3 text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap ${officeSubTab === 'dnft' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        DNFT P2P
                        {officeSubTab === 'dnft' && (
                            <motion.div layoutId="officeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {officeSubTab === 'profile' && (
                    <motion.div key="office-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Current Fandom Rank */}
                        <div className="px-2">
                            <div className="bg-gradient-to-br from-[#111] to-[#1a1a24] border border-white/10 rounded-3xl p-5 relative overflow-hidden ring-1 ring-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Current Fandom Rank</p>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Iljimae 3</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-red-500/30 flex items-center justify-center">
                                        <Crown size={24} className="text-red-500" />
                                    </div>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                        <span>Next: Iljimae 4</span>
                                        <span className="text-red-500">10 / 15 DRs</span>
                                    </div>
                                    <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 w-[66%] relative">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Stats */}
                        <div className="grid grid-cols-2 gap-3 px-2">
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-lg relative overflow-hidden">
                                <div className="absolute -right-3 -bottom-3 opacity-[0.03]">
                                    <Users size={56} />
                                </div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Direct Referrals (DR)</span>
                                <span className="text-xl font-black text-white">{referrals.l1}</span>
                            </div>
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-lg relative overflow-hidden">
                                <div className="absolute -right-3 -bottom-3 opacity-[0.03]">
                                    <Briefcase size={56} />
                                </div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Fandom Volume (FV)</span>
                                <span className="text-xl font-black text-white">{1000 + (referrals.l1 * 100) + (referrals.l2 * 50)}</span>
                                <span className="text-[9px] text-red-500 font-bold ml-1">VORA</span>
                            </div>
                        </div>

                        {/* Referral Link & Tool */}
                        <div className="px-2">
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Your Fandom Link</p>
                                    <p className="text-xs font-mono text-cyan-400">t.me/Vora_Brown_bot?start={(window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id || 'TESTUSER'}</p>
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    aria-label={isLinkCopied ? "Copied!" : "Copy Fandom Link"}
                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
                                >
                                    {isLinkCopied ? (
                                        <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                        <Copy size={16} className="text-white" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Uni-Level Tiers Breakdown */}
                        <div className="px-2">
                            <h3 className="text-sm font-black uppercase tracking-wider mb-4">Network Structure</h3>
                            <div className="space-y-3">
                                {[
                                    { tier: 'L1 (Direct)', users: referrals.l1, volume: `${referrals.l1 * 100} FV`, percent: '30%', color: 'border-red-500/30 text-red-500 bg-red-500/10' },
                                    { tier: 'L2 (Crew)', users: referrals.l2, volume: `${referrals.l2 * 50} FV`, percent: '15%', color: 'border-orange-500/30 text-orange-400 bg-orange-500/10' }
                                ].map((level, idx) => (
                                    <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-[2px] h-10 ${level.color.split(' ')[0].replace('border-', 'bg-')}`}></div>
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase">{level.tier}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{level.users} Partners • {level.percent} Yield</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-black text-slate-300">{level.volume}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Shadow Volume */}
                                <div className="bg-[#0a0a0a] border border-white/5 border-dashed rounded-2xl p-4 flex items-center justify-between mt-2">
                                    <div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase">N-Level Shadow Volume</h4>
                                        <p className="text-[10px] text-slate-600 font-bold mt-0.5">Automated Roll-up Stats</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-slate-500">{referrals.shadowVolume} SV</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {officeSubTab === 'community' && (
                    <motion.div key="office-community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CommunityView />
                    </motion.div>
                )}

                {officeSubTab === 'dnft' && (
                    <motion.div key="office-dnft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 px-2">
                        <div className="bg-gradient-to-br from-indigo-900/40 to-[#111] border border-white/10 rounded-3xl p-5 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-black text-white">DNFT P2P Market</h3>
                                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-1 rounded-full border border-indigo-500/30">Beta</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">Trade your DNFT assets directly with other users via secure escrow.</p>
                            <button onClick={() => handleMockUpload('dnft')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/50">
                                Upload & Create DNFT
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">Recent Listings</h4>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-4 flex justify-between items-center cursor-pointer"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(0, 255, 255, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(0,255,255,0.15)] relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-10"></div>
                                            <img src="/assets/chip.jpg" alt="DNFT" className="w-full h-full object-cover mix-blend-screen" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white">Quantum Core #{1024 + i}</p>
                                            <p className="text-[9px] text-slate-500 font-bold">Seller: UQx...{i}fA</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-emerald-400">{250 + (i * 50)} TON</p>
                                        <button className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold px-3 py-1 mt-1 rounded-lg transition-colors border border-cyan-500/20">Buy</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="flex justify-center min-h-screen bg-[#050505]">
            <div className="w-full max-w-[430px] bg-black text-white font-sans select-none pb-32 relative overflow-hidden shadow-2xl border-x border-white/5">
                {/* Background Gradients */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-96 bg-gradient-to-b from-slate-900/50 to-black pointer-events-none z-0" />

                {/* Header */}
                <div className="relative z-10 px-6 pt-8 pb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            onClick={handleProfileClick}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-lg"
                        >
                            {profileImg ? (
                                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-emerald-500" size={20} />
                            )}
                            <div className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex">
                                <span className="text-[8px] font-black text-white px-1 text-center leading-tight uppercase">+ IMG</span>
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <VoraLogo className="w-6 h-6" />
                                <h2 className="text-lg font-black uppercase tracking-tight">VORA</h2>
                            </div>
                            <div className="flex items-center space-x-2 mt-0.5">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transform -skew-x-6 px-1.5 rounded-sm ${isUserActive ? 'text-white bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'text-slate-400 bg-slate-800'}`}>VFB</span>
                            </div>
                        </div>
                    </div>
                    {/* Real TON Connect Button */}
                    <div className="ton-connect-wrapper transform scale-75 origin-right">
                        <TonConnectButton className="ton-connect-btn-custom" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 px-6 min-h-[60vh]">
                    {activeTab === NavTab.HOME && HomeView()}
                    {activeTab === NavTab.GAME && GameView()}
                    {activeTab === NavTab.CREW && CrewRankingView()}
                    {activeTab === NavTab.OFFICE && MyOfficeView()}
                    {activeTab === NavTab.MARKETPLACE && MarketplaceView()}
                    {activeTab === NavTab.COMMUNITY && CommunityView()}
                    {activeTab === NavTab.LIVE && <VoraLivePage />}
                    {activeTab === NavTab.INFO && <FandomSubscriptionPage />}
                </div>

                {/* Manager Brown Floating Pill (Only on Home) */}
                {(() => {
                    const kstHour = (new Date().getUTCHours() + 9) % 24;
                    return activeTab === NavTab.HOME && kstHour >= 10 && kstHour < 24 ? (
                        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-full max-w-[430px] flex justify-center pointer-events-none">
                            <button
                                onClick={() => {
                                    const botUrl = "https://t.me/Vora_Brown_bot";
                                    if (window.Telegram?.WebApp?.openTelegramLink) {
                                        window.Telegram.WebApp.openTelegramLink(botUrl);
                                    } else {
                                        window.open(botUrl, "_blank");
                                    }
                                }}
                                className="pointer-events-auto bg-gradient-to-r from-amber-600 to-amber-400 p-[1px] rounded-full shadow-2xl transform hover:scale-105 transition-transform"
                            >
                                <div className="bg-[#0a0a0a] px-5 py-3 rounded-full flex items-center gap-3 border border-white/5 hover:bg-black/80 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative">
                                        <span className="text-amber-500 font-black text-xs">B</span>
                                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white uppercase leading-none">Manager Brown</p>
                                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Policy Guard</p>
                                    </div>
                                    <MessageSquare size={16} className="text-amber-500 ml-1" />
                                </div>
                            </button>
                        </div>
                    ) : null;
                })()}

                {/* Bottom Navigation */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-50 pointer-events-none">
                    <nav className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex justify-between items-center px-4 py-3 shadow-2xl pointer-events-auto">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            active={activeTab === NavTab.HOME}
                            onClick={() => setActiveTab(NavTab.HOME)}
                        />
                        <NavItem
                            icon={<Trophy size={20} />}
                            active={activeTab === NavTab.CREW}
                            onClick={() => { setActiveTab(NavTab.CREW); setSelectedCrew(null); }}
                        />

                        {/* MYPAGE (Center Red V Button) */}
                        <div className="relative -top-6">
                            <button
                                onClick={() => setActiveTab(NavTab.OFFICE)}
                                className={`w-14 h-14 rounded-full bg-gradient-to-br border-4 border-[#050505] shadow-[0_4px_25px_rgba(220,38,38,0.5)] flex items-center justify-center transition-transform ${activeTab === NavTab.OFFICE
                                    ? 'from-red-600 to-red-900 ring-4 ring-red-500/50 ring-offset-2 ring-offset-[#050505] scale-110'
                                    : 'from-slate-800 to-black hover:from-red-800 hover:to-red-900'
                                    }`}
                            >
                                <span className={`text-2xl font-black italic tracking-tighter ${activeTab === NavTab.OFFICE ? 'text-white drop-shadow-[0_0_10px_white]' : 'text-slate-500'}`}>V</span>
                            </button>
                        </div>

                        <NavItem
                            icon={<Crown size={20} />}
                            active={activeTab === NavTab.INFO}
                            onClick={() => setActiveTab(NavTab.INFO)}
                        />
                        <NavItem
                            icon={<Gamepad2 size={20} />}
                            active={activeTab === NavTab.GAME}
                            onClick={() => setActiveTab(NavTab.GAME)}
                        />
                    </nav>
                </div>

                <style>{`
                    @keyframes pan-slow {
                        0% { background-position: 0% 0%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 0%; }
                    }
                    .animate-pan-slow {
                        animation: pan-slow 120s linear infinite;
                    }
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-6px); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 4s infinite ease-in-out;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    /* Hide TON Connect Text and keep symbol */
                    .ton-connect-btn-custom button > div > span {
                        display: none !important;
                    }
                    .ton-connect-btn-custom button > div {
                        margin: 0 !important;
                    }
                    .ton-connect-btn-custom button {
                        padding: 8px 12px !important;
                        min-width: auto !important;
                    }
                `}</style>

                {/* Admin Toggle Area */}
                <div className="fixed top-0 right-0 w-16 h-16 z-[100] cursor-pointer" onDoubleClick={() => navigate('/admin')} />
            </div>
        </div>
    );
};
export default UserApp;
