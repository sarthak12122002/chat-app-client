import { useMemo } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316'];

/**
 * Flatten nested data for charting
 */
function flattenData(data) {
  return data.map(row => {
    const flattened = {};
    Object.entries(row).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For arrays, use count or first value
        if (value.length > 0 && typeof value[0] === 'object') {
          flattened[key] = value.length; // Count of items
          flattened[`${key}_count`] = value.length;
        } else {
          flattened[key] = value.length > 0 ? value[0] : null;
        }
      } else if (typeof value === 'object' && value !== null) {
        flattened[key] = JSON.stringify(value);
      } else {
        flattened[key] = value;
      }
    });
    return flattened;
  });
}

export default function ChartRenderer({ type, data, config }) {
  const chartData = useMemo(() => flattenData(data), [data]);

  if (!chartData || chartData.length === 0) return null;

  const { x_key, y_key, title } = config || {};

  // Auto-detect keys if not provided
  const xKey = x_key || Object.keys(chartData[0])[0];
  const yKey = y_key || Object.keys(chartData[0]).find(k => typeof chartData[0][k] === 'number') || Object.keys(chartData[0])[1];

  const renderChart = () => {
    switch (type) {
      case 'bar_chart':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis dataKey={xKey} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey={yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'pie_chart':
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry[xKey]}: ${entry[yKey]}`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        );

      case 'line_chart':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis dataKey={xKey} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card/50 p-4 animate-fade-in">
      {title && <h3 className="text-sm font-semibold mb-4 text-foreground">{title}</h3>}
      <ResponsiveContainer width="100%" height={320}>
        {renderChart()}
      </ResponsiveContainer>
      <div className="mt-3 text-xs text-muted-foreground text-center">
        {chartData.length} data points • {xKey} vs {yKey}
      </div>
    </div>
  );
}