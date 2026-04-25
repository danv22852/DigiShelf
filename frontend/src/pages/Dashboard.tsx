import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Reading', 'To Read', 'Completed'];
const MAX_BOOKS_PER_SHELF = 8;

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);

  // 1. Independent State: Each category has its own array of shelves
  const [collections, setCollections] = useState<{ [key: string]: number[] }>({
    'Reading': [3, 2], // Shelf 1 has 3 books, Shelf 2 has 2
    'To Read': [0],    // Starts with one empty shelf
    'Completed': [8, 8, 4] // Two full shelves and one half-full
  });

  const activeCategory = CATEGORIES[activeTab];
  const currentShelves = collections[activeCategory];

  const changeTab = (newDirection: number) => {
    setDirection(newDirection);
    setActiveTab((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return CATEGORIES.length - 1;
      if (nextIndex >= CATEGORIES.length) return 0;
      return nextIndex;
    });
  };

  // 2. Updated Add Shelf Logic for specific category
  const addShelf = () => {
    setCollections(prev => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], 0]
    }));
  };

  // 3. Updated Add Book Logic for specific category
  const addBookToShelf = (shelfIndex: number) => {
    if (currentShelves[shelfIndex] < MAX_BOOKS_PER_SHELF) {
      const updatedShelves = [...currentShelves];
      updatedShelves[shelfIndex]++;
      setCollections(prev => ({
        ...prev,
        [activeCategory]: updatedShelves
      }));
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 500 : -500, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 500 : -500, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] p-8 overflow-hidden flex flex-col items-center font-sans">
      
      {/* Navigation */}
      <div className="max-w-4xl w-full flex justify-between items-center mb-10">
        <button onClick={() => changeTab(-1)} className="p-2 hover:bg-orange-100 rounded-full"><ChevronLeft size={32}/></button>
        <div className="text-center">
          <h1 className="text-4xl font-black text-stone-800">{activeCategory}</h1>
        </div>
        <button onClick={() => changeTab(1)} className="p-2 hover:bg-orange-100 rounded-full"><ChevronRight size={32}/></button>
      </div>

      {/* Bookshelf Casing */}
      <div className="relative w-full max-w-4xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeCategory} // Key changes per category to trigger independent animation
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full bg-[#3E2723] border-x-[20px] border-t-[24px] border-[#5D4037] rounded-t-lg shadow-2xl overflow-hidden"
          >
            <div className="bg-[#4E342E] p-10 min-h-[500px]">
              {currentShelves.map((bookCount, shelfIdx) => (
                <div key={shelfIdx} className="mb-10 border-b-[10px] border-[#3E2723] flex items-end px-4 pb-0 min-h-[120px]">
                  {Array.from({ length: bookCount }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-32 mx-[2px] rounded-sm shadow-md"
                      style={{ backgroundColor: ['#8D6E63', '#795548', '#5D4037'][i % 3] }}
                    />
                  ))}
                  {bookCount < MAX_BOOKS_PER_SHELF && (
                    <button onClick={() => addBookToShelf(shelfIdx)} className="w-10 h-24 ml-2 border border-white/10 text-white/20 flex items-center justify-center hover:bg-white/5">
                      <Plus size={16}/>
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={addShelf} className="w-full mt-4 text-[#A1887F] hover:text-white text-xs uppercase font-bold tracking-widest">
                + Add Layer
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="h-8 bg-[#5D4037] w-full rounded-b-lg shadow-xl" />
      </div>
    </div>
  );
};

export default Dashboard;
