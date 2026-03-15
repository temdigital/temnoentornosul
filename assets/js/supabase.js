// Configuração do Supabase
// IMPORTANTE: Substitua pelas suas credenciais reais!
const SUPABASE_URL = 'https://flidbkfrfosuahgphiza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mCBYSpZc45Pw345wZ1coEA_rYL61Ea8';

// Inicializa o cliente Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cache local
const cache = {
    publicacoes: null,
    eventos: null,
    empresas: null,
    timestamp: null,
    expiryTime: 5 * 60 * 1000 // 5 minutos
};

function isCacheValid() {
    if (!cache.timestamp) return false;
    const now = new Date().getTime();
    return (now - cache.timestamp) < cache.expiryTime;
}

// Busca publicações
async function fetchPublicacoes(limit = 6) {
    try {
        if (isCacheValid() && cache.publicacoes) {
            return cache.publicacoes.slice(0, limit);
        }

        const { data, error } = await supabase
            .from('publicacoes')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) throw error;

        cache.publicacoes = data;
        cache.timestamp = new Date().getTime();

        return data || [];
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return [];
    }
}

// Busca eventos
async function fetchEventos(limit = 3) {
    try {
        if (isCacheValid() && cache.eventos) {
            return cache.eventos.slice(0, limit);
        }

        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) throw error;

        cache.eventos = data;
        cache.timestamp = new Date().getTime();

        return data || [];
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        return [];
    }
}

// Busca empresas
async function fetchEmpresas(limit = 6) {
    try {
        if (isCacheValid() && cache.empresas) {
            return cache.empresas.slice(0, limit);
        }

        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) throw error;

        cache.empresas = data;
        cache.timestamp = new Date().getTime();

        return data || [];
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        return [];
    }
}

// Busca estatísticas
async function fetchStats() {
    try {
        const [pub, evt, emp] = await Promise.all([
            supabase.from('publicacoes').select('*', { count: 'exact', head: true }),
            supabase.from('eventos').select('*', { count: 'exact', head: true }),
            supabase.from('empresas').select('*', { count: 'exact', head: true })
        ]);

        return {
            publicacoes: pub.count || 0,
            eventos: evt.count || 0,
            empresas: emp.count || 0
        };
    } catch (error) {
        console.error('Erro ao buscar stats:', error);
        return { publicacoes: 0, eventos: 0, empresas: 0 };
    }
}