import React from 'react';
import { TrendingUp, Bell, Star, ArrowRight } from 'lucide-react';

const InsightButton = () => {
    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white font-sans">
            {/* 1. 상단 팬덤 인사이트 버튼 */}
            <button className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform mb-6">
                <Star size={20} fill="white" />
                <span className="font-bold text-lg">VORA 팬덤 프리미엄 인사이트</span>
            </button>

            {/* 2. 트레이딩 신호 섹션 (업로드 이미지 로직 반영) */}
            <section className="mb-6">
                <h3 className="text-gray-400 mb-3 text-sm font-medium">실시간 트레이딩 신호</h3>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold italic">USD/JPY</span>
                        <span className="text-green-400 flex items-center gap-1"><TrendingUp size={16} /> +0.19%</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-blue-400">
                            <span>피벗 포인트</span>
                            <span className="font-mono">158.100</span>
                        </div>
                        <div className="flex justify-between text-green-400 border-t border-gray-700 pt-2">
                            <span>저항선 (Target)</span>
                            <span className="font-mono">159.00 / 159.35</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            * 158.10 위 돌파는 159.00 가는 경로를 여는 긍정적 신호임.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. 뉴스 및 광고 섹션 (구독 전환 유도) */}
            <section className="space-y-4">
                <h3 className="text-gray-400 text-sm font-medium">주요 마켓 뉴스</h3>

                {/* 뉴스 카드 1 */}
                <div className="bg-gray-800 p-3 rounded-lg text-sm">삼성전자, 차세대 HBM 공급망 확대... 반도체 섹터 강세</div>

                {/* 광고 카드 (중요!) */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-4 rounded-xl border-2 border-indigo-500/50 relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Promotion</span>
                        <h4 className="mt-1 font-bold">VORA 팬덤 20% 할인 찬스!</h4>
                        <p className="text-xs text-indigo-200">프리미엄 지지/저항선을 실시간 알림으로 받으세요.</p>
                        <button className="mt-3 flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg">
                            지금 구독하기 <ArrowRight size={12} />
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                        <Star size={80} />
                    </div>
                </div>

                {/* 뉴스 카드 2 */}
                <div className="bg-gray-800 p-3 rounded-lg text-sm">BTC 9만 달러 공방전, SOL 생태계 자금 유입 가속화</div>

                {/* 광고 카드 (MM봇) */}
                <div className="bg-gray-800 p-4 rounded-xl border border-orange-500/50">
                    <h4 className="font-bold text-orange-400 flex items-center gap-2">
                        🤖 MM봇 사전 예약 진행 중
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">자동화된 Fibonacci Confluence 로직으로 수익 극대화</p>
                </div>
            </section>

            {/* 4. 예정된 이벤트 (Economic Calendar) */}
            <section className="mt-8 pb-10">
                <h3 className="text-gray-400 text-sm font-medium mb-3">주요 경제 지표 발표</h3>
                <div className="bg-gray-800 rounded-xl divide-y divide-gray-700">
                    <div className="p-3 flex justify-between text-xs">
                        <span className="text-gray-400 underline">21:30</span>
                        <span>미국 소비자물가지수 (CPI) 발표</span>
                        <Bell size={14} className="text-yellow-500" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InsightButton;