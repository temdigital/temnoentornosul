// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site inicializado');
    
    // Carrega conteúdo do Supabase
    carregarPublicacoes();
    carregarEventos();
    carregarEmpresas();
    carregarStats();
});

// Carrega publicações
async function carregarPublicacoes() {
    const grid = document.getElementById('publicacoesGrid');
    const loading = document.getElementById('publicacoesLoading');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        const dados = await fetchPublicacoes(3);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-newspaper"></i><p>Nenhuma publicação encontrada</p></div>';
            return;
        }
        
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
                    <p class="card-excerpt">${item.resumo || item.conteudo?.substring(0, 100) || 'Clique para ler mais...'}</p>
                    <a href="pages/publicacao.html?id=${item.id}" class="btn">Ler mais</a>
                </div>
            </article>
        `).join('');
        
    } catch (error) {
        console.error('Erro:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar</p></div>';
    }
}

// Carrega eventos
async function carregarEventos() {
    const grid = document.getElementById('eventosGrid');
    const loading = document.getElementById('eventosLoading');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        const dados = await fetchEventos(3);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>Nenhum evento encontrado</p></div>';
            return;
        }
        
        grid.innerHTML = dados.map(item => `
            <article class="card event-card fade-in">
                <img src="${item.imagem_url || 'https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'}" 
                     alt="${item.titulo || 'Evento'}" 
                     class="card-img" 
                     loading="lazy"
                     onerror="this.src='https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'">
                <div class="card-content">
                    <div class="event-date">
                        <i class="far fa-calendar-alt"></i>
                        ${item.data || 'Data a definir'}
                    </div>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.local || 'Local a definir'}
                    </div>
                    <h3 class="card-title">${item.titulo || 'Sem título'}</h3>
                    <p>${item.descricao || item.resumo || ''}</p>
                    <a href="pages/eventos.html?id=${item.id}" class="btn">+ Saiba mais</a>
                </div>
            </article>
        `).join('');
        
    } catch (error) {
        console.error('Erro:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar</p></div>';
    }
}

// Carrega empresas
async function carregarEmpresas() {
    const grid = document.getElementById('empresasGrid');
    const loading = document.getElementById('empresasLoading');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        const dados = await fetchEmpresas(6);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 