import React from 'react';
import { TARGET_AUDIENCE } from '../data/productData';
import { Sun, Utensils, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOrderClick: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOrderClick }) => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Sun className="w-8 h-8 text-[#265338]" />;
      case 2:
        return <Utensils className="w-8 h-8 text-[#265338]" />;
      case 3:
      default:
        return <HeartHandshake className="w-8 h-8 text-[#265338]" />;
    }
  };

  return (
    <section id="recommendations" className="py-16 sm:py-24 bg-[#FAF8F2] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-base sm:text-lg font-bold text-[#2A523A] bg-[#E5EFE6] px-4 py-1.5 rounded-full inline-block mb-3 border border-[#BDD4C1]">
            누구에게나 편안한 자연 식사
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173722] font-serif-kr">
            이런 분께 특히 좋아요
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#3E4E40] leading-relaxed">
            복잡한 준비 없이 정직한 곡물과 채소를 손쉽게 드시고 싶은 분들을 위한 최선의 선택입니다.
          </p>
        </div>

        {/* 3 Core Audience Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TARGET_AUDIENCE.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E5DAC4] hover:border-[#224A32] transition-all shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF2EC] flex items-center justify-center border border-[#CFDFD3]">
                    {getIcon(item.id)}
                  </div>
                  <span className="text-3xl font-extrabold text-[#D4C5A8] tabular-nums font-serif-kr">
                    0{idx + 1}
                  </span>
                </div>

                {/* Subtag */}
                <span className="text-sm font-bold text-[#2E6B42] bg-[#EFF6F0] px-3 py-1 rounded-md inline-block mb-2">
                  {item.tag}
                </span>

                {/* Big Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#173722] leading-snug font-serif-kr">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-base sm:text-lg text-[#455246] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Key Benefit Highlight */}
              <div className="mt-6 pt-4 border-t border-[#F0E8D8] flex items-start gap-2 bg-[#FBF9F4] p-3 rounded-xl border border-[#EBE3D0]">
                <CheckCircle2 className="w-5 h-5 text-[#2A5A39] shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-bold text-[#23432B]">
                  {item.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Big Bottom Action banner */}
        <div className="mt-12 bg-gradient-to-r from-[#20472F] to-[#163622] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#1A3826]/20">
          <div className="text-center md:text-left">
            <span className="text-[#A5D6B1] text-sm sm:text-base font-bold">
              바쁜 아침과 거르기 쉬운 한 끼
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1 font-serif-kr">
              내 몸을 위한 가장 정직한 하루 한 잔, 시작해보세요
            </h3>
            <p className="mt-2 text-[#E1EFE4] text-base sm:text-lg">
              합성 첨가물 없는 순수 50곡 생식 1박스 (30포) + 전용 쉐이커 무료 증정
            </p>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full md:w-auto px-8 sm:px-10 py-4 sm:py-5 text-xl sm:text-2xl font-extrabold text-[#183925] bg-[#FFFFFF] hover:bg-[#F3EFE6] active:scale-[0.98] rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            지금 주문하기 →
          </button>
        </div>
      </div>
    </section>
  );
};
