import './globals.css';
import PasswordGate from '../components/PasswordGate';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Conley Forever & Forever Conley',
  description: 'The official website of the Conley Family.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-US">
      <body>
        <PasswordGate>
          <div className="Site">
            <div className="Site-inner">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </PasswordGate>
      </body>
    </html>
  );
}
