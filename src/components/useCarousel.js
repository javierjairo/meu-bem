import { useState, useRef, useCallback, useEffect } from 'react';

export default function useCarousel(itemCount, { autoPlayMs = 4000, pauseOnHover = false } = {}) {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const touchStart = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const isSwipeValid = useRef(true);
  const wrapperRef = useRef(null);

  const maxIndex = itemCount - 1;

  const next = useCallback(() => {
    setIndex(i => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setIndex(i => Math.max(i - 1, 0));
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCardClick = useCallback((distance) => {
    if (isDragging.current) return;
    if (distance === 0) {
      openModal();
    } else if (distance > 0) {
      next();
    } else {
      prev();
    }
  }, [openModal, next, prev]);

  // Touch handlers com tracking contínuo para feedback visual
  const onTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    isSwipeValid.current = true;
    setDragOffset(0);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (touchStart.current === null || !isSwipeValid.current) return;

    const dx = e.touches[0].clientX - touchStart.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Se o scroll vertical é maior que horizontal, não interceptar
    if (!isDragging.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      isSwipeValid.current = false;
      setDragOffset(0);
      return;
    }

    if (Math.abs(dx) > 8) {
      isDragging.current = true;
    }

    // Aplicar resistência nas bordas
    let offset = dx;
    if ((index === 0 && dx > 0) || (index === maxIndex && dx < 0)) {
      offset = dx * 0.3; // Resistência de 70%
    }

    setDragOffset(offset);
  }, [index, maxIndex]);

  const onTouchEnd = useCallback((e) => {
    setDragOffset(0);

    if (touchStart.current === null || !isSwipeValid.current) {
      touchStart.current = null;
      return;
    }

    const diff = touchStart.current - e.changedTouches[0].clientX;
    const wasDragging = isDragging.current;

    touchStart.current = null;
    isDragging.current = false;

    // Threshold menor para mobile (35px em vez de 50px)
    if (wasDragging && Math.abs(diff) > 35) {
      diff > 0 ? next() : prev();
    }
  }, [next, prev]);

  // Auto-play
  useEffect(() => {
    if (isModalOpen) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1));
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [maxIndex, isModalOpen, isHovered, autoPlayMs, pauseOnHover]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
        return;
      }

      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInView) return;

      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, isModalOpen, closeModal]);

  return {
    index,
    setIndex,
    isModalOpen,
    isHovered,
    setIsHovered,
    dragOffset,
    maxIndex,
    wrapperRef,
    next,
    prev,
    closeModal,
    openModal,
    handleCardClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
