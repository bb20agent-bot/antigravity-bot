import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Zap, Wallet, Bot, MessageSquare,
  Activity, ArrowUpRight, ShieldCheck, Crown, Lock, Flame,
  LineChart, Video, FileText, Search, Bell, Settings,
  CheckCircle2, TrendingUp, AlertTriangle, ArrowRight,
  Database, Network, Cuboid, Globe, ShieldAlert, Cpu
} from 'lucide-react';

type TabType = 'DASHBOARD' | 'FANDOM' | 'T2E' | 'LIQUIDITY' | 'STAKING' | 'COMMUNITY';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-black/40 border-r border-white/10 backdrop-blur-3xl flex flex-col z-20">
        <div className="p-7">
          <h1 className="text-2xl font-black tracking-widest uppercase flex items-center gap-2">
            <ShieldCheck className="text-amber-500" size={28} />
            <span className="text-[#00C9A7]">V</span>ORA <span className="text-xs text-amber-500 border border-amber-500/30 px-1.5 rounded bg-amber-500/10">ADMIN</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 italic flex items-center gap-1">
            <Lock size={10} /> Central Control Node
          </p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 no-scrollbar overflow-y-auto">
           <SidebarItem icon={<LayoutDashboard size={18} />} label="통합 대시보드 홈" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
           <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Fandom Universe</p>
           <SidebarItem icon={<Users size={18} />} label="유니레벨 & dNFT 관리" active={activeTab === 'FANDOM'} onClick={() => setActiveTab('FANDOM')} />
           <SidebarItem icon={<Zap size={18} />} label="T2E 배수 & 크루 에어드랍" active={activeTab === 'T2E'} onClick={() => setActiveTab('T2E')} />
           
           <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Finance & Auto-Trading</p>
           <SidebarItem icon={<Wallet size={18} />} label="조이 P2P 덱스 & 유동성" active={activeTab === 'LIQUIDITY'} onClick={() => setActiveTab('LIQUIDITY')} />
           <SidebarItem icon={<Bot size={18} />} label="CEX 상장 & MM 봇 제어" active={activeTab === 'STAKING'} onClick={() => setActiveTab('STAKING')} />
           
           <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Community Hub</p>
           <SidebarItem icon={<MessageSquare size={18} />} label="아카데미 & DAO 거버넌스" active={activeTab === 'COMMUNITY'} onClick={() => setActiveTab('COMMUNITY')} />
        </nav>

        <div className="p-5 border-t border-white/10 bg-white/5">
          <div className="bg-[#0a0a0a] rounded-2xl p-4 flex items-center gap-3 border border-white/10 shadow-2xl">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-inner">
                <Crown size={20} className="text-white drop-shadow-md" />
             </div>
             <div>
               <p className="text-xs font-black uppercase text-white tracking-widest">Steve. J</p>
               <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Super Admin
               </p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        {/* Top Header */}
        <header className="h-[72px] border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-30">
           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-colors focus-within:bg-white/10 focus-within:border-white/20">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="CMD+K Search operations..." className="bg-transparent text-xs font-medium outline-none w-64 text-white placeholder-gray-500" />
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                <Activity size={14} className="text-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Operational</span>
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-ping"></span>
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>
              </button>
           </div>
        </header>

        {/* Dynamic Panel Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 no-scrollbar">
           {/* Abstract Glow Backgrounds */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0088cc]/10 rounded-full blur-[150px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

           <div className="relative z-10 max-w-7xl mx-auto animate-in fade-in duration-500">
             {activeTab === 'DASHBOARD' && <DashboardPanel />}
             {activeTab === 'FANDOM' && <FandomPanel />}
             {activeTab === 'T2E' && <T2EPanel />}
             {activeTab === 'LIQUIDITY' && <LiquidityPanel />}
             {activeTab === 'STAKING' && <StakingPanel />}
             {activeTab === 'COMMUNITY' && <CommunityPanel />}
           </div>
        </div>
      </main>
    </div>
  );
};

// -------------------------------------------------------------
// 1. Dashboard Overview Panel
// -------------------------------------------------------------
const DashboardPanel = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Platform Overview</h2>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">실시간 생태계 통합 지표</p>
      </div>
      <button className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition">
        <ArrowUpRight size={14} /> Export Report
      </button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Fandom Users" value="12,450" sub="+8% vs last week" icon={<Users className="text-[#0088cc]" />} />
      <StatCard title="VORA Liquidity" value="$1.2M" sub="Joy CMO Pool" icon={<Database className="text-purple-500" />} />
      <StatCard title="Staking Pre-order" value="68%" sub="$2.04M / $3.00M TARGET" icon={<Flame className="text-amber-500" />} />
      <StatCard title="P2P 텍스 수익 (Burn)" value="45,200 TON" sub="15% Auto Burned" icon={<LineChart className="text-green-500" />} />
    </div>

    <div className="grid grid-cols-3 gap-6 mt-8">
      <div className="col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Network size={16} className="text-blue-400"/> 실시간 트랜잭션 & 봇 가동률</h3>
        <div className="h-64 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5">
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">[ TradingView Graph Mockup ]</p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Urgent Actions</h3>
        <ActionAlert title="dNFT 5단계 승인 대기" desc="Alex 님의 '로키 지팡이' 큐브 패스 승인 대기중." type="amber" />
        <ActionAlert title="P2P 에스크로 타겟 달성" desc="조이 봇이 25% 텍스 정산을 완료했습니다." type="blue" />
        <ActionAlert title="신규 전략 투표 완료" desc="DAO: Grid Master v2 배포 투표 가결." type="green" />
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------
// 2. Fandom Unilevel & dNFT Panel
// -------------------------------------------------------------
const FandomPanel = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Fandom Universe & dNFT</h2>
      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">1, 2레벨 N볼륨 추적 및 5단계 페르소나 관리</p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      {/* 5-Stage dNFT System */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10"><Cuboid size={200} /></div>
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-purple-400 flex items-center gap-2">
          <Cuboid size={16} /> dNFT 5단계 변신 (우주력 큐브)
        </h3>
        <div className="space-y-4 z-10 relative">
          <StageRow level={1} title="스타트업 개발자" req="가입 기본 혜택" active={true} />
          <StageRow level={2} title="성장하는 매니저" req="N볼륨 5,000" active={true} />
          <StageRow level={3} title="비즈니스 성공자" req="N볼륨 20,000" active={true} />
          <StageRow level={4} title="크루 리더 (조이/브라운)" req="N볼륨 50,000 + AI기여" active={false} />
          <div className="p-4 bg-gradient-to-r from-purple-900/40 to-amber-900/40 border border-amber-500/30 rounded-2xl flex justify-between items-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1 block">Final Stage (Lv.5)</span>
              <h4 className="font-black text-white">로키의 지팡이 큐브 (Loki's Cube)</h4>
              <p className="text-[10px] text-gray-400 mt-1">대미를 장식하는 절대 권력 부여</p>
            </div>
            <button className="bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-amber-500/20">승인 발동</button>
          </div>
        </div>
      </div>

      {/* Unilevel Tree Watcher */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Network size={16} className="text-[#0088cc]"/> 1,2레벨 유니레벨 N볼륨 추적</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
              <th className="pb-3">User</th>
              <th className="pb-3">Level 1 Vol</th>
              <th className="pb-3">Level 2 Vol</th>
              <th className="pb-3">Total N Vol</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold">
            <UserRow name="Alex (Team A)" l1="12,500" l2="34,200" sum="46,700" isHigh={true} />
            <UserRow name="Sarah (Team B)" l1="8,000" l2="15,000" sum="23,000" isHigh={false} />
            <UserRow name="David (Team C)" l1="4,200" l2="4,500" sum="8,700" isHigh={false} />
            <UserRow name="Elena (Team D)" l1="25,000" l2="60,000" sum="85,000" isHigh={true} />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------
// 3. T2E & Airdrop Panel
// -------------------------------------------------------------
const T2EPanel = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-1">T2E & Crew Promotion</h2>
      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">탭투언 차등 배수 & 팀빌딩 에어드랍 관리</p>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 col-span-2">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-green-400">T2E Multiplier Engine</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Fandom User</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[9px] font-black">Base Setup</span>
            </div>
            <div className="text-3xl font-black text-white">1.0x <span className="text-xs text-gray-500">VORA/Tap</span></div>
          </div>
          <div className="bg-gradient-to-br from-amber-900/30 to-[#0a0a0a] p-5 rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Fandom Trader</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded text-[9px] font-black">Premium</span>
            </div>
            <div className="text-3xl font-black text-amber-500">2.0x <span className="text-xs text-gray-500">VORA/Tap</span></div>
          </div>
        </div>
        
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Volume Bonus Override</h3>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex-1">
            <p className="text-xs font-bold text-white mb-1">+0.5x N볼륨 달성 에어드랍율 증가</p>
            <p className="text-[10px] text-gray-400">추천 볼륨이 높아지면 기본 T2E 드랍량이 상승합니다.</p>
          </div>
          <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase">설정 변경</button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-900/30 to-purple-900/20 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-blue-400 flex items-center gap-2">
          <Crown size={18} /> Crew Promotion
        </h3>
        <p className="text-[10px] text-gray-300 font-medium mb-6 leading-relaxed">
          브라운 AI 활용도가 높고 하부 팀 관리가 우수한 팬덤을 <strong className="text-white">'크루'로 발탁</strong>하여 단독 프로모션 에어드랍을 쏩니다.
        </p>
        <div className="space-y-3 mb-6">
          <div className="bg-check-dark p-3 rounded-xl border border-white/10 flex justify-between items-center bg-[#0a0a0a]">
            <div>
              <p className="text-xs font-black">Elena S.</p>
              <p className="text-[9px] text-green-400">AI Score: 98 / Team: 124</p>
            </div>
            <button className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"><ArrowRight size={12}/></button>
          </div>
          <div className="bg-check-dark p-3 rounded-xl border border-white/10 flex justify-between items-center bg-[#0a0a0a]">
            <div>
              <p className="text-xs font-black">Marcus T.</p>
              <p className="text-[9px] text-green-400">AI Score: 92 / Team: 89</p>
            </div>
            <button className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"><ArrowRight size={12}/></button>
          </div>
        </div>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
          크루 발탁 & 에어드랍 쏘기
        </button>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------
// 4. Liquidity & Joy CMO MM P2P Panel
// -------------------------------------------------------------
const LiquidityPanel = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Joy CMO Liquidity & P2P Escrow</h2>
      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">팬덤 구독 기반 TON/USDC 풀 생성 및 에스크로 텍스 관리</p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      {/* Platform Liquidity Withdrawal */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-cyan-400">
          <Database size={16} /> Subscription Liquidity Pool
        </h3>
        <p className="text-[10px] text-gray-400 mb-6">팬덤 구독시 생성되는 TON / USDC 풀을 통해 출금을 자체 지원합니다. (CEX 상장 전 정책)</p>
        
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Current Pool Size</span>
              <p className="text-xl font-black text-white mt-1">1,245,000 USDC</p>
            </div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center"><Wallet className="text-cyan-400" /></div>
          </div>
          
          <div className="border border-white/5 rounded-xl p-4 bg-white/5">
             <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-black uppercase tracking-widest">출금 기여 차감 수수료 (5%)</span>
               <span className="text-[10px] text-green-400 font-bold">Active</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex-1 bg-[#0a0a0a] p-2 rounded-lg text-center border border-white/5">
                 <p className="text-[9px] text-gray-500 font-black uppercase mb-1">운영비</p>
                 <p className="text-sm font-black text-cyan-400">2.0%</p>
               </div>
               <div className="flex-1 bg-[#0a0a0a] p-2 rounded-lg text-center border border-white/5">
                 <p className="text-[9px] text-gray-500 font-black uppercase mb-1">VORA 소각(Burn)</p>
                 <p className="text-sm font-black text-red-500">3.0%</p>
               </div>
             </div>
          </div>
          <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors">VORA DEX POOL 연결 확인</button>
        </div>
      </div>

      {/* Telegram P2P Escrow Tax */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px]"></div>
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-amber-500">
          <Globe size={16} /> Telegram P2P Escrow (Joy MM)
        </h3>
        
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5">
           <span className="text-[10px] font-black text-amber-500">Seller 사전할인 유도: -3%</span>
           <span className="text-[10px] font-black text-green-400">Buyer 프리미엄 확보: +2%</span>
        </div>

        <div className="border border-white/5 rounded-xl p-4 bg-[#0a0a0a] mb-5">
           <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-white">조이 중개 에스크로 텍스 (Tax)</span>
             <span className="text-xs font-black text-red-500">TOTAL 25%</span>
           </div>
           
           <div className="h-4 bg-white/5 rounded-full overflow-hidden flex mb-2">
             <div className="h-full bg-blue-500" style={{ width: '40%' }}></div> {/* 10% / 25% */}
             <div className="h-full bg-red-600" style={{ width: '60%' }}></div> {/* 15% / 25% */}
           </div>
           
           <div className="flex justify-between text-[10px] font-bold">
             <span className="text-blue-400">10% 운영비 분배</span>
             <span className="text-red-500">15% 소각 (Burn)</span>
           </div>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
           <span className="text-xs font-bold">실시간 P2P 매칭 대기열</span>
           <span className="text-[10px] bg-red-500 px-2 py-1 rounded text-white font-black animate-pulse">24 Active</span>
        </div>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------
// 5. Staking & CEX MM Bot Panel
// -------------------------------------------------------------
const StakingPanel = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-1">VORA MM Staking & Auto Bots</h2>
      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">300만불 사전예약 게이지 및 자체 CEX 봇 모니터링</p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6 relative overflow-hidden">
       <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-5"><Flame size={200} /></div>
       <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-amber-500 z-10 relative">
         <Flame size={16} /> 300만불 사전 예약 스테이킹 풀 (Pre-order)
       </h3>
       
       <div className="z-10 relative w-3/4">
         <div className="flex justify-between text-2xl font-black mb-2">
           <span>$2,040,000</span>
           <span className="text-gray-500">$3,000,000</span>
         </div>
         <div className="h-6 bg-black/50 rounded-full overflow-hidden border border-white/10 p-1 mb-3">
           <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: '68%' }}></div>
         </div>
         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-500">
           <span>68% Filled</span>
           <span>CEX 상장 조건 달성까지 $960,000 남음</span>
         </div>
       </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <BotControlCard 
        name="VORA 전략 그리드 봇" 
        status="Standby" 
        desc="강력한 마틴게일 및 리스크 분산형 양방향 그리드 타점. (CEX 상장 완료 시 출격 대기)"
      />
      <BotControlCard 
        name="VORA 브라운 Copy Trading Bot" 
        status="Online" 
        desc="상위 1% 브라운 AI 포지션을 수만 명의 팬덤 유저에게 0.1초 딜레이로 복사/배포합니다."
        isOnline={true}
      />
    </div>
  </div>
);

// -------------------------------------------------------------
// 6. Community & Academy Hub
// -------------------------------------------------------------
const CommunityPanel = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Academy & Community Hub</h2>
      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">강좌 영상 업로드 관리, 백서 및 DAO 투표 통제소</p>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-purple-400"><Video size={16}/> 미디어 업로더 (Media Uploader)</h3>
            <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded">Storage: 2.4TB / 5.0TB</span>
          </div>
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-white/40 transition-colors cursor-pointer mb-4 bg-black/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3"><ArrowUpRight size={20} className="text-purple-400" /></div>
            <p className="font-black text-sm mb-1">VORA 아카데미 강좌 및 백테스팅 영상 업로드</p>
            <p className="text-[10px] text-gray-400">Click or drag & drop MP4, MOV files here</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-[#0a0a0a] border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">유튜브 연동 송출</button>
            <button className="flex-1 py-3 bg-purple-600 border border-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">데이터베이스 저장</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16}/> 공식 채널 & 백서</h3>
          <div className="space-y-3 mb-6">
            <input type="text" value="https://t.me/vora_official_kr" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-400 outline-none" readOnly />
            <input type="text" value="https://x.com/vora_global" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-400 outline-none" readOnly />
            <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl mt-4">
              <span className="text-xs font-black text-purple-400">Whitepaper v2.1.pdf</span>
              <button className="text-[10px] font-black uppercase bg-purple-500 text-white px-2 py-1 rounded">Update</button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/30 to-[#0a0a0a] border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-indigo-400"><MessageSquare size={16}/> DAO 투표 생성기</h3>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4">
            신규 퀀트 전략 런칭, 토크노믹스 변경 등을 팬덤 DAO 투표로 올립니다.
          </p>
          <input type="text" placeholder="투표 안건 제목 (예: VORA 6.0 전략 도입)" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none mb-3 placeholder-gray-600" />
          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">투표 등록 (블록체인 기록)</button>
        </div>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------
// Small Reusable Components
// -------------------------------------------------------------
const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <span className={active ? 'text-[#0088cc]' : ''}>{icon}</span>
    <span className={`text-[11px] font-black uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

const StatCard = ({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h4>
      <div className="p-2 bg-black/40 rounded-xl">{icon}</div>
    </div>
    <div className="text-2xl font-black mb-1">{value}</div>
    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{sub}</div>
  </div>
);

const ActionAlert = ({ title, desc, type }: { title: string, desc: string, type: 'amber' | 'blue' | 'green' }) => {
  const colors = {
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    green: 'border-green-500/30 bg-green-500/10 text-green-500'
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[type]} flex gap-3 items-start`}>
      <AlertTriangle size={16} className="mt-0.5" />
      <div>
        <h4 className="text-xs font-black mb-1">{title}</h4>
        <p className="text-[10px] opacity-80 leading-relaxed font-bold">{desc}</p>
      </div>
    </div>
  );
};

const StageRow = ({ level, title, req, active }: { level: number, title: string, req: string, active: boolean }) => (
  <div className={`flex items-center gap-4 p-3 rounded-xl border ${active ? 'bg-white/10 border-white/20' : 'bg-[#0a0a0a] border-white/5 opacity-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${active ? 'bg-[#0088cc] text-white' : 'bg-white/5 text-gray-600'}`}>
      L{level}
    </div>
    <div className="flex-1">
      <h4 className="text-xs font-black text-white">{title}</h4>
      <p className="text-[10px] text-gray-400">{req}</p>
    </div>
    {active ? <CheckCircle2 size={16} className="text-green-500" /> : <Lock size={16} className="text-gray-600" />}
  </div>
);

const UserRow = ({ name, l1, l2, sum, isHigh }: { name: string, l1: string, l2: string, sum: string, isHigh: boolean }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
    <td className="py-3 items-center flex gap-2">
      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px]">{name.charAt(0)}</div>
      {name}
    </td>
    <td className="py-3 text-gray-400">{l1}</td>
    <td className="py-3 text-gray-400">{l2}</td>
    <td className={`py-3 ${isHigh ? 'text-[#0088cc]' : 'text-gray-300'}`}>{sum}</td>
    <td className="py-3 text-right">
      <button className="text-[9px] font-black uppercase text-amber-500 border border-amber-500/30 px-2 py-1 rounded hover:bg-amber-500 hover:text-black transition">조회</button>
    </td>
  </tr>
);

const BotControlCard = ({ name, status, desc, isOnline }: { name: string, status: string, desc: string, isOnline?: boolean }) => (
  <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4">
        <Cpu size={24} className={isOnline ? 'text-green-500' : 'text-gray-500'} />
      </div>
      <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
        {status}
      </div>
    </div>
    <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-white">{name}</h3>
    <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-6 h-8">{desc}</p>
    <div className="flex gap-2">
      <button className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white' : 'bg-[#0088cc] text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(0,136,204,0.3)]'}`}>
        {isOnline ? 'Stop Bot' : 'Deploy Bot (출격)'}
      </button>
      <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
        <Settings size={14} />
      </button>
    </div>
  </div>
);

export default AdminDashboard;