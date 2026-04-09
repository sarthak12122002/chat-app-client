import { useState } from 'react';
import { Download, ArrowUpDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function exportToCSV(data, filename = 'bioquery_export') {
  if (!data || data.length === 0) return;
  
  // Flatten nested data for CSV
  const flattenedData = data.map(row => {
    const flattened = {};
    Object.entries(row).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If array of objects, extract first item or join
        if (value.length > 0 && typeof value[0] === 'object') {
          flattened[key] = value.map(item => 
            Object.values(item).join(': ')
          ).join('; ');
        } else {
          flattened[key] = value.join(', ');
        }
      } else if (typeof value === 'object' && value !== null) {
        flattened[key] = JSON.stringify(value);
      } else {
        flattened[key] = value;
      }
    });
    return flattened;
  });

  const headers = Object.keys(flattenedData[0]);
  const csvContent = [
    headers.join(','),
    ...flattenedData.map(row => headers.map(h => {
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

/**
 * Render cell value - handles nested arrays/objects
 */
function CellValue({ value }) {
  // Null/undefined
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  // Boolean
  if (typeof value === 'boolean') {
    return <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? '✓' : '✗'}</span>;
  }

  // Number
  if (typeof value === 'number') {
    return <span>{value.toLocaleString()}</span>;
  }

  // Array of objects (e.g., ClinicalTrialNumber)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground text-xs italic">None</span>;
    }

    // Check if array contains objects with URL fields
    if (typeof value[0] === 'object' && value[0] !== null) {
      // Special handling for clinical trials
      if (value[0].ClinicalTrialNumber && value[0].ClinicalTrialNumberURL) {
        return (
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {value.slice(0, 3).map((item, idx) => (
              <a
                key={idx}
                href={item.ClinicalTrialNumberURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-xs font-mono text-primary transition-colors"
              >
                {item.ClinicalTrialNumber}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
            {value.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 3} more
              </Badge>
            )}
          </div>
        );
      }

      // Generic object array
      return (
        <div className="text-xs text-muted-foreground max-w-xs truncate">
          {value.map((item, idx) => Object.values(item).join(': ')).join(', ')}
        </div>
      );
    }

    // Simple array
    return (
      <div className="text-xs">
        {value.slice(0, 3).join(', ')}
        {value.length > 3 && <span className="text-muted-foreground"> (+{value.length - 3})</span>}
      </div>
    );
  }

  // Object (non-array)
  if (typeof value === 'object') {
    return <span className="text-xs text-muted-foreground font-mono">{JSON.stringify(value)}</span>;
  }

  // String - check for URLs
  const stringValue = String(value);
  if (stringValue.startsWith('http://') || stringValue.startsWith('https://')) {
    return (
      <a
        href={stringValue}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1"
      >
        Link <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  // Long text - truncate
  if (stringValue.length > 100) {
    return (
      <div className="max-w-md">
        <span className="line-clamp-2 text-sm">{stringValue}</span>
      </div>
    );
  }

  // Normal string
  return <span>{stringValue}</span>;
}

export default function DataTable({ data, title }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [expandedRows, setExpandedRows] = useState(new Set());

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
        const av = a[sortKey];
        const bv = b[sortKey];
        
        // Handle nested values for sorting
        const aVal = Array.isArray(av) ? av.length : (typeof av === 'object' ? JSON.stringify(av) : av);
        const bVal = Array.isArray(bv) ? bv.length : (typeof bv === 'object' ? JSON.stringify(bv) : bv);
        
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  const toggleRow = (index) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
                    {h.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((row, i) => (
              <tr 
                key={i} 
                className="hover:bg-muted/20 transition-colors"
                onClick={() => {
                  // Auto-expand if row has arrays
                  const hasArrays = Object.values(row).some(v => Array.isArray(v) && v.length > 0);
                  if (hasArrays) toggleRow(i);
                }}
              >
                {headers.map(h => (
                  <td key={h} className="px-4 py-2.5 text-foreground/90 align-top">
                    <CellValue value={row[h]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-border/30 bg-muted/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {data.length} row{data.length !== 1 ? 's' : ''} returned
        </span>
        <span className="text-xs text-muted-foreground">
          Click rows with arrays to expand
        </span>
      </div>
    </div>
  );
}