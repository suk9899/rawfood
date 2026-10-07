import React from 'react';
import { ArrowDown, Check, Sparkles, ShieldCheck, Leaf } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-[#F7F4EA] via-[#FAF8F2] to-[#F5EFE3] border-b border-[#E8DFC8]">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3E6C49]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C8B896]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Top Tagline */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm sm:text-base font-semibold text-[#234A32] bg-[#E3EFE4] rounded-full border border-[#BCD4BF]">
            <Leaf className="w-4 h-4 text-[#2E6B42]" />
            100% 대한민국 땅에서 자란 자연 원료
          </span>
        </div>

        {/* Mandatory Core Headline: "하루한잔, 간편한 한끼" */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#163321] font-serif-kr leading-[1.18] sm:leading-[1.15]">
            하루한잔, <br className="sm:hidden" />
            <span className="text-[#255237] underline decoration-[#A9CBAF] decoration-wavy decoration-2 underline-offset-8">
              간편한 한끼
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-2xl text-[#3D4C3E] leading-relaxed font-medium">
            국내산 50가지 정직한 곡물과 채소를 통째로 갈아 담았습니다. <br className="hidden sm:inline" />
            물이나 우유에 가볍게 타서 바쁜 일상 속 든든함을 채우세요.
          </p>

          {/* Mandatory Core CTA: 큰 "주문하기" 버튼 */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOrderClick}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-xl sm:text-2xl font-extrabold text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#224A32]/25 transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-[#386C4B]"
            >
              <span>주문하기</span>
              <span className="text-base sm:text-lg font-normal bg-[#153421] px-3 py-1 rounded-lg text-[#C8E8D0]">
                특별 혜택가 42,000원
              </span>
            </button>

            <a
              href="#ingredients"
              className="w-full sm:w-auto px-6 py-4 text-base sm:text-lg font-semibold text-[#2E4733] bg-[#EBE4D5] hover:bg-[#E2DAC8] rounded-2xl transition-colors text-center cursor-pointer"
            >
              50가지 원료 살펴보기 ↓
            </a>
          </div>

          {/* Trust bullet points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm sm:text-base font-medium text-[#465948]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#2E6B42] stroke-[3]" />
              합성 첨가물 0%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#2E6B42] stroke-[3]" />
              전용 친환경 쉐이커 보틀 무료 증정
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#2E6B42] stroke-[3]" />
              전국 무료 배송
            </span>
          </div>
        </div>

        {/* Visual Showcase Card: Clean Natural Illustration / Aesthetic Display */}
        <div className="mt-12 sm:mt-16 bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#E3D9C3] shadow-lg shadow-[#7C7053]/10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Glass & Grain Artwork representation */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#F2ECE0] to-[#E5DBC7] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-[#D9CDB5]">
              {/* Decorative grain badge */}
              <div className="absolute top-4 left-4 bg-[#234A32] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                100% 국산원료
              </div>

              {/* Shaker illustration container */}
              <div className="w-44 h-64 sm:w-48 sm:h-72 relative flex items-center justify-center my-2">
                {/* Shake tumbler bottle SVG illustration */}
                <svg
                  viewBox="0 0 160 260"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bottle Cap */}
                  <rect x="45" y="10" width="70" height="26" rx="6" fill="#224A32" />
                  <rect x="58" y="4" width="44" height="8" rx="3" fill="#173623" />
                  {/* Ring */}
                  <rect x="42" y="36" width="76" height="8" rx="2" fill="#D8CFBA" />
                  {/* Bottle Body */}
                  <path
                    d="M32 44 C32 44 26 120 28 220 C28 236 40 248 56 248 L104 248 C120 248 132 236 132 220 C134 120 128 44 128 44 Z"
                    fill="#F7F5EE"
                    stroke="#D4C8AE"
                    strokeWidth="3"
                  />
                  {/* Shake Drink Level (Natural green-grain blend) */}
                  <path
                    d="M31 100 C45 96 65 106 80 102 C98 98 115 104 129 100 L131 220 C131 234 119 245 104 245 L56 245 C41 245 29 234 29 220 Z"
                    fill="#C2D8B9"
                  />
                  {/* Subtle grain texture specks inside bottle */}
                  <circle cx="60" cy="140" r="2.5" fill="#5F7D59" opacity="0.6" />
                  <circle cx="85" cy="155" r="3" fill="#3D5A37" opacity="0.7" />
                  <circle cx="102" cy="135" r="2" fill="#6B5944" opacity="0.8" />
                  <circle cx="50" cy="175" r="2.5" fill="#735C3E" opacity="0.7" />
                  <circle cx="75" cy="190" r="3.5" fill="#4B6A45" opacity="0.6" />
                  <circle cx="110" cy="180" r="2" fill="#556E4E" opacity="0.7" />
                  <circle cx="68" cy="215" r="2" fill="#755E40" opacity="0.6" />
                  <circle cx="95" cy="225" r="2.5" fill="#3A5634" opacity="0.8" />
                  
                  {/* Measurement lines */}
                  <line x1="110" y1="90" x2="122" y2="90" stroke="#9E927A" strokeWidth="2" strokeLinecap="round" />
                  <line x1="114" y1="120" x2="122" y2="120" stroke="#9E927A" strokeWidth="2" strokeLinecap="round" />
                  <line x1="110" y1="150" x2="122" y2="150" stroke="#9E927A" strokeWidth="2" strokeLinecap="round" />
                  <line x1="114" y1="180" x2="122" y2="180" stroke="#9E927A" strokeWidth="2" strokeLinecap="round" />

                  {/* Clean Label */}
                  <rect x="44" y="130" width="72" height="42" rx="4" fill="#FFFFFF" opacity="0.92" />
                  <text x="80" y="148" textAnchor="middle" fill="#1C3F2B" fontSize="10" fontWeight="bold">
                    하루한잔
                  </text>
                  <text x="80" y="161" textAnchor="middle" fill="#4A654F" fontSize="8" fontWeight="medium">
                    자연 50곡 생식
                  </text>
                </svg>
              </div>

              <div className="mt-2 text-center">
                <span className="text-sm font-bold text-[#234A32] block">
                  전용 트라이탄 보틀 (500ml)
                </span>
                <span className="text-xs text-[#5D5545]">
                  주문 시 전 고객 무료 동봉
                </span>
              </div>
            </div>

            {/* Core Value Descriptions */}
            <div className="md:col-span-7 flex flex-col justify-between h-full py-2">
              <div>
                <div className="inline-block px-3 py-1 bg-[#F0EAE1] text-[#2F4734] rounded-lg text-sm font-semibold mb-3">
                  자연 그대로의 영양을 담은 生食
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#193623] font-serif-kr">
                  불필요한 가공 없이, <br className="sm:hidden" />
                  자연 원물 50가지를 정직하게.
                </h2>
                <p className="mt-3 text-base sm:text-lg text-[#404D41] leading-relaxed">
                  바쁜 현대인에게 필요한 것은 복잡한 조리 과정이 아니라, 
                  몸에 이로운 자연의 곡물과 채소를 손쉽게 섭취하는 것입니다. 
                  우리가 매일 밥상에서 챙기기 힘든 50가지 국산 원료를 한 잔에 온전히 담았습니다.
                </p>
              </div>

              {/* 3 key indicators */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EDE5D6] mt-6">
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8DFC8] text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#234A32] tabular-nums">
                    50<span className="text-sm sm:text-base font-normal">종</span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#4E5C4F] mt-1 font-medium">
                    국내산 곡물·채소
                  </div>
                </div>

                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8DFC8] text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#234A32] tabular-nums">
                    0<span className="text-sm sm:text-base font-normal">%</span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#4E5C4F] mt-1 font-medium">
                    보존료·인공착향료
                  </div>
                </div>

                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8DFC8] text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#234A32] tabular-nums">
                    1<span className="text-sm sm:text-base font-normal">분</span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#4E5C4F] mt-1 font-medium">
                    간편한 음용 완성
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
