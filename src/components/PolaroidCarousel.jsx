import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { sharedStyles as SS } from './carouselStyles';
import useCarousel from './useCarousel';

function getCardSize() {
  if (typeof window === 'undefined') return { w: 220, h: 300 };
  const vw = window.innerWidth;
  if (vw < 400) return { w: 170, h: 240 };
  if (vw < 640) return { w: 195, h: 270 };
  return { w: 220, h: 300 };
}

function getSpacing() {
  if (typeof window === 'undefined') return 190;
  return window.innerWidth < 640 ? 140 : 190;
}

function buildTransform(distance, flipped, dragOffset = 0) {
  const spacing = getSpacing();
  const scale = Math.max(1 - Math.abs(distance) * 0.12, 0.72);
  const rotateY = (flipped ? 180 : 0) + distance * -15;
  const translateZ = -Math.abs(distance) * 90;
  const translateX = distance * spacing + dragOffset;
  return `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
}

export default function PolaroidCarousel({ items = [] }) {
  const [modalFlipped, setModalFlipped] = useState(false);
  const [cardSize, setCardSize] = useState(getCardSize());

  const carousel = useCarousel(items.length, { autoPlayMs: 4500 });
  const {
    index, setIndex, isModalOpen, dragOffset, maxIndex, wrapperRef,
    next, prev, handleCardClick: baseHandleCardClick,
    onTouchStart, onTouchMove, onTouchEnd,
  } = carousel;

  useEffect(() => {
    const handleResize = () => setCardSize(getCardSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeModal = useCallback(() => {
    carousel.closeModal();
    setTimeout(() => setModalFlipped(false), 300);
  }, [carousel]);

  const handleCardClick = useCallback((distance) => {
    if (distance === 0) {
      carousel.openModal();
      setModalFlipped(false);
    } else {
      baseHandleCardClick(distance);
    }
  }, [carousel, baseHandleCardClick]);

  const S = {
    cardOuter: (distance, flipped) => ({
      width: `${cardSize.w}px`,
      height: `${cardSize.h}px`,
      position: 'absolute',
      transformStyle: 'preserve-3d',
      transition: dragOffset !== 0
        ? 'opacity 0.2s ease'
        : 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
      transform: buildTransform(distance, flipped, dragOffset),
      opacity: Math.abs(distance) > 2 ? 0 : Math.abs(distance) > 1 ? 0.55 : 1,
      zIndex: 50 - Math.abs(distance),
      cursor: distance === 0 ? 'pointer' : 'default',
      WebkitTapHighlightColor: 'transparent',
    }),
    face: (isBack) => ({
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
      background: '#fff',
      borderRadius: '4px',
      padding: `8px 8px ${cardSize.h < 270 ? '36px' : '44px'} 8px`,
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
    }),
    photo: {
      width: '100%',
      flex: 1,
      objectFit: 'cover',
      display: 'block',
      borderRadius: '2px',
      minHeight: 0,
    },
    caption: {
      position: 'absolute',
      bottom: '8px',
      left: '10px',
      right: '10px',
      textAlign: 'center',
      color: '#333',
      fontFamily: "'Dancing Script', cursive",
      fontSize: cardSize.w < 195 ? '17px' : '21px',
      lineHeight: 1,
      display: 'block',
      pointerEvents: 'none',
    },
    modalCardOuter: (isOpen) => ({
      width: 'min(85vw, 400px)',
      position: 'relative',
      perspective: '1200px',
      transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(40px)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    }),
    modalCardInner: (flipped) => ({
      width: '100%',
      position: 'relative',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      cursor: 'pointer',
    }),
    modalHint: {
      position: 'absolute',
      bottom: '-36px',
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '12px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      pointerEvents: 'none',
    },
  };

  return (
    <div
      ref={wrapperRef}
      style={SS.wrapper}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={SS.track}>
        {items.map((item, i) => {
          const distance = i - index;
          return (
            <div key={i} style={S.cardOuter(distance, false)} onClick={() => handleCardClick(distance)}>
              <div style={S.face(false)}>
                <img src={item.srcFront} alt={item.caption} style={S.photo} draggable={false} />
                <span style={S.caption}>{item.caption}</span>
              </div>
              <div style={S.face(true)}>
                <img src={item.srcBack} alt={`${item.caption} — verso`} style={S.photo} draggable={false} />
                <span style={S.caption}>❤️</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={SS.controls}>
        <button style={SS.btnBase(index === 0)} disabled={index === 0} onClick={prev} aria-label="Anterior">←</button>
        <div style={SS.dots}>
          {items.map((_, i) => (
            <div key={i} style={SS.dot(i === index)} onClick={() => setIndex(i)} />
          ))}
        </div>
        <button style={SS.btnBase(index === maxIndex)} disabled={index === maxIndex} onClick={next} aria-label="Próximo">→</button>
      </div>

      <p style={SS.hint()}>toque na foto para ampliar ✦ arraste para navegar</p>

      {typeof document !== 'undefined' && createPortal(
        <div
          style={SS.modalOverlay(isModalOpen)}
          onClick={closeModal}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {isModalOpen && <button style={SS.modalCloseBtn} onClick={closeModal}>×</button>}
          <div
            style={S.modalCardOuter(isModalOpen)}
            onClick={(e) => { e.stopPropagation(); setModalFlipped(f => !f); }}
          >
            <div style={S.modalCardInner(modalFlipped)}>
              <div style={{ visibility: 'hidden', padding: '8px 8px 44px 8px', display: 'flex', flexDirection: 'column' }}>
                <img src={modalFlipped ? items[index]?.srcBack : items[index]?.srcFront} style={{ width: '100%', height: 'auto', display: 'block' }} alt="" />
              </div>
              <div style={S.face(false)}>
                <img src={items[index]?.srcFront} alt={items[index]?.caption} style={{ ...S.photo, objectFit: 'contain' }} />
                <span style={S.caption}>{items[index]?.caption}</span>
              </div>
              <div style={S.face(true)}>
                <img src={items[index]?.srcBack} alt={`${items[index]?.caption} — verso`} style={{ ...S.photo, objectFit: 'contain' }} />
                <span style={S.caption}>❤️</span>
              </div>
            </div>
            <p style={S.modalHint}>toque na foto para virar</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
