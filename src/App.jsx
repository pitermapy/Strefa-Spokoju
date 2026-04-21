import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';

// Layout & Components
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';

// Pages
import Start from './pages/Start';
import Dziennik from './pages/Dziennik';
import Relaks from './pages/Relaks';
import Quiz from './pages/Quiz';
import Odliczanie from './pages/Odliczanie';
import Onboarding from './pages/Onboarding';
import Zwierzak from './pages/Zwierzak';
import Sklep from './pages/Sklep';
import FloatingPet from './components/FloatingPet';

function App() {
  const [theme] = useLocalStorage('strefa_theme', 'light');
  const [hasSeenOnboarding] = useLocalStorage('strefa_onboarding', false);
  const location = useLocation();

  // Apply theme class
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  const showNav = hasSeenOnboarding && location.pathname !== '/onboarding';

  return (
    <div className="flex flex-col min-h-screen bg-background text-text font-sans">
      {showNav && <TopBar />}
      
      <main className="flex-1 overflow-y-auto pb-20 pt-4 px-4">
        <Routes>
          {!hasSeenOnboarding ? (
            <>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Start />} />
              <Route path="/dziennik" element={<Dziennik />} />
              <Route path="/relaks" element={<Relaks />} />
              <Route path="/zwierzak" element={<Zwierzak />} />
              <Route path="/sklep" element={<Sklep />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/odliczanie" element={<Odliczanie />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>

      {showNav && <BottomNav />}
      <FloatingPet />
    </div>
  );
}

export default App;
