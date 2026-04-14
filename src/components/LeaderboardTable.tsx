import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { LeaderboardEntry } from '../hooks/useLeadsKPIs';

interface Props {
  data: LeaderboardEntry[];
}

type SortKey = 'owner' | 'assigned' | 'vendidos' | 'conversion';
type SortDir = 'asc' | 'desc';

export function LeaderboardTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('vendidos');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...data].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    const cmp = typeof va === 'string'
      ? va.localeCompare(vb as string)
      : (va as number) - (vb as number);
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const maxAssigned = Math.max(...data.map(d => d.assigned), 1);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-[#4f8ef7]" />
      : <ChevronUp className="w-3 h-3 text-[#4f8ef7]" />;
  }

  const thCls = 'px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors select-none';

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
        Leaderboard Lead Owners
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2d3e]">
              <th className={thCls} onClick={() => handleSort('owner')}>
                <span className="flex items-center gap-1">Agente <SortIcon col="owner" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className={thCls} onClick={() => handleSort('assigned')}>
                <span className="flex items-center gap-1">Asignados <SortIcon col="assigned" /></span>
              </th>
              <th className={thCls} onClick={() => handleSort('vendidos')}>
                <span className="flex items-center gap-1">Vendidos <SortIcon col="vendidos" /></span>
              </th>
              <th className={thCls} onClick={() => handleSort('conversion')}>
                <span className="flex items-center gap-1">Conv% <SortIcon col="conversion" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                Performance
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => (
              <tr
                key={entry.owner}
                className="border-b border-[#2a2d3e]/50 hover:bg-[#252836] transition-colors"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        backgroundColor: i === 0 ? '#ffa502' : i === 1 ? '#9ca3af' : i === 2 ? '#ff6b35' : '#2a2d3e',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-white font-medium">{entry.owner}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-400 bg-[#252836] px-2 py-0.5 rounded-full">
                    {entry.team}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-300 font-medium">
                  {entry.assigned.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  <span className="text-[#00d4aa] font-bold">{entry.vendidos}</span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className="font-bold text-sm"
                    style={{
                      color: entry.conversion >= 15 ? '#00d4aa' : entry.conversion >= 8 ? '#ffa502' : '#ff4757',
                    }}
                  >
                    {entry.conversion}%
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="w-28 bg-[#2a2d3e] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(entry.assigned / maxAssigned) * 100}%`,
                        backgroundColor: '#4f8ef7',
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
