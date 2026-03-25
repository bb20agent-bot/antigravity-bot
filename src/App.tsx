
// src/App.tsx 상단에 추가
import './index.css';
import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  TrendingUp,
  ShieldCheck,
  LayoutDashboard,
  Play,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  BarChart3,
  Copy,
  ArrowRight,
  Star,
  Globe,
  Wallet2,
  Coins,
  Fingerprint,
  Info,
  ShoppingBag,
  Sparkles,
  FileText,
  Lock,
  Crown,
  Video,
  Bot,
  Send,
  Twitter,
  Share2,
  RefreshCw,
  Settings,
  Database,
  BarChart,
  UserPlus,
  ChevronDown,
  UserCheck,
  Network,
  ListFilter,
  AlertTriangle,
  ShieldAlert,
  Bell,
  Check,
  MessageCircle,
  X,
  History,
  Activity,
  Timer,
  Trophy,
  Flame,
  Battery
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, UserAssets, StrategyInfo, DNFTCharacter, DownlineUser, LegalNotice, BoostTier } from '../types';
import { translations, Language } from '../services/i18nService';
import { VoraLogo } from '../components/VoraLogo';
import VoraLivePage from '../pages/VoraLivePage';

// --- Fandom Academy Data ---
const ACADEMY_COURSES = [
  { ep: 1, title: '블로그 수익 자동화 시스템', desc: '조이의 시나리오 작성, 블로그 컨셉 이미지 생성, 포스팅 자동 업로드 파이프라인 구축법.', thumb: '📝', time: '45 MIN' },
  { ep: 2, title: '차트 레시피 입문', desc: '온라인 강좌. 캔들의 이해부터 핵심 지지/저항선 공략 실전 연습', thumb: '📊', time: '38 MIN' },
  { ep: 3, title: '추세와 역추세 매매기법', desc: '강력한 추세 돌파 셋업 및 리스크 관리형 역추세 스캘핑 매매 룰 익히기', thumb: '📈', time: '52 MIN' },
  { ep: 4, title: '타점 잡기 심화 가이드', desc: '눌림목/되돌림 공략법 및 3가지 핵심 실전 진입 타이밍 포인트', thumb: '🎯', time: '41 MIN' },
  { ep: 5, title: '전략 셋팅 5종 마스터', desc: '시장 상황에 맞춘 5가지 입증된 트레이딩 셋업 완벽 분석', thumb: '⚔️', time: '60 MIN' },
  { ep: 6, title: '글로벌 선물 거래소 완벽 해부', desc: '바이낸스, 바이비트, OKX 특장점 및 수익 창출을 위한 선물 계정 셋팅법', thumb: '🌍', time: '35 MIN' },
  { ep: 7, title: '트레이딩 뷰 200% 활용 실전', desc: '보라 전략 셋팅, 브라운 웹훅 자동매매 연결 및 수익 극대화 얼러트 최적화', thumb: '🎛️', time: '55 MIN' },
  { ep: 8, title: 'MT5 실전 매매 로직', desc: '외환/금 종목별 기능 이해, 핍 계산, 손익비 및 스톱/트레일링 셋팅 전략', thumb: '📉', time: '48 MIN' },
  { ep: 9, title: '추천 브로커사 강점 비교', desc: '레버리지, 수수료, 슬리피지, 이벤트 혜택 비교를 통한 최적의 브로커 선정', thumb: '⚖️', time: '30 MIN'},
  { ep: 10, title: '브라운 백테스팅 및 종합', desc: '브라운 멘탈 관리법 및 배운 전략을 종합하여 나만의 승률 높은 레시피 만들기', thumb: '🧠', time: '40 MIN' }
];

const FandomSubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<'USER' | 'TRADER' | null>(null);
  const [showAcademy, setShowAcademy] = useState(false);

  if (showAcademy) {
    return (
      <div className="px-5 py-4 space-y-6 pb-24 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowAcademy(false)} className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20"><AlertTriangle className="rotate-90 hidden" /><ArrowUpRight className="rotate-[225deg]" size={20}/></button>
          <h2 className="text-xl font-black italic uppercase">VORA Academy</h2>
        </div>
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          <span className="bg-purple-500 text-[9px] px-2 py-1 rounded-full uppercase font-black tracking-widest text-white absolute top-4 right-4 animate-pulse">Exclusive</span>
          <h3 className="text-2xl font-black mb-2 text-white">VORA Masterclass 10</h3>
          <p className="text-xs text-purple-200 leading-relaxed font-medium">상위 1% 도약을 위한 보라 독점 아카데미. 블로그 수익 자동화부터 글로벌 선물 매매 전략까지 10대 핵심 노하우를 제공합니다.</p>
        </div>
        <div className="space-y-4">
          {ACADEMY_COURSES.map(course => (
            <div key={course.ep} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center" onClick={() => alert(`[VORA 아카데미]\n\nEP ${course.ep}. ${course.title}\n\n팬덤 구독자 전용 동영상 재생 모듈을 연결 중입니다.`)}>
              <div className="bg-black/40 w-16 h-16 rounded-xl flex items-center justify-center text-3xl border border-white/5 shadow-inner">
                {course.thumb}
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-1 block">Episode {course.ep} • {course.time}</span>
                <h4 className="text-sm font-bold text-white mb-1 leading-tight">{course.title}</h4>
                <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">{course.desc}</p>
              </div>
              <Play className="text-green-400 w-8 flex-shrink-0 opacity-80" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 select-none">Fandom Plans</h2>
        <p className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">Choose Your VORA Journey</p>
      </div>
      
      {/* Fandom User Plan */}
      <div onClick={() => setSelectedPlan('USER')} className={`relative p-[1px] rounded-[2rem] overflow-hidden cursor-pointer transition-all ${selectedPlan === 'USER' ? 'scale-[1.02] z-10' : 'opacity-80 scale-95'}`}>
        <div className={`absolute inset-0 bg-gradient-to-b from-blue-500 to-indigo-600 ${selectedPlan === 'USER' ? 'opacity-100' : 'opacity-50'}`}></div>
        <div className="relative bg-[#0a0a0a] rounded-[2rem] p-6 h-full border border-white/10 pb-8 hover:bg-[#111]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Star className="text-blue-400 mb-2" size={28} />
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Fandom User</h3>
              <p className="text-[10px] text-gray-400 font-bold">크리에이터 및 투자 입문자용</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black block">$19</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">/ month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-xs font-medium text-gray-300">
              <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
              <span>VORA 아카데미 (온라인 10강) 무제한 수강</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-gray-300">
              <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
              <span>블로그 자동화 파이프라인 봇 (시나리오+이미지)</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-gray-300">
              <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
              <span>dNFT 프로필 자동 생성 (Tap-to-earn 부스트)</span>
            </li>
          </ul>
          {selectedPlan === 'USER' && (
             <button onClick={(e) => { e.stopPropagation(); setShowAcademy(true); }} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20">Subscribe & Enter Academy</button>
          )}
        </div>
      </div>

      {/* Fandom Trader Plan */}
      <div onClick={() => setSelectedPlan('TRADER')} className={`relative p-[1px] rounded-[2rem] overflow-hidden cursor-pointer transition-all ${selectedPlan === 'TRADER' ? 'scale-[1.02] z-10' : 'opacity-80 scale-95'}`}>
        <div className={`absolute inset-0 bg-gradient-to-b from-amber-500 to-red-600 ${selectedPlan === 'TRADER' ? 'opacity-100 animate-pulse' : 'opacity-50'}`}></div>
        <div className="relative bg-[#0a0a0a] rounded-[2rem] p-6 h-full border border-white/10 pb-8 hover:bg-[#111]">
          <span className="absolute top-0 right-6 bg-gradient-to-b from-amber-500 to-red-600 px-3 py-1 rounded-b-xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg">Most Popular</span>
          <div className="flex justify-between items-start mb-6 pt-2">
            <div>
              <TrendingUp className="text-amber-500 mb-2" size={28} />
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Fandom Trader</h3>
              <p className="text-[10px] text-gray-400 font-bold">본격 전문 실전 트레이더용</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black block">$49</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">/ month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-xs font-medium text-amber-200">
              <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
              <span>Fandom User 혜택 전체 포함 (아카데미 10강)</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-white">
              <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
              <span>트레이딩뷰 웹훅 연동 및 실시간 대시보드 제공</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-white">
              <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
              <span>브라운 AI 목표 관리 및 자동 손절/익절 (안전벨트)</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-white">
              <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
              <span>바이낸스 / MT5 자동매매 (Autopilot) 봇 지원</span>
            </li>
          </ul>
          {selectedPlan === 'TRADER' && (
             <div className="space-y-3">
               <button onClick={(e) => { e.stopPropagation(); setShowAcademy(true); }} className="w-full py-3 bg-white/10 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/20">📚 아카데미 10강 보기</button>
               <button onClick={(e) => { e.stopPropagation(); window.location.href = '/vora_dashboard.html'; }} className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-red-500 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                 <LayoutDashboard size={16} /> 트레이더 대시보드 입장
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value }: { value: string | number }) => (
  <span className="tabular-nums transition-all duration-500 ease-out">{value}</span>
);

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const OrgNode: React.FC<{ user: DownlineUser; level: number }> = ({ user, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const hasChildren = user.children && user.children.length > 0;
  return (
    <div className="relative">
      <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${user.status === 'Active' ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-50'}`}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border border-white/10">{user.name.charAt(0)}</div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-tight">{user.name}</p>
          <p className="text-[8px] font-bold text-gray-500">{user.rank} • {user.volume} TON</p>
        </div>
        {hasChildren && <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-gray-500">{isExpanded ? <ChevronDown size={14} /> : <ArrowRight size={14} />}</button>}
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-4 mt-2 pl-4 border-l border-white/10 space-y-2">
          {user.children!.map(child => (
            <OrgNode key={child.id} user={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ExtendedStrategyInfo extends StrategyInfo {
  id: string;
  exchange: string;
  thumbnail: string;
  viewers: string;
}

const StrategyVideoCard: React.FC<{ strategy: ExtendedStrategyInfo }> = ({ strategy }) => {
  return (
    <div className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden group transition-all hover:border-white/20">
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
          <div className="px-2 py-1 bg-red-500 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">Live Backtest</div>
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
            <Users size={8} className="inline mr-1" /> {strategy.viewers}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-sm font-black uppercase tracking-tight mb-1">{strategy.name}</h4>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold">Trader: {strategy.trader}</p>
            <div className="flex items-center gap-1 text-green-500 font-black text-xs">
              <TrendingUp size={12} /> {strategy.roi}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between bg-white/5">
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Win Rate</p>
            <p className="text-[10px] font-black text-white">{strategy.winRate}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Risk</p>
            <p className={`text-[10px] font-black ${strategy.riskLevel === 'High' ? 'text-red-500' : 'text-green-500'}`}>{strategy.riskLevel}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-[#0088cc] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00aaff] transition-colors">
          Copy Strategy
        </button>
      </div>
    </div>
  );
};

const App: React.FC<{ lang?: Language }> = ({ lang = 'ko' }) => {
  const t = translations[lang] || translations['ko'];
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [assets, setAssets] = useState<UserAssets>({
    ton: 124.52,
    vora: 45000,
    totalSubscriptionFee: 500,
    accumulatedBenefits: 520,  // Set over fee to show Phase 2 logic
    lastActiveTime: Date.now() - 172800000, // 48 hours ago
    currentTier: 'Starter',
    energy: 1000,
    maxEnergy: 1000
  });

  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const [taps, setTaps] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isTapping, setIsTapping] = useState(false);
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [lastEarnedAmount, setLastEarnedAmount] = useState(0);

  const [strategySortBy, setStrategySortBy] = useState("roi");

  const [downline] = useState<DownlineUser[]>([
    { id: 'd1', name: 'Alex Vora', rank: 'Gold Elite', status: 'Active', volume: '2,450', children: [] },
    { id: 'd2', name: 'Elena S.', rank: 'Emerald', status: 'Active', volume: '5,100', children: [] }
  ]);

  // --- Dynamic Engine Logic ---
  const isBreakEvenReached = assets.accumulatedBenefits >= assets.totalSubscriptionFee;
  const timeSinceLastActive = Date.now() - assets.lastActiveTime;
  const safeTimeLeft = Math.max(0, 259200000 - timeSinceLastActive); // 72h limit
  const isUserActive = safeTimeLeft > 0;

  const tierMultipliers: Record<BoostTier, number> = {
    'Eco': 0.2, 'Starter': 1.0, 'Pro': 2.5, 'Elite': 5.0, 'Partner': 15.0
  };

  const activityMultiplier = (isBreakEvenReached && !isUserActive) ? 0.3 : 1.0;
  const currentTotalMultiplier = (tierMultipliers[assets.currentTier] * activityMultiplier).toFixed(2);

  const [adminStrategies] = useState<ExtendedStrategyInfo[]>([
    {
      id: 's1',
      name: "Momentum Breakout v4",
      trader: "Simbora",
      roi: "+42.5%",
      winRate: "78%",
      status: "Live",
      exchange: "Bybit",
      thumbnail: "https://picsum.photos/800/500?grayscale&sig=1",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-financial-charts-on-a-computer-monitor-4326-large.mp4",
      viewers: "1.2K",
      riskLevel: 'High'
    },
    {
      id: 's2',
      name: "Grid Master Pro",
      trader: "VORA_AI",
      roi: "+28.1%",
      winRate: "85%",
      status: "Live",
      exchange: "Binance",
      thumbnail: "https://picsum.photos/800/500?grayscale&sig=2",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-tablet-screen-4327-large.mp4",
      viewers: "856",
      riskLevel: 'Medium'
    },
  ]);

  // Energy Regeneration
  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + 1)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (assets.energy <= 0) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const baseVora = 10;
    const totalEarned = Math.round(baseVora * parseFloat(currentTotalMultiplier));

    setAssets(prev => ({
      ...prev,
      vora: prev.vora + totalEarned,
      accumulatedBenefits: prev.accumulatedBenefits + (totalEarned / 10000),
      energy: prev.energy - 1,
      lastActiveTime: Date.now()
    }));

    setTaps(prev => [...prev, { id: Date.now(), x: clientX, y: clientY }]);

    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const removeTap = (id: number) => {
    setTaps(prev => prev.filter(tap => tap.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white max-w-md mx-auto relative overflow-hidden pb-32 border-x border-white/15">

      {/* Risk Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 space-y-6 max-w-xs text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse"><ShieldAlert size={32} className="text-amber-500" /></div>
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-amber-500">Service Policy</h2>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                VORA는 금융 상품이 아닌 '유효 트레이딩 부스트' 유틸리티 서비스입니다. 모든 리워드는 생태계 기여도(7:3 법칙)에 따라 변동되며, 과거 데이터는 재가입 시 복구되지 않습니다.
              </p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} className="w-full py-4 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">AGREE & ENTER</button>
          </div>
        </div>
      )}



      <header className="px-5 pt-7 pb-4 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <VoraLogo className="w-8 h-8" />
            <h2 className="text-[18px] font-black tracking-widest leading-none" style={{ fontFamily: "'Syne', sans-serif" }}><span className="text-[#00C9A7]">V</span>ORA</h2>
          </div>
          <div className="flex items-center gap-1.5 mt-1 ml-2">
            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border uppercase ${isUserActive ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
              {isUserActive ? 'ACTIVE GROUP' : 'INACTIVE GROUP'}
            </span>
            <span className="text-[7px] font-black bg-white/5 text-gray-500 px-1.5 py-0.5 rounded border border-white/10 uppercase">{assets.currentTier} TIER</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-black shadow-xl">
          <Wallet2 size={14} />Connect
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-20">

        {/* Dynamic Engine Dashboard Section */}
        <section className="px-5 py-4 space-y-4">
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-7 backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/5">
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
                <Timer size={18} className={isUserActive ? 'text-green-500' : 'text-red-500'} />
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">72H Activity Safeguard</p>
                  <p className={`text-xs font-black tracking-widest ${isUserActive ? 'text-white' : 'text-red-500'}`}>
                    {formatTime(Math.floor(safeTimeLeft / 1000))}
                  </p>
                </div>
              </div>
              {isUserActive ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <button onClick={() => setActiveTab(NavTab.MY_OFFICE)} className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest animate-pulse">Re-Activate Now</button>
              )}
            </div>
          </div>
        </section>

        {activeTab === NavTab.HOME && (
          <div className="px-5 space-y-6 pb-10">
            {/* VORA Balance Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 opacity-10"><Coins size={120} /></div>
              <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Total Accumulated Benefits</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black tracking-tighter text-white"><AnimatedNumber value={assets.vora.toLocaleString()} /></span>
                <span className="text-sm font-black text-purple-400">VORA</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">≈ {assets.accumulatedBenefits.toFixed(2)} TON EQ.</p>
            </div>

            {/* Live Backtesting Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Video size={16} className="text-red-500" /> Live Backtesting
                </h3>
                <button className="text-[10px] font-black text-[#0088cc] uppercase tracking-widest">View All</button>
              </div>
              <div className="space-y-4">
                {adminStrategies.map(strategy => (
                  <StrategyVideoCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            </div>

            {/* Info Section about the 7:3 Rule */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-500">Simbora Utility Policy</h4>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                본 플랫폼은 혜택 누적액이 구독료에 도달한 시점부터 <span className="text-white font-bold">동적 배분 모드</span>로 전환됩니다. 72시간 내 활동을 유지하여 <span className="text-green-500 font-bold">70% 풀(Active Group)</span> 권한을 지키십시오. 활동 미비 시 혜택 획득 속도가 즉시 제한됩니다.
              </p>
            </div>
          </div>
        )}

        {activeTab === NavTab.MY_OFFICE && (
          <div className="px-5 py-4 space-y-8 animate-in slide-in-from-right duration-500 pb-24 h-max flex flex-col">
            <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">My Office</h3>
              <p className="text-[10px] text-gray-500 font-black tracking-[0.3em] uppercase">VORA Tokens & Crew Activities</p>
            </div>

            {/* Token History & Activity */}
            <section className="bg-gradient-to-br from-green-900/20 to-transparent border border-white/10 rounded-3xl p-6">
               <div className="flex items-center gap-3 mb-4">
                 <Coins className="text-green-500" size={24} />
                 <div>
                   <h4 className="font-black uppercase text-sm">보라 토큰 내역</h4>
                   <p className="text-[10px] text-gray-400">나의 누적 VORA 획득량</p>
                 </div>
               </div>
               <div className="text-4xl font-black text-white tracking-tighter mb-1"><AnimatedNumber value={assets.vora.toLocaleString()} /> <span className="text-sm text-green-500">VORA</span></div>
            </section>

            {/* Tapping Center (Engagement Center) */}
            <section className="flex flex-col items-center justify-center space-y-8 py-4">
              <div className="relative">
                {/* Tapping Circle */}
                <motion.button
                  onPointerDown={handleTap}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-48 h-48 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00C9A7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      <Zap size={40} fill="black" className="text-black" />
                    </div>
                  </div>

                  {/* Floating Numbers Container */}
                  <AnimatePresence>
                    {taps.map(tap => (
                      <motion.div
                        key={tap.id}
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={() => removeTap(tap.id)}
                        className="fixed pointer-events-none text-xl font-black text-white z-[100]"
                        style={{ left: tap.x - 20, top: tap.y - 40 }}
                      >
                        +{Math.round(10 * parseFloat(currentTotalMultiplier))}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Energy Bar */}
              <div className="w-full max-w-[200px] space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00C9A7]">Energy</span>
                  <span className="text-[10px] font-black">{assets.energy} /{assets.maxEnergy}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full border border-white/10 p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00C9A7] to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(assets.energy / assets.maxEnergy) * 100}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Crew Activities (Downline Tree) */}
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <Users className="text-blue-400" size={20} />
                   <h4 className="font-black uppercase text-sm">크루 추천 볼륨</h4>
                 </div>
                 <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-bold uppercase">My Team</span>
              </div>
              <div className="space-y-3">
                {downline.map(member => (
                   <OrgNode key={member.id} user={member} level={0} />
                ))}
              </div>
            </section>

            {/* Voting & Community Hub */}
            <section className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="bg-purple-500/20 w-10 h-10 flex items-center justify-center rounded-xl"><Sparkles className="text-purple-400" size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">투표 안건 참여</span>
               </div>
               <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="bg-pink-500/20 w-10 h-10 flex items-center justify-center rounded-xl"><MessageCircle className="text-pink-400" size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">커뮤니티 허브</span>
               </div>
            </section>

          </div>
        )}
      </main>

      {/* Floating Manager Brown */}
      {(() => {
        const kstHour = (new Date().getUTCHours() + 9) % 24;
        return kstHour >= 10 && kstHour < 24 ? (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center gap-3 pointer-events-none">
            {/* Brown CTO Button */}
            <button
              onClick={() => {
                const botUrl = "https://t.me/BrownCTO_Bot";
                if (window.Telegram?.WebApp?.openTelegramLink) {
                  window.Telegram.WebApp.openTelegramLink(botUrl);
                } else {
                  window.open(botUrl, "_blank");
                }
              }}
              className="pointer-events-auto bg-gradient-to-r from-[#0088cc] to-blue-400 p-[1px] rounded-full shadow-2xl animate-bounce-slow"
            >
              <div className="bg-[#0a0a0a] px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/5 hover:bg-black/80 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center relative">
                  <Bot size={16} className="text-[#0088cc]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></span>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-white uppercase leading-none">CTO Brown</p>
                  <p className="text-[6px] font-black text-[#0088cc] uppercase tracking-widest mt-0.5">Tech & Policy</p>
                </div>
              </div>
            </button>

            {/* Joy Seo CMO Button */}
            <button
              onClick={() => {
                const botUrl = "https://t.me/Crew_Meetup_Bot";
                if (window.Telegram?.WebApp?.openTelegramLink) {
                  window.Telegram.WebApp.openTelegramLink(botUrl);
                } else {
                  window.open(botUrl, "_blank");
                }
              }}
              className="pointer-events-auto bg-gradient-to-r from-amber-600 to-amber-400 p-[1px] rounded-full shadow-2xl animate-bounce-slow"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="bg-[#0a0a0a] px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/5 hover:bg-black/80 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center relative">
                  <Bot size={16} className="text-amber-500" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></span>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-white uppercase leading-none">CMO Joy</p>
                  <p className="text-[6px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Crew Leader</p>
                </div>
              </div>
            </button>
          </div>
        ) : null;
      })()}

      {activeTab === NavTab.LIVE && (
        <VoraLivePage />
      )}

      {activeTab === NavTab.INFO && (
        <FandomSubscriptionPage />
      )}

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full py-4.5 px-8 z-50 flex justify-between items-center shadow-2xl">
        <NavItem icon={<LayoutDashboard size={22} />} active={activeTab === NavTab.HOME} onClick={() => setActiveTab(NavTab.HOME)} ariaLabel="Home" />
        <NavItem icon={<Video size={22} />} active={activeTab === NavTab.LIVE} onClick={() => setActiveTab(NavTab.LIVE)} ariaLabel="Live" />
        <NavItem icon={<Gamepad2 size={22} />} active={activeTab === NavTab.MY_OFFICE} onClick={() => setActiveTab(NavTab.MY_OFFICE)} ariaLabel="My Office" />
        <NavItem icon={<ShoppingBag size={22} />} active={activeTab === NavTab.MARKETPLACE} onClick={() => setActiveTab(NavTab.MARKETPLACE)} ariaLabel="Marketplace" />
        <NavItem icon={<Crown size={22} />} active={activeTab === NavTab.INFO} onClick={() => setActiveTab(NavTab.INFO)} ariaLabel="Info" />
      </nav>

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-bounce-slow { animation: bounce-slow 5s infinite ease-in-out; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, active, onClick, className, ariaLabel }: { icon: React.ReactNode, active: boolean, onClick: () => void, className?: string, ariaLabel?: string }) => (
  <button onClick={onClick} className={`p-2 transition-all relative ${className} ${active ? 'scale-125' : 'text-gray-600'}`} aria-label={ariaLabel}>
    <span className={active ? 'text-[#0088cc]' : ''}>{icon}</span>
    {active && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0088cc] shadow-[0_0_15px_#0088cc]"></span>}
  </button>
);

export default App;

