/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IngredientsSection } from './components/IngredientsSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { HowToDrinkSection } from './components/HowToDrinkSection';
import { ProductOrderSection } from './components/ProductOrderSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { AuthModal } from './components/AuthModal';
import { AdminOrderManager } from './components/AdminOrderManager';
import { OrderLookupModal } from './components/OrderLookupModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { PRODUCT_INFO } from './data/productData';
import { User } from './types/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authForOrder, setAuthForOrder] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState<boolean>(false);

  // Restore current user session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('haru_current_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to restore user session:', e);
    }
  }, []);

  const handleIncrease = () => {
    if (quantity < 10) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // User must log in first to place an order
  const handleOrderTrigger = () => {
    if (!currentUser) {
      setAuthForOrder(true);
      setIsAuthModalOpen(true);
    } else {
      setIsOrderModalOpen(true);
    }
  };

  const handleHeroOrderClick = () => {
    if (!currentUser) {
      setAuthForOrder(true);
      setIsAuthModalOpen(true);
    } else {
      const productEl = document.getElementById('product');
      if (productEl) {
        productEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        setIsOrderModalOpen(true);
      }
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('haru_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }

    // If login was initiated by wanting to place an order, open the order modal immediately
    if (authForOrder) {
      setAuthForOrder(false);
      setIsOrderModalOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('haru_current_user');
    } catch (e) {
      console.warn(e);
    }
  };

  const currentTotalPrice = PRODUCT_INFO.salePrice * quantity;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#2C332B] font-sans">
      {/* Top Banner when logged in: "스테판 님 환영합니다." */}
      {currentUser && (
        <aside 
          aria-label="회원 환영 알림 바"
          className="bg-[#1C3A27] text-white py-2.5 px-4 text-center text-sm sm:text-base font-bold border-b border-[#2C523B] transition-all"
        >
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52D273] animate-pulse" />
              <span className="text-[#A5E3B5] font-extrabold text-base sm:text-lg">
                {currentUser.name} 님 환영합니다.
              </span>
              <span className="hidden sm:inline text-xs text-[#C5E3CE]">
                · 회원 전용 무료배송 및 전용 보틀 증정 혜택 적용 중
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-[#C5E3CE] hidden md:inline">{currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="underline text-white hover:text-[#A5E3B5] cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Top Navigation */}
      <Header
        currentUser={currentUser}
        onOrderClick={handleOrderTrigger}
        onLookupClick={() => setIsLookupModalOpen(true)}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onAuthClick={() => {
          setAuthForOrder(false);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with "하루한잔, 간편한 한끼" & Big "주문하기" button */}
        <HeroSection onOrderClick={handleHeroOrderClick} />

        {/* 2. 국내산 50가지 곡물, 채소 소개 */}
        <IngredientsSection />

        {/* 3. 이런 분께 좋아요 3가지 (아침 거르는 분, 끼니 챙기기 번거로운 분 등) */}
        <TargetAudienceSection onOrderClick={handleHeroOrderClick} />

        {/* 4. 물이나 우유에 타서 드세요 (1 -> 2 -> 3 순서 표시) */}
        <HowToDrinkSection />

        {/* 5. 상품 1개와 가격, 큰 "주문하기" 버튼 */}
        <ProductOrderSection
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onOrderClick={handleOrderTrigger}
        />

        {/* 6. 자주 묻는 질문 FAQ (일반 식품 규정 준수) */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onLookupClick={() => setIsLookupModalOpen(true)}
        onAdminClick={() => setIsAdminModalOpen(true)}
      />

      {/* Mobile Sticky Order Bar (respecting 15% mobile viewport cap) */}
      <MobileStickyBar onOrderClick={handleOrderTrigger} price={currentTotalPrice} />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthForOrder(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        forOrder={authForOrder}
      />

      {/* Customer Real Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        quantity={quantity}
        totalPrice={currentTotalPrice}
        defaultCustomerName={currentUser ? currentUser.name : ''}
      />

      {/* Customer Live Order Status Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      {/* Store Owner Real-time Order Management Center Modal */}
      <AdminOrderManager
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
