import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = [
  'hsl(252, 85%, 60%)',
  'hsl(172, 66%, 50%)',
  'hsl(45, 93%, 58%)',
  'hsl(340, 75%, 55%)',
  'hsl(200, 80%, 55%)',
  'hsl(290, 60%, 55%)',
  'hsl(15, 80%, 55%)',
  'hsl(130, 50%, 45%)',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-lg border border-border/50">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function ChartRenderer({ type, data, config }) {
  if (!data || data.length === 0) return null;

  const xKey = config?.x_key || Object.keys(data[0])[0];
  const yKey = config?.y_key || Object.keys(data[0])[1];
  const title = config?.title || '';

  const wrapper = (children) => (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5 animate-fade-in">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={320}>
        {children}
      </ResponsiveContainer>
    </div>
  );

  if (type === 'bar_chart') {
    return wrapper(
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => typeof v === 'number' ? v.toLocaleString() : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKey} radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  }

  if (type === 'pie_chart') {
    return wrapper(
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={110}
          innerRadius={55}
          dataKey={yKey}
          nameKey={xKey}
          paddingAngle={3}
          stroke="none"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}
        />
      </PieChart>
    );
  }

  if (type === 'line_chart') {
    return wrapper(
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => typeof v === 'number' ? v.toLocaleString() : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={COLORS[0]}
          strokeWidth={2.5}
          dot={{ r: 4, fill: COLORS[0], strokeWidth: 2, stroke: 'hsl(var(--card))' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    );
  }

  return null;
}