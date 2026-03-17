/**
 * JavaScript da Página Inicial
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Carregar componentes
        await carregarComponentes();
        
        // Carregar publicações em destaque
        await carregarPublicacoesDestaque();
        
        // Carregar parceiros em destaque
        await carregarParceirosDestaque();
        
        // Carregar próximos eventos
        await carregarProximosEventos();
        
        // Configurar formulário de newsletter
        configurarNewsletter();
        
    } catch (error) {
        console.error('Erro ao carregar página inicial:', error);
        mostrarAlerta('Erro ao carregar conteúdo. Tente novamente mais tarde.', 'error');
    }
});

/**
 * Carrega publicações em destaque
 */
async function carregarPublicacoesDestaque() {
    const container = document.getElementById('publicacoes-destaque');
    if (!container) return;
    
    try {
        const result = await PublicacoesAPI.listar({ limite: 3 });
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(publicacao => `
                <div class="card">
                    <img src="${publicacao.imagem_destaque || '/images/placeholder-publicacao.jpg'}" 
                         alt="${publicacao.titulo}"
                         class="card-image"
                         loading="lazy">
                    <div class="card-content">
                        ${publicacao.categorias ? `
                            <span class="badge" style="background-color: ${publicacao.categorias.cor_fundo}">
                                ${publicacao.categorias.nome}
                            </span>
                        ` : ''}
                        <h3 class="card-title">
                            <a href="/publicacao.html?id=${publicacao.id}">${publicacao.titulo}</a>
                        </h3>
                        <p class="card-text">${publicacao.subtitulo || ''}</p>
                        <div class="card-meta">
                            <small>
                                <i class="far fa-calendar"></i> 
                                ${formatarData(publicacao.published_at)}
                            </small>
                            ${publicacao.colunistas ? `
                                <small>
                                    <i class="far fa-user"></i> 
                                    ${publicacao.colunistas.nome}
                                </small>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center">Nenhuma publicação encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar publicações:', error);
        container.innerHTML = '<p class="text-center">Erro ao carregar publicações.</p>';
    }
}

/**
 * Carrega parceiros em destaque
 */
async function carregarParceirosDestaque() {
    const container = document.getElementById('parceiros-destaque');
    if (!container) return;
    
    try {
        const result = await ParceirosAPI.listarTodos({ limite: 4 });
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(parceiro => `
                <div class="parceiro-card ${parceiro.premium ? 'premium' : ''}">
                    ${parceiro.premium ? '<span class="badge badge-premium">Premium</span>' : ''}
                    <img src="${parceiro.logo_url || '/images/placeholder-logo.jpg'}" 
                         alt="${parceiro.nome_fantasia}"
                         class="parceiro-logo"
                         loading="lazy">
                    <h3 class="parceiro-nome">
                        <a href="/parceiro.html?id=${parceiro.id}">${parceiro.nome_fantasia}</a>
                    </h3>
                    <p class="parceiro-descricao">${parceiro.descricao_curta || ''}</p>
                    <div class="parceiro-contato">
                        ${parceiro.whatsapp ? `
                            <a href="${parceiro.whatsapp_link}" target="_blank" class="btn btn-small">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        ` : ''}
                        <a href="/parceiro.html?id=${parceiro.id}" class="btn btn-small btn-outline">
                            Ver perfil
                        </a>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center">Nenhum parceiro encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar parceiros:', error);
        container.innerHTML = '<p class="text-center">Erro ao carregar parceiros.</p>';
    }
}

/**
 * Carrega próximos eventos
 */
async function carregarProximosEventos() {
    const container = document.getElementById('eventos-lista');
    if (!container) return;
    
    try {
        const result = await EventosAPI.listarProximos(3);
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(evento => {
                const dataInicio = new Date(evento.data_inicio);
                const dataFim = new Date(evento.data_fim);
                
                return `
                    <div class="evento-card">
                        <div class="evento-data">
                            <span class="dia">${dataInicio.getDate()}</span>
                            <span class="mes">${getNomeMes(dataInicio.getMonth())}</span>
                        </div>
                        <div class="evento-info">
                            <h3>${evento.titulo}</h3>
                            <p>${evento.descricao.substring(0, 100)}${evento.descricao.length > 100 ? '...' : ''}</p>
                            <div class="evento-local">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${evento.local || 'Local a definir'}</span>
                            </div>
                            ${evento.horario ? `
                                <div class="evento-horario">
                                    <i class="far fa-clock"></i>
                                    <span>${evento.horario}</span>
                                </div>
                            ` : ''}
                            <a href="/evento.html?id=${evento.id}" class="btn btn-outline btn-small mt-2">
                                Saiba mais
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p class="text-center">Nenhum evento próximo encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        container.innerHTML = '<p class="text-center">Erro ao carregar eventos.</p>';
    }
}

/**
 * Configura formulário de newsletter
 */
function configurarNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        try {
            // Aqui você pode integrar com um serviço de newsletter
            // Por exemplo, Mailchimp, SendGrid, etc.
            
            mostrarAlerta('Inscrição realizada com sucesso!', 'success');
            form.reset();
        } catch (error) {
            mostrarAlerta('Erro ao realizar inscrição. Tente novamente.', 'error');
        }
    });
}

/**
 * Utilitário para mostrar alertas
 */
function mostrarAlerta(mensagem, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.textContent = mensagem;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * Retorna nome do mês em português
 */
function getNomeMes(mes) {
    const meses = [
        'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
        'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];
    return meses[mes];
}