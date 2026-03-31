import { createClient } from '@supabase/supabase-js';

// ⚠️ SUBSTITUIR pelos valores reais do seu projeto Supabase
// Encontre em: Supabase Dashboard → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Flag para saber se o Supabase está configurado
export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Criar client mesmo vazio (evita crash na importação)
export const supabase = supabaseConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
