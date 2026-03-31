import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function CapsuleLogin() {
  const { login, cadastrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'login') {
        await login(email, senha);
      } else {
        await cadastrar(email, senha);
        setErro('');
        setModo('login');
        alert('Conta criada! Agora faça login.');
      }
    } catch (err) {
      const msg = err?.message || 'Algo deu errado';
      if (msg.includes('Invalid login')) setErro('Email ou senha incorretos');
      else if (msg.includes('already registered')) setErro('Esse email já está cadastrado');
      else if (msg.includes('Password should')) setErro('A senha precisa ter pelo menos 6 caracteres');
      else setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e5e7eb',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: '360px', margin: '0 auto' }}>
      {/* Ícone de cadeado */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>

      <p style={{
        fontSize: '13px',
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: '20px',
        lineHeight: 1.5,
      }}>
        {modo === 'login'
          ? 'Entre com sua conta para acessar as cápsulas'
          : 'Crie sua conta para participar'
        }
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
        />

        {erro && (
          <p style={{
            fontSize: '12px',
            color: '#f87171',
            textAlign: 'center',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(248, 113, 113, 0.1)',
            margin: 0,
          }}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: '12px',
            borderRadius: '9999px',
            border: 'none',
            background: carregando
              ? 'rgba(124, 58, 237, 0.3)'
              : 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: carregando ? 'not-allowed' : 'pointer',
            letterSpacing: '0.03em',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
          }}
        >
          {carregando
            ? '...'
            : modo === 'login' ? 'Entrar' : 'Criar Conta'
          }
        </button>
      </form>

      <button
        onClick={() => { setModo(m => m === 'login' ? 'cadastro' : 'login'); setErro(''); }}
        style={{
          display: 'block',
          width: '100%',
          marginTop: '12px',
          background: 'none',
          border: 'none',
          color: '#a78bfa',
          fontSize: '12px',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        {modo === 'login'
          ? 'Não tem conta? Cadastre-se'
          : 'Já tem conta? Faça login'
        }
      </button>
    </div>
  );
}
