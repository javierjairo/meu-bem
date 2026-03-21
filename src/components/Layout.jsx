import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground'; // Importando as partículas

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-gray-200 relative">
      <ParticleBackground />
      
      {/* O Navbar agora deve estar "na frente" com z-index */}
      <div className="relative z-50">
        <Navbar />
      </div>
      
      {/* Container principal para o conteúdo dinâmico com z-index para ficar sobre as estrelas */}
      <main className="flex-grow pt-28 pb-12 px-6 max-w-5xl mx-auto w-full fade-in relative z-10">
        <Outlet />
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
