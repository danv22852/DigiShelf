import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, LogOut, Trash2, Edit3, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
type Book = {
  id: string;
  color: string;
  height: string;
  title?: string;
};

type Shelf = Book[];

const CATEGORIES = ['Reading', 'To Read', 'Completed'];
const MAX_BOOKS_PER_SHELF = 18; // Increased slightly for better density
const BOOK_COLORS = ['#8D6E63', '#5D4037', '#795548', '#A1887F', '#6D4C41', '#3E2723', '#2E7D32', '#1565C0', '#C62828', '#F9A825'];

// --- HELPER: Generate a random book ---
const createBook = (): Book => ({
  id: Math.random().toString(36).substr(2, 9),
  color: BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)],
  height: ['120px', '145px', '110px', '132px', '125px'][Math.floor(Math.random() * 5)],
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(0);
  const [editingShelf, setEditingShelf] = useState<{ category: string; index: number } | null>(null);

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<number>(() => {
    const saved = localStorage.getItem('active_bookshelf_tab');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Refactored State: Stores ARRAYS of Books, not just numbers
  const [collections, setCollections] = useState<{ [key: string]: Shelf[] }>(() => {
    const saved = localStorage.getItem('my_bookshelves_v2');
    if (saved) return JSON.parse(saved);
    
    // Default starter data
    return {
      'Reading': [[createBook(), createBook(), createBook()]], 
      'To Read': [[]],
      'Completed': [[]]
    };
  });

  useEffect(() => {
    localStorage.setItem('my_bookshelves_v2', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('active_bookshelf_tab', activeTab.toString());
  }, [activeTab]);

  const activeCategory = CATEGORIES[activeTab];
  const currentShelves = collections[activeCategory];

  // --- ACTIONS ---

  const changeTab = (newDirection: number) => {
    setDirection(newDirection);
    setActiveTab((prev) => (prev + newDirection + CATEGORIES.length) % CATEGORIES.length);
  };

  const addShelfLayer = () => {
    setCollections(prev => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], []]
    }));
  };

  const deleteShelfLayer = (index: number) => {
    if (currentShelves.length <= 1) {
      // If it's the last shelf, just clear it instead of deleting the layer
      const updated = [...currentShelves];
      updated[index] = [];
      setCollections(prev => ({ ...prev, [activeCategory]: updated }));
      return;
    }
    const updated = currentShelves.filter((_, i) => i !== index);
    setCollections(prev => ({ ...prev, [activeCategory]: updated }));
  };

  // --- MODAL ACTIONS (Passed down to the Edit Modal) ---
  
  const updateShelf = (category: string, shelfIndex: number, newBooks: Book[]) => {
    setCollections(prev => {
      const newShelves = [...prev[category]];
      newShelves[shelfIndex] = newBooks;
      return { ...prev, [category]: newShelves };
    });
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 600 : -600, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] p-8 flex flex-col items-center font-sans relative overflow-x-hidden">
      
      {/* Top Controls */}
      <button 
        onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
        className="absolute top-6 left-6 flex items-center gap-2 text-stone-400 hover:text-red-500 transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <LogOut size={18} /> Logout
      </button>

      {/* Header */}
      <div className="max-w-4xl w-full flex justify-between items-center mb-10 z-10">
        <button onClick={() => changeTab(-1)} className="p-2 hover:bg-stone-200/50 rounded-full transition-all"><ChevronLeft size={40}/></button>
        <h1 className="text-5xl font-black text-stone-800 tracking-tighter">{activeCategory}</h1>
        <button onClick={() => changeTab(1)} className="p-2 hover:bg-stone-200/50 rounded-full transition-all"><ChevronRight size={40}/></button>
      </div>

      {/* Bookshelf Display */}
      <div className="relative w-full max-w-4xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeCategory}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="w-full bg-[#3E2723] border-x-[24px] border-t-[28px] border-[#5D4037] rounded-t-xl shadow-2xl"
          >
            <div className="bg-[#4E342E] p-10 min-h-[550px] shadow-inner relative">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none h-12" />
              
              {currentShelves.map((shelfBooks, index) => (
                <div key={index} className="mb-12 border-b-[12px] border-[#3E2723] flex items-end px-6 pb-0 min-h-[150px] relative group/shelf">
                  
                  {/* Shelf Action Buttons (Visible on Hover) */}
                  <div className="absolute -right-6 top-0 flex flex-col gap-2 opacity-0 group-hover/shelf:opacity-100 transition-all z-20">
                    <button 
                      onClick={() => setEditingShelf({ category: activeCategory, index })}
                      className="p-2 bg-white/10 hover:bg-blue-500 text-white rounded-full shadow-md backdrop-blur-sm transition-colors"
                      title="Edit Shelf"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteShelfLayer(index)}
                      className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full shadow-md backdrop-blur-sm transition-colors"
                      title="Delete Layer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Render Books */}
                  {shelfBooks.map((book) => (
                    <motion.div 
                      key={book.id}
                      layoutId={book.id}
                      className="w-11 mx-[1px] rounded-t-sm shadow-md border-l border-white/10 relative group/book"
                      style={{ height: book.height, backgroundColor: book.color }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/book:bg-white/10 transition-colors" />
                    </motion.div>
                  ))}

                  {/* Empty State Hint */}
                  {shelfBooks.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-sm font-medium italic">
                      Empty Shelf
                    </div>
                  )}
                </div>
              ))}
              
              <button onClick={addShelfLayer} className="w-full mt-6 py-3 border-2 border-dashed border-white/10 text-[#A1887F] hover:text-white hover:border-white/30 hover:bg-white/5 text-xs uppercase font-bold tracking-[0.2em] rounded-lg transition-all">
                + Add New Layer
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="h-10 bg-[#5D4037] w-[calc(100%+8px)] -ml-1 rounded-b-xl shadow-2xl border-t-2 border-black/20" />
      </div>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {editingShelf && (
          <EditShelfModal 
            category={editingShelf.category}
            shelfIndex={editingShelf.index}
            books={collections[editingShelf.category][editingShelf.index]}
            onSave={(newBooks) => {
              updateShelf(editingShelf.category, editingShelf.index, newBooks);
              setEditingShelf(null);
            }}
            onClose={() => setEditingShelf(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENT: EDIT SHELF MODAL ---
const EditShelfModal: React.FC<{
  category: string;
  shelfIndex: number;
  books: Book[];
  onSave: (books: Book[]) => void;
  onClose: () => void;
}> = ({ category, shelfIndex, books, onSave, onClose }) => {
  const [tempBooks, setTempBooks] = useState<Book[]>(books);

  const addNewBook = () => {
    if (tempBooks.length >= MAX_BOOKS_PER_SHELF) return;
    setTempBooks([...tempBooks, createBook()]);
  };

  const removeBook = (id: string) => {
    setTempBooks(tempBooks.filter(b => b.id !== id));
  };

  const changeColor = (id: string, newColor: string) => {
    setTempBooks(tempBooks.map(b => b.id === id ? { ...b, color: newColor } : b));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Edit Shelf Layer {shelfIndex + 1}</h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{category} Collection</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content: Scrollable List */}
        <div className="p-8 overflow-y-auto flex-1">
          
          {/* Visual Shelf Preview */}
          <div className="mb-8 p-6 bg-[#4E342E] rounded-lg flex items-end justify-center min-h-[160px] shadow-inner border-b-8 border-[#3E2723]">
             {tempBooks.map((book) => (
                <div 
                  key={book.id}
                  className="w-10 mx-[1px] rounded-t-sm shadow-lg border-l border-white/10"
                  style={{ height: book.height, backgroundColor: book.color }}
                />
              ))}
              {tempBooks.length === 0 && <span className="text-white/20 text-sm">Empty Shelf Preview</span>}
          </div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Manage Books ({tempBooks.length}/{MAX_BOOKS_PER_SHELF})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tempBooks.map((book, i) => (
              <div key={book.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                {/* Book Color Picker */}
                <div className="relative group/picker">
                  <div 
                    className="w-10 h-14 rounded shadow-sm border-l-2 border-black/5 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: book.color }}
                  />
                  {/* Color Dropdown on Hover */}
                  <div className="absolute top-full left-0 mt-2 bg-white p-2 rounded-lg shadow-xl border border-gray-100 grid grid-cols-5 gap-1 w-40 opacity-0 group-hover/picker:opacity-100 pointer-events-none group-hover/picker:pointer-events-auto z-10 transition-opacity">
                    {BOOK_COLORS.map(c => (
                      <button 
                        key={c} 
                        onClick={() => changeColor(book.id, c)}
                        className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-700">Book #{i + 1}</p>
                  <p className="text-xs text-gray-400">Hover cover to change color</p>
                </div>

                <button 
                  onClick={() => removeBook(book.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Add Button */}
            {tempBooks.length < MAX_BOOKS_PER_SHELF && (
              <button 
                onClick={addNewBook}
                className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all h-[88px]"
              >
                <Plus size={24} />
                <span className="text-xs font-bold uppercase">Add Book</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(tempBooks)} className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Check size={18} /> Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
