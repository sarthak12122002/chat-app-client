import { useState, useEffect } from 'react';
import { base44 } from '@/api/client.js';
import { BarChart3, Loader2, Database, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(252, 85%, 60%)', 'hsl(172, 66%, 50%)', 'hsl(45, 93%, 58%)', 'hsl(340, 75%, 55%)', 'hsl(200, 80%, 55%)'];

export default function Analytics() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await base44.entities.ChatQuery.list('-created_date', 200);
      setQueries(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const total = queries.length;
  const completed = queries.filter(q => q.status === 'completed').length;
  const rejected = queries.filter(q => q.status === 'rejected').length;
  const saved = queries.filter(q => q.is_saved).length;

  // Visualization type distribution
  const vizTypes = {};
  queries.forEach(q => {
    if (q.visualization_type) {
      const key = q.visualization_type.replace('_', ' ');
      vizTypes[key] = (vizTypes[key] || 0) + 1;
    }
  });
  const vizData = Object.entries(vizTypes).map(([name, value]) => ({ name, value }));

  // Queries by day (last 7 days)
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    dayMap[key] = 0;
  }
  queries.forEach(q => {
    const d = new Date(q.created_date);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (key in dayMap) dayMap[key]++;
  });
  const dailyData = Object.entries(dayMap).map(([day, count]) => ({ day, count }));

  const stats = [
    { label: 'Total Queries', value: total, icon: MessageSquare, color: 'text-primary' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-accent' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-destructive' },
    { label: 'Saved', value: saved, icon: Database, color: 'text-chart-3' },
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border/40 flex items-center gap-3 px-6 shrink-0 glass">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-semibold text-foreground">Usage Analytics</h1>
      </header>

      <div className="p-6 overflow-y-auto flex-1">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-border/50 bg-card/50 p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/50 bg-card/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Queries This Week</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Visualization Types</h3>
              {vizData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={vizData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {vizData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}