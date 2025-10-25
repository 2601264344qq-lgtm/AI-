import React, { useState } from 'react';
import type { CalculationResult } from '../../types';
import { getCalculationResponse } from '../../services/geminiService';

interface GearStrengthCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const GearStrengthCalculator: React.FC<GearStrengthCalculatorProps> = ({ onCalculate }) => {
  const [module, setModule] = useState('');
  const [teeth, setTeeth] = useState('');
  const [faceWidth, setFaceWidth] = useState('');
  const [material, setMaterial] = useState('');
  const [torque, setTorque] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!module || !teeth || !faceWidth || !material || !torque) {
      alert('请填写所有必填项。');
      return;
    }
    setLoading(true);

    const prompt = `请帮我计算齿轮的强度校核：模数: ${module} mm, 齿数: ${teeth}, 齿宽: ${faceWidth} mm, 材料: ${material}, 输入扭矩: ${torque} N·m。请返回最大接触应力、弯曲应力和是否满足强度要求，给出详细公式和计算步骤。`;
    
    try {
        const resultText = await getCalculationResponse(prompt);

        onCalculate({
          id: Date.now().toString(),
          title: '齿轮强度校核 (AI)',
          inputs: [
            { label: '模数', value: module },
            { label: '齿数', value: teeth },
            { label: '齿宽', value: faceWidth },
            { label: '材料', value: material },
            { label: '扭矩 (N·m)', value: torque }
          ],
          output: [{ label: 'AI 计算结果', value: resultText }]
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
      <h3 className="text-lg font-semibold text-green-200 mb-4">齿轮强度校核 (AI)</h3>
      <div className="space-y-4">
        {[
          { label: '模数 (mm)', value: module, setter: setModule, placeholder: 'e.g. 2.5' },
          { label: '齿数', value: teeth, setter: setTeeth, placeholder: 'e.g. 40' },
          { label: '齿宽 (mm)', value: faceWidth, setter: setFaceWidth, placeholder: 'e.g. 25' },
          { label: '材料', value: material, setter: setMaterial, placeholder: 'e.g. 40Cr' },
          { label: '扭矩 (N·m)', value: torque, setter: setTorque, placeholder: 'e.g. 150' }
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-1">{item.label}</label>
            <input
              type={ (item.label.includes('材料')) ? 'text' : 'number' }
              value={item.value}
              onChange={e => item.setter(e.target.value)}
              placeholder={item.placeholder}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full mt-4 py-2.5 bg-gradient-to-r from-green-600 to-violet-600 text-white rounded-md hover:from-green-700 hover:to-violet-700 transition-all font-semibold transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {loading ? 'AI 计算中...' : '开始计算'}
      </button>
    </div>
  );
};

export default GearStrengthCalculator;
