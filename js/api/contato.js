/**
 * API de Contato
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * Gerencia o formulário de contato
 */

const ContatoAPI = {
    /**
     * Envia mensagem de contato
     */
    async enviarMensagem(dados) {
        try {
            // Validações
            if (!dados.nome || !dados.email || !dados.mensagem) {
                throw new Error('Preencha todos os campos obrigatórios');
            }
            
            if (!this.validarEmail(dados.email)) {
                throw new Error('Email inválido');
            }
            
            // Salvar no banco
            const { data, error } = await supabase
                .from('contatos')
                .insert([{
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone,
                    assunto: dados.assunto,
                    mensagem: dados.mensagem,
                    lida: false,
                    created_at: new Date()
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Aqui você pode adicionar integração com email
            // Por exemplo, enviar notificação para o admin
            
            return {
                success: true,
                message: 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
            };
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return {
                success: false,
                error: error.message || 'Erro ao enviar mensagem. Tente novamente.'
            };
        }
    },

    /**
     * Lista mensagens (admin apenas)
     */
    async listarMensagens(filtros = {}) {
        try {
            // Verificar permissão
            const isAdmin = await supabaseAuth.hasPermission('admin');
            if (!isAdmin) {
                throw new Error('Acesso negado');
            }
            
            let query = supabase
                .from('contatos')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (filtros.lidas !== undefined) {
                query = query.eq('lida', filtros.lidas);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar mensagens:', error);
            return { success: false, error: 'Erro ao carregar mensagens' };
        }
    },

    /**
     * Marca mensagem como lida
     */
    async marcarComoLida(id) {
        try {
            const { data, error } = await supabase
                .from('contatos')
                .update({ lida: true })
                .eq('id', id);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar mensagem:', error);
            return { success: false, error: 'Erro ao atualizar mensagem' };
        }
    },

    /**
     * Valida email
     */
    validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Disponibilizar globalmente
window.ContatoAPI = ContatoAPI;