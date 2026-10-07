import React, { useState } from 'react';
import { INGREDIENTS_50 } from '../data/productData';
import { Sprout, Shield, Sparkles, MapPin } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allItemsCount = INGREDIENTS_50.reduce((acc, cat) => acc + cat.count, 0);

  const displayedCategories =
    selectedCategory === 'all'
      ? INGREDIENTS_50
      : INGREDIENTS_50.filter((c) => c.id === selectedCategory);

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#F5EFE3] border-b border-[#E5DAC4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7E0CE] text-[#2C4835] rounded-full text-sm font-semibold mb-3">
            <MapPin className="w-4 h-4 text-[#264D34]" />
            100% 대한민국 산지 직송 원료
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173722] font-serif-kr">
            국내산 50가지 곡물과 채소
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#3E4E40] leading-relaxed">
            비옥한 우리 땅에서 정직하게 자란 곡류, 잎채소, 뿌리채소, 해조류까지. <br className="hidden sm:inline" />
            자연이 길러낸 본연의 맛과 영양을 통째로 깨끗하게 담았습니다.
          </p>
        </div>

        {/* 3 Core Principles (No exaggeration, just honest food quality) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#DED4BE] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32] mb-4">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-[#193623]">
              1. 100% 국내산 원물
            </h3>
            <p className="mt-2 text-base text-[#465447] leading-relaxed">
              수입산 원료를 일체 섞지 않고, 전국 우수 산지에서 수확한 햇곡물과 신선 채소 50종만을 엄선하여 사용합니다.
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#DED4BE] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32] mb-4">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-[#193623]">
              2. 무첨가 원칙 준수
            </h3>
            <p className="mt-2 text-base text-[#465447] leading-relaxed">
              보존료, 합성감미료, 인공착향료, 정제설탕을 전혀 넣지 않습니다. 곡물 본연의 은은하고 고소한 단맛만을 전합니다.
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#DED4BE] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32] mb-4">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-[#193623]">
              3. 자연 건조 미세 분쇄
            </h3>
            <p className="mt-2 text-base text-[#465447] leading-relaxed">
              고온 열풍 대신 자연 건조와 정밀 분쇄 공정을 거쳐 원물의 식감과 풍미를 살리고 물이나 우유에 부드럽게 풀립니다.
            </p>
          </div>
        </div>

        {/* 50 Ingredients Interactive Browser */}
        <div className="mt-12 bg-[#FAF8F2] rounded-3xl p-6 sm:p-10 border border-[#DED4BE] shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFC8]">
            <div>
              <span className="text-sm font-bold text-[#2E4F39] uppercase tracking-wider">
                투명한 전성분 공개
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#193623] mt-1 font-serif-kr">
                50가지 자연 원료 한눈에 보기
              </h3>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EFE8D8] rounded-xl">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#224A32] text-white shadow-sm'
                    : 'text-[#485649] hover:text-[#183925]'
                }`}
              >
                전체 (50)
              </button>
              {INGREDIENTS_50.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#224A32] text-white shadow-sm'
                      : 'text-[#485649] hover:text-[#183925]'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* List of Ingredients */}
          <div className="mt-8 space-y-8">
            {displayedCategories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg sm:text-xl font-bold text-[#1B3827]">
                    {cat.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 bg-[#E3EFE4] text-[#224A32] rounded-md">
                    {cat.count}종
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#FFFFFF] px-3.5 py-2.5 rounded-xl border border-[#E5DAC2] text-[#263829] text-base sm:text-lg font-medium shadow-xs hover:border-[#224A32] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#467D56] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notice box */}
          <div className="mt-8 pt-6 border-t border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-[#5B6B5D] gap-2">
            <span>
              * 모든 원료는 식품위생법 규격을 통과한 검증된 국내산 농산물만을 사용합니다.
            </span>
            <span className="font-semibold text-[#254A32]">
              전 성분 알레르기 유발 물질 표시: 대두, 메밀 함유
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
