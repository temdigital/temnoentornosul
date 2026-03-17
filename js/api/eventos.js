/**
 * API de Eventos
 * Tem no Entorno Sul
 */

const EventosAPI = {
    /**
     * Lista próximos eventos
     */
    async listarProximos(limite = 3) {
        try {
            const hoje = new Date().toISOString().split('T')[0];
            
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .gte('data_inicio', hoje)
                .order('data_inicio', { ascending: true })
                .limit(limite);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar próximos eventos:', error);
            return { success: false, data: [] };
        }
    },
    
    /**
     * Lista todos os eventos (para página de eventos)
     */
    async listarTodos(filtros = {}) {
        try {
            let query = supabase
                .from('eventos')
                .select('*')
                .order('data_inicio', { ascending: true });
            
            if (filtros.mes) {
                // Filtrar por mês específico
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            return { success: false, data: [] };
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
            return { success: false, data: null };
        }
    }
};