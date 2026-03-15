// ============================================
// CONFIGURAÇÃO DO SUPABASE - Renato Asse
// ============================================

// IMPORTANTE: Substitua pelas suas credenciais reais do Supabase!
const SUPABASE_URL = 'https://flidbkfrfosuahgphiza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaWRia2ZyZm9zdWFoZ3BoaXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDQ4NDEsImV4cCI6MjA4ODYyMDg0MX0.VigqHuXyOvmO9YuGYCTobFW4yecByK7FQxGtsIAiHOM';

// Verifica se o Supabase já foi carregado
if (typeof supabaseJs === 'undefined') {
    console.error('❌ Supabase JS não carregado! Verifique o CDN no HTML');
} else {
    console.log('✅ Supabase JS carregado com sucesso');
}

// Cria uma ÚNICA instância global
window.supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Cliente Supabase inicializado');

// ============================================
// FUNÇÕES DE ACESSO AO BANCO
// ============================================

// Busca publicações
window.fetchPublicacoes = async function(limit = 6) {
    try {
        console.log('🔍 Buscando publicações...');
        
        const { data, error } = await window.supabase
            .from('publicacoes')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('❌ Erro na consulta:', error);
            return [];
        }

        console.log(`✅ ${data?.length || 0} publicações encontradas`);
        return data || [];
        
    } catch (error) {
        console.error('❌ Erro ao buscar publicações:', error);
        return [];
    }
};

// Busca eventos
window.fetchEventos = async function(limit = 3) {
    try {
        console.log('🔍 Buscando eventos...');
        
        const { data, error } = await window.supabase
            .from('eventos')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('❌ Erro na consulta:', error);
            return [];
        }

        console.log(`✅ ${data?.length || 0} eventos encontrados`);
        return data || [];
        
    } catch (error) {
        console.error('❌ Erro ao buscar eventos:', error);
        return [];
    }
};

// Busca empresas
window.fetchEmpresas = async function(limit = 6) {
    try {
        console.log('🔍 Buscando empresas...');
        
        const { data, error } = await window.supabase
            .from('empresas')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('❌ Erro na consulta:', error);
            return [];
        }

        console.log(`✅ ${data?.length || 0} empresas encontradas`);
        return data || [];
        
    } catch (error) {
        console.error('❌ Erro ao buscar empresas:', error);
        return [];
    }
};

console.log('✅ Módulo Supabase carregado completamente');