import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles } from 'lucide-react';
import { strings } from '../utils/strings';
import { useAppContext } from '../context/AppContext';

export default function Zwierzak() {
  const { petData, setPetData, addPoints } = useAppContext();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPetting, setIsPetting] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const chatEndRef = useRef(null);

  const isSetup = petData.type && petData.name;

  const handleSetup = (type, name) => {
    if (!name.trim()) return;
    setPetData(prev => ({ ...prev, type, name: name.trim(), happiness: 100 }));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    setChatMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsTyping(true);

    try {
      if (window.puter && window.puter.ai) {
        const systemPrompt = "Jesteś uroczym, wspierającym zwierzakiem w aplikacji Strefa Spokoju. Pomagasz użytkownikowi emocjonalnie, ale nie jesteś terapeutą ani psychologiem. Odpowiadasz krótko, ciepło i bez oceniania.";
        const response = await window.puter.ai.chat(
          `${systemPrompt}\n\nUser: ${userMsg}\nZwierzak:`
        );
        
        setChatMessages(prev => [...prev, { text: response?.message?.content || response, sender: 'pet' }]);
        
        // Boost happiness slightly when chatting
        setPetData(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 5)
        }));
        
        // Check if pet wasn't fed/played today? We can give points for chatting.
        // For now let's just give 2 points per chat msg (max limits can be done but kept simple here)
        if (Math.random() > 0.5) {
            addPoints(2);
        }
      } else {
         setChatMessages(prev => [...prev, { text: "Hau miau! (Problem z połączeniem AI)", sender: 'pet' }]);
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { text: "Hau miau... coś poszło nie tak.", sender: 'pet' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePet = () => {
    if (isPetting) return;
    setIsPetting(true);
    
    // Add floating heart
    const newHeart = { id: Date.now() };
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Update happiness
    setPetData(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 2)
    }));

    if (Math.random() > 0.7) {
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

  const getMoodLabel = () => {
    if (petData.happiness > 70) return strings.zwierzak.moodHappy;
    if (petData.happiness > 30) return strings.zwierzak.moodNeutral;
    return strings.zwierzak.moodSad;
  };

  if (!isSetup) {
    return <SetupPet onComplete={handleSetup} />;
  }

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <motion.div 
        className="bg-surface rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Heart size={14} className={petData.happiness > 30 ? "fill-current" : ""} />
          {petData.happiness}%
        </div>
        
        <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
          {getMoodLabel()}
        </div>

        <motion.div 
          className="relative mt-4 mb-4 cursor-pointer select-none"
          onClick={handlePet}
          animate={{ 
            y: isPetting ? 5 : [0, -5, 0],
            scaleY: isPetting ? 0.9 : 1,
            scaleX: isPetting ? 1.05 : 1
          }}
          transition={{ 
            y: { repeat: isPetting ? 0 : Infinity, duration: 2 },
            default: { duration: 0.2 }
          }}
        >
          <img 
            src={getPetImage()} 
            alt={petData.name} 
            className={`w-40 h-40 object-contain drop-shadow-xl transition-all ${petData.happiness < 40 ? 'grayscale opacity-80' : ''}`}
            style={{ mixBlendMode: 'multiply' }}
          />
          
          <AnimatePresence>
            {floatingHearts.map(heart => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 text-pink-500 z-20 pointer-events-none"
              >
                <Heart size={24} fill="currentColor" />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Cosmetics layer */}
          {petData.equipped.hat && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl pointer-events-none z-10">
              {petData.equipped.hat === 'hat1' ? '🎩' : '🧢'}
            </div>
          )}
          {petData.equipped.glasses && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-5xl pointer-events-none z-10">
              🕶️
            </div>
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-text">{petData.name}</h2>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 bg-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-background/50">
          <h3 className="font-medium text-text flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Porozmawiaj z {petData.name}
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {chatMessages.length === 0 && (
              <p className="text-center text-text-muted text-sm mt-4">
                Napisz coś do swojego zwierzaka!
              </p>
            )}
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-accent/30 text-text border border-accent/50 rounded-tl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-accent/30 text-text border border-accent/50 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-background/50 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={strings.zwierzak.chatPlaceholder}
              className="flex-1 bg-surface border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-primary text-primary-foreground p-2 rounded-full disabled:opacity-50 hover:brightness-95 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SetupPet({ onComplete }) {
  const [type, setType] = useState('dog');
  const [name, setName] = useState('');

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full gap-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-text mb-2">{strings.zwierzak.chooseType}</h2>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={() => setType('dog')}
          className={`flex-1 p-6 rounded-3xl border-2 transition-all ${
            type === 'dog' ? 'border-primary bg-primary/10' : 'border-gray-100 dark:border-gray-800 bg-surface'
          }`}
        >
          <div className="flex justify-center mb-2">
            <img src="/dog.png" alt="Dog" className="w-16 h-16 object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="font-medium">{strings.zwierzak.dog}</div>
        </button>
        <button 
          onClick={() => setType('cat')}
          className={`flex-1 p-4 rounded-3xl border-2 transition-all ${
            type === 'cat' ? 'border-primary bg-primary/10' : 'border-gray-100 dark:border-gray-800 bg-surface'
          }`}
        >
          <div className="flex justify-center mb-2">
            <img src="/cat.png" alt="Cat" className="w-16 h-16 object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="font-medium">{strings.zwierzak.cat}</div>
        </button>
      </div>

      <div className="w-full max-w-sm mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={strings.zwierzak.namePlaceholder}
          className="w-full bg-surface border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 text-center text-lg focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <button
        onClick={() => onComplete(type, name)}
        disabled={!name.trim()}
        className="w-full max-w-sm py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
      >
        {strings.zwierzak.saveName}
      </button>
    </motion.div>
  );
}
