/**
 * API de Parceiros/Comércios
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * Gerencia todas as operações relacionadas a parceiros
 */

const ParceirosAPI = {
    /**
     * Lista todos os parceiros ativos
     */
    async listarTodos(filtros = {}) {
        try {
            let query = supabase
                .from('parceiros')
                .select(`
                    *,
                    profiles:user_id (
                        email,
                        telefone
                    )
                `)
                .eq('status', 'ativo');
            
            // Aplicar filtros
            if (filtros.plano) {
                query = query.eq('plano', filtros.plano);
            }
            
            if (filtros.cidade) {
                query = query.ilike('cidade', `%${filtros.cidade}%`);
            }
            
            if (filtros.bairro) {
                query = query.ilike('bairro', `%${filtros.bairro}%`);
            }
            
            if (filtros.busca) {
                query = query.or(`nome_fantasia.ilike.%${filtros.busca}%,descricao_curta.ilike.%${filtros.busca}%`);
            }
            
            // Ordenação
            query = query.order('plano', { ascending: false }) // Premium primeiro
                        .order('nome_fantasia');
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            // Formatar dados
            const parceiros = data.map(p => supabaseUtils.formatPartnerData(p));
            
            return { success: true, data: parceiros };
        } catch (error) {
            console.error('Erro ao listar parceiros:', error);
            return { success: false, error: 'Erro ao carregar parceiros' };
        }
    },

    /**
     * Busca parceiro por ID
     */
    async buscarPorId(id) {
        try {
            const { data, error } = await supabase
                .from('parceiros')
                .select(`
                    *,
                    profiles:user_id (
                        email
                    ),
                    servicos (*)
                `)
                .eq('id', id)
                .eq('status', 'ativo')
                .single();
            
            if (error) throw error;
            
            // Incrementar visualizações
            await supabase.rpc('increment_visualizacoes', {
                table_name: 'parceiros',
                record_id: id
            });
            
            return { 
                success: true, 
                data: supabaseUtils.formatPartnerData(data) 
            };
        } catch (error) {
            console.error('Erro ao buscar parceiro:', error);
            return { success: false, error: 'Parceiro não encontrado' };
        }
    },

    /**
     * Atualiza dados do parceiro
     */
    async atualizar(id, dados) {
        try {
            // Verificar permissão
            const session = await supabaseAuth.getSession();
            if (!session) throw new Error('Não autorizado');
            
            // Verificar se usuário é dono do parceiro ou admin
            const { data: parceiro, error: checkError } = await supabase
                .from('parceiros')
                .select('user_id')
                .eq('id', id)
                .single();
            
            if (checkError) throw checkError;
            
            const isAdmin = await supabaseAuth.hasPermission('admin');
            if (parceiro.user_id !== session.user.id && !isAdmin) {
                throw new Error('Sem permissão para editar');
            }
            
            // Atualizar dados
            const { data, error } = await supabase
                .from('parceiros')
                .update({
                    ...dados,
                    updated_at: new Date()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao atualizar parceiro:', error);
            return { success: false, error: 'Erro ao atualizar dados' };
        }
    },

    /**
     * Busca parceiros por localização (para mapa)
     */
    async buscarPorLocalizacao(lat, lng, raioKm = 10) {
        try {
            // Nota: Para buscar por raio, seria ideal usar PostGIS
            // Por enquanto, vamos buscar todos e filtrar no front
            const { data, error } = await supabase
                .from('parceiros')
                .select('id, nome_fantasia, latitude, longitude, endereco, bairro, plano')
                .eq('status', 'ativo')
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);
            
            if (error) throw error;
            
            // Filtrar por distância (implementação simples)
            const parceirosProximos = data.filter(p => {
                const distancia = this.calcularDistancia(
                    lat, lng,
                    p.latitude, p.longitude
                );
                return distancia <= raioKm;
            });
            
            return { success: true, data: parceirosProximos };
        } catch (error) {
            console.error('Erro ao buscar por localização:', error);
            return { success: false, error: 'Erro na busca por localização' };
        }
    },

    /**
     * Calcula distância entre dois pontos (fórmula de Haversine)
     */
    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    deg2rad(deg) {
        return deg * (Math.PI/180);
    },

    /**
     * Cria agendamento (apenas para premium)
     */
    async criarAgendamento(dados) {
        try {
            // Verificar se parceiro é premium
            const { data: parceiro, error: checkError } = await supabase
                .from('parceiros')
                .select('plano')
                .eq('id', dados.parceiro_id)
                .single();
            
            if (checkError) throw checkError;
            
            if (parceiro.plano !== 'premium') {
                throw new Error('Agendamentos disponíveis apenas para parceiros premium');
            }
            
            // Criar agendamento
            const { data, error } = await supabase
                .from('agendamentos')
                .insert([{
                    ...dados,
                    created_at: new Date()
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            return { success: false, error: error.message };
        }
    }
};

// Disponibilizar globalmente
window.ParceirosAPI = ParceirosAPI;