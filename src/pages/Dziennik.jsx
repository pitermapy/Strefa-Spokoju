import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppContext } from '../context/AppContext';

export default function Dziennik() {
  const { addPoints, updatePetMood } = useAppContext();
  const [entries, setEntries] = useLocalStorage('strefa_journal', []);
  const [isAdding, setIsAdding] = useState(false);
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSave = () => {
    if (note.trim() || selectedMood !== null) {
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        note: note.trim(),
        mood: selectedMood !== null ? strings.dziennik.moods[selectedMood] : null
      };
      setEntries([newEntry, ...entries]);
      setNote('');
      
      // Update pet mood based on user mood
      if (selectedMood !== null) {
        if (selectedMood < 2) updatePetMood(-10); // Sad/Neutral decreases happiness slightly
        else if (selectedMood > 2) updatePetMood(10); // Happy increases happiness
      }
      
      setSelectedMood(null);
      setIsAdding(false);
      addPoints(10, 'Za wpis w notatniku!');
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className="flex flex-col gap-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text">{strings.dziennik.title}</h2>
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
            className="bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-text-muted">{new Date().toLocaleDateString('pl-PL')}</span>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-text">
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-around mb-6 bg-background p-2 rounded-2xl">
              {strings.dziennik.moods.map((mood, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMood(idx)}
                  className={`text-3xl p-2 rounded-xl transition-transform ${selectedMood === idx ? 'scale-125 bg-surface shadow-sm' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={strings.dziennik.placeholder}
              className="w-full bg-background border-none rounded-2xl p-4 text-text outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32 mb-4"
            />

            <button 
              onClick={handleSave}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium active:scale-95 transition-all"
            >
              {strings.dziennik.save}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <CalendarIcon size={18} className="text-primary" />
          {strings.dziennik.historyTitle}
        </h3>

        {entries.length === 0 ? (
          <div className="text-center py-10 bg-surface rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-text-muted">Brak wpisów. Dodaj swój pierwszy wpis!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4"
              >
                {entry.mood && (
                  <div className="text-4xl bg-background w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                    {entry.mood}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-medium text-text capitalize">{formatDate(entry.date)}</span>
                    <span className="text-xs text-text-muted">{formatTime(entry.date)}</span>
                  </div>
                  {entry.note && (
                    <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                      {entry.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
