import { NavLink } from 'react-router-dom';
import { Home, Book, Wind, Dog, ShoppingBag } from 'lucide-react';
import { strings } from '../utils/strings';

export default function BottomNav() {
  const navItems = [
    { path: '/', label: strings.nav.start, icon: <Home size={24} /> },
    { path: '/dziennik', label: strings.nav.dziennik, icon: <Book size={24} /> },
    { path: '/zwierzak', label: strings.nav.zwierzak, icon: <Dog size={24} /> },
    { path: '/sklep', label: strings.nav.sklep, icon: <ShoppingBag size={24} /> },
    { path: '/relaks', label: strings.nav.relaks, icon: <Wind size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-surface shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe pt-2 px-2 z-50">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary transform -translate-y-1'
                    : 'text-text-muted hover:bg-background/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
