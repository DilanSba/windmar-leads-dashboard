import React, { useState, useMemo } from 'react';
import {
  Users, TrendingUp, ShoppingBag, Calendar,
  UserX, CreditCard, LayoutDashboard, PieChart,
} from 'lucide-react';

import { RAW_DATA, LeadRecord } from './data/leadsData';
import { useLeadsKPIs } from './hooks/useLeadsKPIs';
import { FilterBar, FilterState, DEFAULT_FILTERS } from './components/FilterBar';
import { DashboardHeader } from './components/DashboardHeader';
import { KPICard } from './components/KPICard';

import { LeadsLineChart } from './components/charts/LeadsLineChart';
import { ConversionFunnelChart } from './components/charts/ConversionFunnelChart';
import { SourceConversionChart } from './components/charts/SourceConversionChart';
import { StatusDonutChart } from './components/charts/StatusDonutChart';
import { ConversionTrendChart } from './components/charts/ConversionTrendChart';
import { TeamAssistanceChart } from './components/charts/TeamAssistanceChart';
import { ProductBreakdownChart } from './components/charts/ProductBreakdownChart';

import { LeaderboardTable } from './components/LeaderboardTable';
import { TopSalesRepsTable } from './components/TopSalesRepsTable';

const TOTAL = RAW_DATA.length;

function applyFilters(data: LeadRecord[], f: FilterState): LeadRecord[] {
  return data.filter(lead => {
    // Date range
    if (f.dateStart && lead.createdTime < f.dateStart) return false;
    if (f.dateEnd && lead.createdTime > f.dateEnd) return false;
    // Lead sources
    if (f.leadSources.length > 0 && !f.leadSources.includes(lead.leadSource)) return false;
    // Owner
    if (f.leadOwner && lead.leadOwner !== f.leadOwner) return false;
    // Team
    if (f.teamAssistance && lead.teamAssistance !== f.teamAssistance) return false;
    // Statuses
    if (f.leadStatuses.length > 0 && !f.leadStatuses.includes(lead.leadStatus)) return false;
    // Product
    if (f.product) {
      if (f.product === 'Sin definir') {
        if (lead.product !== '') return false;
      } else {
        if (lead.product !== f.product) return false;
      }
    }
    return true;
  });
}

type TabId = 'dashboard' | 'busqueda';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'busqueda', label: 'Busqueda', icon: <PieChart className="w-4 h-4" /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredData = useMemo(() => applyFilters(RAW_DATA, filters), [filters]);

  const kpis = useLeadsKPIs(filteredData);

  // Sparklines from monthly trend
  const sparkLeads = kpis.monthlyTrend.map(m => ({ value: m.totalLeads }));
  const sparkVendidos = kpis.monthlyTrend.map(m => ({ value: m.vendidos }));
  const sparkConv = kpis.monthlyTrend.map(m => ({ value: m.conversion }));
  const sparkCitas = kpis.monthlyTrend.map(m => ({ value: m.vendidos + (m.totalLeads > 0 ? Math.round(m.totalLeads * 0.14) : 0) }));

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-sans">
      <DashboardHeader filteredLeads={filteredData} totalLeads={TOTAL} />

      {/* Tab Navigation */}
      <div className="bg-[#1a1d27] border-b border-[#2a2d3e] px-6">
        <div className="max-w-[1920px] mx-auto flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#00d4aa] text-[#00d4aa]'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1920px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          totalLeads={TOTAL}
          filteredCount={filteredData.length}
          hasProductData={kpis.hasProductData}
        />

        {activeTab === 'dashboard' && (
          <>
            {/* ── KPI Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <KPICard
                title="Total Leads"
                value={kpis.totalLeads}
                icon={<Users className="w-5 h-5" />}
                accentColor="#4f8ef7"
                sparkline={sparkLeads}
                delay={0}
              />
              <KPICard
                title="Casos Vendidos"
                value={kpis.casosVendidos}
                subtitle={`${kpis.tasaConversion}% conversión`}
                icon={<ShoppingBag className="w-5 h-5" />}
                accentColor="#00d4aa"
                sparkline={sparkVendidos}
                delay={80}
              />
              <KPICard
                title="Tasa de Conversión"
                value={`${kpis.tasaConversion}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="#00d4aa"
                sparkline={sparkConv}
                delay={160}
              />
              <KPICard
                title="Citas Generadas"
                subtitle="Realizadas + Confirmadas + Coordinadas"
                value={kpis.citasGeneradas}
                icon={<Calendar className="w-5 h-5" />}
                accentColor="#ffa502"
                sparkline={sparkCitas}
                delay={240}
              />
              <KPICard
                title="Leads Descartados"
                value={kpis.leadsDescartados}
                subtitle={`DQ + Junk + No Contesta (${kpis.pctDescartados}%)`}
                icon={<UserX className="w-5 h-5" />}
                accentColor="#ff6b35"
                delay={320}
              />
              <KPICard
                title="Credit Fail"
                value={kpis.creditFail}
                subtitle={`${kpis.pctCreditFail}% del total`}
                icon={<CreditCard className="w-5 h-5" />}
                accentColor="#ff4757"
                delay={400}
              />
            </div>

            {/* ── Row 1: Line + Funnel ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
              <LeadsLineChart data={kpis.monthlyTrend} />
              <ConversionFunnelChart data={kpis.funnelStages} />
            </div>

            {/* ── Row 2: Source conversion + Status donut ───────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
              <SourceConversionChart data={kpis.sourceConversion} />
              <StatusDonutChart data={kpis.statusGroups} total={filteredData.length} />
            </div>

            {/* ── Row 3: Conversion trend + Team assistance ─────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <ConversionTrendChart data={kpis.monthlyTrend} />
              <TeamAssistanceChart data={kpis.teamConversion} />
            </div>

            {/* ── Row 4: Leaderboard (full width) ──────────────────────────── */}
            <LeaderboardTable data={kpis.leaderboard} />

            {/* ── Row 5: Sales Reps + Product breakdown ─────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <TopSalesRepsTable data={kpis.topSalesReps} totalVendidos={kpis.casosVendidos} />
              <ProductBreakdownChart data={kpis.productSplit} hasProductData={kpis.hasProductData} />
            </div>
          </>
        )}

        {activeTab === 'busqueda' && (
          <div className="space-y-6">
            {/* Header de Busqueda */}
            <div className="flex items-center gap-3 pb-2">
              <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[#00d4aa]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Busqueda de Leads</h2>
                <p className="text-xs text-gray-400">
                  {filteredData.length.toLocaleString()} leads encontrados
                </p>
              </div>
            </div>

            {/* Distribución por status + producto */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <StatusDonutChart data={kpis.statusGroups} total={filteredData.length} />
              <ProductBreakdownChart data={kpis.productSplit} hasProductData={kpis.hasProductData} />
            </div>

            {/* Fuente de leads + Team */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <SourceConversionChart data={kpis.sourceConversion} />
              <TeamAssistanceChart data={kpis.teamConversion} />
            </div>

            {/* Leaderboard */}
            <LeaderboardTable data={kpis.leaderboard} />
          </div>
        )}
      </main>
    </div>
  );
}
