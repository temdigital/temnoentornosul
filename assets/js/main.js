// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando site...');
    
    // Carrega todos os dados
    carregarPublicacoes();
    carregarEventos();
    carregarEmpresas();
});

// Carrega publicações
async function carregarPublicacoes() {
    const loading = document.getElementById('publicacoesLoading');
    const grid = document.getElementById('publicacoesGrid');
    
    if (!grid) return;
    
    try {
        // Mostra loading
        if (loading) loading.style.display = 'block';
        
        // Busca dados
        const dados = await fetchPublicacoes(3);
        
        // Esconde loading
        if (loading) loading.style.display = 'none';
        
        // Se não tem dados
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-newspaper"></i><p>Nenhuma publicação encontrada</p></div>';
            return;
        }
        
        // Renderiza os cards
        grid.innerHTML = dados.map(item => `
            <article class="card post-card fade-in">
                <img src="${item.imagem_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'}" 
                     alt="${item.titulo || 'Publicação'}" 
                     class="card-img" 
                     loading="lazy"
                     onerror="this.src='https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'">
                <div class="card-content">
                    <span class="card-category">${item.categoria || 'Geral'}</span>
                    <h3 class="card-title">${item.titulo || 'Sem título'}</h3>
                    <p class="card-excerpt">${item.resumo || (item.conteudo ? item.conteudo.substring(0, 100) + '...' : 'Clique para ler mais...')}</p>
                    <a href="https://www.temnoentornosul.com.br/publicacao?id=${item.id}" class="btn">Ler mais</a>
                </div>
            </article>
        `).join('');
        
        console.log('Publicações renderizadas:', dados.length);
        
    } catch (error) {
        console.error('Erro em carregarPublicacoes:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar publicações</p></div>';
    }
}

// Carrega eventos
async function carregarEventos() {
    const loading = document.getElementById('eventosLoading');
    const grid = document.getElementById('eventosGrid');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        const dados = await fetchEventos(3);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>Nenhum evento encontrado</p></div>';
            return;
        }
        
        grid.innerHTML = dados.map(item => {
            // Verifica se é evento passado (opcional)
            const isPassado = false; // Implementar lógica se necessário
            
            return `
                <article class="card event-card ${isPassado ? 'event-past' : ''} fade-in">
                    <img src="${item.imagem_url || 'https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'}" 
                         alt="${item.titulo || 'Evento'}" 
                         class="card-img" 
                         loading="lazy"
                         onerror="this.src='https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'">
                    <div class="card-content">
                        <div class="event-date">
                            <i class="far fa-calendar-alt"></i>
                            ${item.data || item.data_inicio || 'Data a definir'}
                        </div>
                        <div class="event-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${item.local || 'Local a definir'}
                        </div>
                        <h3 class="card-title">${item.titulo || 'Sem título'}</h3>
                        <p>${item.descricao || item.resumo || ''}</p>
                        <a href="https://www.temnoentornosul.com.br/eventos?id=${item.id}" class="btn">+ Saiba mais</a>
                    </div>
                </article>
            `;
        }).join('');
        
        console.log('Eventos renderizados:', dados.length);
        
    } catch (error) {
        console.error('Erro em carregarEventos:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar eventos</p></div>';
    }
}

// Carrega empresas
async function carregarEmpresas() {
    const loading = document.getElementById('empresasLoading');
    const grid = document.getElementById('empresasGrid');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        const dados = await fetchEmpresas(6);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-store-alt"></i><p>Nenhuma empresa encontrada</p></div>';
            return;
        }
        
        grid.innerHTML = dados.map(item => `
            <article class="card post-card fade-in">
                <img src="${item.imagem_url || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}" 
                     alt="${item.nome || 'Empresa'}" 
                     class="card-img" 
                     loading="lazy"
                     onerror="this.src='https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'">
                <div class="card-content">
                    <span class="card-category">${item.categoria || 'Empresa'}</span>
                    <h3 class="card-title">${item.nome || 'Sem nome'}</h3>
                    <p class="card-excerpt">
                        <i class="fas fa-map-marker-alt"></i> ${item.endereco || 'Local não informado'}<br>
                        ${item.telefone ? '<i class="fas fa-phone"></i> ' + item.telefone : ''}
                    </p>
                    <a href="https://www.temnoentornosul.com.br/empresas?id=${item.id}" class="btn">Ver detalhes</a>
                </div>
            </article>
        `).join('');
        
        console.log('Empresas renderizadas:', dados.length);
        
    } catch (error) {
        console.error('Erro em carregarEmpresas:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar empresas</p></div>';
    }
}