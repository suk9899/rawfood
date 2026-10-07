import React, { useState } from 'react';
import { X, Search, Package, Phone, Truck, Clock, AlertCircle } from 'lucide-react';
import { CreatedOrder } from './OrderModal';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<CreatedOrder[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setErrorMsg('주문하신 휴대폰 번호 또는 주문번호를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Fetch from backend API
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          // If query also matches order id directly
          let matched = data.orders;
          if (matched.length === 0) {
            // Try single order lookup by ID
            const singleRes = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
            if (singleRes.ok) {
              const singleData = await singleRes.json();
              if (singleData.success && singleData.order) {
                matched = [singleData.order];
              }
            }
          }
          setOrders(matched);
        }
      } else {
        // Fallback to local storage
        const local = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
        const cleanDigits = clean.replace(/[^0-9]/g, '');
        const matched = local.filter((o: CreatedOrder) =>
          o.phone.replace(/[^0-9]/g, '').includes(cleanDigits) || o.id === clean
        );
        setOrders(matched);
      }
    } catch (err) {
      console.warn('API error, reading local fallback:', err);
      const local = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
      const cleanDigits = clean.replace(/[^0-9]/g, '');
      const matched = local.filter((o: CreatedOrder) =>
        o.phone.replace(/[^0-9]/g, '').includes(cleanDigits) || o.id === clean
      );
      setOrders(matched);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F2] w-full max-w-lg rounded-3xl border-2 border-[#E3D9C3] shadow-2xl overflow-hidden relative my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#224A32] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-[#A5D6B1] block">
              실시간 배송 및 접수 현황
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-kr">
              내 주문 내역 조회
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-base font-bold text-[#233526]">
              주문 시 입력한 휴대폰 번호 또는 주문번호
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="예: 010-1234-5678 또는 주문번호"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 text-base sm:text-lg rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 text-base sm:text-lg font-bold text-white bg-[#224A32] hover:bg-[#183925] rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                {loading ? '조회 중...' : '조회'}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
            )}
          </form>

          {/* Results Area */}
          {searched && (
            <div className="space-y-4 pt-4 border-t border-[#E5DAC2]">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-[#677769]">
                  <Package className="w-10 h-10 text-[#C7D4C9] mx-auto mb-2" />
                  <p className="text-base font-bold text-[#263D2B]">
                    조회된 주문 내역이 없습니다.
                  </p>
                  <p className="text-xs sm:text-sm mt-1">
                    휴대폰 번호를 다시 확인해 주시거나, 가게 고객센터(1588-0000)로 문의해 주세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="text-sm font-bold text-[#224A32]">
                    총 {orders.length}건의 주문이 확인되었습니다.
                  </div>

                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white p-5 rounded-2xl border border-[#DED4BE] shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#1E3B29]">
                          {o.id}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#EAF2EC] text-[#224A32] border border-[#BCD4BF]">
                          {o.status}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 text-[#3B4D3E]">
                        <div className="flex justify-between">
                          <span className="text-[#6C7D6E]">주문자:</span>
                          <span className="font-semibold text-[#183321]">{o.customerName} ({o.phone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6C7D6E]">주문 상품:</span>
                          <span className="font-semibold">{o.productName} ({o.quantity}박스)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6C7D6E]">결제 금액:</span>
                          <span className="font-bold text-[#224A32] tabular-nums">
                            {o.totalPrice.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6C7D6E]">배송지:</span>
                          <span className="text-right truncate max-w-[200px]">
                            {o.address} {o.detailAddress}
                          </span>
                        </div>
                      </div>

                      {/* Bank transfer info reminder if pending */}
                      {o.status === '입금대기' && (
                        <div className="p-3 bg-[#FFF9EE] rounded-xl border border-[#E8CE9E] text-xs text-[#8A5B1D] space-y-1">
                          <div className="font-bold">입금 계좌 안내:</div>
                          <div>농협은행 302-1234-5678-91 (예금주: 하루한잔생식)</div>
                          <div>입금자명: <strong>{o.customerName}</strong></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
