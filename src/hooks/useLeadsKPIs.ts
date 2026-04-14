import { useMemo } from 'react';
import { LeadRecord, LeadStatus } from '../data/leadsData';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// ─── KPI Types ────────────────────────────────────────────────────────────────

export interface MonthlyPoint {
  month: string;      // "Ene 25"
  totalLeads: number;
  vendidos: number;
  conversion: number; // 0–100
}

export interface FunnelStage {
  name: string;
  value: number;
  pct: number; // % of total leads
  convRate: number; // % vs previous stage
}

export interface SourceConversion {
  source: string;
  total: number;
  vendidos: number;
  pct: number;
}

export interface StatusGroup {
  name: string;
  value: number;
  color: string;
}

export interface LeaderboardEntry {
  owner: string;
  team: string;
  assigned: number;
  vendidos: number;
  conversion: number; // 0–100
}

export interface SalesRepEntry {
  rep: string;
  deals: number;
  pctTotal: number;
}

export interface TeamConversion {
  team: string;
  total: number;
  vendidos: number;
  conversion: number;
}

export interface ProductSplit {
  product: string;
  count: number;
  pct: number;
  color: string;
}

export interface LeadsKPIs {
  // Top cards
  totalLeads: number;
  casosVendidos: number;
  tasaConversion: number;
  citasGeneradas: number;
  leadsDescartados: number;
  pctDescartados: number;
  creditFail: number;
  pctCreditFail: number;

  // Charts data
  monthlyTrend: MonthlyPoint[];
  funnelStages: FunnelStage[];
  sourceConversion: SourceConversion[];
  statusGroups: StatusGroup[];
  leaderboard: LeaderboardEntry[];
  topSalesReps: SalesRepEntry[];
  teamConversion: TeamConversion[];
  productSplit: ProductSplit[];
  hasProductData: boolean;
}

// ─── Status grouping (mapped to real Zoho CRM statuses) ──────────────────────

const STATUS_GROUPS: Record<string, { group: string; color: string }> = {
  'Caso Vendido':                  { group: 'Vendido',       color: '#00d4aa' },
  'Caso Vendido sin Match':        { group: 'Vendido',       color: '#00d4aa' },
  'Cita Realizada':                { group: 'Cita Generada', color: '#ffa502' },
  'Cita Confirmada':               { group: 'Cita Generada', color: '#ffa502' },
  'Cita Coordinada':               { group: 'Cita Generada', color: '#ffa502' },
  'Cita en Espera':                { group: 'Cita Generada', color: '#ffa502' },
  'Asistencia Coordinada':         { group: 'Cita Generada', color: '#ffa502' },
  'Llamar Despues':                { group: 'En Proceso',    color: '#4f8ef7' },
  'Seguimiento Requerido':         { group: 'En Proceso',    color: '#4f8ef7' },
  'Nuevo Lead':                    { group: 'En Proceso',    color: '#4f8ef7' },
  'New Lead':                      { group: 'En Proceso',    color: '#4f8ef7' },
  'Lead Nuevo / Cliente Existente':{ group: 'En Proceso',    color: '#4f8ef7' },
  'No Contesta':                   { group: 'No Contesta',   color: '#a55eea' },
  'Lead Frio':                     { group: 'Frío',          color: '#ff6b35' },
  'DQ o No le Interesa':           { group: 'Descartado',    color: '#ff6b35' },
  'Junk Lead':                     { group: 'Descartado',    color: '#ff6b35' },
  'Credit Fail':                   { group: 'Credit Fail',   color: '#ff4757' },
};

const PRODUCT_COLORS: Record<string, string> = {
  'Solar':         '#a55eea',
  'Roofing':       '#fc5c65',
  'Battery':       '#2bcbba',
  'Solar+Battery': '#4f8ef7',
  'Roofing+Solar': '#ff6b35',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeadsKPIs(data: LeadRecord[]): LeadsKPIs {
  return useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return emptyKPIs();
    }

    // ── Basic counts ─────────────────────────────────────────────────────────
    const VENDIDO_STATUSES = ['Caso Vendido', 'Caso Vendido sin Match'];
    const CITA_STATUSES = ['Cita Realizada', 'Cita Confirmada', 'Cita Coordinada', 'Cita en Espera', 'Asistencia Coordinada'];
    const DQ_STATUSES = ['DQ o No le Interesa', 'Junk Lead'];
    const NO_CONTACTADO_STATUSES = ['No Contesta'];

    const vendidos = data.filter(l => VENDIDO_STATUSES.includes(l.leadStatus)).length;
    const citasGeneradas = data.filter(l => CITA_STATUSES.includes(l.leadStatus)).length;

    const dq = data.filter(l => DQ_STATUSES.includes(l.leadStatus)).length;
    const noContesta = data.filter(l => NO_CONTACTADO_STATUSES.includes(l.leadStatus)).length;
    const descartados = dq + noContesta;

    const creditFail = data.filter(l => l.leadStatus === 'Credit Fail').length;

    const contactados = data.filter(l =>
      !['No Contesta'].includes(l.leadStatus)
    ).length;

    // ── Monthly trend ─────────────────────────────────────────────────────────
    const monthMap = new Map<string, { total: number; vendidos: number }>();

    for (const lead of data) {
      const d = parseISO(lead.createdTime);
      const key = format(d, 'MMM yy', { locale: es });
      const prev = monthMap.get(key) ?? { total: 0, vendidos: 0 };
      monthMap.set(key, {
        total: prev.total + 1,
        vendidos: prev.vendidos + (lead.leadStatus === 'Caso Vendido' ? 1 : 0),
      });
    }

    // Sort months chronologically
    const allDates = data.map(l => l.createdTime).sort();
    const orderedMonths: string[] = [];
    for (const d of allDates) {
      const key = format(parseISO(d), 'MMM yy', { locale: es });
      if (!orderedMonths.includes(key)) orderedMonths.push(key);
    }

    const monthlyTrend: MonthlyPoint[] = orderedMonths.map(month => {
      const { total: t, vendidos: v } = monthMap.get(month) ?? { total: 0, vendidos: 0 };
      return { month, totalLeads: t, vendidos: v, conversion: t > 0 ? Math.round((v / t) * 100) : 0 };
    });

    // ── Funnel ────────────────────────────────────────────────────────────────
    const citasPlusVendidos = citasGeneradas + vendidos;
    const funnelStages: FunnelStage[] = [
      { name: 'Total Leads', value: total, pct: 100, convRate: 100 },
      {
        name: 'Contactados',
        value: contactados,
        pct: pct(contactados, total),
        convRate: pct(contactados, total),
      },
      {
        name: 'Cita Generada',
        value: citasPlusVendidos,
        pct: pct(citasPlusVendidos, total),
        convRate: contactados > 0 ? pct(citasPlusVendidos, contactados) : 0,
      },
      {
        name: 'Caso Vendido',
        value: vendidos,
        pct: pct(vendidos, total),
        convRate: citasPlusVendidos > 0 ? pct(vendidos, citasPlusVendidos) : 0,
      },
    ];

    // ── Source conversion ──────────────────────────────────────────────────────
    const sourceMap = new Map<string, { total: number; vendidos: number }>();
    for (const lead of data) {
      const prev = sourceMap.get(lead.leadSource) ?? { total: 0, vendidos: 0 };
      sourceMap.set(lead.leadSource, {
        total: prev.total + 1,
        vendidos: prev.vendidos + (VENDIDO_STATUSES.includes(lead.leadStatus) ? 1 : 0),
      });
    }
    const sourceConversion: SourceConversion[] = Array.from(sourceMap.entries())
      .map(([source, { total: t, vendidos: v }]) => ({
        source,
        total: t,
        vendidos: v,
        pct: t > 0 ? Math.round((v / t) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // ── Status groups (donut) ─────────────────────────────────────────────────
    const groupMap = new Map<string, { count: number; color: string }>();
    for (const lead of data) {
      const { group, color } = STATUS_GROUPS[lead.leadStatus] ?? { group: 'Otros', color: '#888' };
      const prev = groupMap.get(group) ?? { count: 0, color };
      groupMap.set(group, { count: prev.count + 1, color });
    }
    const statusGroups: StatusGroup[] = Array.from(groupMap.entries())
      .map(([name, { count, color }]) => ({ name, value: count, color }))
      .sort((a, b) => b.value - a.value);

    // ── Leaderboard ───────────────────────────────────────────────────────────
    const ownerMap = new Map<string, { team: string; assigned: number; vendidos: number }>();
    for (const lead of data) {
      const prev = ownerMap.get(lead.leadOwner) ?? { team: lead.teamAssistance, assigned: 0, vendidos: 0 };
      ownerMap.set(lead.leadOwner, {
        team: lead.teamAssistance,
        assigned: prev.assigned + 1,
        vendidos: prev.vendidos + (VENDIDO_STATUSES.includes(lead.leadStatus) ? 1 : 0),
      });
    }
    const leaderboard: LeaderboardEntry[] = Array.from(ownerMap.entries())
      .map(([owner, { team, assigned, vendidos: v }]) => ({
        owner,
        team,
        assigned,
        vendidos: v,
        conversion: assigned > 0 ? Math.round((v / assigned) * 100) : 0,
      }))
      .sort((a, b) => b.vendidos - a.vendidos)
      .slice(0, 10);

    // ── Top Sales Reps ────────────────────────────────────────────────────────
    const repMap = new Map<string, number>();
    for (const lead of data) {
      if (VENDIDO_STATUSES.includes(lead.leadStatus) && lead.salesRep) {
        repMap.set(lead.salesRep, (repMap.get(lead.salesRep) ?? 0) + 1);
      }
    }
    const topSalesReps: SalesRepEntry[] = Array.from(repMap.entries())
      .map(([rep, deals]) => ({ rep, deals, pctTotal: pct(deals, vendidos) }))
      .sort((a, b) => b.deals - a.deals)
      .slice(0, 10);

    // ── Team conversion ───────────────────────────────────────────────────────
    const teamMap = new Map<string, { total: number; vendidos: number }>();
    for (const lead of data) {
      const t = lead.teamAssistance || 'Sin Equipo';
      const prev = teamMap.get(t) ?? { total: 0, vendidos: 0 };
      teamMap.set(t, {
        total: prev.total + 1,
        vendidos: prev.vendidos + (VENDIDO_STATUSES.includes(lead.leadStatus) ? 1 : 0),
      });
    }
    const teamConversion: TeamConversion[] = Array.from(teamMap.entries())
      .map(([team, { total: t, vendidos: v }]) => ({
        team,
        total: t,
        vendidos: v,
        conversion: t > 0 ? Math.round((v / t) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // ── Product split ─────────────────────────────────────────────────────────
    const prodMap = new Map<string, number>();
    for (const lead of data) {
      if (lead.product) {
        prodMap.set(lead.product, (prodMap.get(lead.product) ?? 0) + 1);
      }
    }
    const totalWithProduct = Array.from(prodMap.values()).reduce((s, v) => s + v, 0);
    const hasProductData = totalWithProduct > 0;
    const productSplit: ProductSplit[] = Array.from(prodMap.entries())
      .map(([product, count]) => ({
        product,
        count,
        pct: totalWithProduct > 0 ? Math.round((count / totalWithProduct) * 100) : 0,
        color: PRODUCT_COLORS[product] ?? '#888',
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLeads: total,
      casosVendidos: vendidos,
      tasaConversion: total > 0 ? Math.round((vendidos / total) * 10000) / 100 : 0,
      citasGeneradas,
      leadsDescartados: descartados,
      pctDescartados: pct(descartados, total),
      creditFail,
      pctCreditFail: pct(creditFail, total),

      monthlyTrend,
      funnelStages,
      sourceConversion,
      statusGroups,
      leaderboard,
      topSalesReps,
      teamConversion,
      productSplit,
      hasProductData,
    };
  }, [data]);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function emptyKPIs(): LeadsKPIs {
  return {
    totalLeads: 0, casosVendidos: 0, tasaConversion: 0, citasGeneradas: 0,
    leadsDescartados: 0, pctDescartados: 0, creditFail: 0, pctCreditFail: 0,
    monthlyTrend: [], funnelStages: [], sourceConversion: [], statusGroups: [],
    leaderboard: [], topSalesReps: [], teamConversion: [], productSplit: [],
    hasProductData: false,
  };
}
