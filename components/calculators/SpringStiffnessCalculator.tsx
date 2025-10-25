import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface SpringStiffnessCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const SpringStiffnessCalculator: React.FC<SpringStiffnessCalculatorProps> = ({ onCalculate }) => {
  const [diameter, setDiameter] = useState('');
  const [wireDiameter, setWireDiameter] = useState('');
  const [turns, setTurns] = useState('');
  const [length, setLength] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const d = parseFloat(diameter);
    const wd = parseFloat(wireDiameter);
    const t = parseFloat(turns);
    const l = parseFloat(length);

    if (!(d > 0 && wd > 0 && t > 0 && l > 0)) {
        alert('请输入有效的正数作为所有输入值。');
        return;
    }

    setLoading(true);
    try {
      const prompt = `请帮我计算弹簧刚度：材料为常用弹簧钢, 弹簧中径: ${diameter} mm, 钢丝直径: ${wireDiameter} mm, 有效圈数: ${turns}, 自由长度: ${length} mm。请返回弹簧刚度 k 和其它重要设计参数。`;
      const resultText = await getCalculationResponse(prompt);

      onCalculate({
        id: Date.now().toString(),
        title: '弹簧刚度计算 (AI)',
        inputs: [
          { label: '弹簧中径 (mm)', value: d },
          { label: '钢丝直径 (mm)', value: wd },
          { label: '有效圈数', value: t },
          { label: '自由长度 (mm)', value: l }
        ],
        output: [{ label: 'AI 计算结果', value: resultText }]
      });
    } catch(err) {
        console.error(err);
        alert('AI 计算失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/70 p-6 rounded-xl border border-pink-500/30">
      <h3 className="text-lg font-semibold text-pink-200 mb-4">弹簧刚度计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '弹簧中径 (mm)', value: diameter, setter: setDiameter, placeholder: 'e.g. 20' },
          { label: '钢丝直径 (mm)', value: wireDiameter, setter: setWireDiameter, placeholder: 'e.g. 2' },
          { label: '有效圈数', value: turns, setter: setTurns, placeholder: 'e.g. 10' },
          { label: '自由长度 (mm)', value: length, setter: setLength, placeholder: 'e.g. 50' },
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
            />
          </div>
        ))}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-md hover:from-pink-700 hover:to-violet-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 计算中...' : '计算弹簧刚度'}
        </button>
      </div>
    </div>
  );
};

export default SpringStiffnessCalculator;
