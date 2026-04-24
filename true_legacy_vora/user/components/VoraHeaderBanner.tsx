import React, { useState, useEffect } from 'react';

export default function VoraHeaderBanner() {
    // 배너 슬라이딩 상태 관리
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = [
        { id: 1, text: "🔥 MM 봇 풀 스테이킹 최대 1,000% 보상 사전 예약!", color: "bg-gradient-to-r from-purple-600 to-indigo-600" },
        { id: 2, text: "🎉 VORA 출시 기념: 팬덤 구독 20% 특별 할인", color: "bg-gradient-to-r from-green-600 to-teal-600" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 4000); // 4초마다 슬라이드 전환
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="w-full flex flex-col items-center bg-gray-900 text-white">
            {/* 1. 상단 헤더 영역 */}
            <header className="w-full max-w-md flex justify-between items-center p-4">
                {/* 좌측: dNFT 아이콘 & 유저 ID */}
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-red-500 flex items-center justify-center overflow-hidden">
                        {/* dNFT V 심볼 대체 */}
                        <span className="text-red-500 font-bold text-lg">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">VORA FANDOM</span>
                        <span className="text-sm font-semibold">User_#8821</span>
                    </div>
                </div>

                {/* 중앙: VORA 로고 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <span className="text-xl font-extrabold tracking-widest">VORA</span>
                </div>

                {/* 우측: 지갑 연결 버튼 (안쪽으로 약간 들여쓰기 적용 - mr-2) */}
                <div className="mr-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold shadow-lg transition-all">
                        Connect Wallet
                    </button>
                </div>
            </header>

            {/* 2. 슬라이딩 배너 영역 */}
            <div className="w-full max-w-md px-4 mt-2 mb-4">
                <div className="relative w-full h-12 overflow-hidden rounded-xl shadow-md">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute w-full h-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-in-out ${banner.color} ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                                }`}
                        >
                            {banner.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}