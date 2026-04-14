import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, LabelList, ResponsiveContainer,
} from 'recharts';
import { TeamConversion } from '../../hooks/useLeadsKPIs';

interface Props {
  data: TeamConversion[];
}

const TEAM_COLORS = ['#4f8ef7', '#00d4aa', '#ffa502', '#a55eea', '#ff6b35'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TeamConversion;
  return (
    <div className="bg-[#252836] border border-[#2a2d3e] rounded-xl p-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-2">{d.team}</p>
      <p className="text-gray-300">Total: <span className="text-[#4f8ef7] font-bold">{d.total.toLocaleString()}</span></p>
      <p className="text-gray-300">Vendidos: <span className="text-[#00d4aa] font-bold">{d.vendidos.toLocaleString()}</span></p>
      <p className="text-gray-300">Conversión: <span className="text-[#ffa502] font-bold">{d.conversion}%</span></p>
    </div>
  );
};

const ConvLabel = ({ x, y, width, value }: any) => (
  <text
    x={x + width + 6}
    y={y + 10}
    fill="#ffa502"
    fontSize={11}
    fontWeight={600}
    dominantBaseline="middle"
  >
    {value}%
  </text>
);

export function TeamAssistanceChart({ data }: Props) {
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
        Distribución por Equipo
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 70, left: 10, bottom: 5 }}
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
            dataKey="team"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={105}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" name="Total" radius={[0, 6, 6, 0]} maxBarSize={36}>
            {data.map((_, i) => <Cell key={i} fill={TEAM_COLORS[i % TEAM_COLORS.length]} />)}
            <LabelList dataKey="conversion" content={<ConvLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
