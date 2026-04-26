import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDeleteAccount = () => {
    localStorage.clear();
    setDeleted(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  console.log('isDark:', isDark);

  return (
    <div className="min-h-screen bg-[#FDFCF0] dark:bg-[#1f1f1f] p-8 flex flex-col items-center font-sans transition-colors duration-300">
      <div className="w-full max-w-lg">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors font-bold text-xs uppercase tracking-widest mb-10"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        {/* Title */}
        <h1 className="text-5xl font-black text-stone-800 dark:text-white tracking-tighter mb-10">
          Settings
        </h1>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-[#2a2a2a] border border-stone-200 dark:border-[#3a3a3a] rounded-2xl overflow-hidden mb-4 transition-colors duration-300">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 dark:text-[#555] px-6 pt-5 pb-2">
            Appearance
          </p>

          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-stone-400 dark:text-[#666]" />
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-white">Dark Mode</p>
                <p className="text-xs text-stone-400 dark:text-[#666]">Switch to a darker background</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleDark}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                isDark ? 'bg-[#A1887F]' : 'bg-stone-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-[#2a2a2a] border border-stone-200 dark:border-[#3a3a3a] rounded-2xl overflow-hidden transition-colors duration-300">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 dark:text-[#555] px-6 pt-5 pb-2">
            Account
          </p>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-3 px-6 py-4 border-t border-stone-100 dark:border-[#3a3a3a] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-sm font-semibold text-left"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>

      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>

              <h2 className="text-xl font-black text-stone-800 dark:text-white tracking-tight mb-2">
                Delete your account?
              </h2>
              <p className="text-sm text-stone-400 dark:text-[#666] leading-relaxed mb-6">
                This is permanent. All your shelves and books will be gone forever.
              </p>

              {deleted ? (
                <p className="text-sm font-bold text-green-500">Account deleted. Redirecting...</p>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-stone-200 dark:border-[#3a3a3a] text-sm font-bold text-stone-500 dark:text-[#888] hover:bg-stone-50 dark:hover:bg-[#333] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;