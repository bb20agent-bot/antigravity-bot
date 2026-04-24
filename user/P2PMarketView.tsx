import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Check, ShieldAlert, BadgeDollarSign, Wallet, Users, Key, AlertTriangle } from 'lucide-react';

interface Order {
    id: string;
    sellerId: string;
    amount: number;
    price: number;
    totalUsd: number;
    status: 'open' | 'filled';
}

const mockOrders: Order[] = [
    { id: '1', sellerId: '@hunter99', amount: 500, price: 0.1, totalUsd: 50, status: 'open' },
    { id: '2', sellerId: '@cryptoking', amount: 1500, price: 0.095, totalUsd: 142.5, status: 'open' },
    { id: '3', sellerId: '@vora_fan', amount: 200, price: 0.1, totalUsd: 20, status: 'open' },
];

export const P2PMarketView: React.FC<{ userTier: 'bronze' | 'silver' | 'gold' | 'crew' }> = ({ userTier = 'bronze' }) => {
    // Mock user state
    const [minedVora, setMinedVora] = useState(1250); 
    const [sellAmount, setSellAmount] = useState<number | string>("");

    const [orders, setOrders] = useState<Order[]>(mockOrders);

    const handleCreateSellOrder = () => {
        const amount = Number(sellAmount);
        if (amount <= 0 || amount > minedVora) {
            alert("Invalid amount. 출금은 오직 T2E를 통해 만든(터치 누적) 수량 내에서만 가능합니다.");
            return;
        }
        const usdValue = amount * 0.10; // Mock current VORA value estimation
        const lockTime = usdValue >= 10000 ? "72시간" : "24시간";
        
        alert(`출금 신청(Claim)이 접수되었습니다!\n\n해킹 및 보안 방어를 위한 최소 승인 대기 기간인 [${lockTime}] 후에 최종 승인되어 수령 가능합니다.\n\n(※ VORA 토큰 10,000불 가치 초과 시 72시간 심사 적용)`);
        setMinedVora(prev => prev - amount);
        setSellAmount("");
    };

    const handleBuyOrder = (order: Order) => {
        if (userTier === 'bronze' || userTier === 'silver') {
            alert("Bronze and Silver tiers cannot purchase VORA from the P2P pool. You must upgrade to Gold/Crew to act as a Market Maker.");
            return;
        }
        alert(`Executing Smart Contract to BUY ${order.amount} VORA for $${order.totalUsd} from ${order.sellerId}.\n\n[백엔드 API 호출: /api/p2p/fill-order]`);
        setOrders(prev => prev.filter(o => o.id !== order.id));
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-28">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                    <span translate="no">VORA</span> P2P FlyWheel
                </h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] mt-2 uppercase">Official Liquidity Market</p>
                
                <div className="mt-4 px-6 flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                        userTier === 'crew' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20' :
                        userTier === 'gold' ? 'bg-amber-500/20 text-yellow-500 border-yellow-500/50 shadow-yellow-500/20' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/50'
                    }`}>
                        Your Role: {userTier === 'crew' ? 'Exchange Operator' : userTier === 'gold' ? 'Market Maker (Buyer)' : 'Miner (Seller)'}
                    </span>
                </div>
            </div>

            {/* Seller View (Allowed for all tiers, but heavily used by Bronze/Silver) */}
            <div className="bg-gradient-to-br from-white/5 to-black border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10" />
                
                <div className="flex items-center gap-2 mb-6 text-white">
                    <Wallet size={20} className="text-red-400" />
                    <h3 className="text-lg font-black uppercase tracking-tight">Withdraw & Sell</h3>
                </div>

                <div className="bg-black/50 border border-red-500/20 rounded-2xl p-4 mb-6 relative overflow-hidden">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 z-10 relative">T2E 총 누적 터치량 (L1/L2/Rollup 통합 에어드랍 보상)</p>
                    <div className="text-3xl font-black text-white z-10 relative">
                        {minedVora.toLocaleString()} <span className="text-sm text-red-400">VORA</span>
                    </div>
                    <BadgeDollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10 z-0" />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 mb-1 block">Amount to Sell</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={sellAmount}
                                onChange={e => setSellAmount(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-red-500/50 transition-colors"
                            />
                            <button 
                                onClick={() => setSellAmount(minedVora)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCreateSellOrder}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex justify-center items-center gap-2"
                    >
                        <ArrowLeftRight size={16} /> Claim / Submit Sell Order
                    </button>
                    <p className="text-[9px] text-gray-500 font-bold text-center mt-2 leading-relaxed">
                        출금(Claim)은 오직 T2E 터치를 통해 만든 수량 안에서만 신청 가능합니다.<br/>(기본 24시간 보안 승인 / 1만불 초과 시 72시간 락업 적용)
                    </p>
                </div>
            </div>

            {/* Buyer / Market Maker View (Only useful for Gold/Crew) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl mt-8">
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-green-900/20 to-transparent">
                    <div className="flex items-center gap-2 text-white">
                        <BadgeDollarSign size={20} className="text-green-400" />
                        <h3 className="text-lg font-black uppercase tracking-tight">Open Market (Buy VORA)</h3>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-2">
                        골드 및 크루 등급 전용 유동성 공급 창구
                    </p>
                </div>

                {userTier === 'bronze' || userTier === 'silver' ? (
                    <div className="p-10 text-center">
                        <ShieldAlert size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-xs text-gray-400 font-bold leading-relaxed">
                            매수(Buyer) 권한이 없습니다.<br/>마켓 메이커가 되어 구독료 할인 및 팀빌딩 자금을 확보하려면 <strong>Gold</strong> 이상으로 등급을 업그레이드하세요.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        {orders.map(order => (
                            <div key={order.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-green-500/30 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users size={12} className="text-gray-500" />
                                        <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{order.sellerId}</span>
                                    </div>
                                    <h4 className="text-lg font-black text-white">{order.amount.toLocaleString()} <span className="text-xs text-green-400">VORA</span></h4>
                                    <p className="text-[10px] text-gray-500 font-bold">@ ${order.price} (Total: ${order.totalUsd})</p>
                                </div>
                                <button 
                                    onClick={() => handleBuyOrder(order)}
                                    className="bg-green-500/20 hover:bg-green-500 border border-green-500/50 text-green-400 hover:text-black py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Crew Secret P2P Room Feature */}
            {userTier === 'crew' && (
                <div className="mt-8 bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <Key size={32} className="text-cyan-400 mb-4" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Create OTC Room</h3>
                        <p className="text-[10px] text-gray-300 font-bold leading-relaxed mb-6 max-w-xs">
                            크루 멤버 전용 혜택입니다. 프라이빗 P2P 룸을 개설하여 조직원들의 VORA 거래를 중개하고 자체 수수료(Spread)를 세팅할 수 있습니다.
                        </p>
                        <button onClick={() => alert("Launching OTC Room Setup Module...")} className="bg-cyan-500 text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-white transition-colors">
                            Launch Room
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
