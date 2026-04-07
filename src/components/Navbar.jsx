import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';

// Ícone hamburger SVG puro — sem dependência de lib, garantia de renderização
function HamburgerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkBase = "transition-colors duration-200 px-4 py-2 rounded-full text-sm font-medium tracking-wide";
  const getLinkClasses = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-purple-700/20 text-purple-400`
      : `${linkBase} text-gray-400 hover:text-purple-300 hover:bg-white/5`;

  const mobileLinkBase = "block w-full text-center py-3 px-6 rounded-xl text-base font-medium tracking-wide transition-colors duration-200";
  const getMobileLinkClasses = ({ isActive }) =>
    isActive
      ? `${mobileLinkBase} bg-purple-700/20 text-purple-400`
      : `${mobileLinkBase} text-gray-300 active:bg-white/10`;

  return (
    <>
      <nav
        className="fixed w-full top-0 z-50 border-b border-purple-900/30"
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <NavLink to="/perfis" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
            <Heart size={22} className="fill-purple-500/50" />
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider">J & V</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex gap-2">
            <NavLink to="/perfis" className={getLinkClasses}>Perfis</NavLink>
            <NavLink to="/galeria" className={getLinkClasses}>Álbum</NavLink>
            <NavLink to="/pets" className={getLinkClasses}>Eles</NavLink>
            <NavLink to="/para-nos" className={getLinkClasses}>Para Nós</NavLink>
            <NavLink to="/trofeus" className={getLinkClasses}>Troféus</NavLink>
          </div>

          {/* Mobile hamburger — SVG puro inline para garantir renderização */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              padding: 0,
            }}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay — sem backdrop-blur */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-16 left-0 right-0 z-50 md:hidden"
        style={{
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <div
          className="mx-3 mt-2 p-3 rounded-2xl flex flex-col gap-1"
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.97)',
            border: '1px solid rgba(88, 28, 135, 0.4)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          <NavLink to="/perfis" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Perfis</NavLink>
          <NavLink to="/galeria" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Álbum</NavLink>
          <NavLink to="/pets" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Eles</NavLink>
          <NavLink to="/para-nos" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Para Nós</NavLink>
          <NavLink to="/trofeus" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Troféus</NavLink>
        </div>
      </div>
    </>
  );
}
