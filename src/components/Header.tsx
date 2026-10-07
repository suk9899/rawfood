import React from 'react';
import { ShoppingBag, Search, Settings, User as UserIcon, LogOut, LogIn, Package } from 'lucide-react';
import { User } from '../types/auth';

interface HeaderProps {
  currentUser: User | null;
  onOrderClick: () => void;
  onLookupClick: () => void;
  onAdminClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOrderClick,
  onLookupClick,
  onAdminClick,
  onAuthClick,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          className="group flex items-baseline gap-2 text-2xl sm:text-3xl font-extrabold text-[#1B3828] font-serif-kr tracking-tight"
          aria-label="하루한잔 생식 홈"
        >
          <span>하루한잔 생식</span>
          <span className="text-xs sm:text-sm font-normal text-[#4F6E56] font-sans tracking-normal">
            生食
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-base lg:text-lg font-medium text-[#384A3B]">
          <a href="#ingredients" className="hover:text-[#1B3828] transition-colors">
            50가지 원료
          </a>
          <a href="#recommendations" className="hover:text-[#1B3828] transition-colors">
            이런 분께 추천
          </a>
          <a href="#how-to-drink" className="hover:text-[#1B3828] transition-colors">
            음용 방법
          </a>
          <a href="#product" className="hover:text-[#1B3828] transition-colors">
            상품 안내
          </a>
          <button
            onClick={onLookupClick}
            className="text-sm font-semibold text-[#2E6B42] hover:text-[#1B3828] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>주문조회</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User state: Logged In vs Logged Out */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#EAF2EC] px-3 py-1.5 rounded-xl border border-[#BCD4BF]">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#183925]">
                <span className="w-2 h-2 rounded-full bg-[#3EA75B]" />
                <span className="font-extrabold">{currentUser.name} 님 환영합니다.</span>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-[#526655] hover:text-red-700 underline cursor-pointer ml-1"
                title="로그아웃"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-3.5 py-2 text-sm sm:text-base font-bold text-[#224A32] hover:text-[#163622] hover:bg-[#EFE8D8] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </button>
          )}

          {/* Seller Order Manager button */}
          <button
            onClick={onAdminClick}
            className="px-3 py-2 text-xs sm:text-sm font-extrabold text-[#183E23] bg-[#E2ECE3] hover:bg-[#D5E5D7] border border-[#BCD4BF] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            title="판매자 주문관리 화면 열기"
          >
            <Package className="w-4 h-4 text-[#246B3A]" />
            <span>주문관리</span>
          </button>

          {/* Primary Order CTA */}
          <button
            onClick={onOrderClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-white bg-[#224A32] hover:bg-[#1A3B27] active:scale-[0.98] rounded-xl shadow-md shadow-[#224A32]/15 transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-5 h-5 text-[#A5D6B1]" />
            <span>주문하기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
