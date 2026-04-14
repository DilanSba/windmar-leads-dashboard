import React, { useState, useEffect, useRef } from 'react';
import { Download, Check, BarChart3 } from 'lucide-react';
import { LeadRecord } from '../data/leadsData';
import { exportFilteredLeadsToCSV } from '../utils/exportCSV';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  filteredLeads: LeadRecord[];
  totalLeads: number;
}

export function DashboardHeader({ filteredLeads, totalLeads }: Props) {
  const [now, setNow] = useState(new Date());
  const [exported, setExported] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  function handleExport() {
    exportFilteredLeadsToCSV(filteredLeads);
    setExported(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setExported(false), 2000);
  }

  const isFiltered = filteredLeads.length !== totalLeads;
  const btnLabel = exported
    ? '✓ Exportado'
    : isFiltered
      ? `Exportar filtrados (${filteredLeads.length.toLocaleString()})`
      : `Exportar todos (${totalLeads.toLocaleString()})`;

  const dateStr = format(now, "EEEE d 'de' MMMM yyyy · HH:mm:ss", { locale: es });

  return (
    <header className="bg-[#1a1d27] border-b border-[#2a2d3e] px-6 py-4 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#00d4aa]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">
              WINDMAR{' '}
              <span className="text-[#00d4aa]">|</span>{' '}
              <span className="text-gray-300">Leads Dashboard</span>
            </h1>
            <p className="text-xs text-gray-500 capitalize">{dateStr}</p>
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            exported
              ? 'bg-[#00d4aa] text-black'
              : 'bg-[#00d4aa] hover:bg-[#00c09a] text-black'
          }`}
          title={btnLabel}
        >
          {exported ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{btnLabel}</span>
        </button>
      </div>
    </header>
  );
}
