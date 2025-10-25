import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface CouplingTorqueCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const CouplingTorqueCalculator: React.FC<CouplingTorqueCalculatorProps> = ({ onCalculate }) => {
  const [torque, setTorque] = useState('');
  const [diameter, setDiameter] = useState('');
  const [safetyFactor, setSafetyFactor] = useState('1.5');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const t = parseFloat(torque);
    const d = parseFloat(diameter);
    const sf = parseFloat(safetyFactor);

    if (!(t > 0 && d > 0 && sf > 0)) {
        alert('请输入有效的正数作为所有输入值。');
        return;
    }

    setLoading(true);
    try {
      const prompt = `请帮我进行联轴器扭矩校核与选型：输入扭矩: ${torque} N·m, 轴径: ${diameter} mm, 安全系数: ${safetyFactor}。请校核并推荐合适的联轴器类型。`;
      const resultText = await getCalculationResponse(prompt);

      onCalculate({
        id: Date.now().toString(),
        title: '联轴器扭矩计算 (AI)',
        inputs: [
          { label: '扭矩 (N·m)', value: t },
          { label: '轴径 (mm)', value: d },
          { label: '安全系数', value: sf }
        ],
        output: [{ label: 'AI 计算结果', value: resultText }]
      });
    } catch (err) {
      console.error(err);
      alert('AI 计算失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/70 p-6 rounded-xl border border-yellow-500/30">
      <h3 className="text-lg font-semibold text-yellow-200 mb-4">联轴器扭矩计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '扭矩 (N·m)', value: torque, setter: setTorque, placeholder: 'e.g. 100' },
          { label: '轴径 (mm)', value: diameter, setter: setDiameter, placeholder: 'e.g. 40' },
          { label: '安全系数', value: safetyFactor, setter: setSafetyFactor, placeholder: 'e.g. 1.5' }
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
            />
          </div>
        ))}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-yellow-600 to-violet-600 text-white rounded-md hover:from-yellow-700 hover:to-violet-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 计算中...' : '计算联轴器扭矩'}
        </button>
      </div>
    </div>
  );
};

export default CouplingTorqueCalculator;
