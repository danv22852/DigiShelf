import React from 'react';
import { Search, Plus } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        <Plus size={20} />
        <span>Add Book</span>
      </button>
    </header>
  );
};

export default Header;
