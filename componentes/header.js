// componentes/header.js
export async function carregarHeader() {
  const { supabase } = await import('../js/supabase-config.js');
  const { data: { session } } = await supabase.auth.getSession();

  const authDesktop = document.getElementById('authButtonDesktop');
  const authMobile = document.getElementById('authButtonMobile');
  const userInfoMobile = document.getElementById('userInfoMobile');

  if (!authDesktop) return;

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, avatar_url, tipo_usuario')
      .eq('id', session.user.id)
      .single();

    const nome = profile?.nome || session.user.email?.split('@')[0] || 'Usuário';
    const avatar = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=256d3c&color=fff&bold=true`;

    let dashboardLink = '';
    let dashboardUrl = '';
    if (profile?.tipo_usuario === 'admin') {
      dashboardUrl = './admin/dashboard.html';
      dashboardLink = `<a href="${dashboardUrl}"><i class="fas fa-tachometer-alt"></i> Dashboard Admin</a>`;
    } else if (profile?.tipo_usuario === 'colunista') {
      dashboardUrl = './admin/dashboard_colunista.html';
      dashboardLink = `<a href="${dashboardUrl}"><i class="fas fa-edit"></i> Dashboard Colunista</a>`;
    } else if (profile?.tipo_usuario === 'comercio') {
      const { data: parceiro } = await supabase
        .from('parceiros')
        .select('plano')
        .eq('user_id', session.user.id)
        .single();
      if (parceiro?.plano === 'premium') {
        dashboardUrl = './admin/dashboard_parceiro.html';
        dashboardLink = `<a href="${dashboardUrl}"><i class="fas fa-chart-line"></i> Dashboard Parceiro</a>`;
      }
    }

    // Guarda a URL do dashboard para uso no perfil
    window.dashboardUrl = dashboardUrl;

    authDesktop.innerHTML = `
      <div class="user-menu">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${nome.split(' ')[0]}</span>
        <div class="user-dropdown">
          ${dashboardLink}
          <a href="./pages/perfil.html"><i class="fas fa-user"></i> Meu Perfil</a>
          <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Sair</a>
        </div>
      </div>
    `;

    if (userInfoMobile) {
      userInfoMobile.innerHTML = `
        <div class="user-info-mobile">
          <img src="${avatar}" class="user-avatar-mobile">
          <div>
            <div class="user-name-mobile">${nome}</div>
            <div class="user-email-mobile">${session.user.email}</div>
          </div>
        </div>
      `;
    }
    if (authMobile) {
      authMobile.innerHTML = `<a href="#" id="logoutBtnMobile"><i class="fas fa-sign-out-alt"></i> Sair</a>`;
    }

    document.getElementById('logoutBtn')?.addEventListener('click', () => fazerLogout());
    document.getElementById('logoutBtnMobile')?.addEventListener('click', () => fazerLogout());

  } else {
    authDesktop.innerHTML = `<a href="./admin/login.html" class="btn-login"><i class="fas fa-user"></i> Login</a>`;
    if (userInfoMobile) userInfoMobile.innerHTML = '';
    if (authMobile) authMobile.innerHTML = `<a href="./admin/login.html" class="btn-login"><i class="fas fa-user"></i> Login</a>`;
  }
}

async function fazerLogout() {
  const { supabase } = await import('../js/supabase-config.js');
  await supabase.auth.signOut();
  window.location.href = './index.html';
}