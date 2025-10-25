import React from 'react';
import type { Page, NavItem } from '../types';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 17h.01M15 17h.01M9 10h.01M12 10h.01M15 10h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const OptimizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const VisualizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TestTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.363-.448c-.57-.108-1.14-.108-1.71 0l-2.363.448a2 2 0 01-1.022.547M16 21v-2a4 4 0 00-4-4H12a4 4 0 00-4 4v2m8-12V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v4h8z" /></svg>;

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen }) => {
  const navItems: NavItem[] = [
    { id: 'home', label: '主页', icon: <HomeIcon /> },
    { id: 'chat', label: '与小顾对话', icon: <ChatIcon /> },
    { id: 'calculator', label: '工程计算器', icon: <CalculatorIcon /> },
    { id: 'optimize', label: '参数优化', icon: <OptimizeIcon /> },
    { id: 'visualize', label: '结果可视化', icon: <VisualizeIcon /> },
    { id: 'report', label: '生成报告', icon: <ReportIcon /> },
    { id: 'test-ai', label: '测试 AI', icon: <TestTubeIcon /> },
  ];

  const sidebarClasses = `fixed top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col p-4 border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">AI 设计助手</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activePage === item.id 
                ? 'bg-violet-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
