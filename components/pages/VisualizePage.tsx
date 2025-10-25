import React from 'react';
import type { AnalysisData } from '../../types';

interface StatCardProps {
    title: string;
    value: string;
    unit: string;
    description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, description }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">
            {value} <span className="text-xl text-gray-300">{unit}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
);

const VisualizePage: React.FC<{ initialData: AnalysisData | null }> = ({ initialData }) => {
  const utilization = initialData ? initialData.visualData.utilization * 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-200 mb-6">结果可视化</h1>
      {initialData ? (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
                <StatCard title="最大应力" value={initialData.visualData.stress.max.toFixed(2)} unit="MPa" description={`位于: ${initialData.visualData.stress.location}`} />
                <StatCard title="最大变形" value={initialData.visualData.deformation.max.toFixed(3)} unit="mm" description={`位于: ${initialData.visualData.deformation.location}`} />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">材料利用率</h2>
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-base font-medium text-blue-300">利用率</span>
                        <span className="text-sm font-medium text-blue-300">{utilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4">
                        <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-4 rounded-full" style={{ width: `${utilization}%` }}></div>
                    </div>
                </div>
            </div>

             <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">设计参数总览</h2>
                <ul className="space-y-2 text-gray-300">
                    <li><strong>零件类型:</strong> {initialData.params.partType}</li>
                    <li><strong>材料类型:</strong> {initialData.params.materialType}</li>
                    <li><strong>外径:</strong> {initialData.params.outerDia} mm</li>
                    <li><strong>内径:</strong> {initialData.params.innerDia} mm</li>
                    <li><strong>长度:</strong> {initialData.params.length} mm</li>
                </ul>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            <p className="text-lg text-gray-400">暂无数据可供可视化。</p>
            <p className="text-sm text-gray-500 mt-1">请先在“与小顾对话”页面完成一次分析。</p>
        </div>
      )}
    </div>
  );
};

export default VisualizePage;
