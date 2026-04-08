import { TrendingUp } from 'lucide-react';

export default function MetricCard({ data, title }) {
  if (!data || data.length === 0) return null;

  const metrics = data.map((item, i) => {
    const keys = Object.keys(item);
    const label = item.label || item.name || item[keys[0]] || `Metric ${i + 1}`;
    const value = item.value ?? item[keys[keys.length - 1]] ?? 0;
    return { label, value };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-card/50 p-5 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground tracking-tight">
            {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
          </p>
        </div>
      ))}
    </div>
  );
}