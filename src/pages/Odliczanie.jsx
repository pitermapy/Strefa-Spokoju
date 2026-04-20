import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar as CalendarIcon, Plus, X, Sun } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Odliczanie() {
  const defaultEvents = [
    {
      id: 'summer',
      name: strings.odliczanie.holidayTitle,
      date: new Date(new Date().getFullYear(), 5, 25).toISOString(), // Roughly start of summer holidays in PL
      icon: 'sun'
    }
  ];

  // If holiday passed this year, set for next year
  if (new Date(defaultEvents[0].date) < new Date()) {
    defaultEvents[0].date = new Date(new Date().getFullYear() + 1, 5, 25).toISOString();
  }

  const [customEvents, setCustomEvents] = useLocalStorage('strefa_events', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  
  const allEvents = [...defaultEvents, ...customEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  const calculateDays = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const handleAdd = () => {
    if (newEventName.trim() && newEventDate) {
      setCustomEvents([
        ...customEvents, 
        { 
          id: Date.now().toString(), 
          name: newEventName, 
          date: new Date(newEventDate).toISOString(),
          icon: 'calendar'
        }
      ]);
      setNewEventName('');
      setNewEventDate('');
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  return (
    <motion.div 
      className="flex flex-col gap-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text">{strings.odliczanie.title}</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-text">{strings.odliczanie.addEventBtn}</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-text">
                <X size={20} />
              </button>
            </div>

            <input 
              type="text" 
              placeholder={strings.odliczanie.eventName}
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              className="w-full bg-background border-none rounded-xl p-3 text-text outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            
            <input 
              type="date" 
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="w-full bg-background border-none rounded-xl p-3 text-text outline-none focus:ring-2 focus:ring-primary mb-5"
            />

            <button 
              onClick={handleAdd}
              disabled={!newEventName || !newEventDate}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium active:scale-95 transition-all disabled:opacity-50"
            >
              {strings.odliczanie.save}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {allEvents.map(event => {
          const days = calculateDays(event.date);
          const isPast = days === 0 && new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
          
          if (isPast && event.id !== 'summer') return null;

          return (
            <motion.div 
              key={event.id}
              layout
              className={`bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 relative overflow-hidden ${event.id === 'summer' ? 'bg-gradient-to-br from-surface to-accent/20' : ''}`}
            >
              {event.id !== 'summer' && (
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${event.id === 'summer' ? 'bg-orange-100 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                {event.icon === 'sun' ? <Sun size={28} /> : <CalendarIcon size={28} />}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-text text-lg">{event.name}</h3>
                <p className="text-sm text-text-muted mt-1">
                  {new Date(event.date).toLocaleDateString('pl-PL')}
                </p>
              </div>

              <div className="text-right shrink-0 min-w-[70px]">
                <div className="text-3xl font-bold text-text">{days}</div>
                <div className="text-xs text-text-muted">{strings.odliczanie.days}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
