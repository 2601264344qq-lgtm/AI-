import React from 'react';
import type { AnalysisData } from '../../types';

const ReportPage: React.FC<{ initialData: AnalysisData | null }> = ({ initialData }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-violet-200">报告生成</h1>
        {initialData && (
             <button
                onClick={handlePrint}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors flex items-center gap-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                <span>打印报告</span>
            </button>
        )}
      </div>

      {initialData ? (
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 prose prose-invert max-w-none prose-h2:text-violet-300 prose-strong:text-gray-200">
            <h2>设计参数</h2>
            <ul>
                <li><strong>零件类型:</strong> {initialData.params.partType}</li>
                <li><strong>材料类型:</strong> {initialData.params.materialType}</li>
                <li><strong>外径 (mm):</strong> {initialData.params.outerDia}</li>
                <li><strong>内径 (mm):</strong> {initialData.params.innerDia}</li>
                <li><strong>长度 (mm):</strong> {initialData.params.length}</li>
            </ul>

            <h2>分析结果</h2>
             <ul>
                <li><strong>最大应力 (MPa):</strong> {initialData.visualData.stress.max.toFixed(2)} (位于: {initialData.visualData.stress.location})</li>
                <li><strong>最大变形 (mm):</strong> {initialData.visualData.deformation.max.toFixed(3)} (位于: {initialData.visualData.deformation.location})</li>
                <li><strong>材料利用率:</strong> {(initialData.visualData.utilization * 100).toFixed(1)}%</li>
            </ul>

            <h2>完整数据</h2>
            <pre className="bg-slate-900 p-4 rounded-md text-sm">
                {JSON.stringify(initialData, null, 2)}
            </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-lg text-gray-400">请先进行分析以生成报告。</p>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
