// ============================================
// SCRIPT PRINCIPAL - Renato Asse
// ============================================

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando site - Versão 2.0');
    
    // Inicializa o menu mobile
    initMobileMenu();
    
    // Configura botão do WhatsApp
    initWhatsAppButton();
    
    // Carrega dados do Supabase
    setTimeout(() => {
        carregarPublicacoes();
        carregarEventos();
        carregarEmpresas();
    }, 500); // Pequeno delay para garantir que tudo carregou
});

// ============================================
// FUNÇÕES DO MENU
// ============================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('⚠️ Elementos do menu não encontrados');
        return;
    }
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.className = navMenu.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    });
    
    // Fecha menu ao clicar em links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });
    
    console.log('✅ Menu mobile inicializado');
}

function initWhatsAppButton() {
    const btn = document.getElementById('whatsapp-group-btn');
    if (btn) {
        btn.addEventListener('click', function() {
            window.open('https://chat.whatsapp.com/DvTQra8rDQp01NqUCmwa8N', '_blank');
        });
        console.log('✅ Botão WhatsApp configurado');
    }
}

// ============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS
// ============================================

async function carregarPublicacoes() {
    const loading = document.getElementById('publicacoesLoading');
    const grid = document.getElementById('publicacoesGrid');
    
    if (!grid) {
        console.warn('⚠️ Grid de publicações não encontrado');
        return;
    }
    
    try {
        if (loading) loading.style.display = 'block';
        
        // Verifica se a função existe
        if (typeof window.fetchPublicacoes !== 'function') {
            throw new Error('fetchPublicacoes não está definida');
        }
        
        const dados = await window.fetchPublicacoes(3);
        
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
                    <p class="card-excerpt">${item.resumo || (item.conteudo ? item.conteudo.substring(0, 100) + '...' : 'Clique para ler mais...')}</p>
                    <a href="https://www.temnoentornosul.com.br/publicacao?id=${item.id}" class="btn">Ler mais</a>
                </div>
            </article>
        `).join('');
        
        console.log(`✅ Publicações renderizadas: ${dados.length}`);
        
    } catch (error) {
        console.error('❌ Erro em carregarPublicacoes:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar publicações</p><button onclick="location.reload()" class="btn" style="margin-top:10px">Tentar novamente</button></div>';
    }
}

async function carregarEventos() {
    const loading = document.getElementById('eventosLoading');
    const grid = document.getElementById('eventosGrid');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        if (typeof window.fetchEventos !== 'function') {
            throw new Error('fetchEventos não está definida');
        }
        
        const dados = await window.fetchEventos(3);
        
        if (loading) loading.style.display = 'none';
        
        if (!dados || dados.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>Nenhum evento encontrado</p></div>';
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
        `).join('');
        
        console.log(`✅ Eventos renderizados: ${dados.length}`);
        
    } catch (error) {
        console.error('❌ Erro em carregarEventos:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar eventos</p><button onclick="location.reload()" class="btn" style="margin-top:10px">Tentar novamente</button></div>';
    }
}

async function carregarEmpresas() {
    const loading = document.getElementById('empresasLoading');
    const grid = document.getElementById('empresasGrid');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        
        if (typeof window.fetchEmpresas !== 'function') {
            throw new Error('fetchEmpresas não está definida');
        }
        
        const dados = await window.fetchEmpresas(6);
        
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
        
        console.log(`✅ Empresas renderizadas: ${dados.length}`);
        
    } catch (error) {
        console.error('❌ Erro em carregarEmpresas:', error);
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar empresas</p><button onclick="location.reload()" class="btn" style="margin-top:10px">Tentar novamente</button></div>';
    }
}