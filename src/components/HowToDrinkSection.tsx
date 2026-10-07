import React from 'react';
import { RECIPE_STEPS } from '../data/productData';
import { Droplets, Sparkle, RefreshCw, ArrowRight, Lightbulb } from 'lucide-react';

export const HowToDrinkSection: React.FC = () => {
  return (
    <section id="how-to-drink" className="py-16 sm:py-24 bg-[#F5EFE3] border-b border-[#E5DAC4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-base sm:text-lg font-bold text-[#2A523A] bg-[#E3EDE5] px-4 py-1.5 rounded-full inline-block mb-3 border border-[#BDD4C1]">
            1분 완성 간편 섭취 가이드
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173722] font-serif-kr">
            물이나 우유에 타서 드세요
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#3E4E40] leading-relaxed">
            언제 어디서나 1분이면 충분합니다. 1단계부터 3단계 순서대로 따라 해 보세요!
          </p>
        </div>

        {/* 1 -> 2 -> 3 Sequential Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Step 1 */}
          <div className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 border-2 border-[#DED4BE] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-[#2A5A39]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#234A32] font-serif-kr tabular-nums">
                  1단계
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32]">
                  <Droplets className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              {/* Big Step Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[#183823] leading-snug font-serif-kr">
                보틀에 음료 200ml 붓기
              </h3>
              <p className="mt-2 text-base sm:text-lg font-semibold text-[#48634F]">
                물 또는 시원한 우유, 두유
              </p>

              {/* Step Detail Artwork / Simple Clean Visual */}
              <div className="my-6 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E8DFC8] flex items-center justify-center gap-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#5F7564] block">권장 음료량</span>
                  <span className="text-2xl font-extrabold text-[#234A32] tabular-nums">200ml</span>
                </div>
                <div className="h-8 w-px bg-[#E5DAC2]" />
                <div className="text-xs text-[#4F5E51] leading-tight">
                  찬물 · 미온수 · 저지방 우유 · 고소한 무가당 두유 모두 잘 어울립니다.
                </div>
              </div>
            </div>

            {/* Crucial Tip */}
            <div className="bg-[#F0EAE0] p-3.5 rounded-xl border border-[#E3D9C7] text-sm text-[#3E4D40] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-[#A88235] shrink-0 mt-0.5" />
              <span>
                <strong>중요 꿀팁:</strong> 생식 가루보다 <strong>음료를 먼저</strong> 넣어야 바닥에 가루가 뭉치지 않아요.
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 border-2 border-[#DED4BE] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-[#3B704C]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#234A32] font-serif-kr tabular-nums">
                  2단계
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32]">
                  <Sparkle className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              {/* Big Step Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[#183823] leading-snug font-serif-kr">
                생식 1포(40g) 털어 넣기
              </h3>
              <p className="mt-2 text-base sm:text-lg font-semibold text-[#48634F]">
                이지컷(Easy-Cut)으로 간편 개봉
              </p>

              {/* Step Detail Artwork / Simple Clean Visual */}
              <div className="my-6 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E8DFC8] flex items-center justify-center gap-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#5F7564] block">1포 정량</span>
                  <span className="text-2xl font-extrabold text-[#234A32] tabular-nums">40g</span>
                </div>
                <div className="h-8 w-px bg-[#E5DAC2]" />
                <div className="text-xs text-[#4F5E51] leading-tight">
                  국내산 50가지 곡물·채소가 1포에 든든하게 꽉 채워져 있습니다.
                </div>
              </div>
            </div>

            {/* Crucial Tip */}
            <div className="bg-[#F0EAE0] p-3.5 rounded-xl border border-[#E3D9C7] text-sm text-[#3E4D40] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-[#A88235] shrink-0 mt-0.5" />
              <span>
                <strong>맛있게 드시는 법:</strong> 달콤함을 원하시면 <strong>꿀 반 스푼</strong>이나 알룰로스를 살짝 곁들여보세요.
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 border-2 border-[#DED4BE] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-[#4F8661]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#234A32] font-serif-kr tabular-nums">
                  3단계
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#E2ECE3] flex items-center justify-center text-[#234A32]">
                  <RefreshCw className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              {/* Big Step Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[#183823] leading-snug font-serif-kr">
                가볍게 흔들어 마시기
              </h3>
              <p className="mt-2 text-base sm:text-lg font-semibold text-[#48634F]">
                5~10초 쉐이킹 후 바로 음용
              </p>

              {/* Step Detail Artwork / Simple Clean Visual */}
              <div className="my-6 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E8DFC8] flex items-center justify-center gap-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#5F7564] block">흔드는 시간</span>
                  <span className="text-2xl font-extrabold text-[#234A32] tabular-nums">5~10초</span>
                </div>
                <div className="h-8 w-px bg-[#E5DAC2]" />
                <div className="text-xs text-[#4F5E51] leading-tight">
                  미세 분쇄 가공으로 몇 번만 가볍게 흔들어도 뭉침 없이 부드럽게 섞입니다.
                </div>
              </div>
            </div>

            {/* Crucial Tip */}
            <div className="bg-[#F0EAE0] p-3.5 rounded-xl border border-[#E3D9C7] text-sm text-[#3E4D40] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-[#A88235] shrink-0 mt-0.5" />
              <span>
                <strong>음용 팁:</strong> 식이섬유가 풍부하므로 섞은 후 오래 두지 마시고 <strong>바로 마실 때</strong> 가장 목넘김이 좋습니다.
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Callout: 물 vs 우유/두유 */}
        <div className="mt-10 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E3D9C4] shadow-sm">
          <h4 className="text-xl sm:text-2xl font-bold text-[#1B3827] text-center font-serif-kr mb-6">
            내 취향에 맞는 음용 방법 선택
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 rounded-xl bg-[#F7F5EE] border border-[#E5DDCB]">
              <div className="font-extrabold text-lg sm:text-xl text-[#234A32] mb-1">
                💧 깔끔하고 담백한 맛을 원할 때: <span className="underline">물 200ml</span>
              </div>
              <p className="text-base text-[#465347] leading-relaxed">
                곡물과 채소 고유의 맑고 깔끔한 맛을 느끼고 싶을 때 추천합니다. 텁텁함 없이 시원하고 개운하게 마실 수 있습니다.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F7F5EE] border border-[#E5DDCB]">
              <div className="font-extrabold text-lg sm:text-xl text-[#234A32] mb-1">
                🥛 진하고 고소한 든든함을 원할 때: <span className="underline">우유 또는 두유 200ml</span>
              </div>
              <p className="text-base text-[#465347] leading-relaxed">
                미숫가루처럼 진하고 깊은 고소함을 느끼며 포만감을 오래 유지하고 싶을 때 좋습니다. 특히 아침 대용으로 훌륭합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
