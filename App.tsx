import React, { useState, useCallback } from 'react';
import type { Page, AnalysisData, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import HomePage from './components/pages/HomePage';
import ChatPage from './components/pages/ChatPage';
import CalculatorPage from './components/pages/CalculatorPage';
import OptimizePage from './components/pages/OptimizePage';
import VisualizePage from './components/pages/VisualizePage';
import ReportPage from './components/pages/ReportPage';
import TestAiPage from './components/pages/TestAiPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  const handleNavigate = useCallback((page: Page) => setActivePage(page), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  
  const handleAnalysisComplete = useCallback((data: AnalysisData) => {
    setAnalysisData(data);
    // Navigate to visualization after analysis is complete for immediate feedback
    if (activePage === 'chat' || activePage === 'optimize') {
      setActivePage('visualize');
    }
  }, [activePage]);

  const handleChatUpdate = useCallback((newLog: ChatMessage[]) => {
    setChatLog(newLog);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'chat': return <ChatPage onAnalysisComplete={handleAnalysisComplete} chatLog={chatLog} onChatUpdate={handleChatUpdate} />;
      case 'calculator': return <CalculatorPage />;
      case 'optimize': return <OptimizePage initialData={analysisData} onAnalysisComplete={handleAnalysisComplete} />;
      case 'visualize': return <VisualizePage initialData={analysisData} />;
      case 'report': return <ReportPage initialData={analysisData} />;
      case 'test-ai': return <TestAiPage />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-gray-300 font-sans">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}>
        <Toolbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
