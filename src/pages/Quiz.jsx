import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { strings } from '../utils/strings';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Quiz() {
  const [lastResult, setLastResult] = useLocalStorage('strefa_quiz_result', null);
  const [currentStep, setCurrentStep] = useState(lastResult ? 'result' : 'start'); // start, playing, result
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = () => {
    setCurrentStep('playing');
    setCurrentQuestionIdx(0);
    setScore(0);
  };

  const handleAnswer = (value) => {
    const newScore = score + value;
    
    if (currentQuestionIdx < strings.quiz.questions.length - 1) {
      setScore(newScore);
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Finish quiz
      const finalScore = newScore;
      const isGood = finalScore > (strings.quiz.questions.length * 1.5); // simple threshold
      const resultData = {
        date: new Date().toISOString(),
        isGood
      };
      setLastResult(resultData);
      setCurrentStep('result');
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-[70vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-text mb-6">{strings.quiz.title}</h2>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface p-8 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <CheckCircle2 size={40} />
              </div>
              <p className="text-text-muted mb-8 leading-relaxed">
                Ten krótki quiz pomoże Ci zatrzymać się na chwilę i zastanowić nad swoim samopoczuciem.
              </p>
              <button 
                onClick={handleStart}
                className="bg-primary text-white w-full py-4 rounded-2xl font-semibold active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                {strings.quiz.startBtn}
              </button>
            </motion.div>
          )}

          {currentStep === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col h-full"
            >
              <div className="mb-8">
                <div className="flex justify-between text-sm text-text-muted mb-2 font-medium">
                  <span>Pytanie {currentQuestionIdx + 1}</span>
                  <span>z {strings.quiz.questions.length}</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIdx + 1) / strings.quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-auto flex-1 flex items-center justify-center min-h-[200px]">
                <h3 className="text-xl font-medium text-text text-center leading-relaxed">
                  {strings.quiz.questions[currentQuestionIdx]}
                </h3>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button onClick={() => handleAnswer(2)} className="bg-secondary/20 hover:bg-secondary/30 text-secondary-darker dark:text-green-400 py-4 rounded-2xl font-medium transition-colors">
                  {strings.quiz.answers.yes}
                </button>
                <button onClick={() => handleAnswer(1)} className="bg-accent/40 hover:bg-accent/60 text-orange-800 dark:text-orange-300 py-4 rounded-2xl font-medium transition-colors">
                  {strings.quiz.answers.sometimes}
                </button>
                <button onClick={() => handleAnswer(0)} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text py-4 rounded-2xl font-medium transition-colors">
                  {strings.quiz.answers.no}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && lastResult && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface p-8 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${lastResult.isGood ? 'bg-secondary/20 text-green-600' : 'bg-primary/20 text-blue-600'}`}>
                <CheckCircle2 size={48} />
              </div>
              
              <h3 className="text-xl font-bold text-text mb-4">Twój wynik</h3>
              
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                {lastResult.isGood ? strings.quiz.resultGood : strings.quiz.resultNeedsSupport}
              </p>

              <div className="bg-background p-4 rounded-xl mb-8 border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-text-muted opacity-80">
                  {strings.quiz.resultDisclaimer}
                </p>
              </div>

              <button 
                onClick={handleStart}
                className="flex items-center justify-center gap-2 w-full py-4 text-primary bg-primary/10 rounded-2xl font-medium active:scale-95 transition-all"
              >
                <RefreshCw size={18} />
                {strings.quiz.retake}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
