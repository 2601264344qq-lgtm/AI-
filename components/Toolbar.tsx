import React from 'react';

interface ToolbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="w-full h-16 bg-slate-900/80 backdrop-blur-sm text-white flex items-center px-6 border-b border-slate-700 sticky top-0 z-10">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <div className="flex-grow">
        {/* Can add page title here if needed */}
      </div>
    </header>
  );
};

export default Toolbar;
