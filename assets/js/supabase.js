// CONFIGURAÇÃO DO SUPABASE
// IMPORTANTE: Substitua pelas suas credenciais reais do Supabase!
const SUPABASE_URL = 'https://flidbkfrfosuahgphiza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mCBYSpZc45Pw345wZ1coEA_rYL61Ea8';

// Inicializa o cliente Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cache local para evitar muitas requisições
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

// Busca publicações do Supabase
async function fetchPublicacoes(limit = 6) {
    try {
        console.log('Buscando publicações do Supabase...');
        
        const { data, error } = await supabase
            .from('publicacoes')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Erro na consulta:', error);
            throw error;
        }

        console.log('Publicações recebidas:', data);
        return data || [];
        
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return [];
    }
}

// Busca eventos do Supabase
async function fetchEventos(limit = 3) {
    try {
        console.log('Buscando eventos do Supabase...');
        
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Erro na consulta:', error);
            throw error;
        }

        console.log('Eventos recebidos:', data);
        return data || [];
        
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        return [];
    }
}

// Busca empresas do Supabase
async function fetchEmpresas(limit = 6) {
    try {
        console.log('Buscando empresas do Supabase...');
        
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Erro na consulta:', error);
            throw error;
        }

        console.log('Empresas recebidas:', data);
        return data || [];
        
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        return [];
    }
}