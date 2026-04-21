import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Coins } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppContext } from '../context/AppContext';

export default function TopBar() {
  const { points } = useAppContext();
  const [theme, setTheme] = useLocalStorage('strefa_theme', 'light');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [pointsAnim, setPointsAnim] = useState(false);

  useEffect(() => {
    const handlePointsAdded = (e) => {
      setPointsAnim(true);
      setTimeout(() => setPointsAnim(false), 1000);
    };
    window.addEventListener('points-added', handlePointsAdded);
    return () => window.removeEventListener('points-added', handlePointsAdded);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
  };

  const themes = [
    { id: 'light', name: strings.themes.light, icon: <Sun size={18} /> },
    { id: 'dark', name: strings.themes.dark, icon: <Moon size={18} /> },
    { id: 'blue', name: strings.themes.blue, color: 'bg-blue-200' },
    { id: 'green', name: strings.themes.green, color: 'bg-green-200' },
    { id: 'sand', name: strings.themes.sand, color: 'bg-orange-100' },
  ];

  return (
    <div className="relative sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4 py-3 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-semibold text-primary">{strings.appName}</h1>
      
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm transition-transform duration-300 ${pointsAnim ? 'scale-125 ring-2 ring-yellow-400' : ''}`}>
          <Coins size={16} />
          {points}
        </div>
        <button 
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          className="p-2 rounded-full hover:bg-surface transition-colors"
          aria-label={strings.themes.title}
        >
          <Palette className="text-text-muted" size={24} />
        </button>
      </div>

      {isThemeMenuOpen && (
        <div className="absolute top-14 right-4 bg-surface p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2 min-w-[150px]">
          <p className="text-sm text-text-muted mb-1 px-2">{strings.themes.title}</p>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${theme === t.id ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-background text-text'}`}
            >
              {t.icon ? (
                <span className="text-text-muted">{t.icon}</span>
              ) : (
                <div className={`w-5 h-5 rounded-full ${t.color} border border-gray-200`}></div>
              )}
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
