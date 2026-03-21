import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';
import PolaroidCarousel from '../components/PolaroidCarousel';
import { Clapperboard, Moon, Music2, Heart } from 'lucide-react';

export default function ParaNos() {
  const { shared, individual } = mockData.paraNos;
  const { person1, person2 } = mockData.profiles;



  return (
    <div className="w-full animate-fadeIn pb-12">
      <SectionTitle title="Para Nós" subtitle="Algumas pequenas fofuras pra você meu bem" />

      {/* Para Nós Compartilhados - Cards estilo designer */}
      <div className="mt-12 mb-24 slide-up px-4">
        <div className="flex items-center gap-4 mb-14 max-w-xl mx-auto">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30"></div>
          <h3 className="text-xs tracking-[0.3em] uppercase text-purple-300/70 whitespace-nowrap font-medium">
            se ficou gag uma vez... que tal outra?
          </h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30"></div>
        </div>

        <PolaroidCarousel items={shared} />
      </div>

      {/* Individuais & Favoritos */}
      <div className="mt-16 slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-serif text-3xl text-center title-text mb-16">
          Nossas Obsessões
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 relative">
          {/* Divisor vertical sutil no meio apenas no desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

          {/* Pessoa 1 */}
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-2xl text-purple-200 mb-6 drop-shadow-md">{person1.name} curte...</h3>

            {/* Tags flutuantes / "Bolhas" */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {individual.person1.tags.map((tag, i) => (
                <span key={i} className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-purple-500/30 text-gray-200 text-sm flex items-center gap-2 hover:bg-purple-900/30 hover:border-purple-400/50 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  {i === 0 ? <Clapperboard size={16} className="text-purple-400" /> : <Moon size={16} className="text-purple-400" />} {tag}
                </span>
              ))}
            </div>

            {/* Mural de Favoritos da Pessoa 1 */}
            <div className="favs-grid flex flex-wrap justify-center gap-6 md:gap-8 px-4 w-full">
              {individual.person1.favorites.map((fav, i) => (
                <div key={i} className={`fav-item relative w-40 sm:w-48 ${fav.rotation}`}
                  style={{ background: '#fff', padding: '10px 10px 36px 10px', boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)' }}>
                  <div className="overflow-hidden bg-black/10" style={{ aspectRatio: '3/4' }}>
                    <img src={fav.src} alt={fav.caption} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <p className="text-center mt-2 text-gray-700 break-words leading-snug"
                    style={{ fontFamily: "'Dancing Script', cursive", fontSize: '16px' }}>
                    {fav.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pessoa 2 */}
          <div className="flex flex-col items-center mt-8 lg:mt-0">
            <h3 className="font-serif text-2xl text-purple-200 mb-6 drop-shadow-md">{person2.name} curte...</h3>

            {/* Tags flutuantes / "Bolhas" */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {individual.person2.tags.map((tag, i) => (
                <span key={i} className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-purple-500/30 text-gray-200 text-sm flex items-center gap-2 hover:bg-purple-900/30 hover:border-purple-400/50 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  {i === 0 ? <Music2 size={16} className="text-purple-400" /> : <Heart size={16} className="text-purple-400" />} {tag}
                </span>
              ))}
            </div>

            {/* Mural de Favoritos da Pessoa 2 */}
            <div className="favs-grid flex flex-wrap justify-center gap-6 md:gap-8 px-4 w-full">
              {individual.person2.favorites.map((fav, i) => (
                <div key={i} className={`fav-item relative w-40 sm:w-48 ${fav.rotation}`}
                  style={{ background: '#fff', padding: '10px 10px 36px 10px', boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)' }}>
                  <div className="overflow-hidden bg-black/10" style={{ aspectRatio: '3/4' }}>
                    <img src={fav.src} alt={fav.caption} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <p className="text-center mt-2 text-gray-700 break-words leading-snug"
                    style={{ fontFamily: "'Dancing Script', cursive", fontSize: '16px' }}>
                    {fav.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
