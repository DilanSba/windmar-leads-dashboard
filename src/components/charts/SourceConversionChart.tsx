import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, LabelList, ResponsiveContainer,
} from 'recharts';
import { SourceConversion } from '../../hooks/useLeadsKPIs';

interface Props {
  data: SourceConversion[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as SourceConversion;
  return (
    <div className="bg-[#252836] border border-[#2a2d3e] rounded-xl p-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-gray-300">Total: <span className="text-[#4f8ef7] font-bold">{d?.total?.toLocaleString()}</span></p>
        <p className="text-gray-300">Vendidos: <span className="text-[#00d4aa] font-bold">{d?.vendidos?.toLocaleString()}</span></p>
        <p className="text-gray-300">Conversión: <span className="text-[#ffa502] font-bold">{d?.pct}%</span></p>
      </div>
    </div>
  );
};

export function SourceConversionChart({ data }: Props) {
  const chartData = data.slice(0, 8); // Top 8 sources

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
        Conversión por Fuente
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
          <XAxis
            dataKey="source"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: 8 }}
          />
          <Bar dataKey="total" name="Total Leads" fill="#4f8ef7" radius={[4, 4, 0, 0]} maxBarSize={30}>
            <LabelList
              dataKey="total"
              position="top"
              style={{ fill: '#9ca3af', fontSize: 10 }}
            />
          </Bar>
          <Bar dataKey="vendidos" name="Vendidos" fill="#00d4aa" radius={[4, 4, 0, 0]} maxBarSize={30}>
            <LabelList
              dataKey="pct"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fill: '#00d4aa', fontSize: 10, fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
