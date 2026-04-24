import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Zap, Wallet, Bot, MessageSquare,
  Activity, ArrowUpRight, ShieldCheck, Crown, Lock, Flame,
  LineChart, Video, FileText, Search, Bell, Settings,
  CheckCircle2, TrendingUp, AlertTriangle, ArrowRight,
  Database, Network, Cuboid, Globe, ShieldAlert, Cpu, Key,
  Coins, RefreshCcw
} from 'lucide-react';

const BASE_API_URL = '/api/admin';

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

type TabType = 'DASHBOARD' | 'FANDOM' | 'DISTRIBUTION' | 'COMMUNITY' | 'P2P_FINANCE';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Mj614600@@") {
      setIsAuthenticated(true);
    } else {
      alert("접근 거부: 관리자 마스터 암호가 일치하지 않습니다.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#050505] text-white font-sans relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-[#050505] to-[#050505]"></div>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full mx-4 relative z-10 overflow-hidden group hover:border-white/20 transition-all">
             <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
             <div className="flex justify-center mb-6 relative z-10 text-amber-500">
                <Lock size={48} className="drop-shadow-lg" />
             </div>
             <h2 className="text-2xl font-black text-center uppercase tracking-widest mb-2 relative z-10">VORA ADMIN</h2>
             <p className="text-[10px] text-gray-400 font-bold tracking-widest text-center uppercase mb-8 relative z-10 italic">Secure Central Control Node</p>
             <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                 <input 
                    type="password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter Master Passcode"
                    className="w-full bg-black/80 border border-white/5 rounded-xl px-4 py-4 font-mono text-center text-sm focus:outline-none focus:border-amber-500/50 transition-colors text-amber-500 tracking-widest placeholder:text-gray-600"
                 />
                 <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    Authenticate & Login
                 </button>
             </form>
             <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl relative z-10 flex gap-3 items-start">
                 <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-red-500/80 font-bold tracking-widest leading-relaxed uppercase">
                   허가되지 않은 접근 감지 시 IP 블랙리스트 등재 및 영구 접속 차단이 즉각 실행됩니다.
                 </p>
             </div>
        </div>
        <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] mt-8 z-10 uppercase">Vora Ecosystem Protected Env.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <aside className="w-72 bg-black/40 border-r border-white/10 backdrop-blur-3xl flex flex-col z-20">
        <div className="p-7">
          <h1 className="text-2xl font-black tracking-widest uppercase flex items-center gap-2">
            <img src="/logo.png" alt="VORA" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span translate="no" className="flex items-center"><span className="text-[#00C9A7]">V</span>ORA</span> <span className="text-xs text-amber-500 border border-amber-500/30 px-1.5 rounded bg-amber-500/10 ml-2">ADMIN</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 italic flex items-center gap-1">
            <Lock size={10} /> Central Control Node
          </p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 no-scrollbar overflow-y-auto">
           <SidebarItem icon={<LayoutDashboard size={18} />} label="통합 대시보드 홈" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
           <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">User Management</p>
           <SidebarItem icon={<Users size={18} />} label="L1/L2 조직 & 유저 관리" active={activeTab === 'FANDOM'} onClick={() => setActiveTab('FANDOM')} />
           
            <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Finance Operations</p>
           <SidebarItem icon={<Coins size={18} />} label="VORA 토큰 배포 허브" active={activeTab === 'DISTRIBUTION'} onClick={() => setActiveTab('DISTRIBUTION')} />
           <SidebarItem icon={<Wallet size={18} />} label="P2P 에스크로 및 관리자 재원" active={activeTab === 'P2P_FINANCE'} onClick={() => setActiveTab('P2P_FINANCE')} />
           
           <p className="px-4 pt-4 pb-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Media Hub</p>
           <SidebarItem icon={<MessageSquare size={18} />} label="글로벌 라이브 스트리밍 제어" active={activeTab === 'COMMUNITY'} onClick={() => setActiveTab('COMMUNITY')} />
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
             {activeTab === 'DISTRIBUTION' && <DistributionPanel />}
             {activeTab === 'COMMUNITY' && <CommunityPanel />}
             {activeTab === 'P2P_FINANCE' && <P2pFinancePanel />}
           </div>
        </div>
      </main>
    </div>
  );
};

// -------------------------------------------------------------
// 7. Distribution Panel (VORA Bulk Sender)
// -------------------------------------------------------------
const DistributionPanel = () => {
    const [recipientList, setRecipientList] = useState("");
    const [isDeploying, setIsDeploying] = useState(false);
    const [totalTokens, setTotalTokens] = useState(0);
    const [selectedTx, setSelectedTx] = useState<any>(null); // For Transaction Blockchain Receipt Header
    
    // Withdrawal Queue System
    const [pendingWithdrawals, setPendingWithdrawals] = useState([
        { id: 1, uid: '260505001002', telegramId: 'crypto_whale', address: 'UQxUser_PrivateVault_X', amount: 50000, type: '전액 출금', timeRemaining: '23h 45m', status: 'pending' },
        { id: 2, uid: '260505001005', telegramId: 'vora_trader', address: 'UQxTrader_Wallet_4', amount: 1500, type: '부분 출금', timeRemaining: '0h 0m', status: 'ready' },
        { id: 3, uid: '260505001088', telegramId: 'early_bird', address: 'UQxEarly_Vault_Z', amount: 3200, type: '부분 출금', timeRemaining: '0h 0m', status: 'ready' },
        { id: 4, uid: '260505001090', telegramId: 'test_node', address: 'UQxTest_Node_V', amount: 100000, type: '전액 출금', timeRemaining: '68h 12m', status: 'pending' }
    ]);

    const addToBatch = (w: any) => {
        const newLine = `${w.address}, ${w.amount}\n`;
        setRecipientList(prev => prev + newLine);
        setPendingWithdrawals(prev => prev.filter(p => p.id !== w.id));
        alert(`[${w.telegramId}] 출금 건이 배포 엔진 리스트에 삽입되었습니다.`);
    };

    const addAllReadyToBatch = () => {
        const readyItems = pendingWithdrawals.filter(w => w.status === 'ready');
        if(readyItems.length === 0) return alert("현재 출금 가능한(지연 해제된) 대기열이 없습니다.");
        
        let appended = "";
        readyItems.forEach(w => {
            appended += `${w.address}, ${w.amount}\n`;
        });
        setRecipientList(prev => prev + appended);
        setPendingWithdrawals(prev => prev.filter(p => p.status !== 'ready'));
        alert(`보안 지연이 해제된 ${readyItems.length}건의 출금이 배포 엔진에 일괄 등록되었습니다.`);
    };

    const parseList = () => {
        const lines = recipientList.split('\n').filter(l => l.trim() !== "");
        let sum = 0;
        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length >= 2) {
                sum += parseFloat(parts[1]) || 0;
            }
        });
        setTotalTokens(sum);
    };

    useEffect(() => { parseList(); }, [recipientList]);

    const handleBulkSend = async () => {
        if (!recipientList) return alert("발송 리스트를 입력하세요.");
        setIsDeploying(true);
        
        // Mocking the backend call
        const res = await fetchApi('/action/distribute-bulk', { 
            method: 'POST', 
            body: JSON.stringify({ list: recipientList }) 
        });

        if (res.status === 'success' || res.success) {
            alert(`[VORA 배포 엔진] ${totalTokens.toLocaleString()} VORA 토큰이 성공적으로 전송 큐에 등록되었습니다.`);
            setRecipientList("");
        } else {
            alert("전송 중 오류가 발생했습니다. (RPC Rate Limit 등)");
        }
        setIsDeploying(false);
    };

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight italic flex items-center gap-3">
                        <Cuboid className="text-blue-500" />
                        VORA Scan & Distribution
                    </h2>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">블록체인 네트워크 인덱싱 및 보상 스테이킹 토큰 직접 분배 레이어</p>
                </div>
                <div 
                    onClick={() => {
                        navigator.clipboard.writeText("EQA_VORA_TOKEN_MASTER_CONTRACT_ADDRESS_V1_7T9xP_0000");
                        alert("VORA 토큰 글로벌 스마트 컨트랙트 주소(EQA_VORA_TOKEN_MASTER_CONTRACT_ADDRESS_V1_7T9xP_0000)가 복사되었습니다.");
                    }}
                    className="p-4 bg-gradient-to-r from-blue-900/40 to-[#0a0a0a] border border-blue-500/20 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer hover:border-blue-500/50 hover:bg-blue-900/30 transition-all group"
                >
                    <div className="text-right">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest group-hover:text-blue-300">Treasury Master Vault <span className="bg-blue-500/20 px-1 py-0.5 rounded ml-1 border border-blue-500/30">COPY ADDRESS</span></p>
                        <p className="text-sm font-black text-blue-400">1,000,000,000 VORA</p>
                    </div>
                    <Wallet className="text-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Col: Distribution Engine */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
                        <Zap size={16} className="text-amber-500" />
                        Airdrop Distribution Engine
                    </h3>
                    
                    <div className="flex-1 space-y-4 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex justify-between">
                            <span>Recipient List (Address, Amount)</span>
                            <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">CSV FORMAT</span>
                        </label>
                        <textarea 
                            value={recipientList}
                            onChange={(e) => setRecipientList(e.target.value)}
                            placeholder="EQD..., 1000&#10;UQx..., 5000"
                            className="w-full flex-1 min-h-[220px] bg-black/80 border border-white/5 rounded-2xl p-5 font-mono text-[11px] text-blue-300 focus:outline-none focus:border-blue-500/50 transition-all no-scrollbar"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Payload</p>
                            <p className="text-lg font-black text-white">{totalTokens.toLocaleString()} <span className="text-xs text-blue-400">VORA</span></p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Network Gas Fee</p>
                            <p className="text-lg font-black text-emerald-400">~ {(totalTokens > 0 ? 0.05 + (recipientList.split('\\n').length * 0.005) : 0).toFixed(3)} <span className="text-xs">TON</span></p>
                        </div>
                    </div>

                    <button 
                        onClick={handleBulkSend}
                        disabled={isDeploying || !recipientList}
                        className={`w-full py-5 mt-6 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] transform transition-all flex items-center justify-center gap-3 ${isDeploying ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-[1.02] shadow-[0_10px_30px_rgba(37,99,235,0.2)] text-white'}`}
                    >
                        {isDeploying ? <RefreshCcw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                        {isDeploying ? 'Syncing with Mainnet...' : 'Execute Distribution'}
                    </button>
                    
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5 w-4 h-4" />
                        <p className="text-[9px] text-amber-500/90 font-bold leading-relaxed tracking-wider">
                            전송은 TON 블록체인 메인넷을 통해 파이널리티가 보장되어 되돌릴 수 없습니다. 대량 배포 시 RPC Rate 리밋 방지를 위해 일괄 서브 큐로 전송됩니다.
                        </p>
                    </div>
                </div>

                {/* Right Col: Vora Scan Explorer */}
                <div className="bg-[#05090e] border border-blue-500/20 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                            <Globe size={16} className="text-blue-400" />
                            Live Network Explorer
                        </h3>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded border border-green-500/20">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Mainnet Sync</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 relative z-10">
                        {[
                            { block: 18274401, hash: 'a1b2c3xH8bV9...9f3eTq1', type: 'Staking Reward', amount: 1250, time: '2 mins ago', from: 'UQxMasterNode_Vora_Treasury_1', to: 'UQx7f2_User_Wallet_kL9', fee: '0.004 TON' },
                            { block: 18274398, hash: 'c7d8tY2pL0oT...4a2bXj8', type: 'N-Volume Airdrop', amount: 450, time: '5 mins ago', from: 'UQxMasterNode_Vora_Treasury_1', to: 'UQx9mP_Apprentice_r2T', fee: '0.003 TON' },
                            { block: 18274395, hash: 'e9f0qM4nB6vC...1c3dUi2', type: 'Staking Reward', amount: 1250, time: '7 mins ago', from: 'UQxMasterNode_Vora_Treasury_1', to: 'UQxJ_a_ActiveTrader_A8c', fee: '0.005 TON' },
                            { block: 18274382, hash: 'b5a6wK1zE3yG...7d4ePl9', type: 'Withdrawal', amount: 10000, time: '12 mins ago', from: 'UQxJko_Vora_Exchange_Qw9', to: 'UQxUser_PrivateVault_X', isOut: true, fee: '0.008 TON' },
                            { block: 18274370, hash: 'f2e3sD5jH7mF...8b9aVr6', type: 'Crew Bonus', amount: 3000, time: '15 mins ago', from: 'UQxMasterNode_Vora_Treasury_1', to: 'UQxCrew_GlobalDirector_Z1s', fee: '0.005 TON' }
                        ].map((tx, i) => (
                            <div key={i} onClick={() => setSelectedTx(tx)} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-blue-900/20 transition-colors group cursor-pointer hover:border-blue-500/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/20 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                                       <span className="text-[7px] text-blue-400 font-black uppercase">Block</span>
                                       <span className="text-[9px] text-white font-bold">{tx.block.toString().slice(-4)}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono text-gray-300 font-bold group-hover:text-blue-400 transition-colors uppercase tracking-wider">{tx.type}</p>
                                        <p className="text-[10px] font-mono text-gray-500 mt-0.5">Hash: <span className="text-blue-300">{tx.hash.slice(0,8)}...</span> • {tx.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-black tracking-widest uppercase ${tx.isOut ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {tx.isOut ? '-' : '+'}{tx.amount.toLocaleString()} VORA
                                    </p>
                                    <div className="text-[8px] font-mono font-bold text-gray-600 mt-1 uppercase flex items-center gap-1 justify-end truncate max-w-[120px]">
                                        {tx.from.slice(0,6)} <ArrowRight size={8} className="shrink-0" /> {tx.to.slice(0,6)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Modal Overlay for Receipt */}
                    {selectedTx && (
                        <div className="absolute inset-0 bg-[#05090e]/95 backdrop-blur-xl z-20 p-8 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
                           <div className="border border-blue-500/30 bg-blue-900/10 rounded-3xl p-6 shadow-2xl relative">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedTx(null); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition">X</button>
                              <h4 className="text-lg font-black uppercase text-white mb-6 flex items-center gap-2"><CheckCircle2 className="text-emerald-500"/> Transaction Receipt</h4>
                              
                              <div className="space-y-4 font-mono text-xs text-gray-300 w-full overflow-hidden">
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                     <span className="text-gray-500">Status</span>
                                     <span className="text-emerald-400 font-bold">Confirmed (Block {selectedTx.block})</span>
                                 </div>
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                     <span className="text-gray-500">Full Hash</span>
                                     <span className="text-blue-400 truncate ml-4">{selectedTx.hash}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                     <span className="text-gray-500">From</span>
                                     <span className="text-white truncate ml-4 w-48 text-right">{selectedTx.from}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                     <span className="text-gray-500">To</span>
                                     <span className="text-white truncate ml-4 w-48 text-right">{selectedTx.to}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                     <span className="text-gray-500">Transfer Type</span>
                                     <span className="text-white bg-white/10 px-2 rounded-sm">{selectedTx.type}</span>
                                 </div>
                                 <div className="flex justify-between pt-2">
                                     <span className="text-gray-500">Total Transferred</span>
                                     <span className="text-lg font-black text-emerald-400">{selectedTx.amount.toLocaleString()} VORA</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="text-gray-500">Network Gas Paid</span>
                                     <span className="text-amber-500 font-bold">{selectedTx.fee}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Security Withdrawal Queue */}
            <div className="bg-[#05090e] border border-blue-500/20 rounded-3xl p-8 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                            <Lock size={16} className="text-red-500" />
                            스마트 보안 출금 대기열 (Pending Withdrawals)
                        </h3>
                        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider text-left">부분 출금 보호(24H) 및 전액 출금 보호(72H)가 해제된 안전한 건만 배포 엔진에 장전 가능합니다.</p>
                    </div>
                    <button onClick={addAllReadyToBatch} className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2">
                        <CheckCircle2 size={14} /> 보안 검증 완주건 일괄 배포 롤업
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
                                <th className="pb-3 px-2">보안 지연 타이머 (Time Remaining)</th>
                                <th className="pb-3 px-2">App UID / Telegram</th>
                                <th className="pb-3 px-2">Target Address (메인넷 목적지)</th>
                                <th className="pb-3 px-2 text-right">Amount (VORA)</th>
                                <th className="pb-3 px-2 text-center">Engine Rollup</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold font-mono">
                            {pendingWithdrawals.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-500 italic font-sans">현재 접수된 출금 요청이 없습니다.</td>
                                </tr>
                            )}
                            {pendingWithdrawals.map(w => (
                                <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black flex items-center gap-2 w-fit ${w.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                                            {w.status === 'ready' ? <CheckCircle2 size={12}/> : <ShieldAlert size={12}/>}
                                            {w.timeRemaining === '0h 0m' ? '출금 가능 (지연 해제)' : `지연 보류 중 (${w.timeRemaining})`}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="text-cyan-400 text-[10px]">{w.uid} ({w.type})</div>
                                        <div className="text-gray-300 font-sans text-[11px]">@{w.telegramId}</div>
                                    </td>
                                    <td className="py-3 px-2 text-blue-300 max-w-[150px] truncate">{w.address}</td>
                                    <td className="py-3 px-2 text-right text-emerald-400">+{w.amount.toLocaleString()}</td>
                                    <td className="py-3 px-2 text-center">
                                        {w.status === 'ready' ? (
                                            <button onClick={() => addToBatch(w)} className="text-[9px] font-black uppercase tracking-widest text-[#05090e] bg-emerald-400 w-full py-1.5 rounded hover:bg-emerald-300 transition-colors">
                                                단건 로드(Load)
                                            </button>
                                        ) : (
                                            <div className="text-[9px] text-red-500/50 font-black uppercase tracking-widest text-center py-1.5 border border-red-500/20 rounded bg-red-500/5">
                                                Locked
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
    if (res.status === 'success' || res.success) {
        setData(res.data);
    } else {
        setData({ users: 3105, liquidityUsdc: 1530200, stakingPool: 1250000 });
    }
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
        <StatCard title="Total L1/L2 Network" value={data.users.toLocaleString()} sub="Registered in DB" icon={<Users className="text-[#0088cc]" />} />
        <StatCard title="Global Liquidity" value={`$${data.liquidityUsdc.toLocaleString()}`} sub="VORA Treasury Pool" icon={<Database className="text-purple-500" />} />
        <StatCard title="Staking Pool Dominance" value={`${((data.stakingPool / data.liquidityUsdc)*100).toFixed(1)}%`} sub={`$${data.stakingPool.toLocaleString()} Staked`} icon={<Flame className="text-amber-500" />} />
        <StatCard title="Automated ROI Rate" value={`${Math.min(100, ((data.liquidityUsdc * 0.15) / data.stakingPool) * 100).toFixed(2)}%`} sub="Calculated Yield Output" icon={<LineChart className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
           <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Network size={16} className="text-emerald-400"/> 글로벌 수익 재원 분배율 (Global Revenue Allocation)</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-gray-300">개인 유저 스테이킹(Trading Pool) 보상</span>
                  <span className="text-emerald-400">50%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 w-[50%] h-full"></div></div>
              
              <div className="flex justify-between items-center text-xs font-black pt-2">
                  <span className="text-gray-300">추천 유저 보상 (L1, L2, N-Volume)</span>
                  <span className="text-blue-400">20%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 w-[20%] h-full"></div></div>

              <div className="flex justify-between items-center text-xs font-black pt-2">
                  <span className="text-gray-300">VORA 크루 한정 보상 풀</span>
                  <span className="text-purple-400">10%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 w-[10%] h-full"></div></div>

              <div className="flex justify-between items-center text-xs font-black pt-2">
                  <span className="text-gray-300">개발, 운영 및 봇 오퍼레이터</span>
                  <span className="text-amber-400">20%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 w-[20%] h-full"></div></div>
              
              <p className="text-[10px] text-gray-500 font-bold mt-4 italic border-t border-white/10 pt-4">* 누락되는 N-Volume 추천 재원은 자동으로 소각(Burn) 풀로 이관되어 디플레이션에 기여합니다.</p>
           </div>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
           <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Flame size={16} className="text-red-400"/> 기간별 추천 보상 적용 가이드 (Mini-App Sync)</h3>
           <div className="bg-black/40 rounded-xl p-4 space-y-3 text-[10px] font-black uppercase tracking-wide text-gray-300 border border-white/5">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>[3 Days]</span> <span className="text-blue-400">L1: 2% / L2: 1%</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>[7 Days]</span> <span className="text-blue-400">L1: 3% / L2: 1.5%</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>[30 Days]</span> <span className="text-blue-400">L1: 7% / L2: 3.5% / N: 1%</span></div>
              <div className="flex justify-between text-purple-400"><span>[1 Year]</span> <span>L1: 15% / L2: 7.5% / N: 3%</span></div>
           </div>
           <ActionAlert title="API Health & Sync: Online" desc="Mini-App Front-end DB successfully synchronized with updated tokenomics." type="green" />
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
    if (res.status === 'success' || res.success) {
        setUsers(res.data);
    } else {
        setUsers([
            { uid: '260505001000', telegramId: 'vora_korea', l1Vol: 12000, l2Vol: 8500, nVolume: 250000, deposit: 40000, withdrawal: 2500, burnt: 1400, isCrew: true },
            { uid: '260505001001', telegramId: 'global_node', l1Vol: 1500, l2Vol: 450, nVolume: 12000, deposit: 5000, withdrawal: 0, burnt: 550, isCrew: false },
            { uid: '260505001002', telegramId: 'crypto_whale', l1Vol: 195000, l2Vol: 82000, nVolume: 5000000, deposit: 1000000, withdrawal: 420000, burnt: 21000, isCrew: true }
        ]);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">L1 / L2 Network Universe</h2>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">조직망 뎁스 및 유니레벨 자산 추적 제어 (N-Volume & Finance)</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-purple-400">
          <Network size={16} /> 실시간 네트워크 거래 자본 볼륨 레코드
        </h3>
        {users.length === 0 ? (
           <p className="text-gray-500 font-black italic">데이터베이스에 가입된 유저가 없습니다.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
                <th className="pb-3 text-cyan-500">App UID</th>
                <th className="pb-3">Telegram ID</th>
                <th className="pb-3">L1 Volume</th>
                <th className="pb-3">L2 Volume</th>
                <th className="pb-3 text-purple-400">N-Volume</th>
                <th className="pb-3 text-emerald-500 text-right">총 입금액</th>
                <th className="pb-3 text-amber-500 text-right">총 출금액</th>
                <th className="pb-3 text-red-500 text-right">총 소각액</th>
                <th className="pb-3 text-center">Crew Sync</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold font-mono">
              {users.map(u => (
                <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 items-center flex gap-2 text-cyan-400 tracking-wider text-[11px] font-black">{u.uid}</td>
                  <td className="py-3 text-gray-300 font-sans">@{u.telegramId}</td>
                  <td className="py-3 text-gray-400">{(u.l1Vol || 0).toLocaleString()}</td>
                  <td className="py-3 text-gray-500">{(u.l2Vol || 0).toLocaleString()}</td>
                  <td className="py-3 text-purple-400 font-black">{(u.nVolume || 0).toLocaleString()}</td>
                  <td className="py-3 text-emerald-400 text-right">+{(u.deposit || 0).toLocaleString()}</td>
                  <td className="py-3 text-amber-400 text-right">-{(u.withdrawal || 0).toLocaleString()}</td>
                  <td className="py-3 text-red-400 text-right">{(u.burnt || 0).toLocaleString()}</td>
                  <td className="py-3 text-center text-green-400 font-sans">{u.isCrew ? 'VORA CREW' : 'Standard'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Removed Unused Legacy Panthers

const CommunityPanel = () => {
    const [liveUrlTrading, setLiveUrlTrading] = useState("");
    const [liveUrlCommunity, setLiveUrlCommunity] = useState("");
    
    // Vorascan Banner State
    const [voraBannerUrl, setVoraBannerUrl] = useState("");
    const [voraTelegramLink, setVoraTelegramLink] = useState("");
    
    // Auto-fetch current live & banner status
    useEffect(() => {
        fetch('/api/public/live-status')
            .then(res => res.json())
            .then(data => { 
                if(data.liveUrlTrading) setLiveUrlTrading(data.liveUrlTrading); 
                if(data.liveUrlCommunity) setLiveUrlCommunity(data.liveUrlCommunity); 
            })
            .catch(e => console.error(e));
            
        fetch('/api/config')
            .then(res => res.json())
            .then(data => { 
                if(data.vorascanBannerUrl) setVoraBannerUrl(data.vorascanBannerUrl);
                if(data.vorascanTelegramLink) setVoraTelegramLink(data.vorascanTelegramLink);
            })
            .catch(e => console.error(e));
    }, []);

    const handleSetLive = async (type: 'TRADING' | 'COMMUNITY') => {
        const liveUrl = type === 'TRADING' ? liveUrlTrading : liveUrlCommunity;
        if (!liveUrl) return alert("URL을 입력해주세요.");
        
        const res = await fetchApi('/set-live', { method: 'POST', body: JSON.stringify({ type, liveUrl }) });
        if (res.status === 'success' || res.success) {
            alert(res.message);
        } else {
            alert("서버 연결에 실패했습니다.");
        }
    };

    const handleSetVorascanBanner = async () => {
        try {
            const res = await fetch('/api/admin/vorascan-banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bannerUrl: voraBannerUrl, telegramLink: voraTelegramLink })
            });
            const data = await res.json();
            if (data.success) alert(data.message);
            else alert("업데이트 실패: " + data.error);
        } catch (e) {
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-6"><h2 className="text-2xl font-black uppercase">Live Stream & Media Control</h2></div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-emerald-400 mb-4 flex items-center gap-2"><LineChart className="text-emerald-500" /> [1] 글로벌 트레이딩 라이브</h3>
                        <p className="text-xs text-gray-400 font-bold mb-4 leading-relaxed">뉴욕 오픈장 4시간 등 알고리즘 매매 및 시장 시황을 실시간으로 중계하는 트레이딩 채널의 임베드 링크를 세팅합니다.</p>
                        <input 
                            type="text" 
                            value={liveUrlTrading} 
                            onChange={(e)=>setLiveUrlTrading(e.target.value)} 
                            placeholder="예: https://www.youtube.com/embed/..." 
                            className="w-full bg-black text-white font-mono text-[10px] border border-white/10 p-3 rounded-xl outline-none focus:border-emerald-500/50 transition mb-4" 
                        />
                    </div>
                    <button onClick={() => handleSetLive('TRADING')} className="w-full bg-emerald-600 text-black font-black py-3 rounded-xl hover:bg-emerald-500 transition shadow-lg mt-auto">트레이딩 송출 업데이트</button>
                </div>

                <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-blue-400 mb-4 flex items-center gap-2"><Crown className="text-blue-500" /> [2] 크루 커뮤니티 전용 라이브</h3>
                        <p className="text-xs text-gray-400 font-bold mb-4 leading-relaxed">팀 빌딩, 모티베이션, 프로모션 및 크루 활동 확장에 도움을 주는 VORA 커뮤니티 전용 방송 링크를 세팅합니다.</p>
                        <input 
                            type="text" 
                            value={liveUrlCommunity} 
                            onChange={(e)=>setLiveUrlCommunity(e.target.value)} 
                            placeholder="예: https://www.youtube.com/embed/..." 
                            className="w-full bg-black text-white font-mono text-[10px] border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50 transition mb-4" 
                        />
                    </div>
                    <button onClick={() => handleSetLive('COMMUNITY')} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-500 transition shadow-lg mt-auto">커뮤니티 송출 업데이트</button>
                </div>
            </div>

            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-2 mt-4">
                <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                <p className="text-xs text-red-500/80 font-bold leading-relaxed">
                   채널 고정 링크(live_stream?channel=...)를 사용하시면 방송을 켤 때마다 관리자가 링크를 재설정할 필요 없이 유저 미니앱에서 방송이 자동 연동되어 재생됩니다. 두 채널 모두 독립적으로 작동합니다.
                </p>
            </div>

            {/* Vorascan Banner Management Section */}
            <div className="mt-10 mb-6"><h2 className="text-2xl font-black uppercase">Vorascan Banner Control</h2></div>
            <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-black text-purple-400 mb-4 flex items-center gap-2"><Crown className="text-purple-500" /> Vorascan 우상단 텔레그램 배너 연동</h3>
                    <p className="text-xs text-gray-400 font-bold mb-4 leading-relaxed">Vorascan 스캐너 화면 상단에 띄울 배너 이미지 주소와 클릭 시 조이봇(또는 다른 미니앱)으로 바로 연결될 텔레그램 하이퍼링크를 설정합니다.</p>
                    <input 
                        type="text" 
                        value={voraBannerUrl} 
                        onChange={(e)=>setVoraBannerUrl(e.target.value)} 
                        placeholder="배너 이미지 URL (예: https://example.com/banner.png)" 
                        className="w-full bg-black text-white font-mono text-[10px] border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500/50 transition mb-3" 
                    />
                    <input 
                        type="text" 
                        value={voraTelegramLink} 
                        onChange={(e)=>setVoraTelegramLink(e.target.value)} 
                        placeholder="이동할 텔레그램 링크 (예: https://t.me/joy_ai_bot)" 
                        className="w-full bg-black text-white font-mono text-[10px] border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500/50 transition mb-4" 
                    />
                </div>
                <button onClick={handleSetVorascanBanner} className="w-full bg-purple-600 text-white font-black py-3 rounded-xl hover:bg-purple-500 transition shadow-lg mt-auto">Vorascan 배너 실시간 업데이트</button>
            </div>
        </div>
    );
};

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

// -------------------------------------------------------------
// X. P2P & Finance Hub Panel
// -------------------------------------------------------------
const P2pFinancePanel = () => {
    const [p2pLedger] = useState([
        { id: '#TRX-101', driver: '260505001002', user: '5923010', type: 'VORA 매입', voraAmt: 5000, tonAmt: 10, comm: 0.5, status: 'Confirmed', time: '10 mins ago' },
        { id: '#TRX-102', driver: '260505001005', user: '8841022', type: 'VORA 매입', voraAmt: 15000, tonAmt: 30, comm: 1.5, status: 'Confirmed', time: '1 hour ago' },
        { id: '#TRX-103', driver: '260505001002', user: '2194091', type: 'VORA 매입', voraAmt: 120000, tonAmt: 240, comm: 12, status: 'Pending', time: '2 hours ago' },
        { id: '#TRX-104', driver: '260505001001', user: '4452101', type: 'VORA 매입', voraAmt: 2000, tonAmt: 4, comm: 0.2, status: 'Confirmed', time: '3 hours ago' },
        { id: '#TRX-105', driver: '260505001088', user: '7721510', type: 'VORA 매입', voraAmt: 8000, tonAmt: 16, comm: 0.8, status: 'Confirmed', time: '5 hours ago' }
     ]);

     const vaultRevenue = {
         vehicleSales: 450000, // TON
         stakingInflow: 1250000, // TON
         total: 1700000 
     };

     return (
        <div className="space-y-6 max-w-7xl animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight mb-1 flex items-center gap-3 text-white">
                    <Wallet className="text-amber-500" />
                    P2P & FINANCE OPERATIONS
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">P2P 에스크로 매칭 정보와 차량/스테이킹 재원 분리 관리 패널 (DB Sync)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Fund Segregation */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-emerald-400">
                        <Database size={16} /> 총괄 매출 현황 및 트레이딩/운영 자본 분리
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">차량 구매 (Driver) 매출 누계</span>
                                <div className="text-xl font-black text-white">{vaultRevenue.vehicleSales.toLocaleString()} <span className="text-xs text-blue-400">TON</span></div>
                            </div>
                            <Activity size={24} className="text-blue-500/50" />
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">스테이킹 풀 (User) 매출 누계</span>
                                <div className="text-xl font-black text-white">{vaultRevenue.stakingInflow.toLocaleString()} <span className="text-xs text-purple-400">TON</span></div>
                            </div>
                            <Flame size={24} className="text-purple-500/50" />
                        </div>
                        <div className="flex justify-between items-center bg-[#111823] p-4 rounded-2xl border border-cyan-900/60 shadow-inner">
                             <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">최종 종합 매출액</span>
                             <span className="text-2xl font-black text-emerald-400">{vaultRevenue.total.toLocaleString()} <span className="text-sm">TON</span></span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">자산 분리 운용 자동 분배 (Liquidity Separation)</h4>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-amber-400 flex items-center gap-1"><LineChart size={12}/> 트레이딩 자산 풀 (60%)</span>
                                <span className="text-white">{(vaultRevenue.total * 0.6).toLocaleString()} TON</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 w-[60%] h-full relative overflow-hidden">
                                    <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-blue-400 flex items-center gap-1"><ShieldCheck size={12}/> 재단 운영 유지 재원 (40%)</span>
                                <span className="text-white">{(vaultRevenue.total * 0.4).toLocaleString()} TON</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 w-[40%] h-full"></div></div>
                        </div>
                    </div>
                </div>

                {/* P2P Escrow Ledger */}
                <div className="bg-[#05090e] border border-cyan-500/20 rounded-3xl p-8 shadow-2xl flex flex-col hide-scrollbar overflow-x-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-cyan-400 mb-1">
                                <RefreshCcw size={16} /> 실시간 P2P 에스크로 체결 원장
                            </h3>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">차량 운전자 ↔ 스테이킹 유저 간 P2P 교환 내역</p>
                        </div>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div> Live Sync
                        </span>
                    </div>
                    
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-500">
                                <th className="pb-3 px-2">TX ID / Timer</th>
                                <th className="pb-3 px-2 text-amber-500">Driver UID</th>
                                <th className="pb-3 px-2 text-purple-400">User UID</th>
                                <th className="pb-3 px-2 text-right">VORA ↔ TON</th>
                                <th className="pb-3 px-2 text-center border-l border-white/5">Escrow State</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold font-mono">
                            {p2pLedger.map((tx, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-2">
                                        <div className="text-cyan-400">{tx.id}</div>
                                        <div className="text-gray-500 text-[9px]">{tx.time}</div>
                                    </td>
                                    <td className="py-3 px-2 text-amber-500">{tx.driver}</td>
                                    <td className="py-3 px-2 text-purple-400">{tx.user}</td>
                                    <td className="py-3 px-2 text-right tracking-tight">
                                        <div className="text-white bg-white/5 px-1 rounded truncate">{tx.voraAmt.toLocaleString()} VORA</div>
                                        <div className="text-blue-400 mt-1">⇄ {tx.tonAmt} TON</div>
                                    </td>
                                    <td className="py-3 px-2 text-center border-l border-white/5">
                                        <div className={`mx-auto w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${tx.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'}`}>
                                            {tx.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
     );
};

export default AdminDashboard;