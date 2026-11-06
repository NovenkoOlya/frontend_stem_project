import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Trades } from './pages/Trades';
import { Profile } from './pages/Profile';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg)', transition: 'background-color 0.3s' }}>
            
            <Header />

            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;