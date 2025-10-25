import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface BeamDeflectionCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const BeamDeflectionCalculator: React.FC<BeamDeflectionCalculatorProps> = ({ onCalculate }) => {
  const [length, setLength] = useState('');
  const [load, setLoad] = useState('');
  const [modulus, setModulus] = useState('');
  const [inertia, setInertia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const L = parseFloat(length);
    const F = parseFloat(load);
    const E = parseFloat(modulus);
    const I = parseFloat(inertia);

    if (!(L > 0 && F > 0 && E > 0 && I > 0)) {
        alert('请输入有效的正数作为所有输入值。');
        return;
    }

    setLoading(true);
    try {
        const prompt = `请帮我计算简支梁在中心受集中载荷下的最大挠度：梁长: ${length} m, 集中载荷: ${load} N, 弹性模量: ${modulus} Pa, 截面惯性矩: ${inertia} m⁴。请以 mm 为单位返回结果。`;
        const resultText = await getCalculationResponse(prompt);

        onCalculate({
            id: Date.now().toString(),
            title: '梁挠度计算 (AI)',
            inputs: [
            { label: '梁长 (m)', value: L },
            { label: '集中载荷 (N)', value: F },
            { label: '弹性模量 (Pa)', value: E },
            { label: '截面惯性矩 (m⁴)', value: I }
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
    <div className="bg-slate-800/70 p-6 rounded-xl border border-yellow-500/30">
      <h3 className="text-lg font-semibold text-yellow-200 mb-4">简支梁挠度计算器 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '梁长 (m)', value: length, setter: setLength, placeholder: 'e.g. 1' },
          { label: '集中载荷 (N)', value: load, setter: setLoad, placeholder: 'e.g. 1000' },
          { label: '弹性模量 (Pa)', value: modulus, setter: setModulus, placeholder: 'e.g. 2.1e11 for steel' },
          { label: '截面惯性矩 (m⁴)', value: inertia, setter: setInertia, placeholder: 'e.g. 8.5e-9' }
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
          {loading ? 'AI 计算中...' : '计算最大挠度'}
        </button>
      </div>
    </div>
  );
};

export default BeamDeflectionCalculator;
