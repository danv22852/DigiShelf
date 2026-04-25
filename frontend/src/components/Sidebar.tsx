import React from 'react';
import { Layout, BookOpen, Heart, Clock, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Layout, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'My Library', active: false },
    { icon: Heart, label: 'Favorites', active: false },
    { icon: Clock, label: 'To Read', active: false },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col fixed left-0 top-0 bottom-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
        <h1 className="text-xl font-bold text-gray-800">DigiShelf</h1>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
