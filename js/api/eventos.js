/**
 * API de Eventos
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * Gerencia todas as operações relacionadas a eventos
 */

const EventosAPI = {
    /**
     * Lista eventos ativos
     */
    async listar(filtros = {}) {
        try {
            const hoje = new Date().toISOString().split('T')[0];
            
            let query = supabase
                .from('eventos')
                .select('*')
                .eq('status', 'ativo')
                .gte('data_fim', hoje) // Eventos que ainda não terminaram
                .order('data_inicio');
            
            // Filtrar por destaque
            if (filtros.destaque) {
                query = query.eq('destaque', true);
            }
            
            // Filtrar por data específica
            if (filtros.data) {
                query = query.lte('data_inicio', filtros.data)
                            .gte('data_fim', filtros.data);
            }
            
            // Filtrar por mês
            if (filtros.mes && filtros.ano) {
                const inicio = `${filtros.ano}-${String(filtros.mes).padStart(2, '0')}-01`;
                const fim = new Date(filtros.ano, filtros.mes, 0).toISOString().split('T')[0];
                
                query = query.gte('data_inicio', inicio)
                            .lte('data_fim', fim);
            }
            
            // Limite
            if (filtros.limite) {
                query = query.limit(filtros.limite);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            return { success: false, error: 'Erro ao carregar eventos' };
        }
    },

    /**
     * Busca evento por ID
     */
    async buscarPorId(id) {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar evento:', error);
            return { success: false, error: 'Evento não encontrado' };
        }
    },

    /**
     * Lista próximos eventos
     */
    async listarProximos(limite = 5) {
        try {
            const hoje = new Date().toISOString().split('T')[0];
            
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .eq('status', 'ativo')
                .gte('data_inicio', hoje)
                .order('data_inicio')
                .limit(limite);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar próximos eventos:', error);
            return { success: false, error: 'Erro ao carregar eventos' };
        }
    },

    /**
     * Lista eventos por mês (para calendário)
     */
    async listarPorMes(ano, mes) {
        try {
            const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
            const fim = new Date(ano, mes, 0).toISOString().split('T')[0];
            
            const { data, error } = await supabase
                .from('eventos')
                .select('id, titulo, data_inicio, data_fim, destaque')
                .eq('status', 'ativo')
                .gte('data_inicio', inicio)
                .lte('data_fim', fim)
                .order('data_inicio');
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar eventos do mês:', error);
            return { success: false, error: 'Erro ao carregar eventos' };
        }
    }
};

// Disponibilizar globalmente
window.EventosAPI = EventosAPI;