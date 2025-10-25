import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface BoltTorqueCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const BoltTorqueCalculator: React.FC<BoltTorqueCalculatorProps> = ({ onCalculate }) => {
  const [diameter, setDiameter] = useState('');
  const [tensileStrength, setTensileStrength] = useState('');
  const [frictionCoeff, setFrictionCoeff] = useState('0.2');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const d = parseFloat(diameter);
    const sigma = parseFloat(tensileStrength);
    const mu = parseFloat(frictionCoeff);

    if (!(d > 0 && sigma > 0 && mu > 0)) {
        alert('请输入有效的正数作为所有输入值。');
        return;
    }

    setLoading(true);
    try {
        const prompt = `请帮我计算螺栓紧固参数：螺栓直径: ${diameter} mm, 材料抗拉强度: ${tensileStrength} MPa, 摩擦系数: ${frictionCoeff}。请输出预估的预紧力和安装扭矩。`;
        const resultText = await getCalculationResponse(prompt);

        onCalculate({
            id: Date.now().toString(),
            title: '螺栓紧固计算 (AI)',
            inputs: [
            { label: '螺栓直径 (mm)', value: d },
            { label: '抗拉强度 (MPa)', value: sigma },
            { label: '摩擦系数', value: mu }
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
    <div className="bg-slate-800/70 p-6 rounded-xl border border-green-500/30">
      <h3 className="text-lg font-semibold text-green-200 mb-4">螺栓紧固力计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '螺栓直径 (mm)', value: diameter, setter: setDiameter, placeholder: 'e.g. 10' },
          { label: '材料抗拉强度 (MPa)', value: tensileStrength, setter: setTensileStrength, placeholder: 'e.g. 800' },
          { label: '摩擦系数', value: frictionCoeff, setter: setFrictionCoeff, placeholder: 'e.g. 0.2' }
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            />
          </div>
        ))}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-green-600 to-violet-600 text-white rounded-md hover:from-green-700 hover:to-violet-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 计算中...' : '计算螺栓扭矩'}
        </button>
      </div>
    </div>
  );
};

export default BoltTorqueCalculator;
