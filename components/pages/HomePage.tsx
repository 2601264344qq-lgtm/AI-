import React from 'react';
import type { Page } from '../../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const welcomeText = "欢迎使用 AI 智能设计助手";
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      </div>
      <h1 
        className="text-4xl md:text-5xl font-bold text-violet-200 mb-4 animate-typewriter"
        style={{ '--chars': welcomeText.length } as React.CSSProperties}
      >
        {welcomeText}
      </h1>
      <p className="text-lg text-gray-400 mb-8 max-w-2xl">
        一个集成了 Gemini 2.5 Flash 的强大工具，旨在简化您的工程设计流程。从与 AI 对话获取参数，到使用专业计算器，再到数据可视化和报告生成，一切尽在掌握。
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => onNavigate('chat')}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          与小顾对话
        </button>
        <button
          onClick={() => onNavigate('calculator')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          工程计算器
        </button>
      </div>
    </div>
  );
};

export default HomePage;
