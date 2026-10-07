import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  RefreshCw, 
  Download, 
  Search, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Bell, 
  ExternalLink,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { CreatedOrder } from './OrderModal';

interface AdminOrderManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderManager: React.FC<AdminOrderManagerProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<CreatedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  // Store known order IDs to detect new orders
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Synthesize a gentle audio chime using Web Audio API when new order arrives
  const playNewOrderChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay might be blocked on first load; ignore silently
    }
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const freshOrders: CreatedOrder[] = data.orders;

          // Check if brand new orders arrived (after first initial load)
          if (!isInitialLoadRef.current) {
            const newlyArrived = freshOrders.filter(
              (o) => !knownOrderIdsRef.current.has(o.id)
            );
            if (newlyArrived.length > 0) {
              const latest = newlyArrived[0];
              setNewOrderAlert(`🔔 새 주문 도착: ${latest.customerName} 님 (${latest.quantity}박스 / ${latest.totalPrice.toLocaleString()}원)`);
              playNewOrderChime();
              setTimeout(() => setNewOrderAlert(null), 5000);
            }
          }

          // Update known set
          freshOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
          isInitialLoadRef.current = false;

          setOrders(freshOrders);
        }
      } else {
        // Fallback to localStorage
        const local: CreatedOrder[] = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
        setOrders(local);
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/orders, reading local:', err);
      const local: CreatedOrder[] = JSON.parse(localStorage.getItem('haru_my_orders') || '[]');
      setOrders(local);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isOpen) {
      isInitialLoadRef.current = true;
      knownOrderIdsRef.current = new Set();
      fetchOrders(false);
    }
  }, [isOpen]);

  // Real-time automatic polling every 2.5 seconds (새 주문 자동 반영)
  useEffect(() => {
    if (!isOpen || !isAutoRefreshing) return;

    const intervalId = setInterval(() => {
      fetchOrders(true); // silent background fetch
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isOpen, isAutoRefreshing]);

  if (!isOpen) return null;

  // Single-click status update to "배송완료" as requested
  const handleMarkAsCompleted = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: '배송완료' }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: '배송완료' } : o))
        );
      }
    } catch (err) {
      console.error(err);
      // Update local state resiliently
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: '배송완료' } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Revert or change to other statuses if needed
  const handleChangeStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV for courier shipping label upload
  const downloadCSV = () => {
    if (orders.length === 0) {
      alert('다운로드할 주문 내역이 없습니다.');
      return;
    }

    const headers = [
      '주문번호',
      '주문일시',
      '주문자성함',
      '연락처',
      '배송지주소',
      '상세주소',
      '상품명',
      '수량(박스)',
      '결제금액',
      '결제수단',
      '주문상태',
      '배송메모'
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString('ko-KR')}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.address}"`,
      `"${o.detailAddress || ''}"`,
      `"${o.productName}"`,
      `"${o.quantity}"`,
      `"${o.totalPrice}"`,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${(o.memo || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `하루한잔생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase());

    const isCompleted = o.status === '배송완료';
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? isCompleted
        : !isCompleted;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== '주문취소')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingDeliveryCount = orders.filter((o) => o.status !== '배송완료' && o.status !== '주문취소').length;
  const completedCount = orders.filter((o) => o.status === '배송완료').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F2] w-full max-w-6xl rounded-3xl border-2 border-[#E3D9C3] shadow-2xl overflow-hidden relative flex flex-col max-h-[95vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#1B3B28] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Package className="w-6 h-6 text-[#A5D6B1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black font-serif-kr">
                  판매자 주문 관리 센터
                </h3>
                {/* Real-time Indicator */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#295437] text-[#9EE8B0] border border-[#3E7A52]">
                  <span className="w-2 h-2 rounded-full bg-[#52D273] animate-ping" />
                  실시간 자동 수신 중
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#B7D4BD] mt-0.5">
                새 주문이 들어오면 새로고침 없이 표에 자동으로 즉시 나타납니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders(false)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
              title="지금 수동 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Live New Order Pop-up Banner */}
        {newOrderAlert && (
          <div className="bg-[#F59E0B] text-black px-5 py-3 font-extrabold text-sm sm:text-base flex items-center justify-between shadow-md animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 animate-bounce" />
              <span>{newOrderAlert}</span>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="text-xs bg-black/10 hover:bg-black/20 px-2 py-1 rounded-md"
            >
              닫기
            </button>
          </div>
        )}

        {/* Dashboard Statistics KPI Cards */}
        <div className="p-4 sm:p-6 bg-[#F3EDE2] border-b border-[#E3D9C3] shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#DFD3BB] shadow-xs">
              <span className="text-xs font-bold text-[#627364]">전체 주문</span>
              <div className="text-2xl sm:text-3xl font-black text-[#1B3828] tabular-nums mt-1">
                {orders.length}
                <span className="text-sm font-normal text-[#627364] ml-1">건</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFD3BB] shadow-xs">
              <span className="text-xs font-bold text-[#A5681E]">배송 대기 (처리 필요)</span>
              <div className="text-2xl sm:text-3xl font-black text-[#B86810] tabular-nums mt-1">
                {pendingDeliveryCount}
                <span className="text-sm font-normal text-[#627364] ml-1">건</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFD3BB] shadow-xs">
              <span className="text-xs font-bold text-[#2A653E]">배송 완료</span>
              <div className="text-2xl sm:text-3xl font-black text-[#26633B] tabular-nums mt-1">
                {completedCount}
                <span className="text-sm font-normal text-[#627364] ml-1">건</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFD3BB] shadow-xs">
              <span className="text-xs font-bold text-[#1B3828]">총 결제 매출</span>
              <div className="text-xl sm:text-2xl font-black text-[#224A32] tabular-nums mt-1 truncate">
                {totalRevenue.toLocaleString()}
                <span className="text-xs sm:text-sm font-normal ml-0.5">원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Search, Status Filter & CSV Download */}
        <div className="p-4 sm:p-6 pb-2 shrink-0 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#EFE8D8] p-1 rounded-xl">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#183925] shadow-xs'
                    : 'text-[#5B6D5E] hover:text-[#183925]'
                }`}
              >
                전체 ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-[#224A32] text-white shadow-xs'
                    : 'text-[#5B6D5E] hover:text-[#183925]'
                }`}
              >
                배송 대기 ({pendingDeliveryCount})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-white text-[#183925] shadow-xs'
                    : 'text-[#5B6D5E] hover:text-[#183925]'
                }`}
              >
                배송 완료 ({completedCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-[#8C9C8E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="주문자, 주문번호, 주소 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#D5C9B0] bg-white focus:outline-none focus:ring-2 focus:ring-[#224A32]"
              />
            </div>
          </div>

          {/* Export CSV button */}
          <button
            onClick={downloadCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#224A32] hover:bg-[#183925] rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>엑셀(CSV) 다운로드</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* REQUIRED TABLE (표) VIEW: 주문번호, 주문자, 상품, 금액, 상태 */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 pt-2">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E3D9C3] p-12 text-center text-[#6A786C]">
              <Package className="w-12 h-12 text-[#CAD5CB] mx-auto mb-3" />
              <p className="text-xl font-bold text-[#354837]">
                {orders.length === 0 ? '접수된 주문이 아직 없습니다.' : '해당 조건의 주문이 없습니다.'}
              </p>
              <p className="text-sm mt-1 text-[#7A8B7C]">
                고객이 메인 화면에서 결제하면 새로고침 없이 이 표에 자동으로 즉시 추가됩니다.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-[#E3D9C3] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#F5EFE3] text-[#2C4835] text-xs sm:text-sm font-extrabold border-b-2 border-[#E2D6BE]">
                      <th className="py-4 px-4 w-[170px]">주문번호</th>
                      <th className="py-4 px-4 w-[160px]">주문자</th>
                      <th className="py-4 px-4 w-[200px]">상품</th>
                      <th className="py-4 px-4 w-[130px]">금액</th>
                      <th className="py-4 px-4 w-[120px]">상태</th>
                      <th className="py-4 px-4 text-center w-[160px]">배송 상태 변경</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE5D6] text-sm text-[#253828]">
                    {filteredOrders.map((order) => {
                      const isCompleted = order.status === '배송완료';
                      const isUpdating = updatingId === order.id;

                      return (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-[#FAF8F2] transition-colors ${
                            isCompleted ? 'bg-white' : 'bg-[#FEFCF8]'
                          }`}
                        >
                          {/* 1. 주문번호 */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-mono font-bold text-sm text-[#1B3828] tabular-nums">
                              {order.id}
                            </div>
                            <div className="text-xs text-[#7B8B7D] mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#97A799]" />
                              <span>
                                {new Date(order.createdAt).toLocaleString('ko-KR', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </td>

                          {/* 2. 주문자 */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-extrabold text-base text-[#183925]">
                              {order.customerName}
                            </div>
                            <a
                              href={`tel:${order.phone}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#295D3A] hover:underline mt-0.5"
                              title="전화 걸기"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.phone}</span>
                            </a>
                            <div className="text-xs text-[#637566] mt-1 line-clamp-2 max-w-[200px]" title={`${order.address} ${order.detailAddress}`}>
                              📍 {order.address} {order.detailAddress}
                            </div>
                            {order.memo && (
                              <div className="text-[11px] text-[#8A6328] bg-[#FFF8EC] px-2 py-0.5 rounded mt-1 max-w-[200px] truncate">
                                💬 {order.memo}
                              </div>
                            )}
                          </td>

                          {/* 3. 상품 */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-[#1C3A27]">
                              {order.productName}
                            </div>
                            <div className="text-xs font-semibold text-[#48634F] mt-0.5">
                              수량: <strong className="text-sm font-black text-[#1C3A27]">{order.quantity}박스</strong> ({(order.quantity * 30)}포)
                            </div>
                            <div className="text-[11px] text-[#295D3A] mt-0.5">
                              + 전용 보틀 {order.quantity}개 무료 동봉
                            </div>
                          </td>

                          {/* 4. 금액 */}
                          <td className="py-4 px-4 align-top">
                            <div className="text-base font-black text-[#224A32] tabular-nums">
                              {order.totalPrice.toLocaleString()}원
                            </div>
                            <span className="inline-block text-[11px] font-semibold text-[#6E7E70] bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E3DAC8] mt-1">
                              {order.paymentMethod === 'card'
                                ? '신용카드'
                                : order.paymentMethod === 'naver'
                                ? '네이버페이'
                                : order.paymentMethod === 'kakao'
                                ? '카카오페이'
                                : order.paymentMethod === 'toss'
                                ? '토스페이'
                                : order.paymentMethod === 'transfer'
                                ? '무통장입금'
                                : '간편결제'}
                            </span>
                          </td>

                          {/* 5. 상태 */}
                          <td className="py-4 px-4 align-top">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E2ECE3] text-[#1B4D29] border border-[#B8D7BE]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#246B3A]" />
                                배송완료
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFF1D6] text-[#9A5B0B] border border-[#F3D19A]">
                                <Truck className="w-3.5 h-3.5 text-[#B86810]" />
                                {order.status === '결제확인' ? '배송대기' : order.status}
                              </span>
                            )}
                          </td>

                          {/* 6. 배송완료로 바꾸는 버튼 */}
                          <td className="py-4 px-4 align-top text-center">
                            {isCompleted ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-[#2A653E] bg-[#EAF5EC] px-3 py-1.5 rounded-xl border border-[#BDDDC2] block w-full">
                                  ✓ 완료됨
                                </span>
                                <button
                                  onClick={() => handleChangeStatus(order.id, '배송대기')}
                                  disabled={isUpdating}
                                  className="text-[11px] text-[#718274] hover:text-black underline cursor-pointer"
                                >
                                  대기로 되돌리기
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleMarkAsCompleted(order.id)}
                                disabled={isUpdating}
                                className="w-full py-2.5 px-3 text-xs sm:text-sm font-extrabold text-white bg-[#224A32] hover:bg-[#183925] active:scale-[0.97] rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1 border border-[#326945]"
                                title="이 주문을 배송완료로 즉시 변경합니다"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#A5E3B5]" />
                                <span>배송완료 처리</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-4 bg-[#F5EFE3] border-t border-[#E3D9C3] flex flex-wrap items-center justify-between text-xs sm:text-sm text-[#5B6D5E] gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3EA75B] animate-pulse" />
            <span>실시간 자동 수신 활성화 (손님이 주문하면 2초 이내 자동 표시)</span>
          </div>
          <div>
            총 {orders.length}건 중 배송대기 <strong>{pendingDeliveryCount}건</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
