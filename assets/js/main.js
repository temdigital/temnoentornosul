/**
 * Script Principal
 * @author Renato Asse - Desenvolvedor Sênior
 */

// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Tem no Entorno Sul - Inicializando...');
    
    // Inicializa componentes
    initMobileMenu();
    initScrollAnimations();
    initWhatsAppButton();
    loadDynamicContent();
    loadStats();
});

/**
 * Menu Mobile
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Fecha menu ao clicar em links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Fecha menu ao rolar a página (mobile)
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 992 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

/**
 * Animações de scroll
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in, .feature-card, .card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Botão do WhatsApp
 */
function initWhatsAppButton() {
    const btn = document.getElementById('whatsapp-group-btn');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://chat.whatsapp.com/DvTQra8rDQp01NqUCmwa8N', '_blank', 'noopener,noreferrer');
    });
}

/**
 * Carrega estatísticas
 */
async function loadStats() {
    try {
        const stats = await fetchStats();
        
        const elPublicacoes = document.getElementById('statPublicacoes');
        const elEventos = document.getElementById('statEventos');
        const elEmpresas = document.getElementById('statEmpresas');
        
        if (elPublicacoes) animateNumber(elPublicacoes, 0, stats.publicacoes, 1000);
        if (elEventos) animateNumber(elEventos, 0, stats.eventos, 1000);
        if (elEmpresas) animateNumber(elEmpresas, 0, stats.empresas, 1000);
    } catch (error) {
        console.error('Erro ao carregar stats:', error);
    }
}

/**
 * Anima números
 */
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

/**
 * Carrega conteúdo dinâmico
 */
async function loadDynamicContent() {
    await Promise.all([
        carregarPublicacoes(),
        carregarEventos(),
        carregarEmpresas(),
        carregarCategorias()
    ]);
}

/**
 * Carrega publicações
 */
async function carregarPublicacoes() {
    const loading = document.getElementById('publicacoesLoading');
    const grid = document.getElementById('publicacoesGrid');
    const error = document.getElementById('publicacoesError');
    const empty = document.getElementById('publicacoesEmpty');
    
    if (!grid) return;
    
    try {
        // Mostra loading
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
        if (error) error.style.display = 'none';
        if (empty) empty.style.display = 'none';
        
        // Busca dados
        const publicacoes = await fetchPublicacoes(6);
        
        // Esconde loading
        if (loading) loading.style.display = 'none';
        
        if (publicacoes.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }
        
        // Mostra grid
        grid.style.display = 'grid';
        
        // Renderiza publicações
        grid.innerHTML = publicacoes.map(pub => `
            <article class="card post-card fade-in">
                <img src="${pub.imagem_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'}" 
                     alt="${pub.titulo}" 
                     class="card-img" 
                     loading="lazy"
                     onerror="this.src='https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'">
                <div class="card-content">
                    <span class="card-category">${pub.categoria || 'Geral'}</span>
                    <h3 class="card-title">${pub.titulo}</h3>
                    <p class="card-excerpt">${pub.resumo || pub.conteudo?.substring(0, 100) || 'Clique para ler mais...'}</p>
                    <a href="/pages/publicacao.html?id=${pub.id}" class="btn" rel="noopener noreferrer">Ler mais</a>
                </div>
            </article>
        `).join('');
        
    } catch (err) {
        console.error('Erro em carregarPublicacoes:', err);
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'block';
    }
}

/**
 * Carrega eventos
 */
async function carregarEventos() {
    const loading = document.getElementById('eventosLoading');
    const grid = document.getElementById('eventosGrid');
    const error = document.getElementById('eventosError');
    const empty = document.getElementById('eventosEmpty');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
        if (error) error.style.display = 'none';
        if (empty) empty.style.display = 'none';
        
        const eventos = await fetchEventos(3);
        
        if (loading) loading.style.display = 'none';
        
        if (eventos.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        
        grid.innerHTML = eventos.map(evento => {
            const dataEvento = new Date(evento.data_inicio);
            const isPassado = dataEvento < new Date();
            
            return `
                <article class="card event-card ${isPassado ? 'event-past' : ''} fade-in">
                    <img src="${evento.imagem_url || 'https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'}" 
                         alt="${evento.titulo}" 
                         class="card-img" 
                         loading="lazy"
                         onerror="this.src='https://images.pexels.com/photos/30354453/pexels-photo-30354453.jpeg'">
                    <div class="card-content">
                        <div class="event-date">
                            <i class="far fa-calendar-alt"></i>
                            ${formatarDataEvento(evento.data_inicio, evento.data_fim)}
                        </div>
                        <div class="event-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${evento.local || 'Local a definir'}
                        </div>
                        <h3 class="card-title">${evento.titulo}</h3>
                        <p>${evento.descricao || evento.resumo || ''}</p>
                        <a href="/pages/eventos.html?id=${evento.id}" class="btn">+ Saiba mais</a>
                    </div>
                </article>
            `;
        }).join('');
        
    } catch (err) {
        console.error('Erro em carregarEventos:', err);
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'block';
    }
}

/**
 * Carrega empresas
 */
async function carregarEmpresas() {
    const loading = document.getElementById('empresasLoading');
    const grid = document.getElementById('empresasGrid');
    const error = document.getElementById('empresasError');
    const empty = document.getElementById('empresasEmpty');
    
    if (!grid) return;
    
    try {
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
        if (error) error.style.display = 'none';
        if (empty) empty.style.display = 'none';
        
        const empresas = await fetchEmpresas(6);
        
        if (loading) loading.style.display = 'none';
        
        if (empresas.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        
        grid.innerHTML = empresas.map(emp => `
            <article class="empresa-card fade-in">
                <div class="empresa-image">
                    <img src="${emp.imagem_url || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}" 
                         alt="${emp.nome}"
                         loading="lazy"
                         onerror="this.src='https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'">
                </div>
                <div class="empresa-content">
                    <h3 class="empresa-nome">${emp.nome}</h3>
                    <p class="empresa-categoria">
                        <i class="fas fa-tag"></i> ${emp.categoria || 'Geral'}
                    </p>
                    <p class="empresa-endereco">
                        <i class="fas fa-map-marker-alt"></i> ${emp.endereco || 'Localização não informada'}
                    </p>
                    ${emp.telefone ? `
                        <p class="empresa-telefone">
                            <i class="fas fa-phone