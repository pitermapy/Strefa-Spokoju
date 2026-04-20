import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Dog } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Start() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  // Dog support state
  const [dogSupportData, setDogSupportData] = useLocalStorage('strefa_dog_support', { count: 0, lastDate: null });
  const [hasHelpedToday, setHasHelpedToday] = useState(false);

  useEffect(() => {
    // Determine today's indices based on the date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    setQuoteIndex(dayOfYear % strings.quotes.length);
    setFactIndex(dayOfYear % strings.facts.length);

    // Check dog support status
    const todayStr = today.toDateString();
    if (dogSupportData.lastDate === todayStr) {
      setHasHelpedToday(true);
    } else if (dogSupportData.lastDate !== null && dogSupportData.lastDate !== todayStr) {
      // Reset if it's a new day, but keep count? The prompt says "Reset co 24h" and "Prosty licznik". 
      // Let's assume the user just wants to click it once a day. The count can be lifetime or just "helped today".
      setHasHelpedToday(false);
    }
  }, [dogSupportData]);

  const handleDogHelp = () => {
    if (!hasHelpedToday) {
      const todayStr = new Date().toDateString();
      setDogSupportData({
        count: dogSupportData.count + 1,
        lastDate: todayStr
      });
      setHasHelpedToday(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome header handled by TopBar, but we can add a subtle greeting */}
      <motion.div variants={itemVariants} className="pt-2">
        <h2 className="text-2xl font-bold text-text">Dzień dobry! 🌿</h2>
      </motion.div>

      {/* Quote of the day */}
      <motion.div variants={itemVariants} className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 opacity-5">
          <Quote size={100} />
        </div>
        <div className="flex items-center gap-2 mb-3 text-primary">
          <Quote size={20} />
          <h3 className="font-semibold">{strings.start.quoteTitle}</h3>
        </div>
        <p className="text-lg font-medium text-text italic">
          "{strings.quotes[quoteIndex]}"
        </p>
      </motion.div>

      {/* Fact of the day */}
      <motion.div variants={itemVariants} className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3 text-secondary">
          <Sparkles size={20} />
          <h3 className="font-semibold">{strings.start.factTitle}</h3>
        </div>
        <p className="text-text-muted leading-relaxed">
          {strings.facts[factIndex]}
        </p>
      </motion.div>

      {/* Dog Support */}
      <motion.div variants={itemVariants} className="bg-accent/30 p-6 rounded-3xl border border-accent/50 text-center flex flex-col items-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-orange-500">
          <Dog size={32} />
        </div>
        <h3 className="font-bold text-text mb-2">{strings.start.dogSupportTitle}</h3>
        <p className="text-sm text-text-muted mb-6">{strings.start.dogSupportDesc}</p>
        
        <button
          onClick={handleDogHelp}
          disabled={hasHelpedToday}
          className={`w-full py-4 rounded-2xl font-semibold transition-all ${
            hasHelpedToday 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-accent text-orange-900 hover:brightness-95 active:scale-95 shadow-sm'
          }`}
        >
          {hasHelpedToday ? strings.start.dogSupportDone : strings.start.dogSupportBtn}
        </button>
        {dogSupportData.count > 0 && (
          <p className="text-xs text-text-muted mt-3">
            Dobre uczynki: {dogSupportData.count}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
