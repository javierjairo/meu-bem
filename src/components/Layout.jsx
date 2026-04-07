import { Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import AchievementToast from './AchievementToast';
import AchievementEngine from './AchievementEngine';
import CapsuleLogin from './CapsuleLogin';

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p style={{ fontSize: '13px', fontStyle: 'italic' }}>Carregando...</p>
      </div>
    );
  }

  // Se não está logado, tela de login unificada
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-gray-200 relative">
        <ParticleBackground />

        <div style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '40px', marginBottom: '8px' }}>💜</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#e9d5ff',
              margin: '0 0 4px',
            }}>
              J & V
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(168,132,252,0.5)',
              fontStyle: 'italic',
              letterSpacing: '0.1em',
            }}>
              Nosso Portal de Recordações
            </p>
          </div>

          {/* Login form */}
          <div style={{
            maxWidth: '380px',
            width: '100%',
            padding: '28px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}>
            <CapsuleLogin />
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Logado — app normal
  return (
    <div className="min-h-screen flex flex-col text-gray-200 relative">
      <ParticleBackground />

      <Navbar />

      <main className="flex-grow pt-20 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 max-w-5xl mx-auto w-full fade-in relative z-10">
        <Outlet />
      </main>

      <Footer />

      {/* Sistema de Conquistas — roda em background */}
      <AchievementEngine />
      <AchievementToast />
    </div>
  );
}
