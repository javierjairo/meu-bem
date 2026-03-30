import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';
import PolaroidCarousel from '../components/PolaroidCarousel';
import { Clapperboard, Moon, Music2, Heart } from 'lucide-react';

const ICON_MAP = {
  person1: [Clapperboard, Moon],
  person2: [Music2, Heart],
};

function PersonSection({ personKey, personData, individualData }) {
  const icons = ICON_MAP[personKey];

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-serif text-xl sm:text-2xl text-purple-200 mb-4 sm:mb-6 drop-shadow-md">{personData.name} curte...</h3>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
        {individualData.tags.map((tag, i) => {
          const Icon = icons[i] || icons[0];
          return (
            <span key={i} className="px-4 sm:px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-purple-500/30 text-gray-200 text-xs sm:text-sm flex items-center gap-2 active:bg-purple-900/30 sm:hover:bg-purple-900/30 sm:hover:border-purple-400/50 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Icon size={14} className="text-purple-400 sm:w-4 sm:h-4" /> {tag}
            </span>
          );
        })}
      </div>

      <div className="favs-grid flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 w-full">
        {individualData.favorites.map((fav, i) => (
          <div key={i} className={`fav-item relative w-36 sm:w-40 md:w-48 ${fav.rotation}`}
            style={{ background: '#fff', padding: '8px 8px 32px 8px', boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)' }}>
            <div className="overflow-hidden bg-black/10" style={{ aspectRatio: '3/4' }}>
              <img src={fav.src} alt={fav.caption} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" draggable={false} />
            </div>
            <p className="text-center mt-1.5 sm:mt-2 text-gray-700 break-words leading-snug"
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: '14px' }}>
              {fav.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ParaNos() {
  const { shared, individual } = mockData.paraNos;
  const { person1, person2 } = mockData.profiles;

  return (
    <div className="w-full animate-fadeIn pb-8 sm:pb-12">
      <SectionTitle title="Para Nós" subtitle="Algumas pequenas fofuras pra você meu bem" />

      <div className="mt-8 sm:mt-12 mb-16 sm:mb-24 slide-up px-1 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4 mb-10 sm:mb-14 max-w-xl mx-auto px-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30"></div>
          <h3 className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-purple-300/70 whitespace-nowrap font-medium">
            se ficou gag uma vez... que tal outra?
          </h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30"></div>
        </div>
        <PolaroidCarousel items={shared} />
      </div>

      <div className="mt-12 sm:mt-16 slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-serif text-2xl sm:text-3xl text-center title-text mb-10 sm:mb-16">
          Nossas Obsessões
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-8 relative">
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

          <PersonSection personKey="person1" personData={person1} individualData={individual.person1} />

          <div className="mt-4 sm:mt-8 lg:mt-0">
            <PersonSection personKey="person2" personData={person2} individualData={individual.person2} />
          </div>
        </div>
      </div>
    </div>
  );
}
