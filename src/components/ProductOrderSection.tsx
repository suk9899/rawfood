import React from 'react';
import { PRODUCT_INFO } from '../data/productData';
import { Check, Plus, Minus, ShieldCheck, Truck, Gift, Sparkles, Heart } from 'lucide-react';

interface ProductOrderSectionProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onOrderClick: () => void;
}

export const ProductOrderSection: React.FC<ProductOrderSectionProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onOrderClick,
}) => {
  const totalPrice = PRODUCT_INFO.salePrice * quantity;
  const totalOriginalPrice = PRODUCT_INFO.originalPrice * quantity;
  const totalSaved = totalOriginalPrice - totalPrice;

  return (
    <section id="product" className="py-16 sm:py-24 bg-[#FAF8F2] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-base sm:text-lg font-bold text-[#2A523A] bg-[#E3EDE5] px-4 py-1.5 rounded-full inline-block mb-3 border border-[#BDD4C1]">
            정직한 100% 국내산 생식
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173722] font-serif-kr">
            상품 안내 및 주문하기
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#3E4E40] leading-relaxed">
            복잡한 옵션 없이 가장 정직한 단 하나의 구성으로 전해드립니다.
          </p>
        </div>

        {/* Product Box Main Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#E3D9C3] p-6 sm:p-10 shadow-xl shadow-[#7C7053]/10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Product Artwork Visual Container */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#F3EDE2] to-[#E5DAC4] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative border border-[#D9CDB5]">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 bg-[#234A32] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                1개월분 (30포)
              </div>

              {/* Package Illustration */}
              <div className="w-48 h-60 relative flex items-center justify-center my-3">
                <svg
                  viewBox="0 0 180 220"
                  className="w-full h-full drop-shadow-lg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Package Box (Natural Kraft / Beige Box) */}
                  <rect
                    x="25"
                    y="35"
                    width="130"
                    height="165"
                    rx="12"
                    fill="#EFE7D8"
                    stroke="#D5C5A8"
                    strokeWidth="3"
                  />
                  {/* Green Accent Band */}
                  <rect x="25" y="75" width="130" height="42" fill="#224A32" />
                  
                  {/* Clean Typography inside SVG */}
                  <text
                    x="90"
                    y="95"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    하루한잔 생식
                  </text>
                  <text
                    x="90"
                    y="110"
                    textAnchor="middle"
                    fill="#C5E3CE"
                    fontSize="9"
                    fontWeight="500"
                  >
                    국내산 50곡 자연식
                  </text>

                  {/* Leaf Icon on Box */}
                  <circle cx="90" cy="55" r="12" fill="#E2DAC8" />
                  <path
                    d="M90 48 C94 52 96 56 90 62 C84 56 86 52 90 48 Z"
                    fill="#255437"
                  />

                  {/* Stick Pouches Peeking out */}
                  <rect x="40" y="15" width="22" height="30" rx="3" fill="#DCE9DF" stroke="#255437" strokeWidth="1.5" />
                  <rect x="68" y="10" width="22" height="35" rx="3" fill="#255437" stroke="#163823" strokeWidth="1.5" />
                  <rect x="96" y="12" width="22" height="33" rx="3" fill="#DCE9DF" stroke="#255437" strokeWidth="1.5" />

                  {/* Bottom specs */}
                  <text
                    x="90"
                    y="145"
                    textAnchor="middle"
                    fill="#4D4335"
                    fontSize="10"
                    fontWeight="600"
                  >
                    1,200g (40g × 30포)
                  </text>
                  <text
                    x="90"
                    y="162"
                    textAnchor="middle"
                    fill="#6A5F4E"
                    fontSize="9"
                  >
                    100% 국산 곡물·채소
                  </text>

                  {/* Certified mark */}
                  <rect x="62" y="174" width="56" height="16" rx="4" fill="#DDD1BD" />
                  <text
                    x="90"
                    y="185"
                    textAnchor="middle"
                    fill="#362E23"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    HACCP 안전인증
                  </text>
                </svg>
              </div>

              {/* Free Gift Notice Pill */}
              <div className="w-full bg-[#FFFFFF] rounded-xl p-2.5 border border-[#D5C7AA] flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#234A32]">
                <Gift className="w-4 h-4 text-[#C48827]" />
                <span>트라이탄 보틀 전원 무료 증정</span>
              </div>
            </div>

            {/* Right: Product Details, Pricing & Big Button */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Product Name */}
                <span className="text-sm font-bold text-[#2B543A] bg-[#EFF6F0] px-3 py-1 rounded-md inline-block mb-2">
                  {PRODUCT_INFO.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173722] font-serif-kr">
                  {PRODUCT_INFO.name}
                </h3>
                <p className="mt-2 text-base sm:text-lg text-[#475749]">
                  {PRODUCT_INFO.subtitle}
                </p>
                <div className="mt-2 text-sm text-[#6C786E]">
                  구성: {PRODUCT_INFO.specs}
                </div>

                {/* Key Bullet Features */}
                <div className="mt-6 space-y-2 border-t border-[#F0E8D8] pt-4">
                  {PRODUCT_INFO.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-base text-[#2E3C30]">
                      <Check className="w-5 h-5 text-[#2B683F] stroke-[2.5] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Quantity Box */}
              <div className="mt-8 pt-6 border-t border-[#F0E8D8]">
                {/* Price Display */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-sm sm:text-base text-[#808C82] line-through tabular-nums mr-2">
                      {PRODUCT_INFO.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm font-extrabold text-[#C44638] bg-[#FDEAE8] px-2 py-0.5 rounded-md">
                      {PRODUCT_INFO.discountRate}% 할인
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-[#1A3C26] tabular-nums">
                      {PRODUCT_INFO.salePrice.toLocaleString()}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1A3C26] ml-1">
                      원
                    </span>
                  </div>
                </div>

                {/* Quantity Controller with Large, Senior-Friendly Touch Targets */}
                <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E5DAC2] flex items-center justify-between mb-6">
                  <span className="text-base sm:text-lg font-bold text-[#203323]">
                    수량 선택
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onDecrease}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-xl bg-white border border-[#D5C9B0] flex items-center justify-center text-[#234A32] hover:bg-[#EFE9DC] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                      aria-label="수량 감소"
                    >
                      <Minus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <span className="w-12 text-center text-2xl font-extrabold text-[#173722] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={onIncrease}
                      disabled={quantity >= 10}
                      className="w-12 h-12 rounded-xl bg-white border border-[#D5C9B0] flex items-center justify-center text-[#234A32] hover:bg-[#EFE9DC] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                      aria-label="수량 증가"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Total Price Row */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-[#2A3B2D]">총 주문 금액</span>
                    <span className="block text-xs sm:text-sm text-[#27683C] font-semibold">
                      (전국 무료배송 + 전용 보틀 {quantity}개 포함)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl sm:text-5xl font-black text-[#1C4129] tabular-nums">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1C4129] ml-1">
                      원
                    </span>
                  </div>
                </div>

                {/* Big Order CTA Button */}
                <button
                  onClick={onOrderClick}
                  className="w-full py-5 sm:py-6 text-2xl sm:text-3xl font-black text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#224A32]/25 transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-[#386C4B]"
                >
                  <span>주문하기</span>
                  <span className="text-lg sm:text-xl font-normal opacity-90">
                    ({totalPrice.toLocaleString()}원)
                  </span>
                </button>

                <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm text-[#5C6E5F]">
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-4 h-4 text-[#2E6B42]" />
                    우체국 / CJ 대한통운 안심 배송
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#2E6B42]" />
                    신선도 보장 안심 포장
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
