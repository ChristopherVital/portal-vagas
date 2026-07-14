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
      </body>
    </html>
  );
}
