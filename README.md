# WINDMAR | Leads Dashboard

Dashboard de análisis de leads exportados desde Zoho CRM. Construido con React, TypeScript, Recharts y Tailwind CSS.

## Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Recharts** — gráficos
- **date-fns** — manejo de fechas
- **Tailwind CSS v4** — estilos

## KPIs y visualizaciones

- Total Leads, Casos Vendidos, Tasa de Conversión, Citas Generadas, Descartados, Credit Fail
- Línea temporal de leads por mes
- Embudo de conversión por etapas
- Conversión por fuente de lead
- Donut de distribución de status
- Tendencia de conversión mensual (AreaChart)
- Distribución por equipo (horizontal bar)
- Leaderboard de Lead Owners (ordenable)
- Top Sales Reps
- Breakdown por Producto (placeholder hasta que llegue el campo de Zoho)

## Filtros dinámicos

Rango de fechas · Lead Source · Lead Owner · Team Assistance · Lead Status · Producto

## Exportar CSV

Botón en el header — exporta los leads filtrados en ese momento a `.csv` con UTF-8 BOM (compatible con Excel en español).

## Correr localmente

```bash
npm install
npm run dev
```

## Actualizar datos

Los datos viven en `src/data/leadsRaw.json`. Para actualizar desde un nuevo export de Zoho CRM:

1. Reemplaza `Leads_2025-2026.xlsx` en la ruta configurada
2. Ejecuta el script de extracción:
   ```bash
   node extraer-datos.cjs
   ```
3. Recarga el navegador (F5)

## Despliegue en Vercel

```bash
npm run build
```

El proyecto está configurado para desplegar automáticamente en Vercel conectando este repositorio.
