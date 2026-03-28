// componentes/footer.js
export function carregarFooter() {
  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-info">
            <img src="https://i.imgur.com/9eZarki.png" alt="Tem no Entorno Sul" class="footer-logo">
            <p>Conectando moradores aos melhores comércios, serviços e eventos da região do Entorno Sul.</p>
            <div class="social-links">
              <a href="https://facebook.com/temnoentornosul" target="_blank" class="social-link facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="https://instagram.com/temnoentornosul" target="_blank" class="social-link instagram"><i class="fab fa-instagram"></i></a>
              <a href="https://youtube.com/@temnoentornosul" target="_blank" class="social-link youtube"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
          <div class="footer-links">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="./index.html">Início</a></li>
              <li><a href="./publicacoes.html">Publicações</a></li>
              <li><a href="./eventos.html">Eventos</a></li>
              <li><a href="./colunistas.html">Colunistas</a></li>
              <li><a href="./parceiros.html">Parceiros</a></li>
              <li><a href="./contato.html">Contato</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h3>Para Comércios</h3>
            <ul>
              <li><a href="./cadastro.html">Cadastrar grátis</a></li>
              <li><a href="./planos.html">Planos premium</a></li>
              <li><a href="./admin/login.html">Área do parceiro</a></li>
            </ul>
          </div>
          <div class="footer-contato">
            <h3>Contato</h3>
            <ul>
              <li><i class="fas fa-phone"></i> (61) 99928-9239</li>
              <li><i class="fas fa-envelope"></i> temnoentornosul@gmail.com</li>
              <li><i class="fas fa-map-marker-alt"></i> Valparaíso de Goiás/GO</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Tem no Entorno Sul. Todos os direitos reservados</p>
          <div class="footer-extra">
            <span>Desenvolvido por <a href="https://www.reipersonalizacoes.com.br" target="_blank">REI Personalizações</a></span>
          </div>
        </div>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHtml);
}