import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkBase = "transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium tracking-wide";
  const getLinkClasses = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-purple-700/20 text-purple-400`
      : `${linkBase} text-gray-400 hover:text-purple-300 hover:bg-white/5`;

  const mobileLinkBase = "block w-full text-center py-3 px-6 rounded-xl text-base font-medium tracking-wide transition-all duration-300";
  const getMobileLinkClasses = ({ isActive }) =>
    isActive
      ? `${mobileLinkBase} bg-purple-700/20 text-purple-400`
      : `${mobileLinkBase} text-gray-300 active:bg-white/5`;

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-purple-900/30 slide-up">
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
          </div>

          {/* Mobile hamburger — ícone com cor inline para garantir visibilidade */}
          <button
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-full active:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {mobileOpen
              ? <X size={26} color="#d8b4fe" strokeWidth={2.5} />
              : <Menu size={26} color="#d8b4fe" strokeWidth={2.5} />
            }
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-16 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="mx-3 mt-2 p-3 rounded-2xl bg-dark/95 backdrop-blur-xl border border-purple-900/40 shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col gap-1">
          <NavLink to="/perfis" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Perfis</NavLink>
          <NavLink to="/galeria" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Álbum</NavLink>
          <NavLink to="/pets" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Eles</NavLink>
          <NavLink to="/para-nos" className={getMobileLinkClasses} onClick={() => setMobileOpen(false)}>Para Nós</NavLink>
        </div>
      </div>
    </>
  );
}
