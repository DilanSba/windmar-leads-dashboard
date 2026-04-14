import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, LabelList,
} from 'recharts';
import { FunnelStage } from '../../hooks/useLeadsKPIs';

interface Props {
  data: FunnelStage[];
}

const COLORS = ['#4f8ef7', '#ffa502', '#00d4aa', '#00d4aa'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as FunnelStage;
  return (
    <div className="bg-[#252836] border border-[#2a2d3e] rounded-xl p-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-1">{d.name}</p>
      <p className="text-gray-300">Cantidad: <span className="text-white font-bold">{d.value.toLocaleString()}</span></p>
      <p className="text-gray-300">% del total: <span className="text-[#4f8ef7] font-bold">{d.pct}%</span></p>
      <p className="text-gray-300">Conversión etapa: <span className="text-[#00d4aa] font-bold">{d.convRate}%</span></p>
    </div>
  );
};

const CustomLabel = ({ x, y, width, value }: any) => {
  return (
    <text
      x={x + width + 6}
      y={y + 10}
      fill="#9ca3af"
      fontSize={11}
      dominantBaseline="middle"
    >
      {value}%
    </text>
  );
};

export function ConversionFunnelChart({ data }: Props) {
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
        Embudo de Conversión
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i] ?? '#4f8ef7'} />
            ))}
            <LabelList dataKey="pct" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stage-to-stage conversion rates */}
      <div className="flex gap-3 mt-3 flex-wrap">
        {data.slice(1).map((stage, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500">{data[i].name} → {stage.name}:</span>
            <span className="font-bold text-[#00d4aa]">{stage.convRate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
