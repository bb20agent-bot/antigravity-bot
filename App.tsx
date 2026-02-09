
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  User, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  LayoutDashboard, 
  Play, 
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  BarChart3,
  GraduationCap,
  Award,
  Copy,
  ArrowRight,
  Star,
  Activity,
  Flame,
  Globe,
  Wallet2,
  Coins,
  Fingerprint,
  Info,
  Gift,
  ArrowRightLeft,
  History,
  ShoppingBag,
  Sparkles,
  ArrowUp,
  FileText,
  Megaphone,
  BookOpen,
  Lock,
  Crown,
  Compass,
  Video,
  Bot,
  BrainCircuit,
  PieChart,
  Send,
  Twitter,
  ThumbsUp,
  MessageSquare,
  Share2,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { NavTab, UserAssets, StrategyInfo, PredictionHistoryItem, ReferralLevel, TeamMilestone, UserRank, DNFTCharacter } from './types';

const AnimatedNumber = ({ value }: { value: string | number }) => (
  <span className="tabular-nums transition-all duration-500 ease-out">{value}</span>
);

interface ExtendedStrategyInfo extends StrategyInfo {
  id: string;
  exchange: string;
  thumbnail: string;
  viewers: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedLeverage, setSelectedLeverage] = useState<number>(3);
  const [assets, setAssets] = useState<UserAssets>({ ton: 124.52, vora: 45000 });
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // User Rank state
  const [userRank] = useState<string>("GOLD ELITE");

  // Tap to Earn State
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [nextTapCountdown, setNextTapCountdown] = useState<number>(0);
  const [isTapping, setIsTapping] = useState(false);

  // Voting State Simulation
  const [voteCount, setVoteCount] = useState(1240);
  const [hasVoted, setHasVoted] = useState(false);

  // Referral State
  const [referralCode] = useState("VORA-ELITE-99");
  const [copyStatus, setCopyStatus] = useState("Copy");

  // DNFT Market State
  const [dnfts, setDnfts] = useState<DNFTCharacter[]>([
    { id: 'c1', name: '거북도사', tier: 'Legendary', image: '🐢', bonus: 'Master Status', owned: true, price: 1250, lastPrice: 1100, trend: [100, 110, 105, 120, 115, 125], supply: 42 },
    { id: 'c2', name: '일지매', tier: 'Epic', image: '🗡️', bonus: 'Elite Status', owned: false, price: 840, lastPrice: 720, trend: [60, 65, 75, 70, 80, 84], supply: 128 },
    { id: 'c3', name: '홍길동', tier: 'Epic', image: '🎭', bonus: 'Leader Status', owned: false, price: 790, lastPrice: 750, trend: [70, 72, 71, 74, 78, 79], supply: 156 },
    { id: 'c4', name: '황진이', tier: 'Rare', image: '🌸', bonus: 'Member Status', owned: false, price: 420, lastPrice: 380, trend: [30, 32, 35, 33, 40, 42], supply: 512 },
    { id: 'c5', name: '어우동', tier: 'Rare', image: '💃', bonus: 'Verified Status', owned: false, price: 395, lastPrice: 360, trend: [28, 30, 31, 35, 38, 39], supply: 640 },
  ]);

  // Simulate market price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setDnfts(prev => prev.map(nft => {
        const change = (Math.random() * 8) - 2; 
        const newPrice = Math.max(10, Math.round(nft.price! + change));
        const newTrend = [...nft.trend!.slice(1), Math.round(newPrice / 10)];
        return { ...nft, lastPrice: nft.price, price: newPrice, trend: newTrend };
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [strategies] = useState<ExtendedStrategyInfo[]>([
    { id: 's1', name: "Momentum Breakout v4", trader: "Simbora", roi: "+42.5%", winRate: "78%", status: "Live", exchange: "Bybit", thumbnail: "https://picsum.photos/800/500?grayscale&sig=1", viewers: "1.2K" },
    { id: 's2', name: "Grid Master Pro", trader: "VORA_AI", roi: "+28.1%", winRate: "85%", status: "Live", exchange: "Binance", thumbnail: "https://picsum.photos/800/500?grayscale&sig=2", viewers: "856" },
    { id: 's3', name: "Hyper Scalp Alpha", trader: "Master_V", roi: "+12.4%", winRate: "91%", status: "Live", exchange: "OKX", thumbnail: "https://picsum.photos/800/500?grayscale&sig=10", viewers: "3.1K" }
  ]);

  const [referralLevels] = useState<ReferralLevel[]>([
    { level: 1, rate: 30, members: 12, volume: '4,200' },
    { level: 2, rate: 15, members: 45, volume: '18,500' },
    { level: 3, rate: 5, members: 128, volume: '42,000' },
  ]);

  // Global Timers for T2E
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastTapTime > 0) {
        const now = Date.now();
        const diff = 86400000 - (now - lastTapTime);
        setNextTapCountdown(diff > 0 ? Math.floor(diff / 1000) : 0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastTapTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTapToEarn = () => {
    if (nextTapCountdown > 0) return;
    setIsTapping(true);
    setTimeout(() => {
      const baseVora = isSubscribed ? 1000 : 200;
      const referralMultiplier = 1.5; 
      const totalEarned = Math.round(baseVora * referralMultiplier);
      setAssets(prev => ({ ...prev, vora: prev.vora + totalEarned }));
      setLastTapTime(Date.now());
      setIsTapping(false);
    }, 1200);
  };

  const handleSubscribe = () => {
    if (assets.ton < 100) return;
    setAssets(prev => ({ ton: prev.ton - 100, vora: prev.vora + 100 }));
    setIsSubscribed(true);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://t.me/VoraTradeFiBot?start=${referralCode}`);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy"), 2000);
  };

  const handleVote = () => {
    if (hasVoted) return;
    setVoteCount(prev => prev + 1);
    setHasVoted(true);
  };

  const leverageOptions = [
    { value: 3, label: "3x", req: "$1,000 ~ $5,000", info: "Basic Tier" },
    { value: 5, label: "5x", req: "$10,000+", info: "Advanced Tier" },
    { value: 10, label: "10x", req: "$50,000+", info: "Pro Tier" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white max-w-md mx-auto relative overflow-hidden pb-32 border-x border-white/15 ring-1 ring-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
      {/* Background Decor */}
      <div className="absolute top-[-5%] right-[-10%] w-72 h-72 bg-[#0088cc]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-60 h-60 bg-[#a855f7]/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Top Profile Header - Refined Proportions */}
      <header className="px-5 pt-7 pb-4 flex items-center justify-between relative z-30 bg-gradient-to-b from-[#050505] to-transparent">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0088cc] to-purple-500 rounded-2xl blur opacity-20"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-2xl">
               <User size={24} className="text-[#0088cc]" />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0088cc] border-2 border-[#050505] rounded-full flex items-center justify-center shadow-md">
                 <Star size={10} fill="white" className="text-white" />
               </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
               <h2 className="text-[16px] font-black tracking-tight leading-none">
                 VORA_99
               </h2>
               <div className="bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                 <Crown size={10} className="text-yellow-500" />
                 <span className="text-[8px] font-black text-yellow-500 tracking-tighter uppercase">{userRank}</span>
               </div>
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">
              TON Pioneer <span className="text-gray-700 mx-1">|</span> UID: 78210
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsWalletConnected(!isWalletConnected)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl border ${
            isWalletConnected 
              ? 'bg-white/5 text-gray-500 border-white/10' 
              : 'bg-white text-black border-white shadow-[0_4px_15px_rgba(255,255,255,0.1)] active:scale-95'
          }`}
        >
          <Wallet2 size={14} />
          {isWalletConnected ? 'Connected' : 'Connect'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto relative z-20 no-scrollbar">
        
        {activeTab === NavTab.HOME && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Asset Display - Side-by-Side for Stability */}
            <section className="px-5 py-4">
              <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-2xl ring-1 ring-white/5">
                <div className="absolute top-4 right-6 bg-green-500/10 text-green-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-green-500/20 flex items-center gap-1 uppercase tracking-tighter">
                  {isSubscribed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {isSubscribed ? 'Vora Pioneer Active' : 'Monthly Required'}
                </div>
                
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] mb-5">Portfolio Overview</p>
                
                <div className="flex items-center justify-between mb-8 gap-4">
                   <div className="flex-1">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-tight">TON Balance</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black tracking-tighter text-white">
                          <AnimatedNumber value={assets.ton.toFixed(1)} />
                        </span>
                        <span className="text-xs font-bold text-[#0088cc]">TON</span>
                      </div>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10"></div>
                   <div className="flex-1 text-right">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-tight">VORA Power</p>
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-4xl font-black tracking-tighter text-purple-400">
                          <AnimatedNumber value={assets.vora.toLocaleString()} />
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase">VORA</span>
                      </div>
                   </div>
                </div>

                {!isSubscribed ? (
                  <button 
                    onClick={handleSubscribe}
                    className="w-full bg-white text-black py-4.5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.12)] active:scale-95 transition-all"
                  >
                    <RefreshCw size={16} />
                    Subscribe (100 TON)
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-[8px] ml-1">+100 VORA</span>
                  </button>
                ) : (
                  <div className="w-full bg-white/5 border border-white/10 py-4 rounded-3xl flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Active Membership</span>
                  </div>
                )}
              </div>
            </section>

            {/* Leverage Section */}
            <section className="px-5 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                  <Zap size={14} className="text-[#0088cc]" /> Leverage Terminal
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {leverageOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setSelectedLeverage(opt.value)}
                      className={`relative py-5 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-1 ${
                        selectedLeverage === opt.value ? 'bg-[#0088cc] border-[#00d4ff] shadow-xl text-white' : 'bg-black/40 border-white/5 grayscale opacity-60 text-gray-500'
                      }`}>
                      <span className="text-2xl font-black tracking-tighter">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Vertical Video Feed */}
            <section className="px-5 space-y-4 mb-10">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Video size={18} className="text-[#0088cc]" />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Live Alpha Feed</h3>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isSubscribed ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {isSubscribed ? <CheckCircle2 size={10} /> : <Lock size={10} />}
                  <span className="text-[9px] font-black uppercase">{isSubscribed ? 'Unlocked' : 'Locked Content'}</span>
                </div>
              </div>

              <div className="space-y-6">
                {strategies.map((strat) => (
                  <div key={strat.id} className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 group ring-1 ring-white/5">
                    {!isSubscribed && <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                           <Lock size={24} className="text-white/40" />
                        </div>
                        <p className="text-[11px] font-black uppercase leading-relaxed tracking-wider">Subscribe to TON Monthly<br/>to Watch Strategy Alpha</p>
                      </div>}
                    <div className="aspect-video relative">
                      <img src={strat.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play fill="white" size={24} className="opacity-80" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black tracking-tight">{strat.name}</h4>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{strat.trader} • {strat.exchange}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-green-400">{strat.roi}</span>
                        <p className="text-[8px] font-black text-gray-600 uppercase">Return</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === NavTab.MY_OFFICE && (
          <div className="px-5 py-4 space-y-8 animate-in slide-in-from-right duration-500">
            <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Elite Office</h3>
              <p className="text-[10px] text-gray-500 font-black tracking-[0.3em]">PARTICIPATION & GROWTH</p>
            </div>

            {/* Referral Link Component */}
            <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <Share2 size={16} className="text-[#0088cc]" /> Affiliate Link
                  </h4>
                  <span className="text-[8px] font-black bg-[#0088cc]/10 text-[#0088cc] px-2 py-0.5 rounded-full border border-[#0088cc]/20">MONETIZED</span>
               </div>
               <div className="bg-black/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <p className="text-[10px] font-medium text-gray-400 truncate pr-4 italic">
                    https://t.me/VoraTradeFiBot?start={referralCode}
                  </p>
                  <button 
                    onClick={handleCopyReferral}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0088cc] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0077bb] transition-all active:scale-95 shadow-lg"
                  >
                    <Copy size={12} />
                    {copyStatus}
                  </button>
               </div>
            </section>

            {/* Tap-to-Earn Rewards Section */}
            <section className="bg-gradient-to-tr from-[#0088cc]/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden text-center space-y-6 ring-1 ring-white/5">
               <div className="flex justify-center relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-75 animate-pulse"></div>
                  <button onClick={handleTapToEarn} disabled={nextTapCountdown > 0 || isTapping}
                    className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                      nextTapCountdown > 0 ? 'bg-white/5 border border-white/10 opacity-60 scale-95' : 'bg-white text-black shadow-2xl active:scale-90'
                    }`}>
                    {isTapping ? <div className="animate-spin w-12 h-12 border-4 border-black/20 border-t-black rounded-full"></div> : 
                      <div className="flex flex-col items-center">
                         <Coins size={48} fill="currentColor" className="mb-2" />
                         <span className="text-[12px] font-black uppercase tracking-widest leading-none">{nextTapCountdown > 0 ? formatTime(nextTapCountdown) : 'COLLECT VORA'}</span>
                         <span className="text-[8px] font-black text-gray-500 mt-1 uppercase">24H CYCLE</span>
                      </div>}
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  {[
                    { label: 'Unilevel', val: isSubscribed ? '+50%' : '+0%', icon: <Users size={12} /> },
                    { label: 'Activity', val: '+12%', icon: <Target size={12} /> },
                    { label: 'Lectures', val: '+8%', icon: <GraduationCap size={12} /> },
                    { label: 'Trading', val: '+10%', icon: <TrendingUp size={12} /> }
                  ].map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{item.icon}</span>
                        <span className="text-[8px] font-black uppercase text-gray-500">{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-black ${item.val.startsWith('+0') ? 'text-gray-700' : 'text-green-400'}`}>{item.val}</span>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 space-y-6">
               <h4 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2"><BarChart3 size={16} className="text-[#0088cc]" /> Network Structure</h4>
               <div className="space-y-3">
                  {referralLevels.map((l) => (
                    <div key={l.level} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-gray-500 uppercase">Tier {l.level} Rewards</span>
                      <span className="text-lg font-black text-[#0088cc]">{l.rate}%</span>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        )}

        {activeTab === NavTab.MARKETPLACE && (
          <div className="px-5 py-4 space-y-8 animate-in slide-in-from-left duration-500">
             <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Gallery</h3>
              <p className="text-[10px] text-gray-500 font-black tracking-[0.3em]">DNFT MARKETPLACE</p>
            </div>
            <section className="space-y-4 pb-10 px-1">
                {dnfts.map((nft) => (
                  <div key={nft.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-all cursor-pointer ring-1 ring-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-[#111] border border-white/10 flex items-center justify-center text-4xl shadow-xl">{nft.image}</div>
                      <div>
                        <h5 className="text-md font-black tracking-tight">{nft.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase italic">{nft.bonus}</span>
                          <span className={`text-[7px] font-black px-1 rounded bg-white/5 border border-white/10 ${nft.tier === 'Legendary' ? 'text-yellow-500' : 'text-purple-400'}`}>{nft.tier}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-white"><AnimatedNumber value={nft.price!} /> <span className="text-[10px] text-[#0088cc]">VORA</span></p>
                       <div className={`text-[10px] font-black ${nft.price! >= nft.lastPrice! ? 'text-green-500' : 'text-red-500'} flex items-center justify-end gap-1`}>
                          {nft.price! >= nft.lastPrice! ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {Math.abs(((nft.price! - nft.lastPrice!) / nft.lastPrice!) * 100).toFixed(1)}%
                       </div>
                    </div>
                  </div>
                ))}
            </section>
          </div>
        )}

        {activeTab === NavTab.INFO && (
          <div className="px-5 py-4 space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Discovery Hub</h3>
              <p className="text-[10px] text-gray-500 font-black tracking-[0.3em]">SOCIALS & GOVERNANCE</p>
            </div>

            {/* Platform Improvement Voting (Governance) */}
            <section className="space-y-4">
               <h4 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                 <ThumbsUp size={16} className="text-green-500" /> Platform Governance
               </h4>
               <div className="bg-gradient-to-br from-[#1c1c1c] to-black border border-white/10 rounded-[2.5rem] p-7 space-y-5 ring-1 ring-white/5">
                  <div>
                    <span className="text-[8px] font-black text-[#0088cc] uppercase bg-[#0088cc]/10 px-2 py-0.5 rounded-full border border-[#0088cc]/20 mb-2 inline-block">Proposal #24</span>
                    <h5 className="text-[13px] font-black leading-snug">Implement Auto-Rebalancing for Staking Rewards?</h5>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Direct community vote for feature dev</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black">
                       <span className="uppercase tracking-widest text-gray-500">Current Support</span>
                       <span className="text-[#0088cc]">{voteCount.toLocaleString()} VORA Power</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-[#0088cc] transition-all duration-1000" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={handleVote}
                    disabled={hasVoted}
                    className={`w-full py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all ${
                      hasVoted 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-none scale-95' 
                        : 'bg-white text-black active:scale-95 shadow-[0_10px_25px_rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {hasVoted ? 'VOTE CONFIRMED' : 'SUBMIT ALPHA VOTE'}
                  </button>
               </div>
            </section>

            {/* Social Channels Section */}
            <section className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                <Globe size={16} className="text-[#0088cc]" /> Global Channels
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white/5 border border-white/10 p-4.5 rounded-[2rem] flex items-center gap-3 group active:scale-95 transition-all">
                   <div className="w-10 h-10 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-all shadow-inner">
                      <Send size={20} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase">Telegram</p>
                      <p className="text-[8px] text-gray-500 font-bold">Community</p>
                   </div>
                </button>
                <button className="bg-white/5 border border-white/10 p-4.5 rounded-[2rem] flex items-center gap-3 group active:scale-95 transition-all">
                   <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                      <Twitter size={20} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase">X / Twitter</p>
                      <p className="text-[8px] text-gray-500 font-bold">News Feed</p>
                   </div>
                </button>
              </div>
            </section>

            {/* Documents & Resources */}
            <section className="space-y-4 pb-20">
              <h4 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                <BookOpen size={16} className="text-purple-500" /> Protocol Docs
              </h4>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-4 ring-1 ring-white/5">
                 <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 hover:border-[#0088cc]/40 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <FileText size={18} className="text-gray-500 group-hover:text-[#0088cc]" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Core Whitepaper v2.0</span>
                   </div>
                   <ArrowRight size={14} className="text-gray-700" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 hover:border-[#0088cc]/40 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-gray-500 group-hover:text-green-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Compliance Policy</span>
                   </div>
                   <ArrowRight size={14} className="text-gray-700" />
                 </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Floating VORA AI Agent Button */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none">
         <button className="pointer-events-auto bg-gradient-to-r from-[#0088cc] to-[#a855f7] p-[1px] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-bounce-slow ring-1 ring-white/10">
            <div className="bg-[#0a0a0a] px-7 py-3.5 rounded-full flex items-center gap-3 border border-white/5">
               <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <Bot size={18} className="text-white z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/20 to-purple-500/20 animate-pulse"></div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a] z-20"></span>
               </div>
               <div className="text-left">
                  <p className="text-[11px] font-black text-white uppercase tracking-tighter">VORA AGENTIC AI</p>
                  <p className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-0.5">Automating Your Assets</p>
               </div>
               <Sparkles size={16} className="text-purple-400" />
            </div>
         </button>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full py-4.5 px-8 z-50 flex justify-between items-center shadow-2xl ring-1 ring-white/5">
        <NavItem 
          icon={<LayoutDashboard size={22} strokeWidth={activeTab === NavTab.HOME ? 3 : 2} />} 
          active={activeTab === NavTab.HOME} 
          onClick={() => setActiveTab(NavTab.HOME)} 
        />
        <NavItem 
          icon={<Gamepad2 size={22} strokeWidth={activeTab === NavTab.MY_OFFICE ? 3 : 2} />} 
          active={activeTab === NavTab.MY_OFFICE} 
          onClick={() => setActiveTab(NavTab.MY_OFFICE)} 
        />
        <NavItem 
          icon={<ShoppingBag size={22} strokeWidth={activeTab === NavTab.MARKETPLACE ? 3 : 2} />} 
          active={activeTab === NavTab.MARKETPLACE} 
          onClick={() => setActiveTab(NavTab.MARKETPLACE)} 
        />
        <NavItem 
          icon={<FileText size={22} strokeWidth={activeTab === NavTab.INFO ? 3 : 2} />} 
          active={activeTab === NavTab.INFO} 
          onClick={() => setActiveTab(NavTab.INFO)} 
        />
      </nav>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s infinite ease-in-out;
        }
        main {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        main::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-2 transition-all duration-500 relative ${active ? 'text-[#0088cc] scale-125' : 'text-gray-600'}`}
  >
    {icon}
    {active && (
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0088cc] shadow-[0_0_15px_rgba(0,136,204,1)]"></span>
    )}
  </button>
);

export default App;
