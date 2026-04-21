import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Plus, Wind, Coffee, Activity } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppContext } from '../context/AppContext';

export default function Relaks() {
  const { addPoints } = useAppContext();
  const [customExercises, setCustomExercises] = useLocalStorage('strefa_exercises', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newExercise, setNewExercise] = useState('');
  
  const [activeExercise, setActiveExercise] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(1);

  const defaultExercises = [
    { id: 'breathe', name: strings.relaks.exerciseBreathe, icon: <Wind size={20} /> },
    { id: 'break', name: strings.relaks.exerciseBreak, icon: <Coffee size={20} /> },
    { id: 'stretch', name: strings.relaks.exerciseStretch, icon: <Activity size={20} /> },
  ];

  const allExercises = [...defaultExercises, ...customExercises];

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      setActiveExercise(null);
      addPoints(15, 'Za udany relaks!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const toggleTimer = (exercise) => {
    if (activeExercise?.id === exercise.id && isActive) {
      // Stop
      setIsActive(false);
      setActiveExercise(null);
    } else {
      // Start
      setActiveExercise(exercise);
      setTimeRemaining(selectedMinutes * 60);
      setIsActive(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = () => {
    if (newExercise.trim()) {
      setCustomExercises([...customExercises, { id: `custom_${Date.now()}`, name: newExercise, icon: <Wind size={20} /> }]);
      setNewExercise('');
      setIsAdding(false);
    }
  };

  // Breathing animation variants
  const breathVariants = {
    inhale: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "easeInOut" } },
    hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4 } }, // holding doesn't animate scale
    exhale: { scale: 1, opacity: 0.4, transition: { duration: 4, ease: "easeInOut" } },
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-text mb-2">{strings.relaks.title}</h2>

      {isActive && activeExercise?.id === 'breathe' && (
        <div className="flex justify-center my-8">
          <motion.div
            className="w-32 h-32 rounded-full bg-primary/40 flex items-center justify-center relative"
            animate={["inhale", "exhale"]}
            variants={breathVariants}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 4
            }}
          >
            <div className="w-24 h-24 rounded-full bg-primary/60 flex items-center justify-center absolute">
              <Wind className="text-white opacity-80" size={32} />
            </div>
          </motion.div>
        </div>
      )}

      {isActive && activeExercise?.id !== 'breathe' && (
        <div className="flex justify-center my-8">
          <motion.div 
            className="w-32 h-32 rounded-full bg-secondary/40 flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <div className="w-24 h-24 rounded-full bg-secondary/60 flex items-center justify-center absolute">
              {activeExercise.icon}
            </div>
          </motion.div>
        </div>
      )}

      {isActive && (
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2 font-mono">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-text-muted">{activeExercise?.name}</p>
        </div>
      )}

      {!isActive && (
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <label className="block text-sm font-medium text-text-muted mb-3">
            Czas trwania: {selectedMinutes} {strings.relaks.timerMinutes}
          </label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={selectedMinutes} 
            onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>1 min</span>
            <span>5 min</span>
          </div>
        </div>
      )}

      <div className="space-y-3 mt-2">
        {allExercises.map(exercise => (
          <div key={exercise.id} className="flex items-center justify-between bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-full text-text-muted">
                {exercise.icon}
              </div>
              <span className="font-medium text-text">{exercise.name}</span>
            </div>
            <button 
              onClick={() => toggleTimer(exercise)}
              className={`p-3 rounded-full transition-colors ${
                isActive && activeExercise?.id === exercise.id 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isActive && activeExercise?.id === exercise.id ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
          </div>
        ))}

        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-text-muted hover:text-text hover:border-gray-300 transition-colors"
          >
            <Plus size={20} />
            <span>{strings.relaks.addExerciseBtn}</span>
          </button>
        ) : (
          <div className="bg-surface p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <input 
              autoFocus
              type="text" 
              placeholder={strings.relaks.addExerciseTitle}
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              className="w-full bg-background border-none rounded-xl p-3 text-text outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleAddExercise}
                className="flex-1 bg-primary text-white py-2 rounded-xl font-medium"
              >
                {strings.relaks.save}
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-background text-text py-2 rounded-xl font-medium"
              >
                {strings.relaks.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
