import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface GearCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const GearCalculator: React.FC<GearCalculatorProps> = ({ onCalculate }) => {
  const [module, setModule] = useState('');
  const [teeth, setTeeth] = useState('');
  const [pressureAngle, setPressureAngle] = useState('20');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const m = parseFloat(module);
    const z = parseInt(teeth);
    const alpha = parseFloat(pressureAngle);

    if (!(m > 0 && z > 0 && alpha > 0)) {
      alert('请输入有效的正数作为模数、齿数和压力角。');
      return;
    }
    
    setLoading(true);
    try {
        const prompt = `请帮我计算齿轮参数：模数: ${module} mm, 齿数: ${teeth}, 压力角: ${pressureAngle}°。请输出分度圆直径、外径、基圆直径和齿距。`;
        const resultText = await getCalculationResponse(prompt);

        onCalculate({
            id: Date.now().toString(),
            title: '齿轮参数计算 (AI)',
            inputs: [
            { label: '模数', value: `${m} mm` },
            { label: '齿数', value: z },
            { label: '压力角', value: `${alpha}°` }
            ],
            output: [
                { label: 'AI 计算结果', value: resultText }
            ],
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("AI calculation failed:", error);
        alert("AI 计算失败，请稍后再试。");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/70 p-6 rounded-xl border border-blue-500/30">
      <h3 className="text-lg font-semibold text-blue-200 mb-4">齿轮参数计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '模数 (mm)', value: module, setter: setModule, placeholder: 'e.g. 2.5' },
          { label: '齿数', value: teeth, setter: setTeeth, placeholder: 'e.g. 40' },
          { label: '压力角 (°)', value: pressureAngle, setter: setPressureAngle, placeholder: 'e.g. 20' }
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        ))}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-md hover:from-blue-700 hover:to-violet-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 计算中...' : '计算齿轮参数'}
        </button>
      </div>
    </div>
  );
};

export default GearCalculator;
