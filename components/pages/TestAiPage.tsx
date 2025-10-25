import React, { useState } from 'react';
import { getTestResponse } from '../../services/geminiService';

const TestAiPage: React.FC = () => {
  const [prompt, setPrompt] = useState('天空为什么是蓝色的？');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');
    setError('');

    try {
      const responseText = await getTestResponse(prompt);
      setResult(responseText);
    } catch (err: any) {
      const errorMessage = `调用失败: ${err.message || '未知错误'}`;
      setError(errorMessage);
      setResult(''); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-800 rounded-xl border border-violet-500/30 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-violet-200 mb-2">AI 模型即时测试 (Gemini 2.5 Flash)</h2>
      <p className="text-sm text-gray-400 mb-4">在此处输入任意文本，点击按钮，如果下方显示 AI 返回的内容，则说明模型已成功接入。</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="输入测试内容..."
        rows={3}
        className="w-full px-3 py-2 mb-3 rounded-lg bg-slate-700/70 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
      />
      <button
        onClick={handleTest}
        disabled={loading}
        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{loading ? '调用中...' : '发送到 Gemini 2.5 Flash'}</span>
      </button>
      <div className="mt-4 p-4 bg-slate-900 rounded-md text-gray-200 whitespace-pre-wrap min-h-[120px]">
        <h3 className="font-semibold text-gray-400 mb-2 border-b border-slate-700 pb-2">模型响应:</h3>
        {error ? <p className="text-red-400">{error}</p> : <p>{result || '结果将在这里显示...'}</p>}
      </div>
    </div>
  );
};

export default TestAiPage;
