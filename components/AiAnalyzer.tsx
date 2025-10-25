import React, { useState } from 'react';
import type { AnalysisData, UploadedFile } from '../types';
import { getAiAnalysis } from '../services/geminiService';

interface AiAnalyzerProps {
  data: AnalysisData | null;
  onAnalysisComplete: (data: AnalysisData) => void;
}

const AiAnalyzer: React.FC<AiAnalyzerProps> = ({ data, onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: UploadedFile[] = [];
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
            fileList.push({
                name: file.name,
                type: file.type,
                size: file.size,
                base64: reader.result as string,
            });
            // When all files are read, update the state
            if (fileList.length === e.target.files?.length) {
                setFiles(prev => [...prev, ...fileList]);
            }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const analyze = async () => {
    if (!data && files.length === 0) return;
    setLoading(true);
    setError('');

    let prompt = '请根据以下信息进行深入分析或优化。';
    if(data) {
        prompt += `\n现有参数数据: ${JSON.stringify(data.params)}。`;
    }
    if(files.length > 0) {
        prompt += `\n请同时分析 ${files.length} 个新上传的文件。`;
    }

    const newData = await getAiAnalysis(prompt, files);

    if (newData) {
      onAnalysisComplete(newData);
      setFiles([]); // Clear files after successful analysis
    } else {
      setError('分析失败，请检查输入或稍后再试。');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-800 rounded-xl border border-violet-500/30">
      <h3 className="text-lg font-semibold text-violet-200 mb-2">AI 优化分析器</h3>
      <p className="text-sm text-gray-400 mb-4">
        基于现有参数，或上传新文件（如规格书、图纸）进行更深入的优化分析。
      </p>
      
      <div className="mb-4">
        <label htmlFor="analyzer-file-upload" className="w-full inline-block text-center px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-md transition-colors cursor-pointer">
          {files.length > 0 ? `已选择 ${files.length} 个文件` : '上传文件进行分析'}
        </label>
        <input id="analyzer-file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <ul className="text-gray-400 text-sm space-y-1">
            {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between bg-slate-800 p-1.5 rounded">
                    <span>{f.name}</span>
                    <button onClick={() => handleRemoveFile(f.name)} className="text-red-400 hover:text-red-300 font-bold text-lg px-2">&times;</button>
                </li>
            ))}
            </ul>
        </div>
      )}

      <button
        onClick={analyze}
        className="w-full px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
        disabled={loading || (!data && files.length === 0)}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        )}
        <span>{loading ? '分析中...' : '开始优化分析'}</span>
      </button>
      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
    </div>
  );
};

export default AiAnalyzer;
