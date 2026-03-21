import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  cardOuter: (distance) => ({
    width: '260px',
    height: '340px',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease, z-index 0s',
    transform: buildTransform(distance),
    opacity: Math.abs(distance) > 3 ? 0 : Math.abs(distance) > 2 ? 0.3 : Math.abs(distance) > 1 ? 0.7 : 1,
    zIndex: 50 - Math.abs(distance),
    cursor: distance === 0 ? 'pointer' : 'default',
  }),
  face: {
    position: 'absolute',
    inset: 0,
    background: '#fff',
    borderRadius: '4px',
    padding: '12px 12px 65px 12px',
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
    bottom: '10px',
    left: '12px',
    right: '12px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
  },
  caption: {
    color: '#333',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '21px',
    lineHeight: 1,
    display: 'block',
  },
  date: {
    color: '#888',
    fontSize: '12px',
    letterSpacing: '0.05em',
    marginTop: '4px',
    display: 'block',
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
    flexWrap: 'wrap',
  },
  dots: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '60%',
    justifyContent: 'center'
  },
  dot: (active) => ({
    width: active ? '16px' : '6px',
    height: '6px',
    borderRadius: '9999px',
    background: active ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(168,85,247,0.3)',
    transition: 'all 0.35s ease',
    cursor: 'pointer'
  }),
  hint: {
    textAlign: 'center',
    marginTop: '20px',
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
    width: '360px',
    height: '500px',
    position: 'relative',
    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(40px)',
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
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
};

function buildTransform(distance) {
  const scale = Math.max(1 - Math.abs(distance) * 0.15, 0.5);
  const translateX = distance * 210;
  const rotateY = distance * -14; 
  const translateZ = -Math.abs(distance) * 90;
  return `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
}

export default function GalleryCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const audioRefs = useRef({});
  const touchStart = useRef(null);
  const wrapperRef = useRef(null);
  const isModalOpenRef = useRef(false);

  const maxIndex = items.length - 1;

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
    if (audio) {
      audio.play().catch(e => console.log('Audio error:', e));
    }
  }, []);

  const pauseAudio = useCallback((id) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // Sync Modal Audio & Stop when closed
  useEffect(() => {
    if (items.length === 0) return;
    const currentId = items[index]?.id;
    if (!currentId) return;

    if (isModalOpen) {
      playAudio(currentId);
    } else {
      pauseAudio(currentId);
    }
  }, [isModalOpen, index, items, playAudio, pauseAudio]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
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
    } else if (distance > 0) {
      next();
    } else {
      prev();
    }
  };

  const handleMouseEnter = (id) => {
    if (!isModalOpenRef.current) playAudio(id);
  };

  const handleMouseLeave = (id) => {
    if (!isModalOpenRef.current) pauseAudio(id);
  };

  /* ── swipe ── */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  /* ── auto-play (paused on hover/modal) ── */
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isModalOpen || isHovered) return;
    const timer = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1));
    }, 4000); // tempo de auto-play
    return () => clearInterval(timer);
  }, [maxIndex, isModalOpen, isHovered]);

  /* ── teclado ── */
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

  return (
    <div 
      ref={wrapperRef} 
      style={S.wrapper} 
      onTouchStart={onTouchStart} 
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Elementos de Áudio Ocultos */}
      {items.map((item) => (
        item.audio && (
          <audio 
            key={`audio-${item.id}`} 
            ref={el => audioRefs.current[item.id] = el} 
            src={item.audio} 
            loop 
          />
        )
      ))}

      {/* Track */}
      <div style={S.track}>
        {items.map((item, i) => {
          const distance = i - index;
          return (
            <div
              key={item.id}
              style={S.cardOuter(distance)}
              onClick={() => handleCardClick(distance)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
            >
              <div style={S.face}>
                <img src={item.src} alt={item.caption} style={S.photo} loading="lazy" />
                <div style={S.captionContainer}>
                  <span style={S.caption}>{item.caption}</span>
                  {item.date && <span style={S.date}>{item.date}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div style={S.controls}>
        <button style={S.btnBase(index === 0)} disabled={index === 0} onClick={prev}>←</button>
        <div style={S.dots}>
          {items.map((_, i) => (
            <div key={`dot-${items[i].id}`} style={S.dot(i === index)} onClick={() => setIndex(i)} title={items[i].caption} />
          ))}
        </div>
        <button style={S.btnBase(index === maxIndex)} disabled={index === maxIndex} onClick={next}>→</button>
      </div>

      <p style={S.hint}>passe o mouse para ouvir ✦ clique para ampliar</p>

      {/* MODAL */}
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
            onClick={(e) => e.stopPropagation()}
          >
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
