import { useState } from 'react';
import { Download, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

function exportToCSV(data, filename = 'bioquery_export') {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? '';
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export default function DataTable({ data, title }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card/50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">{title || 'Query Results'}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => exportToCSV(data)}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30">
              {headers.map(h => (
                <th
                  key={h}
                  onClick={() => handleSort(h)}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <span className="flex items-center gap-1">
                    {h.replace(/_/g, ' ')}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((row, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                {headers.map(h => (
                  <td key={h} className="px-4 py-2.5 text-foreground/80 whitespace-nowrap">
                    {typeof row[h] === 'number'
                      ? row[h].toLocaleString()
                      : row[h] === true ? '✓' : row[h] === false ? '✗' : (row[h] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-border/30 bg-muted/20">
        <span className="text-xs text-muted-foreground">{data.length} row{data.length !== 1 ? 's' : ''} returned</span>
      </div>
    </div>
  );
}