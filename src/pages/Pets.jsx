import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';

export default function Pets() {
  const pets = mockData.pets;

  return (
    <div className="w-full animate-fadeIn">
      <SectionTitle title="Nossos Amores" subtitle="Nossos amores de quatro patas" />

      <div className="flex flex-col gap-10 sm:gap-12 mt-10 sm:mt-16 slide-up">
        {pets.map((pet, index) => (
          <div
            key={pet.id}
            className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6 sm:gap-8 md:gap-16 group`}
          >
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-700"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>

            <div className={`w-full md:w-1/2 flex flex-col justify-center ${index % 2 !== 0 ? 'md:text-right md:items-end' : 'md:text-left md:items-start'} text-center items-center px-2`}>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-gray-100 mb-2">{pet.name}</h3>
              <p className="text-purple-400 font-medium tracking-wide uppercase text-xs sm:text-sm mb-4 sm:mb-6">
                {pet.type} • {pet.breed}
              </p>

              <div className="w-12 h-px bg-purple-700/50 mb-4 sm:mb-6"></div>

              <p className="text-gray-400 font-light leading-relaxed text-base sm:text-lg max-w-md">
                "{pet.description}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
