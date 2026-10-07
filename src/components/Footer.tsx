import React from 'react';
import { ShieldAlert, Phone, Mail, Search, Settings } from 'lucide-react';

interface FooterProps {
  onLookupClick: () => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLookupClick, onAdminClick }) => {
  return (
    <footer className="bg-[#1E3B29] text-[#E2ECE4] pt-14 pb-28 sm:pb-16 border-t border-[#162D1F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Important Regulatory Notice Box */}
        <div className="bg-[#162E20] rounded-2xl p-5 sm:p-6 border border-[#2B4E37] mb-10 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#95C7A2] shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-[#C2DEC9] leading-relaxed">
            <strong>[식품안전 기본 안내]</strong> 본 제품은 질병의 예방 및 치료를 위한 의약품 또는 건강기능식품이 아닌, 
            국내산 곡물과 채소를 자연 건조하여 갈아 만든 <strong>일반식품(생식류)</strong>입니다. 
            균형 잡힌 자연 한 끼 식사 대용으로 안심하고 즐기실 수 있습니다.
          </p>
        </div>

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#2A4D35]">
          <div className="md:col-span-6 space-y-3">
            <h3 className="text-2xl font-bold font-serif-kr text-[#FFFFFF]">
              하루한잔 생식
            </h3>
            <p className="text-base text-[#B3CDB9] leading-relaxed max-w-md">
              자연이 주는 50가지 곡물과 채소의 온전한 생명력을 담아 
              바쁜 일상에 건강하고 간편한 식사 문화를 전합니다.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#A5D6B1]">
              <button
                onClick={onLookupClick}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>내 주문/배송 조회</span>
              </button>
              <span>·</span>
              <button
                onClick={onAdminClick}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>사장님 주문관리 (관리자)</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-6 space-y-3">
            <h4 className="text-lg font-bold text-[#FFFFFF]">
              고객만족센터
            </h4>
            <div className="flex items-center gap-2 text-2xl font-black text-[#A6E3B5] tabular-nums">
              <Phone className="w-6 h-6" />
              <span>1588-0000</span>
            </div>
            <p className="text-sm text-[#B3CDB9]">
              운영시간: 평일 09:30 ~ 18:00 (점심시간 12:00 ~ 13:00 / 주말·공휴일 휴무)
            </p>
            <div className="text-sm text-[#A0BAA6] flex items-center gap-1.5 pt-1">
              <Mail className="w-4 h-4" />
              <span>contact@haruhanjan-rawfood.kr</span>
            </div>
          </div>
        </div>

        {/* Business details & copyright */}
        <div className="pt-8 text-xs sm:text-sm text-[#8BA491] space-y-2">
          <p>
            상호: 하루한잔 자연푸드 주식회사 | 대표: 김자연 | 사업자등록번호: 120-88-00000 | 통신판매업신고: 제2026-서울강남-00000호
          </p>
          <p>
            주소: 서울특별시 서초구 자연대로 50, 4층 | 개인정보보호책임자: 박곡물 (cs@haruhanjan-rawfood.kr)
          </p>
          <p className="pt-2 text-[#768F7B]">
            © 2026 Haruhanjan Raw Food Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
