/**
 * Configuração do Supabase
 * @author Renato Asse - Desenvolvedor Sênior
 */

// Configurações do Supabase (substitua pelas suas credenciais)
const SUPABASE_URL = 'https://flidbkfrfosuahgphiza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mCBYSpZc45Pw345wZ1coEA_rYL61Ea8';

// Inicializa o cliente Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cache local para evitar requisições desnecessárias
const cache = {
    publicacoes: null,
    eventos: null,
    empresas: null,
    timestamp: null,
    expiryTime: 5 * 60 * 1000 // 5 minutos em millisegundos
};

/**
 * Verifica se o cache é válido
 */
function isCacheValid() {
    if (!cache.timestamp) return false;
    const now = new Date().getTime();
    return (now - cache.timestamp) < cache.expiryTime;
}

/**
 * Busca publicações do Supabase
 */
async function fetchPublicacoes(limit = 6) {
    try {
        // Verifica cache
        if (isCacheValid() && cache.publicacoes) {
            console.log('Usando cache de publicações');
            return cache.publicacoes.slice(0, limit);
        }

        console.log('Buscando publicações do Supabase...');
        
        const { data, error } = await supabase
            .from('publicacoes')
            .select('*')
            .eq('status', 'publicado')
            .order('data_publicacao', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Atualiza cache
        cache.publicacoes = data;
        cache.timestamp = new Date().getTime();

        return data;
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        
        // Fallback para dados locais em caso de erro
        return getFallbackPublicacoes(limit);
    }
}

/**
 * Busca eventos do Supabase
 */
async function fetchEventos(limit = 3) {
    try {
        // Verifica cache
        if (isCacheValid() && cache.eventos) {
            console.log('Usando cache de eventos');
            return cache.eventos.slice(0, limit);
        }

        console.log('Buscando eventos do Supabase...');
        
        const hoje = new Date().toISOString();
        
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .gte('data_inicio', hoje) // Apenas eventos futuros
            .order('data_inicio', { ascending: true })
            .limit(limit);

        if (error) throw error;

        // Atualiza cache
        cache.eventos = data;
        cache.timestamp = new Date().getTime();

        return data;
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        
        // Fallback para dados locais
        return getFallbackEventos(limit);
    }
}

/**
 * Busca empresas do Supabase
 */
async function fetchEmpresas(limit = 6) {
    try {
        // Verifica cache
        if (isCacheValid() && cache.empresas) {
            console.log('Usando cache de empresas');
            return cache.empresas.slice(0, limit);
        }

        console.log('Buscando empresas do Supabase...');
        
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('status', 'ativo')
            .order('nome', { ascending: true })
            .limit(limit);

        if (error) throw error;

        // Atualiza cache
        cache.empresas = data;
        cache.timestamp = new Date().getTime();

        return data;
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        
        // Fallback para dados locais
        return getFallbackEmpresas(limit);
    }
}

/**
 * Busca estatísticas gerais
 */
async function fetchStats() {
    try {
        const [publicacoes, eventos, empresas] = await Promise.all([
            supabase.from('publicacoes').select('*', { count: 'exact', head: true }).eq('status', 'publicado'),
            supabase.from('eventos').select('*', { count: 'exact', head: true }).gte('data_inicio', new Date().toISOString()),
            supabase.from('empresas').select('*', { count: 'exact', head: true }).eq('status', 'ativo')
        ]);

        return {
            publicacoes: publicacoes.count || 0,
            eventos: eventos.count || 0,
            empresas: empresas.count || 0
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return { publicacoes: 0, eventos: 0, empresas: 0 };
    }
}

/**
 * Dados de fallback para quando o Supabase estiver offline
 */
function getFallbackPublicacoes(limit) {
    return [
        {
            id: 1,
            titulo: "Feira do Empreendedor atrai centenas de visitantes",
            resumo: "Evento reuniu mais de 50 expositores no Centro de Convenções com grande sucesso de público.",
            imagem_url: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
            categoria: "Economia",
            data_publicacao: new Date().toISOString()
        },
        {
            id: 2,
            titulo: "Nova praça é inaugurada no Jardim ABC",
            resumo: "Espaço de lazer conta com academia ao ar livre, parquinho e área verde para a comunidade.",
            imagem_url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
            categoria: "Infraestrutura",
            data_publicacao: new Date().toISOString()
        }
    ].slice(0, limit);
}

function getFallbackEventos(limit) {
    return [
        {
            id: 1,
            titulo: "Carnaval 2026",
            descricao: "Durante fevereiro de 2026, com foco na semana do carnaval",
            imagem_url: "https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg",
            local: "Prefeitura Municipal",
            data_inicio: "2026-02-13",
            data_fim: "2026-02-17"
        }
    ].slice(0, limit);
}

function getFallbackEmpresas(limit) {
    return [
        {
            id: 1,
            nome: "Padaria do João",
            categoria: "Padaria",
            telefone: "(61) 99999-9999",
            imagem_url: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
            endereco: "Qd 01, Lt 10 - Valparaíso"
        },
        {
            id: 2,
            nome: "Farmácia Popular",
            categoria: "Farmácia",
            telefone: "(61) 98888-8888",
            imagem_url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
            endereco: "Av. Central, 123 - Cidade Ocidental"
        }
    ].slice(0, limit);
}