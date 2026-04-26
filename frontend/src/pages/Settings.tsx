import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FDFCF0] p-8 overflow-hidden flex flex-col items-center font-sans">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                Settings Page
            </h1>
            <p className="mt-2 text-lg text-gray-700 font-medium text-center max-w-lg">
                This is where you can manage your account settings and preferences.
            </p>
        </div>
    );
}

export default Settings;
