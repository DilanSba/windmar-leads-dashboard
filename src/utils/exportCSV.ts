import { LeadRecord } from '../data/leadsData';
import { format } from 'date-fns';

/**
 * Exports currently filtered leads to a CSV file.
 * - UTF-8 with BOM for Excel compatibility (preserves Spanish characters)
 * - Column order and Spanish headers as specified
 * - Empty fields exported as "N/A"
 * - Filename default: windmar_leads_YYYY-MM-DD_HH-mm.csv
 */
export function exportFilteredLeadsToCSV(
  leads: LeadRecord[],
  filename?: string
): void {
  const BOM = '\uFEFF';

  const HEADERS = [
    'Nombre',
    'Agente',
    'Estado',
    'Fuente',
    'Fecha Creación',
    'Fecha Cita',
    'Equipo',
    'Rep de Ventas',
    'ID Deal',
    'Fecha Cierre',
    'Producto',
  ];

  const na = (val: string | undefined | null): string =>
    val && val.trim() !== '' ? val : 'N/A';

  const rows = leads.map(lead => [
    na(lead.leadName),
    na(lead.leadOwner),
    na(lead.leadStatus),
    na(lead.leadSource),
    na(lead.createdTime),
    na(lead.citaDateTime),
    na(lead.teamAssistance),
    na(lead.salesRep),
    na(lead.dealId),
    na(lead.dealClosingDate),
    na(lead.product),
  ]);

  const escapeCell = (val: string): string => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvContent =
    BOM +
    [HEADERS, ...rows]
      .map(row => row.map(escapeCell).join(','))
      .join('\r\n');

  const defaultFilename = `windmar_leads_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  const finalFilename = filename ?? defaultFilename;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
