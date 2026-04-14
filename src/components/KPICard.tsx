import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SparkPoint {
  value: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string;
  trend?: number;       // positive = up, negative = down, 0 = flat
  trendLabel?: string;
  sparkline?: SparkPoint[];
  delay?: number;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  trend,
  trendLabel,
  sparkline,
  delay = 0,
}: KPICardProps) {
  const hasTrend = trend !== undefined;

  const TrendIcon =
    !hasTrend ? null :
    trend > 0 ? TrendingUp :
    trend < 0 ? TrendingDown :
    Minus;

  const trendColor =
    !hasTrend ? '' :
    trend > 0 ? 'text-[#00d4aa]' :
    trend < 0 ? 'text-[#ff4757]' :
    'text-gray-400';

  // Mini sparkline SVG
  function renderSparkline() {
    if (!sparkline || sparkline.length < 2) return null;
    const vals = sparkline.map(p => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const w = 80;
    const h = 28;
    const points = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={w} height={h} className="opacity-60">
        <polyline
          points={points}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div
      className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-5 flex flex-col gap-3 hover:border-opacity-60 transition-all duration-300 kpi-card"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: '#2a2d3e',
      }}
    >
      {/* Top row: icon + sparkline */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: accentColor + '22', color: accentColor }}
        >
          {icon}
        </div>
        {renderSparkline()}
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-bold text-white leading-none" style={{ color: accentColor }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Title + trend */}
      <div className="flex items-end justify-between">
        <p className="text-sm text-gray-400 font-medium leading-tight">{title}</p>
        {hasTrend && TrendIcon && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trendLabel ?? `${Math.abs(trend!)}%`}
          </div>
        )}
      </div>
    </div>
  );
}
