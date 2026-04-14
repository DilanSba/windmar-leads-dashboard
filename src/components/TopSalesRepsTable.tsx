import React from 'react';
import { Trophy } from 'lucide-react';
import { SalesRepEntry } from '../hooks/useLeadsKPIs';

interface Props {
  data: SalesRepEntry[];
  totalVendidos: number;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export function TopSalesRepsTable({ data, totalVendidos }: Props) {
  const maxDeals = Math.max(...data.map(d => d.deals), 1);

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-[#ffa502]" />
        <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
          Top Sales Reps
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">Sin datos de ventas</p>
      ) : (
        <div className="space-y-2">
          {data.map((rep, i) => (
            <div
              key={rep.rep}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#252836] transition-colors"
            >
              <span className="text-lg w-6 text-center">
                {MEDAL[i] ?? <span className="text-gray-500 text-sm font-bold">{i + 1}</span>}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm truncate">{rep.rep}</span>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className="text-[#00d4aa] font-bold text-sm">{rep.deals}</span>
                    <span className="text-gray-500 text-xs">deals</span>
                    <span className="text-gray-600 text-xs">({rep.pctTotal}%)</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#2a2d3e] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(rep.deals / maxDeals) * 100}%`,
                      backgroundColor: i === 0 ? '#ffa502' : i === 1 ? '#9ca3af' : i === 2 ? '#ff6b35' : '#00d4aa',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[#2a2d3e] flex justify-between text-xs text-gray-500">
        <span>Total casos vendidos</span>
        <span className="text-white font-bold">{totalVendidos.toLocaleString()}</span>
      </div>
    </div>
  );
}
