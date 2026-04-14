import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES, TEAMS, LEAD_OWNERS, LeadStatus } from '../data/leadsData';

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  leadSources: string[];
  leadOwner: string;
  teamAssistance: string;
  leadStatuses: LeadStatus[];
  product: string;
}

export const DEFAULT_FILTERS: FilterState = {
  dateStart: '',
  dateEnd: '',
  leadSources: [],
  leadOwner: '',
  teamAssistance: '',
  leadStatuses: [],
  product: '',
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalLeads: number;
  filteredCount: number;
  hasProductData: boolean;
}

const PRODUCTS = ['Solar', 'Roofing', 'Battery', 'Solar+Battery', 'Roofing+Solar', 'Sin definir'];

export function FilterBar({ filters, onChange, totalLeads, filteredCount, hasProductData }: FilterBarProps) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const sourceRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) setSourceOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasActiveFilters =
    filters.dateStart || filters.dateEnd || filters.leadSources.length > 0 ||
    filters.leadOwner || filters.teamAssistance || filters.leadStatuses.length > 0 || filters.product;

  function toggleSource(src: string) {
    const next = filters.leadSources.includes(src)
      ? filters.leadSources.filter(s => s !== src)
      : [...filters.leadSources, src];
    onChange({ ...filters, leadSources: next });
  }

  function toggleStatus(st: LeadStatus) {
    const next = filters.leadStatuses.includes(st)
      ? filters.leadStatuses.filter(s => s !== st)
      : [...filters.leadStatuses, st];
    onChange({ ...filters, leadStatuses: next });
  }

  function reset() {
    onChange(DEFAULT_FILTERS);
  }

  const inputCls = 'bg-[#252836] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#4f8ef7] transition-colors';
  const dropdownBtnCls = 'flex items-center gap-2 bg-[#252836] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-white hover:border-[#4f8ef7] transition-colors cursor-pointer select-none';

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-4 mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-[#4f8ef7]" />
          <span>Filtros</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Mostrando{' '}
            <span className="text-white font-bold">{filteredCount.toLocaleString()}</span>
            {' '}de{' '}
            <span className="text-white font-bold">{totalLeads.toLocaleString()}</span>
            {' '}leads
          </span>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-[#ff6b35] hover:text-orange-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
        {/* Date Start */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Desde</label>
          <input
            type="date"
            value={filters.dateStart}
            onChange={e => onChange({ ...filters, dateStart: e.target.value })}
            className={inputCls + ' text-xs [color-scheme:dark]'}
          />
        </div>

        {/* Date End */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Hasta</label>
          <input
            type="date"
            value={filters.dateEnd}
            onChange={e => onChange({ ...filters, dateEnd: e.target.value })}
            className={inputCls + ' text-xs [color-scheme:dark]'}
          />
        </div>

        {/* Lead Source multi-select */}
        <div className="flex flex-col gap-1" ref={sourceRef}>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Fuente</label>
          <div className="relative">
            <button
              className={dropdownBtnCls + ' w-full justify-between'}
              onClick={() => setSourceOpen(p => !p)}
            >
              <span className="truncate">
                {filters.leadSources.length === 0
                  ? 'Todas'
                  : `${filters.leadSources.length} seleccionadas`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sourceOpen ? 'rotate-180' : ''}`} />
            </button>
            {sourceOpen && (
              <div className="absolute z-50 top-full mt-1 left-0 w-56 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto p-2 space-y-0.5">
                  {LEAD_SOURCES.map(src => (
                    <label key={src} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#252836] rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.leadSources.includes(src)}
                        onChange={() => toggleSource(src)}
                        className="accent-[#4f8ef7]"
                      />
                      <span className="text-sm text-gray-300">{src}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead Owner */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Agente</label>
          <select
            value={filters.leadOwner}
            onChange={e => onChange({ ...filters, leadOwner: e.target.value })}
            className={inputCls + ' appearance-none'}
          >
            <option value="">Todos</option>
            {LEAD_OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Team */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Equipo</label>
          <select
            value={filters.teamAssistance}
            onChange={e => onChange({ ...filters, teamAssistance: e.target.value })}
            className={inputCls + ' appearance-none'}
          >
            <option value="">Todos</option>
            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Lead Status multi-select */}
        <div className="flex flex-col gap-1" ref={statusRef}>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Estado</label>
          <div className="relative">
            <button
              className={dropdownBtnCls + ' w-full justify-between'}
              onClick={() => setStatusOpen(p => !p)}
            >
              <span className="truncate">
                {filters.leadStatuses.length === 0
                  ? 'Todos'
                  : `${filters.leadStatuses.length} estados`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusOpen && (
              <div className="absolute z-50 top-full mt-1 left-0 w-52 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto p-2 space-y-0.5">
                  {LEAD_STATUSES.map(st => (
                    <label key={st} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#252836] rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.leadStatuses.includes(st)}
                        onChange={() => toggleStatus(st)}
                        className="accent-[#4f8ef7]"
                      />
                      <span className="text-sm text-gray-300">{st}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Producto</label>
          <div className="relative group/prod">
            <select
              value={filters.product}
              onChange={e => onChange({ ...filters, product: e.target.value })}
              disabled={!hasProductData}
              className={inputCls + ' appearance-none w-full ' + (!hasProductData ? 'opacity-40 cursor-not-allowed' : '')}
            >
              <option value="">Todos</option>
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {!hasProductData && (
              <div className="absolute left-0 -top-8 hidden group-hover/prod:block bg-[#252836] border border-[#2a2d3e] text-xs text-gray-400 px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                Disponible próximamente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
