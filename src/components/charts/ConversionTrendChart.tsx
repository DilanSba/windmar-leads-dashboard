import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { MonthlyPoint } from '../../hooks/useLeadsKPIs';

interface Props {
  data: MonthlyPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#252836] border border-[#2a2d3e] rounded-xl p-3 shadow-xl text-sm">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      <p className="text-white">
        Conversión:{' '}
        <span className="font-bold text-[#00d4aa]">{payload[0].value}%</span>
      </p>
    </div>
  );
};

export function ConversionTrendChart({ data }: Props) {
  const avg = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.conversion, 0) / data.length)
    : 0;

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
          Tendencia de Conversión Mensual
        </h3>
        <div className="text-xs text-gray-400">
          Promedio: <span className="text-[#00d4aa] font-bold">{avg}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4aa" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="%"
            domain={[0, 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg}
            stroke="#ffa502"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `Avg ${avg}%`, fill: '#ffa502', fontSize: 10, position: 'right' }}
          />
          <Area
            type="monotone"
            dataKey="conversion"
            name="% Conversión"
            stroke="#00d4aa"
            strokeWidth={2.5}
            fill="url(#convGradient)"
            dot={{ r: 3, fill: '#00d4aa', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
