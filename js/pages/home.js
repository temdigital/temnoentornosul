/**
 * JavaScript da Página Inicial
 * Tem no Entorno Sul
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Carregar publicações recentes
        await carregarPublicacoesRecentes();
        
        // Carregar parceiros em destaque
        await carregarParceirosDestaque();
        
        // Carregar próximos eventos
        await carregarProximosEventos();
        
        // Configurar menu mobile
        configurarMenuMobile();
        
        // Configurar formulário de newsletter
        configurarNewsletter();
        
    } catch (error) {
        console.error('Erro ao carregar página inicial:', error);
        mostrarAlerta('Erro ao carregar conteúdo. Tente novamente mais tarde.', 'error');
    }
});

/**
 * Configura o menu mobile (hambúrguer)
 */
function configurarMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuMobile = document.getElementById('menu-mobile');
    
    if (menuToggle && menuMobile) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            menuMobile.classList.toggle('active');
            
            // Animação do ícone hambúrguer
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Carrega publicações recentes
 */
async function carregarPublicacoesRecentes() {
    const container = document.getElementById('publicacoes-destaque');
    if (!container) return;
    
    try {
        const result = await PublicacoesAPI.listar({ limite: 3 });
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = result.data.map(publicacao => `
                <div class="card">
                    <img src="${publicacao.imagem_destaque || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'}" 
                         alt="${publicacao.titulo}"
                         class="card-image"
                         loading="lazy">
                    <div class="card-content">
                        <h3 class="card-title">
                            <a href="/publicacao.html?id=${publicacao.id}">${publicacao.titulo}</a>
                        </h3>
                        <p class="card-text">${publicacao.subtitulo || publicacao.conteudo.substring(0, 100) + '...'}</p>
                        <div class="card-meta">
                            <small>
                                <i class="far fa-calendar"></i> 
                                ${formatarData(publicacao.published_at || publicacao.created_at)}
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
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = result.data.map(parceiro => `
                <div class="parceiro-card ${parceiro.plano === 'premium' ? 'premium' : ''}">
                    ${parceiro.plano === 'premium' ? '<span class="badge badge-premium">Premium</span>' : ''}
                    <img src="${parceiro.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'}" 
                         alt="${parceiro.nome_fantasia}"
                         class="parceiro-logo"
                         loading="lazy">
                    <h3 class="parceiro-nome">
                        <a href="/parceiro.html?id=${parceiro.id}">${parceiro.nome_fantasia}</a>
                    </h3>
                    <p class="parceiro-descricao">${parceiro.descricao_curta || ''}</p>
                    <div class="parceiro-contato">
                        ${parceiro.whatsapp ? `
                            <a href="https://wa.me/${parceiro.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-small btn-success">
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
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = result.data.map(evento => {
                const dataInicio = new Date(evento.data_inicio);
                
                return `
                    <div class="evento-card">
                        <div class="evento-data">
                            <span class="dia">${dataInicio.getDate()}</span>
                            <span class="mes">${getNomeMes(dataInicio.getMonth())}</span>
                        </div>
                        <div class="evento-info">
                            <h3>${evento.titulo}</h3>
                            <p>${evento.descricao.substring(0, 100)}${evento.descricao.length > 100 ? '...' : ''}</p>
                            <div class="evento-meta">
                                <span class="evento-local">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${evento.local || 'Local a definir'}
                                </span>
                                ${evento.horario ? `
                                    <span class="evento-horario">
                                        <i class="far fa-clock"></i>
                                        ${evento.horario}
                                    </span>
                                ` : ''}
                            </div>
                            <a href="/evento.html?id=${evento.id}" class="btn btn-outline btn-small">
                                Saiba mais <i class="fas fa-arrow-right"></i>
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
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        try {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Aqui você pode integrar com um serviço de newsletter
            // Por exemplo, salvar no banco de dados
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
            
            mostrarAlerta('Inscrição realizada com sucesso!', 'success');
            form.reset();
            
        } catch (error) {
            mostrarAlerta('Erro ao realizar inscrição. Tente novamente.', 'error');
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });
}

/**
 * Utilitário para mostrar alertas
 */
function mostrarAlerta(mensagem, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${mensagem}
    `;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.padding = '15px 20px';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alertDiv.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
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

// Adicionar estilos para as animações dos alertas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);