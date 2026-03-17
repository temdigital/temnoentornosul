/**
 * Configuração do cliente Supabase
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * ATENÇÃO: Estas chaves são públicas e podem ser expostas no front-end
 * As políticas de segurança (RLS) protegem os dados no backend
 */

// Configuração do Supabase
const SUPABASE_URL = 'https://flidbkfrfosuahgphiza.supabase.co'; // Substitua pela URL do seu projeto
const SUPABASE_ANON_KEY = 'sb_publishable_mCBYSpZc45Pw345wZ1coEA_rYL61Ea8'; // Substitua pela chave anônima

// Inicializa o cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// =====================================================
// TRATAMENTO DE ERROS GLOBAL
// =====================================================
async function handleSupabaseError(error) {
    console.error('Erro Supabase:', error);
    
    let mensagem = 'Ocorreu um erro inesperado. Tente novamente.';
    
    if (error.message) {
        if (error.message.includes('JWT')) {
            mensagem = 'Sessão expirada. Faça login novamente.';
            // Redirecionar para login se necessário
            if (window.location.pathname.includes('/admin/')) {
                window.location.href = '/admin/login.html';
            }
        } else if (error.message.includes('duplicate key')) {
            mensagem = 'Este registro já existe.';
        } else if (error.message.includes('violates foreign key')) {
            mensagem = 'Registro referenciado não encontrado.';
        } else if (error.message.includes('violates row-level security')) {
            mensagem = 'Você não tem permissão para realizar esta ação.';
        }
    }
    
    // Disparar evento para ser capturado pela UI
    const event = new CustomEvent('supabase-error', { 
        detail: { message: mensagem, originalError: error }
    });
    document.dispatchEvent(event);
    
    return mensagem;
}

// =====================================================
// UTILITÁRIOS DE AUTENTICAÇÃO
// =====================================================
const supabaseAuth = {
    /**
     * Obtém a sessão atual do usuário
     */
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            await handleSupabaseError(error);
            return null;
        }
    },

    /**
     * Obtém o perfil completo do usuário com base na role
     */
    async getUserProfile() {
        try {
            const session = await this.getSession();
            if (!session) return null;
            
            // Buscar perfil base
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            if (profileError) throw profileError;
            
            // Se for comércio, buscar dados específicos
            if (profile.tipo_usuario === 'comercio') {
                const { data: comercio, error: comercioError } = await supabase
                    .from('parceiros')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                
                if (!comercioError && comercio) {
                    return { ...profile, comercio };
                }
            }
            
            // Se for colunista, buscar dados específicos
            if (profile.tipo_usuario === 'colunista') {
                const { data: colunista, error: colunistaError } = await supabase
                    .from('colunistas')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                
                if (!colunistaError && colunista) {
                    return { ...profile, colunista };
                }
            }
            
            return profile;
        } catch (error) {
            await handleSupabaseError(error);
            return null;
        }
    },

    /**
     * Faz login com email e senha
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Buscar perfil completo
            const profile = await this.getUserProfile();
            
            return { success: true, user: data.user, profile };
        } catch (error) {
            const mensagem = await handleSupabaseError(error);
            return { success: false, error: mensagem };
        }
    },

    /**
     * Registra um novo usuário
     */
    async register(email, password, userData) {
        try {
            // 1. Criar usuário no Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nome: userData.nome
                    }
                }
            });
            
            if (authError) throw authError;
            
            // 2. Criar perfil na tabela profiles
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email: email,
                            nome: userData.nome,
                            tipo_usuario: userData.tipo_usuario || 'comercio',
                            telefone: userData.telefone
                        }
                    ]);
                
                if (profileError) throw profileError;
                
                // 3. Se for comércio, criar registro na tabela parceiros
                if (userData.tipo_usuario === 'comercio' || !userData.tipo_usuario) {
                    const { error: parceiroError } = await supabase
                        .from('parceiros')
                        .insert([
                            {
                                user_id: authData.user.id,
                                nome_fantasia: userData.nome_fantasia || userData.nome,
                                plano: 'gratis',
                                status: 'ativo',
                                telefone: userData.telefone,
                                whatsapp: userData.whatsapp,
                                email_contato: userData.email_contato || email
                            }
                        ]);
                    
                    if (parceiroError) throw parceiroError;
                }
            }
            
            return { 
                success: true, 
                message: 'Cadastro realizado com sucesso! Verifique seu email para confirmar.' 
            };
        } catch (error) {
            const mensagem = await handleSupabaseError(error);
            return { success: false, error: mensagem };
        }
    },

    /**
     * Faz logout
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            const mensagem = await handleSupabaseError(error);
            return { success: false, error: mensagem };
        }
    },

    /**
     * Verifica se usuário tem permissão específica
     */
    async hasPermission(tipoPermitido) {
        const session = await this.getSession();
        if (!session) return false;
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('tipo_usuario')
            .eq('id', session.user.id)
            .single();
        
        if (!profile) return false;
        
        if (Array.isArray(tipoPermitido)) {
            return tipoPermitido.includes(profile.tipo_usuario);
        }
        
        return profile.tipo_usuario === tipoPermitido;
    }
};

// =====================================================
// UTILITÁRIOS DE UPLOAD (Supabase Storage)
// =====================================================
const supabaseStorage = {
    /**
     * Faz upload de uma imagem
     */
    async uploadImage(file, bucket = 'imagens', path = '') {
        try {
            // Validar arquivo
            if (!file.type.startsWith('image/')) {
                throw new Error('Arquivo não é uma imagem');
            }
            
            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Imagem muito grande. Máximo 5MB');
            }
            
            // Gerar nome único
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = path ? `${path}/${fileName}` : fileName;
            
            // Fazer upload
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (error) throw error;
            
            // Obter URL pública
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            
            return { 
                success: true, 
                path: filePath,
                url: publicUrl 
            };
        } catch (error) {
            await handleSupabaseError(error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Upload de imagem otimizada (já redimensionada via canvas)
     */
    async uploadOptimizedImage(file, bucket = 'imagens', path = '', maxWidth = 1200) {
        try {
            // Redimensionar imagem antes do upload
            const optimizedFile = await this.resizeImage(file, maxWidth);
            return await this.uploadImage(optimizedFile, bucket, path);
        } catch (error) {
            await handleSupabaseError(error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Redimensiona imagem usando canvas
     */
    resizeImage(file, maxWidth) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        const optimizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(optimizedFile);
                    }, 'image/jpeg', 0.8); // Qualidade 80%
                };
                
                img.onerror = reject;
            };
            
            reader.onerror = reject;
        });
    },

    /**
     * Deleta uma imagem
     */
    async deleteImage(path, bucket = 'imagens') {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            await handleSupabaseError(error);
            return { success: false, error: error.message };
        }
    }
};

// =====================================================
// UTILITÁRIOS DE FORMATAÇÃO (versão backend)
// =====================================================
const supabaseUtils = {
    /**
     * Formata dados vindos do banco para exibição
     */
    formatPartnerData(parceiro) {
        return {
            ...parceiro,
            horario_formatado: parceiro.horario_funcionamento ? 
                Object.entries(parceiro.horario_funcionamento).map(([dia, horario]) => {
                    const diasSemana = {
                        segunda: 'Segunda',
                        terca: 'Terça',
                        quarta: 'Quarta',
                        quinta: 'Quinta',
                        sexta: 'Sexta',
                        sabado: 'Sábado',
                        domingo: 'Domingo'
                    };
                    return `${diasSemana[dia]}: ${horario}`;
                }) : [],
            premium: parceiro.plano === 'premium',
            whatsapp_link: parceiro.whatsapp ? 
                `https://wa.me/${parceiro.whatsapp.replace(/\D/g, '')}` : null
        };
    }
};

// Exportar tudo para uso global
window.supabaseClient = supabase;
window.supabaseAuth = supabaseAuth;
window.supabaseStorage = supabaseStorage;
window.supabaseUtils = supabaseUtils;