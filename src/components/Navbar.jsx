import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Navbar() {
  const linkBase = "transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium tracking-wide";
  const getLinkClasses = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-purple-700/20 text-purple-400`
      : `${linkBase} text-gray-400 hover:text-purple-300 hover:bg-white/5`;

  return (
    <nav className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-purple-900/30 slide-up">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink to="/perfis" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <Heart size={24} className="fill-purple-500/50" />
          <span className="font-serif text-xl font-bold tracking-wider">J & V</span>
        </NavLink>

        <div className="hidden md:flex gap-2">
          <NavLink to="/perfis" className={getLinkClasses}>Perfis</NavLink>
          <NavLink to="/galeria" className={getLinkClasses}>Álbum</NavLink>
          <NavLink to="/pets" className={getLinkClasses}>Eles</NavLink>
          <NavLink to="/para-nos" className={getLinkClasses}>Para Nós</NavLink>
        </div>
      </div>
    </nav>
  );
}
