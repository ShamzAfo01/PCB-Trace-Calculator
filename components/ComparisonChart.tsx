
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalculationInputs } from '../types';
import { calculateTraceWidth } from '../utils/math';

interface Props {
  inputs: CalculationInputs;
}

const ComparisonChart: React.FC<Props> = ({ inputs }) => {
  const data = useMemo(() => {
    const points = [];
    const baseCurrent = Math.max(0.1, inputs.current - 5);
    for (let i = 0; i <= 20; i++) {
      const current = baseCurrent + i * 0.5;
      if (current <= 0) continue;
      const res = calculateTraceWidth({ ...inputs, current });
      points.push({
        current: current.toFixed(1),
        width: parseFloat(res.widthMm.toFixed(3)),
      });
    }
    return points;
  }, [inputs]);

  return (
    <div className="bg-white p-8 rounded-[12px] border border-slate-200 shadow-sm h-[400px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Width vs. Current</h2>
        <p className="text-slate-400 text-sm">Performance curve for {inputs.tempRise}°C rise</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="current"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Amps', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Width (mm)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0038df', fontWeight: 'bold' }}
            cursor={{ stroke: '#0038df', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Line
            type="monotone"
            dataKey="width"
            stroke="#0038df"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, fill: '#0038df', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
