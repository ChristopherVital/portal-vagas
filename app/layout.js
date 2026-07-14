import './globals.css';

export const metadata = {
  title: 'Portal de Vagas LC Recrutamento e Seleção',
  description: 'Encontre vagas e candidate-se enviando seu currículo - LC Recrutamento e Seleção',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <div className="container">
            <h1>📋 Portal de Vagas LC Recrutamento e Seleção</h1>
            <a className="admin-link" href="/admin">Área administrativa</a>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3 className="footer-title">LC Recrutamento e Seleção</h3>
                <p className="footer-info">
                  📍 Belo Horizonte – Minas Gerais
                </p>
              </div>
              <div className="footer-section">
                <h4 className="footer-subtitle">Contato Comercial</h4>
                <a href="https://wa.me/5531982352730" target="_blank" rel="noopener noreferrer" className="footer-phone">
                  📱 (31) 98235-2730
                </a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>Copyright © 2023 LC Recrutamento. Todos os Direitos Reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
