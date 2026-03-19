import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Zap, Wallet, Bot, MessageSquare,
  Activity, ArrowUpRight, ShieldCheck, Crown, Lock, Flame,
  LineChart, Video, FileText, Search, Bell, Settings,
  CheckCircle2, TrendingUp, AlertTriangle, ArrowRight,
  Database, Network, Cuboid, Globe, ShieldAlert, Cpu, Key
} from 'lucide-react';

type TabType = 'DASHBOARD' | 'FANDOM' | 'TRADER_MGMT' | 'T2E' | 'LIQUIDITY' | 'STAKING' | 'COMMUNITY';

const BASE_API_URL = 'http://localhost:3001/api/admin';

// Reusable fetcher
const fetchApi = async (path: string, options?: any) => {
  try {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${path}:`, error);
    return { status: 'error' };
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
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
           <SidebarItem icon={<Key size={18} />} label="VIP 트레이더(API) 관제" active={activeTab === 'TRADER_MGMT'} onClick={() => setActiveTab('TRADER_MGMT')} />
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

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        <header className="h-[72px] border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-30">
           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-colors focus-within:bg-white/10 focus-within:border-white/20">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="CMD+K Search operations..." className="bg-transparent text-xs font-medium outline-none w-64 text-white placeholder-gray-500" />
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                <Activity size={14} className="text-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Backend Connected</span>
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-ping"></span>
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 no-scrollbar">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0088cc]/10 rounded-full blur-[150px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

           <div className="relative z-10 max-w-7xl mx-auto animate-in fade-in duration-500">
             {activeTab === 'DASHBOARD' && <DashboardPanel />}
             {activeTab === 'FANDOM' && <FandomPanel />}
             {activeTab === 'TRADER_MGMT' && <TraderPanel />}
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
// 1. Dashboard Overview
// -------------------------------------------------------------
const DashboardPanel = () => {
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    const res = await fetchApi('/overview');
    if (res.status === 'success') setData(res.data);
  };

  useEffect(() => { loadData(); }, []);

  if (!data) return <div className="text-white text-center py-20 font-black animate-pulse">Loading API Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Platform Overview</h2>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">실시간 생태계 통합 지표 (DB Sync)</p>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition">
          <ArrowUpRight size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Fandom Users" value={data.users.toLocaleString()} sub="Registered in DB" icon={<Users className="text-[#0088cc]" />} />
        <StatCard title="VORA Liquidity" value={`$${data.liquidityUsdc.toLocaleString()}`} sub="Joy CMO Pool" icon={<Database className="text-purple-500" />} />
        <StatCard title="Staking Pre-order" value={`${((data.stakingPool / 3000000)*100).toFixed(1)}%`} sub={`$${data.stakingPool.toLocaleString()} / $3.0M`} icon={<Flame className="text-amber-500" />} />
        <StatCard title="P2P 텍스 수익 (Burn)" value={`${data.p2pTax.toLocaleString()} TON`} sub="Escrow Tax Accumulated" icon={<LineChart className="text-green-500" />} />
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
           <ActionAlert title="API Health: Online" desc="Express v5 & SQLite DB successfully linked to React Front-end." type="green" />
         </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Fandom Panel
// -------------------------------------------------------------
const FandomPanel = () => {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const res = await fetchApi('/users/fandom');
    if (res.status === 'success') setUsers(res.data);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleLevelUp = async (userId: number, currentLevel: number) => {
    if (currentLevel >= 5) return alert("최대 레벨입니다.");
    const res = await fetchApi('/action/upgrade-dnft', { method: 'POST', body: JSON.stringify({ userId, level: currentLevel + 1 }) });
    if (res.status === 'success') {
      alert(`로키 지팡이(Lv.${currentLevel+1}) 발동 승인 완료!`);
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Fandom Universe & dNFT</h2>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">1, 2레벨 N볼륨 추적 및 5단계 페르소나 관리</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-purple-400">
          <Network size={16} /> 1,2레벨 유니레벨 N볼륨 추적 (Live DB)
        </h3>
        {users.length === 0 ? (
           <p className="text-gray-500 font-black italic">데이터베이스에 가입된 유저가 없습니다.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
                <th className="pb-3">User ID</th>
                <th className="pb-3">Telegram ID</th>
                <th className="pb-3">N Volume</th>
                <th className="pb-3 text-center">dNFT Level</th>
                <th className="pb-3 text-center">Crew Status</th>
                <th className="pb-3 text-right">Approve Stage</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold">
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 items-center flex gap-2">UID: {u.id}</td>
                  <td className="py-3 text-cyan-400">@{u.telegramId}</td>
                  <td className="py-3 text-[#0088cc]">{u.nVolume.toLocaleString()} N-Vol</td>
                  <td className="py-3 text-center text-amber-500 font-black">Lv.{u.dnftLevel} {u.dnftLevel === 5 && '👑'}</td>
                  <td className="py-3 text-center text-green-400">{u.isCrew ? 'CREW' : '-'}</td>
                  <td className="py-3 text-right flex gap-2 justify-end">
                    <button onClick={() => handleLevelUp(u.id, u.dnftLevel)} className="text-[9px] font-black uppercase text-amber-500 border border-amber-500/30 px-2 py-1 rounded hover:bg-amber-500 hover:text-black transition">등업 승인</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// X. VIP Trader Management Panel
// -------------------------------------------------------------
const TraderPanel = () => {
  const [traders, setTraders] = useState<any[]>([]);

  const loadTraders = async () => {
    const res = await fetchApi('/traders');
    if (res.status === 'success') setTraders(res.data);
  };

  useEffect(() => { loadTraders(); }, []);

  const handleSupportConnect = async (userId: number) => {
    const apiKey = prompt(`[VIP 대리 지원] User ${userId}의 Binance API Key를 입력하세요 (비워두면 기존 유지):`);
    if (apiKey === null) return; // Cancelled
    const secretKey = prompt(`[VIP 대리 지원] User ${userId}의 Binance Secret Key를 입력하세요:`);
    const webhookUrl = prompt(`[VIP 대리 지원] User ${userId}의 TradingView Webhook URL을 입력하세요:`);
    
    const res = await fetchApi('/traders/update-keys', { 
        method: 'POST', 
        body: JSON.stringify({ userId, apiKey: apiKey || '', secretKey: secretKey || '', webhookUrl: webhookUrl || '' }) 
    });
    if (res.status === 'success') {
        alert(res.message);
        loadTraders();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">VIP Trader Security Command</h2>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">매일 매매를 하는 트레이더들의 API 및 웹훅 연동 특별 관제소</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-blue-400">
          <Key size={16} /> 실시간 Security Key 체결 현황 모니터링
        </h3>
        {traders.length === 0 ? (
           <p className="text-gray-500 font-black italic">현재 등록된 VIP 트레이더가 없습니다.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
                <th className="pb-3 px-2">User ID</th>
                <th className="pb-3 text-center">Binance API Key</th>
                <th className="pb-3 text-center">TV Webhook</th>
                <th className="pb-3 text-right pr-2">중앙 대리 지원 (Intervene)</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold">
              {traders.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2 text-cyan-400">@{t.telegramId} <span className="text-[9px] text-gray-500 ml-1">(UID: {t.id})</span></td>
                  <td className="py-4 text-center">
                     {t.binanceApiKey ? <span className="text-green-400 font-black uppercase tracking-widest text-[9px] border border-green-500/30 px-1 py-0.5 rounded">Connected</span> : <span className="text-red-500 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/30 uppercase tracking-widest text-[9px]">Missing</span>}
                  </td>
                  <td className="py-4 text-center">
                     {t.tvWebhookUrl ? <span className="text-green-400 font-black uppercase tracking-widest text-[9px] border border-green-500/30 px-1 py-0.5 rounded">Active</span> : <span className="text-red-500 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/30 uppercase tracking-widest text-[9px]">Missing</span>}
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button onClick={() => handleSupportConnect(t.id)} className="text-[9px] font-black uppercase text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition shadow-lg">대리 연결</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. T2E & Airdrop Panel
// -------------------------------------------------------------
const T2EPanel = () => {
  const handleAirdrop = async () => {
    const userId = prompt("크루 발탁할 유저의 ID(UID)를 입력하세요:");
    if (!userId) return;
    const res = await fetchApi('/action/airdrop-crew', { method: 'POST', body: JSON.stringify({ userId, amount: 50000 }) });
    if (res.status === 'success') alert(res.message);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">T2E & Crew Promotion</h2>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">탭투언 차등 배수 & 팀빌딩 에어드랍 관리</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 col-span-2">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-green-400">T2E Multiplier Engine</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">User Base Setup</span>
              <div className="text-3xl font-black text-white">1.0x</div>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-[#0a0a0a] p-5 rounded-2xl border border-amber-500/30 text-center shadow-[0_0_20px_rgba(245,158,11,0.05)]">
              <span className="text-[10px] text-amber-500 font-black uppercase block mb-1">Trader Premium</span>
              <div className="text-3xl font-black text-amber-500">2.0x</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-900/30 to-purple-900/20 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-blue-400 flex items-center gap-2">
            <Crown size={18} /> Crew Promotion
          </h3>
          <p className="text-[10px] text-gray-300 font-medium mb-6 leading-relaxed">
            API 연동 완료. 아래 버튼 클릭시 대상 유저의 DB에 <span className="text-green-400">isCrew = 1</span> 반영 및 보너스 에어드랍이 투하됩니다.
          </p>
          <button onClick={handleAirdrop} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all">
            팀빌더 크루 발탁 (Airdrop)
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4, 5, 6. Remaining Panels (Simplified for Demo Logic sharing)
// -------------------------------------------------------------
const LiquidityPanel = () => (
  <div className="space-y-6">
    <div className="mb-6"><h2 className="text-2xl font-black uppercase">Joy CMO Liquidity & P2P Escrow</h2></div>
    <div className="border border-white/10 bg-white/5 rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest">
       <Database size={48} className="mx-auto mb-4 text-cyan-400 opacity-50" />
       API Endpoint '/api/admin/overview' (p2pTaxAccumulated) Connected in Dashboard Home.
    </div>
  </div>
);

const StakingPanel = () => {
  const deployBot = async (botType: string) => {
    const res = await fetchApi('/action/bot-deploy', { method: 'POST', body: JSON.stringify({ botType, action: 'DEPLOY' }) });
    if (res.status === 'success') alert(`[백엔드 OS 통신] ${res.message}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6"><h2 className="text-2xl font-black uppercase">VORA MM Staking & Auto Bots</h2></div>
      <div className="grid grid-cols-2 gap-6">
        <BotControlCard name="VORA 전략 그리드 봇" status="Standby" onDeploy={() => deployBot("GridBot")} />
        <BotControlCard name="VORA 카피 트레이딩 봇" status="Standby" onDeploy={() => deployBot("CopyTradeBot")} />
      </div>
    </div>
  );
};

const BotControlCard = ({ name, status, onDeploy }: any) => (
  <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl">
    <div className="flex justify-between items-center mb-6">
      <Cpu size={24} className="text-blue-500" />
      <span className="text-[10px] font-black uppercase border border-white/10 px-2 py-1 rounded text-gray-400">{status}</span>
    </div>
    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-6">{name}</h3>
    <button onClick={onDeploy} className="w-full py-3 bg-[#0088cc] hover:bg-blue-400 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/30 transition">
      Deploy Bot (출격명령 API)
    </button>
  </div>
);

const CommunityPanel = () => (
   <div className="space-y-6">
    <div className="mb-6"><h2 className="text-2xl font-black uppercase">Academy & Community Hub</h2></div>
    <div className="border border-white/10 bg-white/5 rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest">
       <Video size={48} className="mx-auto mb-4 text-purple-400 opacity-50" />
       Media Uploader Interface Component Ready
    </div>
  </div>
);

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
export default AdminDashboard;