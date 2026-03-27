/**
 * Header Universal para todas as páginas
 * Carrega o menu correto baseado no status de login
 */

async function carregarHeader() {
    const supabase = window.supabase;
    const { data: { session } } = await supabase.auth.getSession();
    
    let avatarHtml = '';
    let nomeExibido = 'Usuário';
    
    if (session) {
        // Buscar perfil do usuário
        const { data: profile } = await supabase
            .from('profiles')
            .select('nome, avatar_url')
            .eq('id', session.user.id)
            .single();
        
        nomeExibido = profile?.nome || session.user.email?.split('@')[0] || 'Usuário';
        const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=256d3c&color=fff&bold=true`;
        
        avatarHtml = `
            <div class="user-menu">
                <img src="${avatarUrl}" alt="${nomeExibido}" class="user-avatar">
                <span class="user-name">${nomeExibido.split(' ')[0]}</span>
                <div class="user-dropdown">
                    <a href="./perfil.html"><i class="fas fa-user"></i> Meu Perfil</a>
                    <a href="#" onclick="event.preventDefault(); fazerLogout()"><i class="fas fa-sign-out-alt"></i> Sair</a>
                </div>
            </div>
        `;
    } else {
        avatarHtml = `<a href="./admin/login.html" class="btn-login"><i class="fas fa-user"></i> Login</a>`;
    }
    
    // Atualizar o header nas versões desktop e mobile
    const authDesktop = document.getElementById('authButtonDesktop');
    const authMobile = document.getElementById('authButtonMobile');
    const userInfoMobile = document.getElementById('userInfoMobile');
    
    if (authDesktop) authDesktop.innerHTML = avatarHtml;
    
    if (session && userInfoMobile) {
        userInfoMobile.innerHTML = `
            <div class="user-info-mobile">
                <img src="${avatarUrl}" alt="${nomeExibido}" class="user-avatar-mobile">
                <div>
                    <div class="user-name-mobile">${nomeExibido}</div>
                    <div class="user-email-mobile">${session.user.email}</div>
                </div>
            </div>
        `;
        if (authMobile) {
            authMobile.innerHTML = `<a href="#" onclick="event.preventDefault(); fazerLogout()" class="btn-logout-mobile"><i class="fas fa-sign-out-alt"></i> Sair</a>`;
        }
    } else {
        if (userInfoMobile) userInfoMobile.innerHTML = '';
        if (authMobile) {
            authMobile.innerHTML = `<a href="./admin/login.html" class="btn-login"><i class="fas fa-user"></i> Login</a>`;
        }
    }
}

// Função de logout global
window.fazerLogout = async function() {
    const supabase = window.supabase;
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout');
    } else {
        window.location.reload();
    }
};

// Carregar header quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarHeader();
});