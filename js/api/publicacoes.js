/**
 * API de Publicações (Blog)
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 * 
 * Gerencia todas as operações relacionadas a publicações
 */

const PublicacoesAPI = {
    /**
     * Lista publicações com filtros
     */
    async listar(filtros = {}) {
        try {
            let query = supabase
                .from('publicacoes')
                .select(`
                    *,
                    categorias (
                        id,
                        nome,
                        slug,
                        cor_fundo
                    ),
                    colunistas (
                        id,
                        nome,
                        foto_url,
                        area_atuacao
                    )
                `)
                .eq('status', 'publicado')
                .order('published_at', { ascending: false });
            
            // Aplicar filtros
            if (filtros.categoria) {
                query = query.eq('categoria_id', filtros.categoria);
            }
            
            if (filtros.colunista) {
                query = query.eq('colunista_id', filtros.colunista);
            }
            
            if (filtros.tag) {
                query = query.contains('palavras_chave', [filtros.tag]);
            }
            
            if (filtros.busca) {
                query = query.or(`titulo.ilike.%${filtros.busca}%,subtitulo.ilike.%${filtros.busca}%`);
            }
            
            // Paginação
            if (filtros.limite) {
                query = query.limit(filtros.limite);
            }
            
            if (filtros.pagina) {
                const offset = (filtros.pagina - 1) * (filtros.limite || 10);
                query = query.range(offset, offset + (filtros.limite || 10) - 1);
            }
            
            const { data, error, count } = await query;
            
            if (error) throw error;
            
            return { success: true, data, count };
        } catch (error) {
            console.error('Erro ao listar publicações:', error);
            return { success: false, error: 'Erro ao carregar publicações' };
        }
    },

    /**
     * Busca publicação por slug
     */
    async buscarPorSlug(slug) {
        try {
            const { data, error } = await supabase
                .from('publicacoes')
                .select(`
                    *,
                    categorias (*),
                    colunistas (*),
                    publicacoes_tags (
                        tags (*)
                    )
                `)
                .eq('slug', slug)
                .eq('status', 'publicado')
                .single();
            
            if (error) throw error;
            
            // Incrementar visualizações
            await supabase.rpc('increment_visualizacoes', {
                table_name: 'publicacoes',
                record_id: data.id
            });
            
            // Formatar tags
            const tags = data.publicacoes_tags?.map(pt => pt.tags) || [];
            
            return { 
                success: true, 
                data: {
                    ...data,
                    tags
                }
            };
        } catch (error) {
            console.error('Erro ao buscar publicação:', error);
            return { success: false, error: 'Publicação não encontrada' };
        }
    },

    /**
     * Lista publicações em destaque
     */
    async listarDestaques(limite = 3) {
        try {
            const { data, error } = await supabase
                .from('publicacoes')
                .select(`
                    *,
                    categorias (nome, slug),
                    colunistas (nome)
                `)
                .eq('status', 'publicado')
                .order('views', { ascending: false })
                .limit(limite);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar destaques:', error);
            return { success: false, error: 'Erro ao carregar destaques' };
        }
    },

    /**
     * Lista categorias
     */
    async listarCategorias() {
        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('ativo', true)
                .order('nome');
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            return { success: false, error: 'Erro ao carregar categorias' };
        }
    },

    /**
     * Lista tags populares
     */
    async listarTagsPopulares(limite = 10) {
        try {
            const { data, error } = await supabase
                .from('tags')
                .select(`
                    *,
                    publicacoes_tags (count)
                `)
                .order('publicacoes_tags.count', { ascending: false })
                .limit(limite);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao listar tags:', error);
            return { success: false, error: 'Erro ao carregar tags' };
        }
    },

    /**
     * Cria nova publicação (admin/colunista)
     */
    async criar(dados) {
        try {
            const session = await supabaseAuth.getSession();
            if (!session) throw new Error('Não autorizado');
            
            // Gerar slug
            const slug = this.gerarSlug(dados.titulo);
            
            // Verificar se slug já existe
            const { data: existente } = await supabase
                .from('publicacoes')
                .select('id')
                .eq('slug', slug)
                .maybeSingle();
            
            if (existente) {
                // Adicionar sufixo numérico
                dados.slug = `${slug}-${Date.now()}`;
            } else {
                dados.slug = slug;
            }
            
            // Adicionar autor
            if (dados.colunista_id) {
                const { data: colunista } = await supabase
                    .from('colunistas')
                    .select('nome')
                    .eq('id', dados.colunista_id)
                    .single();
                
                if (colunista) {
                    dados.autor_nome = colunista.nome;
                }
            }
            
            dados.autor_obs = 'Esta publicação não necessariamente representa a opinião do Tem no Entorno Sul';
            
            const { data, error } = await supabase
                .from('publicacoes')
                .insert([{
                    ...dados,
                    created_at: new Date(),
                    published_at: dados.status === 'publicado' ? new Date() : null
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao criar publicação:', error);
            return { success: false, error: 'Erro ao criar publicação' };
        }
    },

    /**
     * Atualiza publicação
     */
    async atualizar(id, dados) {
        try {
            const session = await supabaseAuth.getSession();
            if (!session) throw new Error('Não autorizado');
            
            // Se mudou status para publicado, setar published_at
            if (dados.status === 'publicado') {
                dados.published_at = new Date();
            }
            
            const { data, error } = await supabase
                .from('publicacoes')
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
            console.error('Erro ao atualizar publicação:', error);
            return { success: false, error: 'Erro ao atualizar publicação' };
        }
    },

    /**
     * Utilitário para gerar slug
     */
    gerarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
    }
};

// Disponibilizar globalmente
window.PublicacoesAPI = PublicacoesAPI;