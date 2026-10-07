import React, { useState } from 'react';
import { FAQS } from '../data/productData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F5EFE3] border-b border-[#E5DAC4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E7E0CE] text-[#2C4835] rounded-full text-sm font-semibold mb-3">
            <HelpCircle className="w-4 h-4 text-[#264D34]" />
            자주 묻는 질문
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173722] font-serif-kr">
            궁금하신 점을 확인해 보세요
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#415143]">
            자연 원물로 만든 일반 식품 생식(生食)에 관한 솔직한 안내입니다.
          </p>
        </div>

        {/* Accordion FAQ items */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F2] rounded-2xl border border-[#DED4BE] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F3ECE0] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl font-black text-[#265338] font-serif-kr">
                      Q.
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#193321] leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-[#455747] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#224A32]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-base sm:text-lg text-[#3B4C3E] leading-relaxed border-t border-[#EDE4D2] pt-4 bg-[#FFFFFF]">
                    <div className="flex items-start gap-3">
                      <span className="text-xl font-bold text-[#6D8A74] shrink-0 font-serif-kr">
                        A.
                      </span>
                      <div>{faq.a}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
