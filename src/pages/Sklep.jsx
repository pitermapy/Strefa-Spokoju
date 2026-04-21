import { motion } from 'framer-motion';
import { ShoppingBag, Coins, Check } from 'lucide-react';
import { strings } from '../utils/strings';
import { useAppContext } from '../context/AppContext';

export default function Sklep() {
  const { points, petData, unlockItem, equipItem } = useAppContext();

  // Shop items data
  const shopItems = [
    { id: 'hat1', name: 'Złoty cylinder', icon: '🎩', price: 50, category: 'hat' },
    { id: 'hat2', name: 'Czapka z daszkiem', icon: '🧢', price: 30, category: 'hat' },
    { id: 'glasses1', name: 'Okulary przeciwsłoneczne', icon: '🕶️', price: 40, category: 'glasses' },
    // more items can be added here
  ];

  const handleBuy = (item) => {
    unlockItem(item.id, item.price);
  };

  const handleEquip = (item) => {
    equipItem(item.category, item.id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-3xl shadow-sm text-primary-foreground flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} />
            {strings.sklep.title}
          </h2>
          <p className="opacity-90 text-sm mt-1">Kupuj akcesoria dla swojego zwierzaka!</p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
          <Coins size={20} className="text-yellow-300" />
          <span className="font-bold text-lg">{points}</span>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {shopItems.map(item => {
          const isUnlocked = petData.unlockedItems.includes(item.id);
          const isEquipped = petData.equipped[item.category] === item.id;
          const canAfford = points >= item.price;

          return (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              className={`bg-surface p-4 rounded-3xl border-2 flex flex-col items-center text-center relative overflow-hidden transition-all ${
                isEquipped ? 'border-primary' : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className="text-5xl my-4">{item.icon}</div>
              <h3 className="font-medium text-text text-sm mb-4 h-10 flex items-center justify-center">
                {item.name}
              </h3>

              {isUnlocked ? (
                <button
                  onClick={() => handleEquip(item)}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-1 ${
                    isEquipped 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-surface border border-gray-200 text-text hover:bg-gray-50'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check size={16} />
                      {strings.sklep.equipped}
                    </>
                  ) : (
                    strings.sklep.equip
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-xl text-sm font-semibold flex justify-center items-center gap-1 transition-colors ${
                    canAfford
                      ? 'bg-secondary text-green-900 hover:brightness-95'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  }`}
                >
                  <Coins size={14} />
                  {item.price}
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
