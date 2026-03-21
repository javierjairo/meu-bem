import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

/* ─── estilos inline para não depender do Tailwind arbitrário ─── */
const S = {
  wrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    padding: '40px 0 60px',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
    perspectiveOrigin: '50% 50%',
    minHeight: '440px',
    position: 'relative',
  },
  cardOuter: (distance, flipped) => ({
    width: '220px',
    height: '300px',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease, z-index 0s',
    transform: buildTransform(distance, flipped),
    opacity: Math.abs(distance) > 2 ? 0 : Math.abs(distance) > 1 ? 0.55 : 1,
    zIndex: 50 - Math.abs(distance),
    cursor: distance === 0 ? 'pointer' : 'default',
  }),
  face: (isBack) => ({
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
    background: '#fff',
    borderRadius: '4px',
    padding: '10px 10px 44px 10px',
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
    color: '#4a4a4a',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '18px',
    lineHeight: 1.2,
    pointerEvents: 'none',
  },
  btnBase: (disabled) => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(168,85,247,0.08)',
    color: disabled ? 'rgba(168,85,247,0.25)' : 'rgba(216,180,254,0.9)',
    fontSize: '18px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, color 0.2s',
    backdropFilter: 'blur(4px)',
  }),
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px',
  },
  dots: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  dot: (active) => ({
    width: active ? '20px' : '6px',
    height: '6px',
    borderRadius: '9999px',
    background: active ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(168,85,247,0.3)',
    transition: 'all 0.35s ease',
  }),
  hint: {
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: 'rgba(216,180,254,0.45)',
    textTransform: 'uppercase',
  },
  modalOverlay: (isOpen) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.4s ease',
  }),
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
  modalCloseBtn: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    color: 'white',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
    zIndex: 10000,
  },
  modalHint: {
    position: 'absolute',
    bottom: '-40px',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
  }
};

function buildTransform(distance, flipped) {
  const scale = Math.max(1 - Math.abs(distance) * 0.12, 0.72);
  const rotateY = (flipped ? 180 : 0) + distance * -15; // virar pro centro (negativo)
  const translateZ = -Math.abs(distance) * 90;
  const translateX = distance * 190;
  return `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
}

export default function PolaroidCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFlipped, setModalFlipped] = useState(false);
  
  const touchStart = useRef(null);
  const wrapperRef = useRef(null);

  const maxIndex = items.length - 1;

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setModalFlipped(false), 300);
  }, []);

  const next = useCallback(() => {
    setIndex(i => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setIndex(i => Math.max(i - 1, 0));
  }, []);

  const handleCardClick = (distance) => {
    if (distance === 0) {
      setIsModalOpen(true);
      setModalFlipped(false);
    } else if (distance > 0) {
      next();
    } else {
      prev();
    }
  };

  /* ── swipe ── */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  /* ── auto-play ── */
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [maxIndex, isModalOpen]);

  /* ── teclado ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Se o modal estiver aberto, apenas ouve o "Esc" para fechar
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
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

  return (
    <div ref={wrapperRef} style={S.wrapper} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Track */}
      <div style={S.track}>
        {items.map((item, i) => {
          const distance = i - index;
          const isActive = distance === 0;
          return (
            <div
              key={i}
              style={S.cardOuter(distance, false)}
              onClick={() => handleCardClick(distance)}
            >
              {/* No track apenas a foto frontal aparece */}
              <div style={S.face(false)}>
                <img src={item.srcFront} alt={item.caption} style={S.photo} />
                <span style={S.caption}>{item.caption}</span>
              </div>
              <div style={S.face(true)}>
                <img src={item.srcBack} alt={`${item.caption} — verso`} style={S.photo} />
                <span style={S.caption}>❤️</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div style={S.controls}>
        <button
          style={S.btnBase(index === 0)}
          disabled={index === 0}
          onClick={prev}
          aria-label="Anterior"
        >
          ←
        </button>

        <div style={S.dots}>
          {items.map((_, i) => (
            <div key={i} style={S.dot(i === index)} onClick={() => { setIndex(i); }} />
          ))}
        </div>

        <button
          style={S.btnBase(index === maxIndex)}
          disabled={index === maxIndex}
          onClick={next}
          aria-label="Próximo"
        >
          →
        </button>
      </div>

      <p style={S.hint}>clique na foto para ampliar ✦ arraste para navegar</p>

      {/* MODAL ── renderedizado na raiz do documento via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <div 
          style={S.modalOverlay(isModalOpen)} 
          onClick={closeModal}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {isModalOpen && <button style={S.modalCloseBtn} onClick={closeModal}>×</button>}
          
          <div 
            style={S.modalCardOuter(isModalOpen)} 
            onClick={(e) => {
              e.stopPropagation();
              setModalFlipped(f => !f);
            }}
          >
            <div style={S.modalCardInner(modalFlipped)}>
              {/* Dummy container to perfectly size the modal polaroid to the current image's aspect ratio */}
              <div style={{ visibility: 'hidden', padding: '10px 10px 44px 10px', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={modalFlipped ? items[index]?.srcBack : items[index]?.srcFront} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                  alt="" 
                />
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
            <p style={S.modalHint}>clique na foto para virar</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
