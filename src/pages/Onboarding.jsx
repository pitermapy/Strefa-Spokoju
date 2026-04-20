import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [, setHasSeenOnboarding] = useLocalStorage('strefa_onboarding', false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      setHasSeenOnboarding(true);
      navigate('/');
    }
  };

  const steps = [
    {
      icon: <Heart size={80} className="text-primary mb-6" />,
      title: strings.onboarding.step1.title,
      desc: strings.onboarding.step1.description,
    },
    {
      icon: <Sparkles size={80} className="text-secondary mb-6" />,
      title: strings.onboarding.step2.title,
      desc: strings.onboarding.step2.description,
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-sm"
        >
          {steps[step].icon}
          <h2 className="text-2xl font-bold text-text mb-4">{steps[step].title}</h2>
          <p className="text-text-muted text-lg mb-12 leading-relaxed">
            {steps[step].desc}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-10">
        <div className={`w-3 h-3 rounded-full transition-colors ${step === 0 ? 'bg-primary' : 'bg-gray-300'}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${step === 1 ? 'bg-primary' : 'bg-gray-300'}`} />
      </div>

      <button
        onClick={handleNext}
        className="w-full max-w-sm bg-primary text-white py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-all"
      >
        {step === 0 ? strings.onboarding.buttonNext : strings.onboarding.buttonStart}
      </button>
    </div>
  );
}
