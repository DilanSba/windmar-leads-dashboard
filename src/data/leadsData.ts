/**
 * EXTENSIÓN FUTURA — Producto Vendido
 * Para activar el breakdown por producto:
 * 1. Exportar el campo "Product" desde Zoho CRM junto con los demás campos
 * 2. Actualizar leadsRaw.json con valores: "Solar" | "Roofing" | "Battery" | "Solar+Battery" | "Roofing+Solar"
 * 3. El gráfico ProductBreakdownChart y el filtro de Product se activan automáticamente
 * No se requieren cambios de código adicionales.
 */

import rawData from './leadsRaw.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'Caso Vendido'
  | 'Caso Vendido sin Match'
  | 'Cita Realizada'
  | 'Cita Confirmada'
  | 'Cita Coordinada'
  | 'Cita en Espera'
  | 'Asistencia Coordinada'
  | 'Credit Fail'
  | 'DQ o No le Interesa'
  | 'Junk Lead'
  | 'Lead Frio'
  | 'Lead Nuevo / Cliente Existente'
  | 'Llamar Despues'
  | 'New Lead'
  | 'No Contesta'
  | 'Nuevo Lead'
  | 'Seguimiento Requerido';

export type ProductType =
  | 'Solar'
  | 'Roofing'
  | 'Battery'
  | 'Solar+Battery'
  | 'Roofing+Solar'
  | '';

export interface LeadRecord {
  leadName: string;
  leadOwner: string;
  leadStatus: LeadStatus;
  leadSource: string;
  createdTime: string;       // ISO date string "YYYY-MM-DD"
  citaDateTime: string;      // ISO date string or ''
  teamAssistance: string;
  salesRep: string;
  dealId: string;
  dealClosingDate: string;   // ISO date string or ''
  product: ProductType;
}

// ─── Real constants from data ─────────────────────────────────────────────────

export const LEAD_STATUSES: LeadStatus[] = [
  'Caso Vendido',
  'Caso Vendido sin Match',
  'Cita Realizada',
  'Cita Confirmada',
  'Cita Coordinada',
  'Cita en Espera',
  'Asistencia Coordinada',
  'Credit Fail',
  'DQ o No le Interesa',
  'Junk Lead',
  'Lead Frio',
  'Lead Nuevo / Cliente Existente',
  'Llamar Despues',
  'New Lead',
  'No Contesta',
  'Nuevo Lead',
  'Seguimiento Requerido',
];

export const LEAD_SOURCES = [
  'Google',
  'Facebook',
  'Facebook Website Leads',
  'Digital',
  'Youtube',
  'CDBG Website',
];

export const TEAMS = [
  'Telemercadeo',
  'Consultant Experience',
  'Ventas',
  'Recoordinación',
  'Recoordinación;Telemercadeo',
  'Recoordinación;VASS',
  'Telemercadeo;VASS',
  'Telemercadeo;Ventas',
];

export const LEAD_OWNERS = Array.from(
  new Set((rawData as LeadRecord[]).map(l => l.leadOwner).filter(Boolean))
).sort();

export const SALES_REPS = Array.from(
  new Set((rawData as LeadRecord[]).map(l => l.salesRep).filter(Boolean))
).sort();

// ─── Data export ──────────────────────────────────────────────────────────────

export const RAW_DATA: LeadRecord[] = rawData as LeadRecord[];
