import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';
import EstatisticasInutils from '../components/EstatisticasInutils';

export default function Profiles() {
  const { person1, person2 } = mockData.profiles;

  const ProfileCard = ({ person }) => (
    <div
      className="relative p-5 sm:p-6 md:p-8 rounded-2xl overflow-hidden transition-colors duration-300 sm:hover:border-purple-500/40"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Glow decorativo — só visível em desktop */}
      <div className="hidden sm:block absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 mb-5 sm:mb-6 rounded-full overflow-hidden border-4 border-purple-900/50">
          <img
            src={person.image}
            alt={`Foto de ${person.name}`}
            className="w-full h-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-100 mb-2">{person.name}</h3>
        <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/20 text-purple-200 text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6">
          {person.role}
        </span>

        <p className="text-gray-400 font-light leading-relaxed max-w-sm text-sm sm:text-base">
          {person.bio}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fadeIn">
      <SectionTitle title="Nossos Perfis" subtitle="O melhor casal da historia tem nome" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mt-10 sm:mt-16 slide-up">
        <ProfileCard person={person1} />
        <ProfileCard person={person2} />
      </div>

      <EstatisticasInutils />
    </div>
  );
}
