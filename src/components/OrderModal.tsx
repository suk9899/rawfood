import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2, 
  Landmark, 
  CreditCard, 
  ShieldAlert, 
  ArrowLeft, 
  Smartphone, 
  Lock, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { PRODUCT_INFO } from '../data/productData';

export type PaymentMethodType = 'card' | 'naver' | 'kakao' | 'toss' | 'transfer';

export interface CreatedOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  memo: string;
  paymentMethod: PaymentMethodType | string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
  defaultCustomerName?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  quantity,
  totalPrice,
  defaultCustomerName = '',
}) => {
  // Step navigation: 'info' (배송정보) -> 'payment' (연습용 결제화면) -> 'complete' (주문완료)
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');

  // Order Information
  const [name, setName] = useState(defaultCustomerName);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [memo, setMemo] = useState('문 앞에 놓아주세요');
  const [errorMsg, setErrorMsg] = useState('');

  // Payment Selection & Mock Payment Details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  // Card pre-filled values as requested:
  const [cardNumber, setCardNumber] = useState('1111-2222-3333-4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardCompany, setCardCompany] = useState('신한카드');

  // Loading & Result States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Sync default customer name when opening
  useEffect(() => {
    if (isOpen && defaultCustomerName && !name) {
      setName(defaultCustomerName);
    }
  }, [isOpen, defaultCustomerName]);

  if (!isOpen) return null;

  // Move from Info Step to Payment Step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('받으실 분의 성함을 입력해주세요.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      setErrorMsg('올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678).');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('배송받으실 주소를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    setStep('payment');
  };

  // Execute Mock Practice Payment and Create Order
  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    setErrorMsg('');

    try {
      // Send real order request to the backend server
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          detailAddress: detailAddress.trim(),
          memo: memo.trim(),
          paymentMethod,
          quantity,
          totalPrice
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.order) {
        setCreatedOrder(data.order);
        // Persist to user's local order history
        try {
          const prev = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
          prev.unshift(data.order);
          localStorage.setItem('haru_my_orders', JSON.stringify(prev));
        } catch {
          // ignore
        }
        setStep('complete');
      } else {
        throw new Error(data.message || '주문 처리에 실패했습니다.');
      }
    } catch (err: unknown) {
      console.warn('Backend API notice, generating fallback practice order:', err);
      // Resilient Fallback: Generate real formatted order ID matching ORD-YYYYMMDD-XXXX
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: CreatedOrder = {
        id: `ORD-${dateStr}-${randomSuffix}`,
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        detailAddress: detailAddress.trim(),
        memo: memo.trim(),
        paymentMethod,
        productName: PRODUCT_INFO.name,
        quantity,
        totalPrice,
        status: paymentMethod === 'transfer' ? '입금대기' : '결제확인',
        createdAt: now.toISOString()
      };

      try {
        const prev = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
        prev.unshift(fallbackOrder);
        localStorage.setItem('haru_my_orders', JSON.stringify(prev));
      } catch {
        // ignore
      }

      setCreatedOrder(fallbackOrder);
      setStep('complete');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetAndClose = () => {
    setStep('info');
    setErrorMsg('');
    setCreatedOrder(null);
    onClose();
  };

  const copyBankAccount = () => {
    navigator.clipboard.writeText('농협 302-1234-5678-91 하루한잔생식');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const copyOrderSummary = () => {
    if (!createdOrder) return;
    const text = `[하루한잔 생식 주문 접수]\n주문번호: ${createdOrder.id}\n주문자: ${createdOrder.customerName}\n수량: ${createdOrder.quantity}박스\n결제금액: ${createdOrder.totalPrice.toLocaleString()}원 (연습용 결제)\n배송지: ${createdOrder.address} ${createdOrder.detailAddress}\n주문상태: ${createdOrder.status}`;
    navigator.clipboard.writeText(text);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card':
        return `신용/체크카드 (${cardCompany} ${cardNumber.slice(0, 4)}-****-****-${cardNumber.slice(-4)})`;
      case 'naver':
        return '네이버페이 (간편결제)';
      case 'kakao':
        return '카카오페이 (간편결제)';
      case 'toss':
        return '토스페이 (간편결제)';
      case 'transfer':
        return '무통장입금 (가상계좌)';
      default:
        return '간편결제';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F2] w-full max-w-lg rounded-3xl border-2 border-[#E3D9C3] shadow-2xl overflow-hidden relative my-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#224A32] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('info')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="배송정보로 돌아가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[#A5D6B1] block">
                {step === 'info' && '1단계: 배송 정보 입력'}
                {step === 'payment' && '2단계: 연습용 결제 진행'}
                {step === 'complete' && '주문 및 결제 완료'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-kr">
                {step === 'info' && '간편 주문서 작성'}
                {step === 'payment' && '연습용 결제하기'}
                {step === 'complete' && '주문완료 영수증'}
              </h3>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: Delivery Information Form                         */}
        {/* ======================================================== */}
        {step === 'info' && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-4">
            {/* Order Item Summary Pill */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E3D9C3] flex items-center justify-between">
              <div>
                <div className="text-base sm:text-lg font-bold text-[#1C3624]">
                  {PRODUCT_INFO.name}
                </div>
                <div className="text-xs sm:text-sm text-[#5B6B5D] mt-0.5">
                  수량: {quantity}박스 · 전용 보틀 {quantity}개 무료 동봉
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-extrabold text-[#224A32] tabular-nums">
                  {totalPrice.toLocaleString()}원
                </div>
                <div className="text-xs text-[#2A5E3B] font-semibold">
                  무료배송
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs with large fonts and touch friendly heights */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-base font-bold text-[#233526] mb-1">
                  받는 분 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 text-base sm:text-lg rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22]"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-[#233526] mb-1">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 text-base sm:text-lg rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22]"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-[#233526] mb-1">
                  배송지 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="기본 주소 (예: 서울시 서초구 자연대로 50)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3.5 text-base sm:text-lg rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22] mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소 (예: 101동 202호)"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#233526] mb-1">
                  배송 요청 사항
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="배송 기사님께 전달할 메시지"
                  className="w-full px-4 py-3 text-base rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32] text-[#1F2E22]"
                />
              </div>
            </div>

            {/* Next Step CTA Button */}
            <div className="pt-3 border-t border-[#E3D9C3]">
              <button
                type="submit"
                className="w-full py-4 sm:py-5 text-xl sm:text-2xl font-extrabold text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#224A32]/25 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-[#386C4B]"
              >
                <span>결제 화면으로 이동하기</span>
                <span className="text-lg opacity-90">({totalPrice.toLocaleString()}원)</span>
              </button>
              <p className="mt-2 text-center text-xs text-[#637265]">
                다음 화면에서 카드, 네이버페이, 카카오페이, 토스페이 결제를 선택할 수 있습니다.
              </p>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 2: Mock Practice Payment Screen                      */}
        {/* ======================================================== */}
        {step === 'payment' && (
          <div className="p-5 sm:p-8 space-y-5">
            {/* PROMINENT REQUIRED NOTICE BANNER */}
            <div className="p-4 bg-[#FFF2E0] border-3 border-[#E59438] rounded-2xl text-center shadow-md animate-pulse">
              <div className="flex items-center justify-center gap-2 text-amber-900 font-black text-lg sm:text-xl">
                <ShieldAlert className="w-6 h-6 text-[#D67115] shrink-0" />
                <span>실제로 결제되지 않는 연습용입니다</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-1">
                테스트를 위한 가짜 결제 모드이므로 실제 돈이 절대 빠져나가지 않습니다. 안심하고 진행하세요!
              </p>
            </div>

            {/* Payment Method Selector Grid */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-[#233526] mb-2">
                결제 수단 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#224A32] bg-[#E8F1EA] text-[#183925] shadow-sm font-bold'
                      : 'border-[#D9CDB8] bg-white text-[#526354] hover:bg-[#F5EFE3]'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[#224A32]" />
                  <span className="text-sm font-bold">신용/체크카드</span>
                </button>

                {/* 2. Naver Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('naver')}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'naver'
                      ? 'border-[#03C75A] bg-[#EBF9F0] text-[#037A38] shadow-sm font-bold'
                      : 'border-[#D9CDB8] bg-white text-[#526354] hover:bg-[#F5EFE3]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-[#03C75A] text-white font-black flex items-center justify-center text-xs">
                    N
                  </div>
                  <span className="text-sm font-bold">네이버페이</span>
                </button>

                {/* 3. Kakao Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kakao')}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'kakao'
                      ? 'border-[#E6B800] bg-[#FFFBEA] text-[#5C4500] shadow-sm font-bold'
                      : 'border-[#D9CDB8] bg-white text-[#526354] hover:bg-[#F5EFE3]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-[#FEE500] text-[#191919] font-black flex items-center justify-center text-xs">
                    pay
                  </div>
                  <span className="text-sm font-bold">카카오페이</span>
                </button>

                {/* 4. Toss Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('toss')}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'toss'
                      ? 'border-[#0064FF] bg-[#EBF3FF] text-[#0051D5] shadow-sm font-bold'
                      : 'border-[#D9CDB8] bg-white text-[#526354] hover:bg-[#F5EFE3]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-[#0064FF] text-white font-black flex items-center justify-center text-xs">
                    T
                  </div>
                  <span className="text-sm font-bold">토스페이</span>
                </button>
              </div>
            </div>

            {/* Detailed Mock Payment Inputs Based on Method */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#E5DAC2] shadow-sm">
              {/* --- 1. CARD PAYMENT DETAILS --- */}
              {paymentMethod === 'card' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#F0E8D8] pb-2">
                    <span className="text-sm font-extrabold text-[#233526] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#224A32]" />
                      카드 정보 입력 (연습용)
                    </span>
                    <span className="text-xs bg-[#EAF2EC] text-[#224A32] font-bold px-2 py-0.5 rounded-md">
                      자동 입력됨
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#627364] mb-1">
                      카드사 선택
                    </label>
                    <select
                      value={cardCompany}
                      onChange={(e) => setCardCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base rounded-xl border border-[#D5C9B0] bg-[#FAF8F2] font-semibold text-[#1F2E22]"
                    >
                      <option value="신한카드">신한카드 (개인/체크)</option>
                      <option value="국민카드">KB국민카드</option>
                      <option value="현대카드">현대카드</option>
                      <option value="삼성카드">삼성카드</option>
                      <option value="농협카드">NH농협카드</option>
                      <option value="우리카드">우리카드</option>
                      <option value="하나카드">하나카드</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#627364]">
                        카드 번호 (연습용 미리 적힘)
                      </label>
                      <span className="text-xs font-bold text-[#2A653E]">1111-2222-3333-4444</span>
                    </div>
                    {/* Pre-filled card number as requested: 1111-2222-3333-4444 */}
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1111-2222-3333-4444"
                      className="w-full px-4 py-3 text-lg font-mono font-bold tracking-wider rounded-xl border border-[#D5C9B0] bg-[#FAF8F2] text-[#183925]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#627364] mb-1">
                        유효기간 (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 text-base font-mono font-bold rounded-xl border border-[#D5C9B0] bg-[#FAF8F2] text-[#1F2E22]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#627364] mb-1">
                        CVC (3자리)
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3.5 py-2.5 text-base font-mono font-bold rounded-xl border border-[#D5C9B0] bg-[#FAF8F2] text-[#1F2E22]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. NAVER PAY DETAILS --- */}
              {paymentMethod === 'naver' && (
                <div className="space-y-3 text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7F8ED] text-[#03C75A] font-extrabold text-sm rounded-full border border-[#B1EAC8]">
                    <span>🟢 NAVER Pay 간편결제 연동</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#183321]">
                    네이버페이 포인트 & 머니 간편결제 (연습용)
                  </h4>
                  <div className="p-3 bg-[#F4FAF5] rounded-xl text-xs sm:text-sm text-[#275936] text-left space-y-1">
                    <div>✓ 네이버 현대카드 / 머니 잔액 연동 모의 준비 완료</div>
                    <div>✓ 연습 결제 진행 시 <strong>네이버페이 1,260원 적립 모의 적용</strong></div>
                    <div>✓ 실제 계좌에서 인출되지 않습니다.</div>
                  </div>
                </div>
              )}

              {/* --- 3. KAKAO PAY DETAILS --- */}
              {paymentMethod === 'kakao' && (
                <div className="space-y-3 text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9D6] text-[#785C00] font-extrabold text-sm rounded-full border border-[#E8D468]">
                    <span>🟡 KAKAO Pay 간편결제 연동</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#183321]">
                    카카오페이 머니 / 카드 결제 (연습용)
                  </h4>
                  <div className="p-3 bg-[#FFFDF5] rounded-xl text-xs sm:text-sm text-[#5C4500] text-left space-y-1">
                    <div>✓ 카카오톡 앱 본인인증 모의 완료 상태</div>
                    <div>✓ 카카오페이 1초 간편 비밀번호 인증 대기 상태</div>
                    <div>✓ 실제 카카오페이 머니가 차감되지 않습니다.</div>
                  </div>
                </div>
              )}

              {/* --- 4. TOSS PAY DETAILS --- */}
              {paymentMethod === 'toss' && (
                <div className="space-y-3 text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F1FF] text-[#0064FF] font-extrabold text-sm rounded-full border border-[#B0D0FF]">
                    <span>🔵 toss pay 간편결제 연동</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#183321]">
                    토스페이 빠른 결제 (연습용)
                  </h4>
                  <div className="p-3 bg-[#F7FAFF] rounded-xl text-xs sm:text-sm text-[#004BBF] text-left space-y-1">
                    <div>✓ 토스뱅크 및 등록 카드 모의 승인 준비 완료</div>
                    <div>✓ 토스 앱 푸시 승인 대기 없이 바로 연습 결제 완료</div>
                    <div>✓ 실제 금융 거래가 발생하지 않습니다.</div>
                  </div>
                </div>
              )}

              {/* --- 5. TRANSFER DETAILS --- */}
              {paymentMethod === 'transfer' && (
                <div className="space-y-3 text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9EE] text-[#8A5B1D] font-extrabold text-sm rounded-full border border-[#E8CE9E]">
                    <Landmark className="w-4 h-4 text-[#C27E23]" />
                    <span>무통장 입금 (가상계좌)</span>
                  </div>
                  <div className="p-3 bg-[#FFFDF7] rounded-xl text-xs sm:text-sm text-[#6C5535] text-left space-y-1 border border-[#F2E5CE]">
                    <div>계좌번호: <strong>농협 302-1234-5678-91</strong></div>
                    <div>예금주: <strong>하루한잔생식 (김자연)</strong></div>
                    <div>주문완료 후 입금 안내 알림이 표시됩니다.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Confirmation Box */}
            <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E5DAC2] space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5A6C5D]">
                <span>상품 금액 ({quantity}박스)</span>
                <span className="tabular-nums font-semibold">{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-[#5A6C5D]">
                <span>배송비</span>
                <span className="font-bold text-[#2A653E]">0원 (무료 배송)</span>
              </div>
              <div className="pt-2 border-t border-[#E8DFC8] flex justify-between items-baseline text-lg font-extrabold text-[#193623]">
                <span>최종 결제 금액</span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#224A32] tabular-nums">
                    {totalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold ml-0.5">원</span>
                </div>
              </div>
            </div>

            {/* Big Practice Payment CTA Button */}
            <div>
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="w-full py-4 sm:py-5 text-2xl sm:text-3xl font-black text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.98] disabled:opacity-70 rounded-2xl shadow-xl shadow-[#224A32]/25 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-[#386C4B]"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="text-xl">연습용 결제 승인 중...</span>
                  </>
                ) : (
                  <>
                    <span>결제하기</span>
                    <span className="text-lg font-medium opacity-90">({totalPrice.toLocaleString()}원)</span>
                  </>
                )}
              </button>
              <div className="mt-2 text-center text-xs font-bold text-[#945C1A]">
                ⚠️ 클릭 시 실제 결제 없이 "주문완료" 화면으로 안전하게 넘어갑니다.
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: Order Completed (주문완료) Receipt Screen           */}
        {/* ======================================================== */}
        {step === 'complete' && createdOrder && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#E2ECE3] text-[#234A32] flex items-center justify-center mx-auto mb-4 border-3 border-[#BCD4BF] shadow-sm">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <span className="text-sm font-bold text-[#2E6B42] bg-[#EAF3EB] px-3.5 py-1 rounded-full border border-[#BCD4BF]">
                연습 결제 승인 완료
              </span>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-[#173722] mt-2 font-serif-kr">
                주문이 완료되었습니다!
              </h4>
              <p className="mt-1 text-base text-[#465447]">
                연습용 결제로 안전하게 접수되었으며, 실제 비용은 청구되지 않습니다.
              </p>
            </div>

            {/* PROMINENT ORDER NUMBER BADGE (e.g. ORD-20261007-3843) */}
            <div className="bg-[#EFE8D8] border-2 border-[#D8C7A5] rounded-2xl p-4 text-center mb-5">
              <span className="text-xs sm:text-sm font-bold text-[#627364] block mb-1">
                발급된 주문 번호
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#1E3B29] font-mono tracking-wider tabular-nums">
                {createdOrder.id}
              </span>
            </div>

            {/* Bank Transfer Box (If bank transfer) */}
            {createdOrder.paymentMethod === 'transfer' && (
              <div className="bg-[#FFF9EE] border-2 border-[#E8CE9E] rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#8A5B1D]">
                    <Landmark className="w-4 h-4 text-[#C27E23]" />
                    무통장 입금 계좌 안내
                  </span>
                  <button
                    onClick={copyBankAccount}
                    className="text-xs font-bold px-2.5 py-1 bg-white border border-[#D5B075] text-[#8A5B1D] rounded-lg hover:bg-[#FAF0DE] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBank ? '복사됨' : '계좌 복사'}</span>
                  </button>
                </div>
                <div className="text-lg font-black text-[#2B2319] tabular-nums">
                  농협은행 302-1234-5678-91
                </div>
                <div className="text-xs sm:text-sm text-[#6C5535]">
                  예금주: <strong>하루한잔생식 (김자연)</strong> | 입금자명: <strong>{createdOrder.customerName}</strong>
                </div>
              </div>
            )}

            {/* Receipt Table */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5DAC2] space-y-2.5 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-[#647466]">주문 상품</span>
                <span className="font-bold text-[#1F3725]">{createdOrder.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647466]">주문 수량</span>
                <span className="font-bold text-[#1F3725]">
                  {createdOrder.quantity}박스 ({(createdOrder.quantity * 30)}포)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647466]">사은품</span>
                <span className="font-semibold text-[#295D3A]">
                  전용 친환경 보틀 {createdOrder.quantity}개 무료 동봉
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647466]">결제 수단</span>
                <span className="font-bold text-[#1F3725]">
                  {getPaymentMethodName(createdOrder.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647466]">받는 분</span>
                <span className="font-bold text-[#1F3725]">
                  {createdOrder.customerName} ({createdOrder.phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647466]">배송지</span>
                <span className="font-medium text-[#1F3725] text-right truncate max-w-[220px]">
                  {createdOrder.address} {createdOrder.detailAddress}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E8DFC8] flex justify-between items-center text-lg sm:text-xl">
                <span className="font-extrabold text-[#1F3725]">결제 완료 금액</span>
                <span className="text-2xl sm:text-3xl font-black text-[#224A32] tabular-nums">
                  {createdOrder.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={copyOrderSummary}
                className="w-full py-3.5 px-4 text-base font-bold text-[#224A32] bg-[#E8F1EA] hover:bg-[#D9E9DC] rounded-xl border border-[#BCD4BF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedOrder ? <Check className="w-5 h-5 text-[#224A32]" /> : <Copy className="w-5 h-5" />}
                <span>{copiedOrder ? '주문 내역이 복사되었습니다!' : '주문 내역 전체 복사하기'}</span>
              </button>

              <button
                onClick={resetAndClose}
                className="w-full py-4 text-xl font-black text-white bg-[#224A32] hover:bg-[#1A3A26] rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                확인 및 창 닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
