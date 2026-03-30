import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-gray-200 relative">
      <ParticleBackground />

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-grow pt-20 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 max-w-5xl mx-auto w-full fade-in relative z-10">
        <Outlet />
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
