import React, { useState, useRef, useEffect } from 'react';
import type { AnalysisData, ChatMessage, UploadedFile } from '../../types';
import { getAiAnalysis, getSimpleChatResponse } from '../../services/geminiService';

interface ChatPageProps {
  chatLog: ChatMessage[];
  onChatUpdate: (newLog: ChatMessage[]) => void;
  onAnalysisComplete: (data: AnalysisData) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ chatLog, onChatUpdate, onAnalysisComplete }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Note: The Gemini model has limitations on file types and sizes it can process.
      // This front-end allows any file type, but the service may reject unsupported ones.
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFiles(prev => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };
  
  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSend = async () => {
    if ((!message.trim() && uploadedFiles.length === 0) || isLoading) return;

    const userMessageContent = message.trim() || (uploadedFiles.length > 0 ? `分析上传的 ${uploadedFiles.length} 个文件。` : "");
    const filesToSend = [...uploadedFiles];
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      attachments: filesToSend,
      timestamp: Date.now(),
    };
    
    const updatedLogWithUser = [...chatLog, userMessage];
    onChatUpdate(updatedLogWithUser);

    setMessage('');
    setUploadedFiles([]);
    setIsLoading(true);

    const analysisKeywords = ['分析', '计算', '设计', '参数'];
    const isAnalysisRequest = analysisKeywords.some(keyword => userMessageContent.includes(keyword)) || filesToSend.length > 0;

    let responseContent: string;

    if (isAnalysisRequest) {
      responseContent = "正在为您分析...";
      const analysisData = await getAiAnalysis(userMessageContent, filesToSend);
      if (analysisData) {
        onAnalysisComplete(analysisData);
        responseContent = `已成功为您分析参数，并生成了初步结果。您可以前往“结果可视化”页面查看。`;
      } else {
        responseContent = "抱歉，参数提取或分析失败，请尝试更详细地描述您的需求。";
      }
    } else {
      responseContent = await getSimpleChatResponse(userMessageContent, chatLog, filesToSend);
    }
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseContent,
      timestamp: Date.now(),
    };

    onChatUpdate([...updatedLogWithUser, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-violet-200 mb-4">与小顾对话</h1>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        {chatLog.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>你好！我是您的 AI 设计助手小顾。您可以向我提问，或上传文件、让我帮您分析设计参数，例如：“帮我分析一个外径50mm，内径20mm的45号钢轴”</p>
            </div>
        ) : (
          chatLog.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-blue-400">
                  <p className="text-xs font-semibold mb-1">附件:</p>
                  <ul className="text-xs list-disc list-inside space-y-1">
                    {msg.attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-md px-4 py-2 rounded-lg bg-slate-700 text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                 </div>
            </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-sm font-semibold text-gray-300 mb-2">已准备上传:</p>
            <ul className="text-gray-400 text-sm space-y-1">
            {uploadedFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between bg-slate-800 p-1.5 rounded">
                    <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                    <button onClick={() => handleRemoveFile(f.name)} className="text-red-400 hover:text-red-300 font-bold text-lg px-2">&times;</button>
                </li>
            ))}
            </ul>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <label htmlFor="file-upload" className="cursor-pointer p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors" title="上传文件">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="输入您的问题或附上文件进行分析..."
          className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
        />
        <button onClick={handleSend} disabled={isLoading || (!message.trim() && uploadedFiles.length === 0)} className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed font-semibold">
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
