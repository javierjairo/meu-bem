import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sharedStyles as SS } from './carouselStyles';
import useCarousel from './useCarousel';

function getCardSize() {
  if (typeof window === 'undefined') return { w: 260, h: 340 };
  const vw = window.innerWidth;
  if (vw < 400) return { w: 200, h: 270 };
  if (vw < 640) return { w: 230, h: 300 };
  return { w: 260, h: 340 };
}

function getSpacing() {
  if (typeof window === 'undefined') return 210;
  return window.innerWidth < 640 ? 160 : 210;
}

function buildTransform(distance, dragOffset = 0) {
  const spacing = getSpacing();
  const scale = Math.max(1 - Math.abs(distance) * 0.15, 0.5);
  const translateX = distance * spacing + dragOffset;
  const rotateY = distance * -14;
  const translateZ = -Math.abs(distance) * 90;
  return `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
}

export default function GalleryCarousel({ items = [] }) {
  const {
    index, setIndex, isModalOpen, isHovered, setIsHovered,
    dragOffset, maxIndex, wrapperRef, next, prev, closeModal,
    handleCardClick, onTouchStart, onTouchMove, onTouchEnd,
  } = useCarousel(items.length, { autoPlayMs: 4000, pauseOnHover: true });

  const [cardSize, setCardSize] = useState(getCardSize());
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const audioRefs = useRef({});
  const isModalOpenRef = useRef(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const handleResize = () => setCardSize(getCardSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  const playAudio = useCallback((id) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio && audio !== audioRefs.current[id]) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    const audio = audioRefs.current[id];
    if (audio) audio.play().catch(() => {});
  }, []);

  const pauseAudio = useCallback((id) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const currentId = items[index]?.id;
    if (!currentId) return;
    if (isModalOpen) playAudio(currentId);
    else pauseAudio(currentId);
  }, [isModalOpen, index, items, playAudio, pauseAudio]);

  const handleMouseEnter = (id) => {
    if (!isModalOpenRef.current) playAudio(id);
  };

  const handleMouseLeave = (id) => {
    if (!isModalOpenRef.current) pauseAudio(id);
  };

  // Em mobile, tocar no card central toca o áudio; segundo toque abre modal
  const handleCardTap = useCallback((distance, id) => {
    if (isTouchDevice && distance === 0) {
      const audio = audioRefs.current[id];
      if (audio && audio.paused) {
        playAudio(id);
        return;
      }
    }
    handleCardClick(distance);
  }, [isTouchDevice, handleCardClick, playAudio]);

  const S = {
    cardOuter: (distance) => ({
      width: `${cardSize.w}px`,
      height: `${cardSize.h}px`,
      position: 'absolute',
      transformStyle: 'preserve-3d',
      transition: dragOffset !== 0
        ? 'opacity 0.2s ease'
        : 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
      transform: buildTransform(distance, dragOffset),
      opacity: Math.abs(distance) > 3 ? 0 : Math.abs(distance) > 2 ? 0.3 : Math.abs(distance) > 1 ? 0.7 : 1,
      zIndex: 50 - Math.abs(distance),
      cursor: distance === 0 ? 'pointer' : 'default',
      WebkitTapHighlightColor: 'transparent',
    }),
    face: {
      position: 'absolute',
      inset: 0,
      background: '#fff',
      borderRadius: '4px',
      padding: `10px 10px ${cardSize.h < 300 ? '50px' : '65px'} 10px`,
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'translateZ(1px)',
    },
    photo: {
      width: '100%',
      flex: 1,
      objectFit: 'cover',
      display: 'block',
      borderRadius: '2px',
      minHeight: 0,
    },
    captionContainer: {
      position: 'absolute',
      bottom: '8px',
      left: '10px',
      right: '10px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: cardSize.h < 300 ? '40px' : '50px',
    },
    caption: {
      color: '#333',
      fontFamily: "'Dancing Script', cursive",
      fontSize: cardSize.w < 230 ? '17px' : '21px',
      lineHeight: 1,
      display: 'block',
    },
    date: {
      color: '#888',
      fontSize: '11px',
      letterSpacing: '0.05em',
      marginTop: '3px',
      display: 'block',
    },
    modalCardOuter: (isOpen) => ({
      width: 'min(85vw, 360px)',
      height: 'min(75vh, 500px)',
      position: 'relative',
      transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(40px)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    }),
  };

  const hintText = isTouchDevice
    ? 'toque para ouvir ✦ toque novamente para ampliar'
    : 'passe o mouse para ouvir ✦ clique para ampliar';

  return (
    <div
      ref={wrapperRef}
      style={SS.wrapper}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.map((item) =>
        item.audio && (
          <audio key={`audio-${item.id}`} ref={el => audioRefs.current[item.id] = el} src={item.audio} loop />
        )
      )}

      <div style={SS.track}>
        {items.map((item, i) => {
          const distance = i - index;
          return (
            <div
              key={item.id}
              style={S.cardOuter(distance)}
              onClick={() => handleCardTap(distance, item.id)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
            >
              <div style={S.face}>
                <img src={item.src} alt={item.caption} style={S.photo} loading="lazy" draggable={false} />
                <div style={S.captionContainer}>
                  <span style={S.caption}>{item.caption}</span>
                  {item.date && <span style={S.date}>{item.date}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={SS.controls}>
        <button style={SS.btnBase(index === 0)} disabled={index === 0} onClick={prev}>←</button>
        <div style={SS.dots}>
          {items.map((_, i) => (
            <div key={`dot-${items[i].id}`} style={SS.dot(i === index)} onClick={() => setIndex(i)} title={items[i].caption} />
          ))}
        </div>
        <button style={SS.btnBase(index === maxIndex)} disabled={index === maxIndex} onClick={next}>→</button>
      </div>

      <p style={SS.hint(isTouchDevice)}>{hintText}</p>

      {typeof document !== 'undefined' && createPortal(
        <div
          style={SS.modalOverlay(isModalOpen)}
          onClick={closeModal}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {isModalOpen && <button style={SS.modalCloseBtn} onClick={closeModal}>×</button>}
          <div style={S.modalCardOuter(isModalOpen)} onClick={(e) => e.stopPropagation()}>
            <div style={S.face}>
              <img src={items[index]?.src} alt={items[index]?.caption} style={S.photo} />
              <div style={S.captionContainer}>
                <span style={S.caption}>{items[index]?.caption}</span>
                {items[index]?.date && <span style={S.date}>{items[index]?.date}</span>}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
