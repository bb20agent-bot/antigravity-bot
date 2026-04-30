import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Crown, Flame, CheckCircle, Bot, X, Star, Send, Wallet, RefreshCcw, QrCode, Copy, Settings, Globe, Key, FileText, Github, MessageCircle, DollarSign } from 'lucide-react';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { beginCell, toNano, Address } from '@ton/core';

enum Page { LIVE = 'LIVE', OFFICE = 'OFFICE', RANK = 'RANK' }
type Tier = 'STARTER' | 'CREW' | 'FANDOM' | 'VIP';

// --- SUB-COMPONENTS --- //

const LiveView = ({ 
    stakes, stakeAmount, setStakeAmount, stakePeriod, setStakePeriod, handleStake, openAiChat, autoRenew, setAutoRenew, stakingMode, setStakingMode 
}: any) => {
    const [liveType, setLiveType] = useState<'TRADING' | 'COMMUNITY'>('TRADING');
    const [liveSrcTrading, setLiveSrcTrading] = useState("https://www.youtube-nocookie.com/embed/nxQPaFtStgI?autoplay=0&controls=1&rel=0&modestbranding=1&fs=1");
    const [liveSrcCommunity, setLiveSrcCommunity] = useState("https://www.youtube-nocookie.com/embed/64ptsW-W2ZU?autoplay=0&controls=1&rel=0&modestbranding=1&fs=1");
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        fetch('/api/public/live-status')
            .then(res => res.json())
            .then(data => { 
                if(data.liveUrlTrading) setLiveSrcTrading(data.liveUrlTrading.replace('autoplay=1', 'autoplay=0')); 
                if(data.liveUrlCommunity) setLiveSrcCommunity(data.liveUrlCommunity.replace('autoplay=1', 'autoplay=0')); 
            })
            .catch(() => {});
            
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const activeSrc = liveType === 'TRADING' ? liveSrcTrading : liveSrcCommunity;

    return (
        <motion.div key="live" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 w-full">
            {/* Live Trading Widget */}
            <div className="bg-[#0b1016] rounded-3xl border border-slate-800/60 p-4 shadow-lg flex flex-col gap-3">
                <div className="flex justify-between items-center px-1 mb-1">
                    <h3 className="text-[14px] font-black uppercase text-white tracking-widest flex items-center gap-2 drop-shadow-md">
                        <Video size={16} fill="currentColor" className="text-red-500/80" /> LIVE MEDIA 채널
                    </h3>
                    <span className="text-[9px] bg-[#2a141b] border border-red-900/50 text-red-500/90 px-2.5 py-1 rounded-md font-black uppercase tracking-wider animate-pulse">ON AIR</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 w-full p-1 bg-black/40 rounded-xl mb-1 border border-white/5">
                    <button 
                        onClick={() => setLiveType('TRADING')} 
                        className={`py-2 text-[10px] font-black uppercase transition-all rounded-lg ${liveType === 'TRADING' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        트레이딩 채널
                    </button>
                    <button 
                        onClick={() => setLiveType('COMMUNITY')} 
                        className={`py-2 text-[10px] font-black uppercase transition-all rounded-lg ${liveType === 'COMMUNITY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        커뮤니티 활동 채널
                    </button>
                </div>
                
                <div 
                    className="w-full aspect-video rounded-2xl bg-[#0a0a0a] border border-[#222] overflow-hidden relative shadow-lg cursor-pointer group"
                    onClick={() => {
                        const currentUrl = liveType === 'TRADING' ? liveSrcTrading : liveSrcCommunity;
                        const match = currentUrl.match(/\/embed\/([^?]+)/);
                        const videoId = match ? match[1] : '64ptsW-W2ZU';
                        const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
                        const tg = (window as any).Telegram?.WebApp;
                        if (tg && tg.openLink) {
                            tg.openLink(watchUrl);
                        } else {
                            window.open(watchUrl, '_blank');
                        }
                    }}
                >
                    <img 
                        src={`https://img.youtube.com/vi/${(liveType === 'TRADING' ? liveSrcTrading : liveSrcCommunity).match(/\/embed\/([^?]+)/)?.[1] || '64ptsW-W2ZU'}/hqdefault.jpg`}
                        alt="VORA Live Stream Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] transform group-hover:scale-110 transition-transform duration-300">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center px-2">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${liveType === 'TRADING' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'} animate-pulse`}></span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#9ca3af]">
                            {liveType === 'TRADING' ? 'XAUUSD ALGO ACTIVE' : 'CREW NETWORK BUILDING'}
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Agents */}
            <div className="grid grid-cols-2 gap-3">
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => openAiChat('BROWN')} className="bg-[#0b1016] border border-slate-800/60 rounded-3xl p-5 flex flex-col items-center shadow-lg justify-center cursor-pointer hover:border-emerald-500/30 transition-colors">
                   <div className="w-10 h-10 rounded-full border border-emerald-500 flex items-center justify-center mb-3">
                        <Bot className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h4 className="text-[12px] font-black italic tracking-widest uppercase text-white">BROWN AI</h4>
                   <p className="text-[9px] text-[#6b7280] font-bold uppercase tracking-widest text-center mt-1">기획 & 프로파일링</p>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => openAiChat('JOY')} className="bg-[#0b1016] border border-slate-800/60 rounded-3xl p-5 flex flex-col items-center shadow-lg justify-center cursor-pointer hover:border-yellow-500/30 transition-colors">
                   <div className="w-10 h-10 rounded-full border border-yellow-500 flex items-center justify-center mb-3">
                        <Bot className="w-5 h-5 text-yellow-400" />
                   </div>
                   <h4 className="text-[12px] font-black italic tracking-widest uppercase text-white">JOY AI</h4>
                   <p className="text-[9px] text-[#6b7280] font-bold uppercase tracking-widest text-center mt-1">세일즈 & 동기부여</p>
                </motion.div>
            </div>

            {/* Staking Pool Area */}
            <div className="bg-[#0b1016] border border-slate-800/60 rounded-3xl p-5 flex flex-col items-center shadow-lg">
                <h3 className="text-[13px] font-black uppercase text-emerald-400 tracking-widest mb-1 drop-shadow-md">
                    VORA TRADING POOL STAKING
                </h3>
                <p className="text-[11px] text-slate-300 font-bold mb-3 tracking-widest">1 VORA = 0.2 TON</p>
                
                <div className="w-full flex bg-[#0a111a] p-1 rounded-xl border border-slate-800 mb-3">
                    <button onClick={() => setStakingMode('DIRECT')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${stakingMode === 'DIRECT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}>직접 스테이킹</button>
                    <button onClick={() => setStakingMode('ENTRUSTED')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${stakingMode === 'ENTRUSTED' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'}`}>위탁 스테이킹 (하부 계정)</button>
                </div>
                
                <div className="w-full bg-black/60 border border-slate-700/50 rounded-xl p-3 mb-3">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
                        <span>예치 기간 선택</span>
                        <span>수익 쉐어 (Share)</span>
                    </div>
                    {[
                        { days: 3, label: '3 일', share: '10%' },
                        { days: 7, label: '7 일', share: '15%' },
                        { days: 30, label: '30 일', share: '25%' },
                        { days: 365, label: '보라 크루 1년', share: '50%' }
                    ].map(opt => (
                        <div key={opt.days} onClick={() => setStakePeriod(opt.days)} className={`flex justify-between items-center p-2 mb-1 rounded-lg cursor-pointer transition-all border ${stakePeriod === opt.days ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800/80 hover:bg-slate-800/50'}`}>
                            <span className={`text-[12px] font-black ${stakePeriod === opt.days ? 'text-emerald-400' : 'text-slate-300'}`}>{opt.label}</span>
                            <span className={`text-[12px] font-bold ${stakePeriod === opt.days ? 'text-emerald-400' : 'text-slate-500'}`}>{opt.share}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full flex justify-between items-center bg-[#0a111a] border border-slate-800 rounded-xl p-3 mb-3">
                    <label className="text-[12px] font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                        <input 
                           type="checkbox" 
                           checked={autoRenew} 
                           onChange={e => setAutoRenew(e.target.checked)} 
                           className="w-4 h-4 accent-emerald-500 bg-black/50 border-slate-700 rounded cursor-pointer" 
                        />
                        <span className={autoRenew ? 'text-emerald-400 font-black' : 'text-slate-400'}>스테이킹 만기 시 자동 연장</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-black uppercase bg-white/5 px-2 py-1 rounded">Auto-Renew</span>
                </div>

                <div className="w-full flex gap-3 mb-3 items-center">
                    <input 
                        type="number" 
                        value={stakeAmount} 
                        onChange={e => setStakeAmount(e.target.value)} 
                        placeholder="VORA 수량 (Amount)" 
                        className="flex-1 min-w-0 bg-black/60 text-white rounded-xl px-4 h-[48px] text-[14px] border border-slate-700 outline-none focus:border-emerald-500 transition-all text-center font-extrabold focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-inner"
                    />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleStake} className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-[#040811] px-5 h-[48px] rounded-xl text-[14px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[100px] shrink-0">
                        STAKE {autoRenew && <RefreshCcw size={14} className="text-black/80" />}
                    </motion.button>
                </div>

                {stakes.length > 0 && (
                    <div className="w-full mt-2 space-y-2">
                        {stakes.map((s: any, idx: number) => {
                            const remainingMs = Math.max(0, s.unlockTime - currentTime);
                            const isLocked = remainingMs > 0;
                            
                            const formatTime = (ms: number) => {
                                const h = Math.floor(ms / 3600000);
                                const m = Math.floor((ms % 3600000) / 60000);
                                const sc = Math.floor((ms % 60000) / 1000);
                                return `${h}시간 ${m.toString().padStart(2,'0')}분 ${sc.toString().padStart(2,'0')}초 남음`;
                            };

                            return (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="bg-[#101620] border border-slate-800 rounded-xl p-3 flex flex-col gap-1 shadow-md">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-black text-slate-200">{s.amount.toLocaleString()} VORA</span>
                                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.2)]">{s.share} SHARE</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] font-bold text-slate-500">{s.period === 365 ? '1년' : `${s.period}일`} 스테이킹 {s.autoRenew ? '(자동연장 설정)' : ''}</span>
                                        <span className={`text-[9px] font-black tracking-wide ${isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {isLocked ? (
                                                <span className="flex items-center gap-1">🔒 {formatTime(remainingMs)}</span>
                                            ) : '✅ 완료됨'}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const OfficeView = ({ assets, appUid, referrerUid, copySuccess, handleCopyLink, setDownlineModal }: any) => {
    return (
        <motion.div key="office" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full space-y-4">
            
            <div className="w-full relative pt-7 pb-6 px-6 rounded-[2rem] bg-gradient-to-b from-[#0a111a] to-[#040609] border border-t-[#2dd4bf]/20 border-l-[#2dd4bf]/10 border-r-[#2dd4bf]/5 border-b-black shadow-[0_15px_30px_-5px_rgba(0,0,0,0.9),_inset_0_2px_20px_rgba(45,212,191,0.06)] overflow-hidden">
                <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#34d399]/40 to-transparent"></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#34d399]/20 blur-2xl rounded-full"></div>

                <div className="text-center relative z-10 mb-8">
                    <h2 className="text-[17px] font-black text-slate-100 tracking-wide mb-1 drop-shadow-md">누적 에어드랍</h2>
                    <div className="flex flex-row justify-center items-end gap-2 mb-1.5 mt-[-4px]">
                        <div className="text-[40px] font-extrabold tracking-tight leading-none text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                            {assets.vora.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3})}
                        </div>
                        <span className="text-[20px] font-bold text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] pb-1.5">VORA</span>
                    </div>
                </div>

                {/* Level Details Panel */}
                <div className="relative z-10 w-full bg-black/40 border border-slate-700/50 rounded-2xl p-4 mb-6 shadow-md backdrop-blur-sm">
                   <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <h4 className="text-[11px] font-black text-slate-300 tracking-widest uppercase">추천인 보상 현황</h4>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black border border-emerald-500/30">실시간 동기화</span>
                   </div>
                   
                   <div className="space-y-3">
                      <div onClick={() => setDownlineModal('L1')} className="flex justify-between items-center bg-[#101620] p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 cursor-pointer group transition-colors">
                          <div>
                              <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 uppercase group-hover:underline">L1 직접 추천 하부 유저</span>
                              <span className="text-[9px] font-bold text-slate-500">{assets.l1}명 조직원 모니터링</span>
                          </div>
                          <div className="text-right">
                              <span className="text-[12px] font-black text-white">{assets.l1 * 1250} VORA</span>
                              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">+ 보상 누적중</p>
                          </div>
                      </div>

                      <div onClick={() => setDownlineModal('L2')} className="flex justify-between items-center bg-[#101620] p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 cursor-pointer group transition-colors">
                          <div>
                              <span className="text-[11px] font-black text-slate-300 flex items-center gap-1.5 uppercase group-hover:underline">L2 간접 추천 하부 유저</span>
                              <span className="text-[9px] font-bold text-slate-500">{assets.l2}명 조직원 모니터링</span>
                          </div>
                          <div className="text-right">
                              <span className="text-[12px] font-black text-slate-200">{assets.l2 * 250} VORA</span>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">+ 보상 누적중</p>
                          </div>
                      </div>
                   </div>

                   <button onClick={() => window.dispatchEvent(new Event('triggerWithdraw'))} className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex justify-center items-center gap-2 text-black font-black text-[12px] uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-transform">
                       <Wallet size={14} /> 출금 하기 (수수료 5%)
                   </button>
                </div>

                {/* Referral Panel */}
                <div className="relative z-10 w-full bg-[#05080e]/80 border border-emerald-500/30 rounded-2xl p-4 mb-6 shadow-md backdrop-blur-sm">
                    <p className="text-[11px] text-slate-400 font-bold mb-2 tracking-widest uppercase">나의 레퍼럴 초대 링크</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-black/60 border border-slate-700 rounded-lg py-2 px-3 text-slate-300 text-[11px] font-black truncate select-all">
                            https://t.me/Crew_Meetup_Bot/app?startapp={appUid}
                        </div>
                        <button onClick={handleCopyLink} className={`px-4 py-2 rounded-lg text-[12px] font-black transition-all shrink-0 ${copySuccess ? 'bg-emerald-500 text-black' : 'bg-[#1e2636] text-emerald-400 border border-emerald-500/50 hover:bg-[#2a3449]'}`}>
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 relative z-10 text-center mb-6">
                    <div className="flex flex-col items-center bg-[#0a111a] border border-slate-800 rounded-xl p-3 shadow-md">
                        <p className="text-[10px] text-slate-400 mb-1.5 font-bold tracking-widest uppercase">초대 크루원</p>
                        <p className="text-[18px] font-black text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{assets.l1}명</p>
                    </div>
                    <div className="flex flex-col items-center bg-[#0a111a] border border-slate-800 rounded-xl p-3 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                        <p className="text-[10px] text-slate-400 mb-1.5 font-bold tracking-widest uppercase leading-tight">크루 N-볼륨<br/></p>
                        <p className="text-[18px] font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">${assets.nVolume.toLocaleString()}</p>
                    </div>
                </div>

                <motion.button onClick={() => window.dispatchEvent(new Event('triggerBurn'))} whileTap={{ scale: 0.95 }} className="relative w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-[15px] font-black text-[#040811] shadow-[0_5px_15px_rgba(16,185,129,0.4),_inset_0_2px_4px_rgba(255,255,255,0.4)]">
                    <span className="relative z-10 tracking-widest">소각 기여 참여</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

const RankView = ({ openAiChat }: any) => {
    const [rankTab, setRankTab] = useState<'LEADERBOARD' | 'EVENT'>('LEADERBOARD');

    return (
        <motion.div key="rank" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 w-full">
            <div className="bg-[#0b1016] rounded-[2rem] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] p-5 mb-4">
                <div className="flex w-full mb-6 bg-[#101620] p-1 rounded-xl border border-slate-800">
                    <button onClick={() => setRankTab('LEADERBOARD')} className={`flex-1 py-2 text-[11px] font-black uppercase rounded-lg transition-all ${rankTab === 'LEADERBOARD' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500'}`}>소각 랭킹 보드</button>
                    <button onClick={() => setRankTab('EVENT')} className={`flex-1 py-2 text-[11px] font-black uppercase rounded-lg transition-all ${rankTab === 'EVENT' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-slate-500'}`}>이벤트 보드</button>
                </div>
                
                {rankTab === 'LEADERBOARD' ? (
                    <div className="space-y-3 mb-6">
                        {[1, 2, 3].map((r, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between ${idx === 0 ? 'bg-cyan-500/10 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-[#101620] border border-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-black ${idx === 0 ? 'text-cyan-400' : 'text-slate-500'}`}>#{r}</span>
                                    <div>
                                        <p className="text-xs font-black text-slate-200 uppercase italic">UID 26050500100{r}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Total Burned</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-emerald-400">{((4 - r) * 12000).toLocaleString()} <span className="text-[10px] text-slate-400">VO</span></span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 mb-2 animate-fade-in text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex justify-center items-center border border-pink-500/40 mb-2">
                            <Star className="text-pink-400 w-8 h-8" />
                        </div>
                        <h3 className="text-[15px] font-black text-white">소각 기여 1위 달성 이벤트</h3>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed px-2">
                            재단 주최 소각 이벤트! 소각 횟수, 내 소각 볼륨, 하부 소각 볼륨을 종합 집계하여 1위 기여자에게 엄청난 혜택을 드립니다.
                        </p>
                        <button onClick={() => openAiChat('JOY')} className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-black uppercase text-[12px] py-3 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <Bot size={16} /> JOY AI 이벤트 안내 및 초대장 받기
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- APP ROOT --- //

export default function UserApp() {
    const [page, setPage] = useState<Page>(Page.LIVE); 
    const [tier, setTier] = useState<Tier>('VIP');
    
    // Web3 TonConnect
    const [tonConnectUI] = useTonConnectUI();
    const userAddress = useTonAddress();
    
    // Staking & Withdrawal State
    const [stakingMode, setStakingMode] = useState<'DIRECT' | 'ENTRUSTED'>('DIRECT');
    const [stakes, setStakes] = useState<{ amount: number, period: number, share: string, unlockTime: number, autoRenew: boolean, mode: string, beneficiary?: string }[]>([]);
    const [stakeAmount, setStakeAmount] = useState<string>('');
    const [stakePeriod, setStakePeriod] = useState<number>(3);
    const [autoRenew, setAutoRenew] = useState<boolean>(true);
    const [stakeSuccessObj, setStakeSuccessObj] = useState<any>(null);
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [withdrawInputAmount, setWithdrawInputAmount] = useState<string>('');
    
    // Wallet State
    const [walletModal, setWalletModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [burnModal, setBurnModal] = useState(false);
    const [downlineModal, setDownlineModal] = useState<'L1' | 'L2' | null>(null);
    const [suspensionData, setSuspensionData] = useState<{isSuspended: boolean, reason: string | null}>({isSuspended: false, reason: null});
    const [language, setLanguage] = useState('한국어');
    const [currency, setCurrency] = useState('USD');
    const voraAddress = "UQxJ_aXr9oP2pM_A8c9iJqLx-B7fQh2Tz1";
    const burnAddress = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

    
    // AI Modal & Chat State
    const [aiModal, setAiModal] = useState<'BROWN' | 'JOY' | null>(null);
    const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isAiTyping, setIsAiTyping] = useState(false);

    const openAiChat = (aiName: 'BROWN' | 'JOY') => {
        setAiModal(aiName);
        setChatMessages([
            { role: 'ai', text: aiName === 'BROWN' ? '안녕하세요. VORA 알고리즘 트레이딩을 보조하는 BROWN AI 입니다. XAUUSD 차트의 핵심 전략과 심플한 최적의 진입 타점에 대해 안내해 드립니다. 궁금하신 점을 말씀해 주세요.' : '반갑습니다! 세일즈 디렉터 JOY AI 입니다. 크루원 발탁 시 지급되는 직/간접 추천 보상과, L1/L2 N-볼륨 총합 확대에 따른 강력한 혜택에 대해 무엇이든 물어보세요!' }
        ]);
        setChatInput("");
        setIsAiTyping(false);
    };

    const handleSendChat = async () => {
        if (!chatInput.trim()) return;
        const userText = chatInput.trim();
        const currentMessages = [...chatMessages, { role: 'user', text: userText }];
        
        // Immediately show the user's message
        setChatMessages(currentMessages as any);
        setChatInput("");
        setIsAiTyping(true);

        try {
            const res = await fetch('/api/chat/bora', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personality: aiModal === 'BROWN' ? 'brown' : 'joy',
                    text: userText
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status} - ${errText.slice(0, 100)}`);
            }

            const data = await res.json();
            
            if (data.aiReply && data.aiReply.text) {
                setChatMessages(prev => [...prev, { role: 'ai', text: data.aiReply.text }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'ai', text: `[시스템 오류] 응답을 생성하지 못했습니다. (${data.error || 'Unknown Error'})` }]);
            }
        } catch (error: any) {
            setChatMessages(prev => [...prev, { role: 'ai', text: `[네트워크/서버 오류] ${error.message || error}` }]);
        } finally {
            setIsAiTyping(false);
        }
    };

    // Referral & Identity Setup & Auto-Registration
    const [telegramId, setTelegramId] = useState<string>('test_user');
    const [appUid, setAppUid] = useState<string>('---------'); 
    const [referrerUid, setReferrerUid] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [assets, setAssets] = useState({ vora: 0, usdEq: 0, l1: 0, l2: 0, nVolume: 0, unclaimedRewards: 0, totalDeposit: 0, totalWithdrawal: 0, totalBurn: 0 });
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        let tgUserId = 'test_user';
        let startParam = null;

        if (tg && tg.initDataUnsafe) {
            tg.expand();
            if (tg.initDataUnsafe.user) {
                tgUserId = String(tg.initDataUnsafe.user.id);
            }
            if (tg.initDataUnsafe.start_param) {
                startParam = tg.initDataUnsafe.start_param;
            }
        }

        // Generate consistent UID across all apps using Telegram ID
        const generateMockUid = (tgId: string) => {
            if (!tgId || tgId === 'test_user') return '260505001000';
            const hash = Array.from(String(tgId)).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return `2605${String(hash).padStart(4, '0')}00`;
        };
        
        const unifiedUid = generateMockUid(tgUserId);
        setTelegramId(tgUserId);
        setAppUid(unifiedUid);

        // Silent Auto-Login / Register to VORA Backend (Optional Data Fetch)
        const fallbackTimer = setTimeout(() => {
            setIsInitializing(false);
            console.warn('[Vora Auth] Fallback timeout triggered. Bypassing infinite load.');
        }, 1500); // 1.5 second max wait time

        fetch('/api/user/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramId: tgUserId, referrerUid: startParam })
        }).then(res => res.json()).then(data => {
            if (data.success && data.user) {
                // If backend provides a real UID, overwrite the fallback mock
                if (data.user.appUid) setAppUid(data.user.appUid);
                
                // Handle Suspension State
                if (data.user.isLinkSuspended) {
                    setSuspensionData({ isSuspended: true, reason: data.user.suspensionReason });
                }

                setAssets(prev => ({
                    ...prev,
                    l1: data.user.l1Count || prev.l1,
                    l2: data.user.l2Count || prev.l2,
                    nVolume: data.user.nVolume || prev.nVolume,
                    unclaimedRewards: (data.user.l1Count * 1250) + (data.user.l2Count * 250),
                    totalDeposit: data.user.totalDeposit || prev.totalDeposit,
                    totalWithdrawal: data.user.totalWithdrawal || prev.totalWithdrawal,
                    totalBurn: data.user.totalBurn || prev.totalBurn
                }));
            }
        }).catch(err => {
            console.warn('[Vora Auth] Using Unified UID Mock mode. (Backend not reached)', err);
        }).finally(() => {
            clearTimeout(fallbackTimer);
            setIsInitializing(false);
        });
    }, []);

    useEffect(() => {
        const handleTriggerWithdraw = () => setWithdrawModal(true);
        const handleTriggerBurn = () => setBurnModal(true);
        window.addEventListener('triggerWithdraw', handleTriggerWithdraw);
        window.addEventListener('triggerBurn', handleTriggerBurn);
        return () => {
            window.removeEventListener('triggerWithdraw', handleTriggerWithdraw);
            window.removeEventListener('triggerBurn', handleTriggerBurn);
        };
    }, []);

    if (isInitializing) {
        return (
            <div translate="no" className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center font-sans text-white relative">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />
                <div className="w-14 h-14 border-[4px] border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                <p className="text-[12px] font-black text-emerald-400 animate-pulse tracking-[0.2em] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    SYNCING SECURE NETWORK...
                </p>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                    Vora Authentication
                </p>
            </div>
        );
    }

    const handleCopyLink = () => {
        const link = `https://t.me/Crew_Meetup_Bot/app?startapp=${appUid}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };
    
    const handleStake = async () => {
        const amt = parseFloat(stakeAmount);
        if (isNaN(amt) || amt <= 0) {
            alert("스테이킹할 VORA 수량을 먼저 입력해주세요.");
            return;
        }
        
        if (!userAddress) {
            alert("블록체인 통신을 위해 먼저 TON 지갑을 연동해주세요.");
            tonConnectUI.openModal();
            return;
        }

        let beneficiary = undefined;
        if (stakingMode === 'ENTRUSTED') {
            const downlineUid = prompt("위탁 스테이킹을 진행할 하부 유저(수혜자)의 UID를 입력하세요:");
            if (!downlineUid) return;
            beneficiary = downlineUid;
        }

        const confirmMsg = confirm(`[스마트 컨트랙트 서명]\n\n${amt.toLocaleString()} VORA를 ${stakingMode} 모드로 스테이킹 하시겠습니까?\n확인을 누르면 지갑 앱이 열립니다.`);
        if (!confirmMsg) return;
        
        try {
            // Fetch User's Jetton Wallet Address via Toncenter API
            const minterAddr = import.meta.env.VITE_VORA_TOKEN_ADDRESS || 'EQD-cVRC3YKEiNuh7u9eWpbGQiPg0tKKH-dgToQgmhIL9WQh';
            const distributorAddr = import.meta.env.VITE_UNILEVEL_DISTRIBUTOR || 'EQBT1gz1SYDrbgjC7-SpI5_zLHlaFPGMNq_O4mE_C1YdNH2W';
            
            let jettonWalletAddr = distributorAddr; // fallback to sending TON if jetton wallet not found
            try {
                const res = await fetch(`https://testnet.toncenter.com/api/v3/jettonWallets?owner_address=${userAddress}&jetton_master_address=${minterAddr}`);
                const data = await res.json();
                if (data.jetton_wallets && data.jetton_wallets.length > 0) {
                    jettonWalletAddr = data.jetton_wallets[0].address;
                }
            } catch(e) {
                console.error("Failed to fetch Jetton Wallet:", e);
            }

            // Construct TokenTransfer Payload
            const payload = beginCell()
                .storeUint(0x0f8a7ea5, 32) // opcode for Jetton Transfer
                .storeUint(0, 64) // query_id
                .storeCoins(toNano(amt.toString())) // amount to send
                .storeAddress(Address.parse(distributorAddr)) // destination (UnilevelDistributor)
                .storeAddress(Address.parse(userAddress)) // response_destination (refunds)
                .storeBit(0) // no custom payload
                .storeCoins(toNano('0.05')) // forward_ton_amount (for distributor internal routing)
                .storeBit(0) // forward_payload in this slice
                .endCell();

            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: jettonWalletAddr,
                        amount: toNano('0.1').toString(), // gas fee
                        payload: payload.toBoc().toString('base64')
                    }
                ]
            });
            
            const periodToShare: Record<number, string> = { 3: '10%', 7: '15%', 30: '25%', 365: '50%' };
            const newStake = { 
                amount: amt, 
                period: stakePeriod, 
                share: periodToShare[stakePeriod], 
                unlockTime: Date.now() + stakePeriod * 24 * 60 * 60 * 1000,
                autoRenew: autoRenew,
                mode: stakingMode,
                beneficiary: beneficiary
            };
            
            setStakes(prev => [...prev, newStake]);
            setStakeAmount('');
            setStakeSuccessObj(newStake);
            
        } catch (e) {
            console.error("TonConnect Error:", e);
            alert("트랜잭션 서명이 취소되었거나 오류가 발생했습니다.");
        }
    };

    return (
        <div translate="no" className="min-h-screen bg-[#070b13] flex flex-col items-center pt-8 font-sans text-white relative overflow-y-auto overflow-x-hidden pb-10 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]">

            {/* Header Profile */}
            <div className="w-full max-w-md flex justify-between items-center mb-6 px-5 z-20 shrink-0 mt-2">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="VORA Logo" className="w-[42px] h-[42px] object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] opacity-90" />
                    <div className="px-3 h-10 rounded-full bg-[#1e263c] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center">
                       <span className="font-black text-cyan-400 text-[8px] tracking-wider uppercase mb-[-2px]">UID</span>
                       <span className="font-bold text-white text-[10px] tracking-tight">{appUid}</span>
                    </div>
                </div>
                {/* Embedded VORA Custom Wallet Button representing Dual-Currency Support */}
                <div className="flex items-center gap-2">
                    <div 
                        onClick={async () => {
                            console.log("Wallet button clicked! userAddress:", userAddress);
                            if (!userAddress) {
                                try {
                                    console.log("Attempting to open TonConnect Modal...");
                                    await tonConnectUI.openModal();
                                    console.log("TonConnect Modal opened successfully.");
                                } catch (e: any) {
                                    console.error("TonConnect Error:", e);
                                    alert("지갑 모달을 여는 중 오류가 발생했습니다: " + (e?.message || JSON.stringify(e)));
                                }
                            } else {
                                setWalletModal(true);
                            }
                        }} 
                        className={`transition-all flex flex-col gap-2 px-3 py-1.5 rounded-2xl border ${userAddress ? 'bg-gradient-to-br from-[#061411] to-[#0a111a] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] min-w-[160px]' : 'bg-[#0a111a]/80 border-[#2dd4bf]/20 hover:bg-[#101622] cursor-pointer flex-row items-center justify-between gap-1.5'}`}
                    >
                        {userAddress ? (
                            <>
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-black tracking-widest text-[#0098EA] flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#0098EA]"></div> 2.45 TON</span>
                                        <span className="text-[9px] font-black tracking-widest text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div> 12,050 VORA</span>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); tonConnectUI.disconnect(); }} className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20">
                                        <Wallet size={12} className="text-emerald-400" />
                                    </div>
                                </div>
                                <div className="border-t border-emerald-900/40 pt-1.5 pb-0.5 flex justify-between items-center w-full">
                                    <span className="font-mono text-[8px] text-emerald-500">{userAddress.slice(0,4)}...{userAddress.slice(-4)}</span>
                                    <div className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors px-1.5 py-0.5 rounded text-[8px] font-black text-emerald-400 uppercase tracking-widest cursor-pointer">
                                        <QrCode size={10} /> QR
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-6 h-6 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center border border-[#2dd4bf]/30 shrink-0">
                                    <Wallet size={12} className="text-[#2dd4bf]" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#2dd4bf] pt-[1px] shrink-0 text-nowrap">VORA Wallet</span>
                            </>
                        )}
                    </div>
                    
                    <button onClick={() => setSettingsModal(true)} className="w-[36px] h-[36px] rounded-xl bg-[#101622] border border-slate-700 shadow-md flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all cursor-pointer">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Nav Pill */}
            <div className="w-full max-w-md flex justify-center mb-6 z-20 shrink-0">
                <div className="bg-[#101622] rounded-full flex border border-slate-800 shadow-lg p-[2px]">
                    {['라이브', '오피스', '소각랭킹'].map((title, i) => {
                        const p = [Page.LIVE, Page.OFFICE, Page.RANK][i];
                        return (
                            <button key={p} className={`w-[85px] py-1.5 rounded-full text-[13px] font-bold transition-all flex justify-center items-center ${page === p ? 'bg-emerald-500 text-[#070b13] shadow-[0_0_12px_rgba(16,185,129,0.7)]' : 'text-slate-400'}`} onClick={() => setPage(p)}>
                                {title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-md px-4 z-10 shrink-0 flex-1 relative">
                <AnimatePresence mode="wait">
                    {page === Page.LIVE && (
                        <LiveView 
                            key="live"
                            stakes={stakes} 
                            stakeAmount={stakeAmount} 
                            setStakeAmount={setStakeAmount} 
                            stakePeriod={stakePeriod} 
                            setStakePeriod={setStakePeriod} 
                            handleStake={handleStake} 
                            openAiChat={openAiChat}
                            autoRenew={autoRenew}
                            setAutoRenew={setAutoRenew}
                            stakingMode={stakingMode}
                            setStakingMode={setStakingMode}
                        />
                    )}
                    {page === Page.OFFICE && (
                        <OfficeView 
                            key="office"
                            assets={assets} 
                            appUid={appUid} 
                            referrerUid={referrerUid} 
                            copySuccess={copySuccess} 
                            handleCopyLink={handleCopyLink} 
                            setDownlineModal={setDownlineModal}
                        />
                    )}
                    {page === Page.RANK && <RankView key="rank" openAiChat={openAiChat} />}
                </AnimatePresence>
            </div>

            {/* --- OVERLAYS & MODALS --- */}

            {/* Staking Success Modal */}
            <AnimatePresence>
                {stakeSuccessObj && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gradient-to-b from-[#0a111a] to-[#040609] border border-emerald-500/50 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-4">
                                <CheckCircle className="text-emerald-400 w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wide">스테이킹 성공!</h2>
                            <p className="text-sm text-slate-300 font-bold mb-6">
                                <span className="text-emerald-400">{stakeSuccessObj.amount.toLocaleString()} VORA</span> 자산이 성공적으로 <span className="text-yellow-400">{stakeSuccessObj.period === 365 ? '1년' : `${stakeSuccessObj.period}일`}</span>간 락업 되었습니다.
                            </p>
                            
                            <div className="w-full grid grid-cols-2 gap-3">
                                <button onClick={() => setStakeSuccessObj(null)} className="py-3 rounded-xl bg-[#101620] border border-slate-700 text-slate-300 font-black text-sm active:scale-95 transition-transform uppercase">
                                    닫기
                                </button>
                                <button 
                                    onClick={() => {
                                        setStakeSuccessObj(null);
                                        setPage(Page.OFFICE);
                                    }} 
                                    className="py-3 rounded-xl bg-emerald-500 text-black font-black text-sm active:scale-95 transition-transform uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                >
                                    내역 확인하기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Withdraw Modal */}
            <AnimatePresence>
                {withdrawModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gradient-to-b from-[#0a111a] to-[#040609] border border-emerald-500/50 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mb-4">
                                <Wallet className="text-emerald-400 w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wide">보상 출금 신청</h2>
                            <p className="text-xs text-slate-300 font-bold mb-4">입력하신 수량만큼 TON 기반 VORA 지갑으로 즉시 인출합니다.</p>
                            
                            <div className="w-full bg-[#101620] p-4 rounded-xl border border-slate-800 mb-6 text-left space-y-3">
                                
                                <div className="flex justify-between items-center bg-black/50 p-2 rounded-lg border border-slate-700/50">
                                    <span className="text-xs text-slate-400 font-bold uppercase">출금가능 잔액</span>
                                    <span className="text-xs font-black text-emerald-400">{assets.unclaimedRewards.toLocaleString()} VORA</span>
                                </div>
                                
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">출금 수량 입력</span>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={withdrawInputAmount}
                                            onChange={e => setWithdrawInputAmount(e.target.value)}
                                            placeholder="예: 1000"
                                            className="w-full bg-black/40 text-white border border-slate-700 rounded-lg p-2 text-sm font-black outline-none focus:border-emerald-500 transition-colors"
                                        />
                                        <button 
                                            onClick={() => setWithdrawInputAmount(String(assets.unclaimedRewards))}
                                            className="px-3 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg border border-emerald-500/20"
                                        >MAX</button>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700/50 pt-3 flex justify-between">
                                    <span className="text-xs text-red-400/80 font-bold uppercase">수수료 (5%)</span>
                                    <span className="text-xs font-black text-red-400">- {withdrawInputAmount ? Math.floor(Number(withdrawInputAmount) * 0.05).toLocaleString() : 0} VORA</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-200 font-black uppercase">최종 실수령액</span>
                                    <span className="text-sm font-black text-white">{withdrawInputAmount ? Math.floor(Number(withdrawInputAmount) * 0.95).toLocaleString() : 0} VORA</span>
                                </div>
                            </div>
                            
                            <div className="w-full grid grid-cols-2 gap-3">
                                <button onClick={() => setWithdrawModal(false)} className="py-3 rounded-xl bg-[#101620] border border-slate-700 text-slate-300 font-black text-sm active:scale-95 transition-transform uppercase">
                                    취소
                                </button>
                                <button 
                                    onClick={async () => {
                                        const maxAmount = assets.unclaimedRewards;
                                        const targetAmount = Number(withdrawInputAmount);
                                        if (!targetAmount || targetAmount <= 0) return alert("출금할 수량을 입력해주세요.");
                                        if (targetAmount > maxAmount) return alert("출금 가능 잔액을 초과했습니다.");
                                        
                                        const delayHours = (targetAmount === maxAmount) ? 72 : 24;

                                        try {
                                            const res = await fetch('/api/action/withdraw', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ uid: appUid, amount: Math.floor(targetAmount * 0.95) })
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                alert(`[TX Hash: ${data.txHash}]\n관리자 확인 및 트래블 룰 정책에 따라 24시간 내에 출금 승인이 진행됩니다.\n\n- 출금 요청액: ${targetAmount.toLocaleString()} VORA\n- 출금 승인 대기: 24시간\n\n승인이 완료되면 5% 수수료 차감 후 VORA 지갑으로 안전하게 인출됩니다.`);
                                                
                                                // Deduct from unclaimed rewards, but don't add to main Wallet VORA balance yet (pending)
                                                setAssets(prev => ({ ...prev, unclaimedRewards: prev.unclaimedRewards - targetAmount }));
                                                setWithdrawModal(false);
                                                setWithdrawInputAmount(''); // Reset
                                            } else {
                                                alert("출금 처리 중 에러가 발생했습니다.");
                                            }
                                        } catch(e) { alert("서버 오류: 지갑 서명을 처리할 수 없습니다."); }
                                    }} 
                                    className="py-3 rounded-xl bg-emerald-500 text-black font-black text-sm active:scale-95 transition-transform uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                >
                                    서명 및 출금
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Action Modal (Chat) */}
            <AnimatePresence>
                {aiModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={`w-full max-w-md h-[85vh] flex flex-col rounded-t-[2.5rem] border-t ${aiModal === 'BROWN' ? 'bg-gradient-to-b from-[#061110] to-[#03080b] border-emerald-500/50 shadow-[0_-20px_50px_rgba(16,185,129,0.15)]' : 'bg-gradient-to-b from-[#110e05] to-[#03080b] border-yellow-500/50 shadow-[0_-20px_50px_rgba(234,179,8,0.15)]'}`}>
                            
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                                <div className="flex items-center gap-4">
                                     <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-black ${aiModal === 'BROWN' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'}`}>
                                         <Bot className={`w-7 h-7 ${aiModal === 'BROWN' ? 'text-emerald-400' : 'text-yellow-400'}`} />
                                     </div>
                                     <div>
                                         <h3 className="text-xl font-black text-white italic tracking-wider">{aiModal} AI</h3>
                                         <p className={`text-xs font-bold uppercase tracking-widest ${aiModal === 'BROWN' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                             {aiModal === 'BROWN' ? 'Market Profiler' : 'Sales Motivator'}
                                         </p>
                                     </div>
                                </div>
                                <button onClick={() => setAiModal(null)} className="p-2 bg-black/50 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            {/* Chat History Area */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar flex flex-col">
                                {chatMessages.map((msg, idx) => (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-3.5 text-[13px] font-medium leading-relaxed shadow-md break-words ${msg.role === 'user' ? 'bg-[#1e2636] text-white rounded-br-sm' : (aiModal === 'BROWN' ? 'bg-emerald-900/40 text-emerald-100 border border-emerald-500/30 rounded-bl-sm' : 'bg-yellow-900/40 text-yellow-100 border border-yellow-500/30 rounded-bl-sm')}`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isAiTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                                        <div className={`rounded-2xl p-3 flex items-center gap-1.5 ${aiModal === 'BROWN' ? 'bg-emerald-900/40 border border-emerald-500/30 rounded-bl-sm' : 'bg-yellow-900/40 border border-yellow-500/30 rounded-bl-sm'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${aiModal === 'BROWN' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-bounce delay-150 ${aiModal === 'BROWN' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-bounce delay-300 ${aiModal === 'BROWN' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Chat Input Area */}
                            <div className="p-4 border-t border-white/5 bg-[#03060a]/80 backdrop-blur-md pb-8">
                                <div className="flex gap-2 relative">
                                    <input 
                                        type="text" 
                                        value={chatInput} 
                                        onChange={(e) => setChatInput(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                        placeholder={`${aiModal}에게 메시지 보내기...`} 
                                        className={`flex-1 bg-black text-white rounded-xl pl-4 pr-12 py-3.5 text-[14px] border ${aiModal === 'BROWN' ? 'border-emerald-500/30 focus:border-emerald-500' : 'border-yellow-500/30 focus:border-yellow-500'} outline-none transition-all font-medium`}
                                    />
                                    <button onClick={handleSendChat} className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg flex items-center justify-center transition-transform active:scale-95 ${chatInput.trim() ? (aiModal === 'BROWN' ? 'bg-emerald-500 text-black' : 'bg-yellow-500 text-black') : 'bg-slate-800 text-slate-500'}`}>
                                        <Send size={16} className={chatInput.trim() ? 'ml-[-2px]' : ''} />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Downline Details Modal */}
            <AnimatePresence>
                {downlineModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#0a111a] border border-emerald-500/30 rounded-3xl p-5 w-full max-w-sm flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.2)] max-h-[80vh] overflow-hidden">
                            <button onClick={() => setDownlineModal(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700 z-10">
                                <X size={16} />
                            </button>
                            
                            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-wide border-b border-slate-800 pb-3">{downlineModal} 하부 유저 목록</h2>
                            
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pt-2">
                                {[1,2,3].map((u) => {
                                    const mockStaking = Math.floor(Math.random() * 50000) + 10000;
                                    const mockCarSales = Math.floor(Math.random() * 2000) + 500;
                                    const mockProfit = (mockStaking * 0.05) + (mockCarSales * 0.1); 
                                    
                                    return (
                                        <div key={u} className="bg-[#101620] p-3 rounded-xl border border-slate-800 flex flex-col gap-2 relative">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-black text-cyan-400">UID: 2605...0{u}</span>
                                                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-black">Active</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold">
                                                <div>스테이킹 볼륨: <span className="text-white">{mockStaking.toLocaleString()} V</span></div>
                                                <div>차량판매 볼륨: <span className="text-white">{mockCarSales.toLocaleString()} V</span></div>
                                            </div>
                                            <div className="border-t border-slate-800 pt-2 flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-yellow-400 font-bold">수익 쉐어 배분율 적용 예상</span>
                                                <span className="text-[12px] font-black text-yellow-300">+{mockProfit.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})} TON</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* Wallet Address & QR Modal */}
            <AnimatePresence>
                {walletModal && userAddress && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#081017] border border-emerald-500/30 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden">
                            
                            <button onClick={() => setWalletModal(false)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                                <QrCode className="text-emerald-400 w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-wide">VORA Wallet</h2>
                            <p className="text-[10px] text-emerald-500/80 font-bold mb-6 tracking-widest uppercase border border-emerald-500/20 px-2 py-0.5 rounded-md bg-emerald-500/5">TON Network</p>
                            
                            <div className="w-full aspect-square bg-white rounded-2xl p-4 mb-6 shadow-inner flex items-center justify-center relative overflow-hidden">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${userAddress}&color=000000&bgcolor=ffffff`} 
                                    alt="Wallet QR Code" 
                                    className="w-full h-full object-contain max-h-[250px]"
                                />
                                <div className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none mix-blend-overlay"></div>
                            </div>
                            
                            <div className="w-full bg-[#03060a] p-4 rounded-xl border border-slate-800 mb-6 flex flex-col items-center justify-center relative group cursor-pointer"
                                 onClick={() => {
                                     if(navigator.clipboard) {
                                         navigator.clipboard.writeText(userAddress);
                                         alert("지갑 주소가 복사되었습니다.");
                                     }
                                 }}
                            >
                                <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">지갑 주소 (TON / VORA)</span>
                                <span className="text-xs font-mono text-emerald-400 font-bold tracking-tight text-center break-all px-2">{userAddress}</span>
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                                     <div className="flex items-center gap-1.5 bg-[#03060a] px-3 py-1.5 rounded-lg border border-emerald-500/50">
                                         <Copy size={12} className="text-emerald-400" />
                                         <span className="text-[10px] font-black text-emerald-400 uppercase">COPY</span>
                                     </div>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 text-center font-bold px-4 leading-relaxed">
                                이 주소는 <span className="text-emerald-400">TON 네트워크</span> 위에서 동작하는 VORA 생태계 스마트 컨트랙트 기반의 고유 입출금 주소입니다. 다른 네트워크의 자산을 입금할 경우 유실될 수 있습니다.
                            </p>
                            
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {settingsModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#081017] border border-slate-700/80 rounded-3xl p-6 w-full max-w-sm flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                            
                            <button onClick={() => setSettingsModal(false)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800">
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wide flex items-center gap-2">
                                <Settings className="text-slate-400" /> Settings
                            </h2>
                            
                            <div className="space-y-4 mb-3 text-sm font-bold">
                                <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
                                    <div className="flex justify-between items-center text-slate-300 cursor-pointer hover:text-white" onClick={() => alert("니모닉 백업 기능은 지갑 연동 후 제공됩니다.")}>
                                        <div className="flex items-center gap-2"><Key size={16} className="text-yellow-500" /> Backup Mnemonic</div>
                                        <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-black uppercase">Setup needed</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-slate-300">
                                    <div className="flex items-center gap-2"><DollarSign size={16} /> Currency</div>
                                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-[#101620] border border-slate-700 rounded-md px-2 py-1 outline-none text-white focus:border-emerald-500">
                                        <option value="USD">USD ($)</option>
                                        <option value="KRW">KRW (₩)</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-slate-300">
                                    <div className="flex items-center gap-2"><Globe size={16} /> Language</div>
                                    <select value={language} onChange={e => { setLanguage('한국어'); alert("현재 다국어(번역) 기능은 준비 중입니다. 다음 업데이트를 기대해 주세요!"); }} className="bg-[#101620] border border-slate-700 rounded-md px-2 py-1 outline-none text-white focus:border-emerald-500">
                                        <option value="한국어">한국어</option>
                                        <option value="English">English</option>
                                        <option value="中文">中文</option>
                                    </select>
                                </div>
                                
                                <div className="flex flex-col gap-3 py-2 text-slate-300">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Community & Docs</span>
                                    <a href="https://vora.gitbook.io/" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white transition-colors bg-white/5 p-3 rounded-xl border border-white/5 group">
                                        <div className="flex items-center gap-2"><FileText size={16} className="text-cyan-400" /> Whitepaper</div>
                                        <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-1.5 py-0.5 rounded">View</span>
                                    </a>
                                    <a href="https://github.com/VoraEcosystem" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white transition-colors bg-white/5 p-3 rounded-xl border border-white/5 group">
                                        <div className="flex items-center gap-2"><Github size={16} /> GitHub Config</div>
                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded group-hover:bg-slate-700">Link</span>
                                    </a>
                                    <a href="https://t.me/vora_official" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white transition-colors bg-white/5 p-3 rounded-xl border border-white/5 group">
                                        <div className="flex items-center gap-2"><MessageCircle size={16} className="text-blue-400" /> Telegram Channel</div>
                                        <span className="text-[10px] bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded">Join</span>
                                    </a>
                                </div>
                            </div>
                            
                            <p className="text-center text-[10px] text-slate-500 font-black tracking-widest uppercase mt-4">Vora Network v1.0.0</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Burn Modal */}
            <AnimatePresence>
                {burnModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#081017] border border-red-500/30 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
                            <button onClick={() => setBurnModal(false)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                                <Flame className="text-red-400 w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-wide">VORA 소각 참여</h2>
                            <p className="text-[10px] text-red-500/80 font-bold mb-6 tracking-widest uppercase border border-red-500/20 px-2 py-0.5 rounded-md bg-red-500/5">Burn Address (Null)</p>
                            
                            <div className="w-full aspect-square bg-white rounded-2xl p-4 mb-6 shadow-inner flex items-center justify-center relative overflow-hidden">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${burnAddress}&color=000000&bgcolor=ffffff`} 
                                    alt="Burn QR Code" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            
                            <div className="w-full bg-[#03060a] p-4 rounded-xl border border-slate-800 mb-6 flex flex-col items-center justify-center relative group cursor-pointer"
                                 onClick={() => {
                                     if(navigator.clipboard) {
                                         navigator.clipboard.writeText(burnAddress);
                                         alert("소각 주소가 복사되었습니다.");
                                     }
                                 }}
                            >
                                <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">소각 전용 주소 복사</span>
                                <span className="text-xs font-mono text-red-400 font-bold tracking-tight text-center break-all px-2">{burnAddress}</span>
                            </div>
                            
                            <p className="text-[11px] text-slate-300 text-center font-bold px-4 leading-relaxed bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                위 주소로 소각할 토큰을 전송하신 후, <strong>공식 텔레그램 그룹에 트랜잭션 스크린샷</strong>을 인증하시면 <span className="text-emerald-400">VIP 그룹에 초대</span>됩니다!
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Suspension Modal */}
            <AnimatePresence>
                {suspensionData.isSuspended && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative bg-[#1a0f12] border border-red-500/50 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <X size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-4 uppercase tracking-wide">계정 정지 알림</h2>
                            <p className="text-sm text-slate-300 text-center mb-4 leading-relaxed">
                                귀하의 레퍼럴 활동 및 출금 기능이 일시 정지되었습니다.
                            </p>
                            <div className="bg-red-500/10 border border-red-500/20 w-full p-4 rounded-xl text-center mb-6">
                                <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">정지 사유</p>
                                <p className="text-sm text-white font-bold">{suspensionData.reason || "관리자 판단에 의한 계정 정지"}</p>
                            </div>
                            <button onClick={() => setSuspensionData({isSuspended: false, reason: null})} className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-slate-700 transition-colors">
                                닫기 (읽기 전용 모드)
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
}
