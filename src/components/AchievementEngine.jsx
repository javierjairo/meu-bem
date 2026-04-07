import { useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, supabaseConfigurado } from '../lib/supabaseClient';

const INICIO_NAMORO = new Date('2026-02-14T00:00:00');

/**
 * Motor de conquistas automáticas.
 * Roda silenciosamente ao logar e verifica condições no banco.
 */
export default function AchievementEngine() {
  const { user } = useAuth();

  const verificarConquistas = useCallback(async () => {
    if (!user || !supabaseConfigurado) return;

    try {
      // Buscar catálogo e desbloqueios do user
      const [resCatalogo, resDesbloqueios] = await Promise.all([
        supabase.from('conquistas').select('id_conquista, titulo'),
        supabase.from('conquistas_usuario').select('id_conquista').eq('usuario_id', user.id),
      ]);

      if (resCatalogo.error || resDesbloqueios.error) return;

      const catalogo = resCatalogo.data || [];
      const jaDesbloqueadas = new Set((resDesbloqueios.data || []).map(d => d.id_conquista));

      // Helper: encontra conquista por titulo e verifica se já foi ganha
      const checar = (titulo) => {
        const c = catalogo.find(x => x.titulo === titulo);
        if (!c) return null;
        if (jaDesbloqueadas.has(c.id_conquista)) return null;
        return c.id_conquista;
      };

      const novasConquistas = [];

      // ============================
      // 1. PRIMEIRO LOGIN
      // Se o user está logado e nunca ganhou, ganha agora
      // ============================
      const idPrimeiroLogin = checar('Primeiro Login');
      if (idPrimeiroLogin) {
        novasConquistas.push(idPrimeiroLogin);
      }

      // ============================
      // 2. PRIMEIRA CÁPSULA
      // Verifica se existe pelo menos 1 cápsula criada pelo user
      // ============================
      const idPrimeiraCap = checar('Primeira Cápsula');
      if (idPrimeiraCap) {
        const { count, error } = await supabase
          .from('capsulas')
          .select('id', { count: 'exact', head: true })
          .eq('criador', user.id);

        if (!error && count > 0) {
          novasConquistas.push(idPrimeiraCap);
        }
      }

      // ============================
      // 3. 100 DIAS JUNTOS
      // Verifica se já passou 100 dias desde 14/02/2026
      // ============================
      const id100Dias = checar('100 Dias Juntos');
      if (id100Dias) {
        const agora = new Date();
        const diffDias = Math.floor((agora - INICIO_NAMORO) / (1000 * 60 * 60 * 24));
        if (diffDias >= 100) {
          novasConquistas.push(id100Dias);
        }
      }

      // Inserir todas as novas conquistas de uma vez
      if (novasConquistas.length > 0) {
        const inserts = novasConquistas.map(id_conquista => ({
          id_conquista,
          usuario_id: user.id,
          notificada: false, // vai disparar o toast
        }));

        await supabase
          .from('conquistas_usuario')
          .upsert(inserts, { onConflict: 'id_conquista,usuario_id', ignoreDuplicates: true });
      }
    } catch (err) {
      console.error('AchievementEngine erro:', err);
    }
  }, [user]);

  useEffect(() => {
    // Roda 3 segundos após o login pra não competir com outros fetches
    const timer = setTimeout(verificarConquistas, 3000);
    return () => clearTimeout(timer);
  }, [verificarConquistas]);

  return null; // componente invisível
}
