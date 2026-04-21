import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

export default function FloatingPet() {
  const { petData, updatePetMood, addPoints } = useAppContext();
  const location = useLocation();
  const [isPetting, setIsPetting] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Don't show if pet not set up or on the main zwierzak page (where it's already big)
  // Or on onboarding
  const isSetup = petData.type && petData.name;
  const isOnZwierzakPage = location.pathname === '/zwierzak';
  const isShowing = isSetup && !isOnZwierzakPage && location.pathname !== '/onboarding';

  const handlePet = (e) => {
    // If it was a drag, don't pet? Framer motion handles this usually, 
    // but we can check if it was a quick tap.
    if (isPetting) return;
    
    setIsPetting(true);
    
    // Add floating heart
    const newHeart = { id: Date.now(), x: (Math.random() - 0.5) * 40 };
    setFloatingHearts(prev => [...prev, newHeart]);
    
    updatePetMood(1);

    if (Math.random() > 0.8) {
      addPoints(1, 'Za głaskanie!');
    }

    setTimeout(() => setIsPetting(false), 300);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  const getPetImage = () => {
    return petData.type === 'dog' ? '/dog.png' : '/cat.png';
  };

  if (!isShowing) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: window.innerWidth - 80, top: 0, bottom: window.innerHeight - 80 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.1, cursor: 'grabbing' }}
        onTap={handlePet}
        initial={{ x: window.innerWidth - 100, y: window.innerHeight / 2 - 40 }}
        className="absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        style={{ width: 80, height: 80 }}
      >
        <div className="relative w-full h-full">
          <motion.img 
            src={getPetImage()} 
            alt={petData.name} 
            className={`w-full h-full object-contain drop-shadow-lg transition-all ${petData.happiness < 40 ? 'grayscale opacity-80' : ''}`}
            animate={{ 
              y: isPetting ? 5 : [0, -3, 0],
              scaleY: isPetting ? 0.85 : 1,
              scaleX: isPetting ? 1.1 : 1
            }}
            transition={{ 
              y: { repeat: isPetting ? 0 : Infinity, duration: 2.5, ease: "easeInOut" },
              default: { duration: 0.2 }
            }}
            style={{ mixBlendMode: 'multiply' }}
          />

          <AnimatePresence>
            {floatingHearts.map(heart => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, x: heart.x, scale: 0.5 }}
                animate={{ opacity: 0, y: -60, x: heart.x + (Math.random() - 0.5) * 20, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 text-pink-500 z-20 pointer-events-none"
              >
                <Heart size={20} fill="currentColor" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cosmetics layer */}
          {petData.equipped.hat && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl pointer-events-none z-10">
              {petData.equipped.hat === 'hat1' ? '🎩' : '🧢'}
            </div>
          )}
          {petData.equipped.glasses && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl pointer-events-none z-10">
              🕶️
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
