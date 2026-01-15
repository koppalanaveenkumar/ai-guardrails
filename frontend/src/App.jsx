import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Docs from './components/Docs';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'dashboard', 'docs'
  const [initialMainAuth, setInitialMainAuth] = useState(false);

  // Auto-login if key exists
  useEffect(() => {
    const key = localStorage.getItem('ai_guardrails_key');
    if (key) {
      setView('dashboard');
    }
  }, []);

  const handleGetStarted = () => {
    const key = localStorage.getItem('ai_guardrails_key');
    if (key) {
      setView('dashboard');
    } else {
      // Stay on landing page but show auth modal
      setInitialMainAuth(true);
    }
  };

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onGetStarted={handleGetStarted}
          onViewDocs={() => setView('docs')}
          showAuthModal={initialMainAuth}
          onAuthSuccess={() => {
            setInitialMainAuth(false);
            setView('dashboard');
          }}
          onAuthClose={() => setInitialMainAuth(false)}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          onLogout={() => {
            localStorage.removeItem('ai_guardrails_key');
            setView('landing');
            setInitialMainAuth(false);
          }}
        />
      )}

      {view === 'docs' && (
        <Docs onBack={() => setView('landing')} />
      )}
    </>
  );
}

export default App;
