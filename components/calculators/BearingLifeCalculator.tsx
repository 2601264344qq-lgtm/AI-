import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface BearingLifeCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const BearingLifeCalculator: React.FC<BearingLifeCalculatorProps> = ({ onCalculate }) => {
  const [diameter, setDiameter] = useState('');
  const [width, setWidth] = useState('');
  const [load, setLoad] = useState('');
  const [speed, setSpeed] = useState('');
  const [factor] = useState('1.0');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const d = parseFloat(diameter);
    const b = parseFloat(width);
    const L = parseFloat(load);
    const n = parseFloat(speed);
    
    if (!(d > 0 && b > 0 && L > 0 && n > 0)) {
        alert('请输入有效的正数作为所有输入值。');
        return;
    }

    setLoading(true);
    try {
      const prompt = `请帮我计算轴承寿命：轴承内径: ${diameter} mm, 轴承宽度: ${width} mm, 当量动载荷: ${load} N, 转速: ${speed} rpm, 可靠度系数: ${factor}。请输出 L10 额定寿命（小时）和 L10 年寿命（年）。`;
      const resultText = await getCalculationResponse(prompt);

      onCalculate({
        id: Date.now().toString(),
        title: '轴承寿命计算 (AI)',
        inputs: [
          { label: '轴承内径', value: `${d} mm` },
          { label: '轴承宽度', value: `${b} mm` },
          { label: '当量动载荷', value: `${L} N` },
          { label: '转速', value: `${n} rpm` },
          { label: '可靠度系数', value: factor }
        ],
        output: [
          { label: 'AI 计算结果', value: resultText },
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
    <div className="bg-slate-800/70 p-6 rounded-xl border border-violet-500/30">
      <h3 className="text-lg font-semibold text-violet-200 mb-4">轴承寿命计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '轴承内径 (mm)', value: diameter, setter: setDiameter, placeholder: 'e.g. 50' },
          { label: '轴承宽度 (mm)', value: width, setter: setWidth, placeholder: 'e.g. 20' },
          { label: '当量动载荷 (N)', value: load, setter: setLoad, placeholder: 'e.g. 5000' },
          { label: '转速 (rpm)', value: speed, setter: setSpeed, placeholder: 'e.g. 1500' }
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
            />
          </div>
        ))}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-md hover:from-violet-700 hover:to-blue-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 计算中...' : '计算轴承寿命'}
        </button>
      </div>
    </div>
  );
};

export default BearingLifeCalculator;
