import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';

export default function Profiles() {
  const { person1, person2 } = mockData.profiles;

  const ProfileCard = ({ person }) => (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl overflow-hidden active:border-purple-500/40 sm:hover:border-purple-500/40 sm:hover:bg-white/10 transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 mb-5 sm:mb-6 rounded-full overflow-hidden border-4 border-purple-900/50 group-hover:border-purple-500/50 transition-all duration-500">
          <img
            src={person.image}
            alt={`Foto de ${person.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            draggable={false}
          />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-100 mb-2 drop-shadow-sm">{person.name}</h3>
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
    </div>
  );
}
