/**
 * Módulo de Autenticação
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * Gerencia toda a lógica de autenticação e sessão
 */

const AuthAPI = {
    /**
     * Registro de novo comércio (plano grátis)
     */
    async registerComercio(dados) {
        try {
            // Validações básicas
            if (!dados.email || !dados.password || !dados.nome_fantasia) {
                throw new Error('Preencha todos os campos obrigatórios');
            }
            
            if (dados.password.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres');
            }
            
            // Registrar no Supabase
            const result = await supabaseAuth.register(dados.email, dados.password, {
                nome: dados.nome_fantasia,
                tipo_usuario: 'comercio',
                nome_fantasia: dados.nome_fantasia,
                telefone: dados.telefone,
                whatsapp: dados.whatsapp,
                email_contato: dados.email
            });
            
            if (result.success) {
                // Registrar no sistema de logs (opcional)
                console.log('Novo comércio registrado:', dados.nome_fantasia);
                
                // Disparar evento de registro
                const event = new CustomEvent('user-registered', {
                    detail: { email: dados.email, tipo: 'comercio' }
                });
                document.dispatchEvent(event);
            }
            
            return result;
        } catch (error) {
            console.error('Erro no registro:', error);
            return {
                success: false,
                error: error.message || 'Erro ao realizar cadastro'
            };
        }
    },

    /**
     * Login de usuário
     */
    async login(email, password) {
        try {
            const result = await supabaseAuth.login(email, password);
            
            if (result.success) {
                // Disparar evento de login
                const event = new CustomEvent('user-login', {
                    detail: { user: result.user, profile: result.profile }
                });
                document.dispatchEvent(event);
                
                // Redirecionar baseado no tipo de usuário
                const profile = result.profile;
                if (profile.tipo_usuario === 'admin') {
                    window.location.href = '/admin/dashboard.html';
                } else if (profile.tipo_usuario === 'colunista') {
                    window.location.href = '/admin/publicacoes/';
                } else {
                    // Comércio - redirecionar para editar perfil
                    window.location.href = '/admin/perfil/editar.html';
                }
            }
            
            return result;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao fazer login. Verifique suas credenciais.'
            };
        }
    },

    /**
     * Logout
     */
    async logout() {
        const result = await supabaseAuth.logout();
        
        if (result.success) {
            // Disparar evento de logout
            const event = new CustomEvent('user-logout');
            document.dispatchEvent(event);
            
            // Redirecionar para home
            window.location.href = '/';
        }
        
        return result;
    },

    /**
     * Verifica se usuário está logado e redireciona se necessário
     */
    async requireAuth(redirectTo = '/admin/login.html') {
        const session = await supabaseAuth.getSession();
        
        if (!session) {
            window.location.href = redirectTo;
            return false;
        }
        
        return true;
    },

    /**
     * Verifica permissões específicas
     */
    async requirePermission(tipoPermitido, redirectTo = '/') {
        const hasPermission = await supabaseAuth.hasPermission(tipoPermitido);
        
        if (!hasPermission) {
            window.location.href = redirectTo;
            return false;
        }
        
        return true;
    },

    /**
     * Recuperação de senha
     */
    async resetPassword(email) {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/redefinir-senha.html`
            });
            
            if (error) throw error;
            
            return {
                success: true,
                message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao enviar email de recuperação.'
            };
        }
    },

    /**
     * Atualiza senha do usuário
     */
    async updatePassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            return {
                success: true,
                message: 'Senha atualizada com sucesso!'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao atualizar senha.'
            };
        }
    },

    /**
     * Obtém dados do usuário atual
     */
    async getCurrentUser() {
        return await supabaseAuth.getUserProfile();
    },

    /**
     * Verifica se usuário é premium
     */
    async isPremium() {
        const profile = await this.getCurrentUser();
        return profile?.comercio?.plano === 'premium';
    },

    /**
     * Atualiza para plano premium (após pagamento)
     */
    async upgradeToPremium(parceiroId, dadosPagamento) {
        try {
            // Aqui você integraria com PagSeguro
            // Por enquanto, apenas atualizamos o plano
            
            const { data, error } = await supabase
                .from('parceiros')
                .update({
                    plano: 'premium',
                    assinatura_id: dadosPagamento.assinatura_id,
                    assinatura_status: 'ativo',
                    data_assinatura: new Date(),
                    data_expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 dias
                })
                .eq('id', parceiroId);
            
            if (error) throw error;
            
            return {
                success: true,
                message: 'Parabéns! Agora você é um parceiro premium!'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao atualizar para plano premium.'
            };
        }
    }
};

// Disponibilizar globalmente
window.AuthAPI = AuthAPI;