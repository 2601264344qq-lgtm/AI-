import React from 'react';
import type { AnalysisData } from '../../types';
import AiAnalyzer from '../AiAnalyzer';

interface OptimizePageProps {
  initialData: AnalysisData | null;
  onAnalysisComplete: (data: AnalysisData) => void;
}

const OptimizePage: React.FC<OptimizePageProps> = ({ initialData, onAnalysisComplete }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-200 mb-4">参数分析与优化</h1>
      {initialData ? (
        <div className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">当前设计参数</h2>
            <pre className="bg-slate-900 p-4 rounded-md text-sm text-gray-300 overflow-x-auto">
              {JSON.stringify(initialData.params, null, 2)}
            </pre>
            <h2 className="text-xl font-semibold text-gray-200 mt-6 mb-4">初步分析结果</h2>
              <pre className="bg-slate-900 p-4 rounded-md text-sm text-gray-300 overflow-x-auto">
              {JSON.stringify(initialData.visualData, null, 2)}
            </pre>
          </div>
          <AiAnalyzer data={initialData} onAnalysisComplete={onAnalysisComplete} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <p className="text-lg text-gray-400">请先在“与小顾对话”页面完成一次分析以获取初始数据。</p>
        </div>
      )}
    </div>
  );
};

export default OptimizePage;
