import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProductSplit } from '../../hooks/useLeadsKPIs';

interface Props {
  data: ProductSplit[];
  hasProductData: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ProductSplit;
  return (
    <div className="bg-[#252836] border border-[#2a2d3e] rounded-xl p-3 shadow-xl text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="text-white font-semibold">{d.product}</span>
      </div>
      <p className="text-gray-300">Cantidad: <span className="text-white font-bold">{d.count.toLocaleString()}</span></p>
      <p className="text-gray-300">Porcentaje: <span className="text-white font-bold">{d.pct}%</span></p>
    </div>
  );
};

const PLACEHOLDER_COLOR = '#2a2d3e';
const PLACEHOLDER_DATA = [{ name: 'Sin datos', value: 1, color: PLACEHOLDER_COLOR }];

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ProductBreakdownChart({ data, hasProductData }: Props) {
  const chartData = hasProductData ? data : PLACEHOLDER_DATA;

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
        Breakdown por Producto
      </h3>

      {!hasProductData ? (
        <div className="flex flex-col items-center justify-center py-6 gap-4">
          {/* Placeholder donut */}
          <div className="relative">
            <svg width={140} height={140} viewBox="0 0 140 140">
              <circle
                cx={70} cy={70} r={50}
                fill="none"
                stroke="#2a2d3e"
                strokeWidth={20}
                strokeDasharray="6 4"
              />
              <circle
                cx={70} cy={70} r={28}
                fill="#1a1d27"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">
              Datos de producto disponibles próximamente
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Exporta el campo "Product" desde Zoho CRM para activar este gráfico
            </p>
          </div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                labelLine={false}
                label={renderLabel}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Product table */}
          <div className="mt-3 space-y-1">
            {data.map((p) => (
              <div key={p.product} className="flex items-center justify-between text-xs py-1 border-t border-[#2a2d3e]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-gray-300">{p.product}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{p.count.toLocaleString()}</span>
                  <span className="text-white font-bold w-10 text-right">{p.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
