import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [points, setPoints] = useLocalStorage('strefa_points', 0);
  const [streak, setStreak] = useLocalStorage('strefa_streak', { days: 0, lastLogin: null });
  const [petData, setPetData] = useLocalStorage('strefa_pet', {
    type: null, // 'dog' | 'cat'
    name: '',
    happiness: 100, // 0-100
    equipped: { hat: null, glasses: null, hoodie: null, costume: null },
    unlockedItems: [] // array of item IDs
  });
  
  // Streak logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastLogin !== today) {
      if (streak.lastLogin) {
        const lastDate = new Date(streak.lastLogin);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Add streak points
          addPoints(10, 'Za codzienny streak logowania! 🔥');
          setStreak({ days: streak.days + 1, lastLogin: today });
        } else {
          // Reset streak
          setStreak({ days: 1, lastLogin: today });
        }
      } else {
        // First time
        setStreak({ days: 1, lastLogin: today });
      }
    }
  }, []);

  const addPoints = (amount, reason = '') => {
    setPoints(prev => prev + amount);
    // Could show a toast here if we had a toast system, 
    // for now we'll just dispatch an event that components can listen to for animation
    window.dispatchEvent(new CustomEvent('points-added', { detail: { amount, reason } }));
  };

  const spendPoints = (amount) => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      return true;
    }
    return false;
  };

  const unlockItem = (itemId, cost) => {
    if (spendPoints(cost)) {
      setPetData(prev => ({
        ...prev,
        unlockedItems: [...prev.unlockedItems, itemId]
      }));
      return true;
    }
    return false;
  };

  const equipItem = (category, itemId) => {
    setPetData(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [category]: prev.equipped[category] === itemId ? null : itemId // toggle
      }
    }));
  };

  const updatePetMood = (amount) => {
    setPetData(prev => ({
      ...prev,
      happiness: Math.min(100, Math.max(0, prev.happiness + amount))
    }));
  };

  return (
    <AppContext.Provider value={{
      points, addPoints, spendPoints,
      streak,
      petData, setPetData, unlockItem, equipItem, updatePetMood
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
