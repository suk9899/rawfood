import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyBarProps {
  onOrderClick: () => void;
  price: number;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOrderClick, price }) => {
  return (
    <aside 
      aria-label="빠른 주문 바"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-t border-[#DED4BD] p-3 shadow-2xl safe-area-bottom"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="pl-1">
          <span className="text-xs text-[#526354] font-medium block">
            무료배송 · 보틀증정
          </span>
          <div className="text-xl font-black text-[#1A3C26] tabular-nums">
            {price.toLocaleString()}원
          </div>
        </div>

        <button
          onClick={onOrderClick}
          className="flex-1 py-3.5 px-6 text-xl font-extrabold text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.98] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#356747]"
        >
          <ShoppingBag className="w-5 h-5 text-[#A5D6B1]" />
          <span>주문하기</span>
        </button>
      </div>
    </aside>
  );
};
