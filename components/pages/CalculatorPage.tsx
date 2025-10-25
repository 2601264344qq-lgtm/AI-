import React, { useState } from 'react';
import BearingLifeCalculator from '../calculators/BearingLifeCalculator';
import GearCalculator from '../calculators/GearCalculator';
import BoltTorqueCalculator from '../calculators/BoltTorqueCalculator';
import BeamDeflectionCalculator from '../calculators/BeamDeflectionCalculator';
import GearStrengthCalculator from '../calculators/GearStrengthCalculator';
import CouplingTorqueCalculator from '../calculators/CouplingTorqueCalculator';
import SpringStiffnessCalculator from '../calculators/SpringStiffnessCalculator';
import type { CalculationResult } from '../../types';

const CalculatorPage: React.FC = () => {
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handleResult = (result: CalculationResult) => {
    setResults(prev => [{ ...result, timestamp: Date.now() }, ...prev]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-200 mb-6">工程计算器</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BearingLifeCalculator onCalculate={handleResult} />
          <GearCalculator onCalculate={handleResult} />
          <BoltTorqueCalculator onCalculate={handleResult} />
          <BeamDeflectionCalculator onCalculate={handleResult} />
          <GearStrengthCalculator onCalculate={handleResult} />
          <CouplingTorqueCalculator onCalculate={handleResult} />
          <SpringStiffnessCalculator onCalculate={handleResult} />
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-200 mb-4 sticky top-0 bg-slate-900 py-2">计算历史</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {results.length > 0 ? (
              results.map(res => (
                <div key={res.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 animate-fade-in">
                  <h3 className="font-bold text-violet-300">{res.title}</h3>
                  <div className="text-sm mt-2">
                    <strong className="text-gray-400">输入:</strong>
                    <ul className="list-disc list-inside text-gray-300">
                      {res.inputs.map((inp, i) => <li key={i}>{inp.label}: {inp.value}</li>)}
                    </ul>
                  </div>
                   <div className="text-sm mt-2">
                    <strong className="text-gray-400">输出:</strong>
                     <ul className="list-disc list-inside text-gray-300">
                      {res.output.map((out, i) => <li key={i}>{out.label}: {out.value}</li>)}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-40 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
                <p className="text-gray-500">暂无计算历史。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
