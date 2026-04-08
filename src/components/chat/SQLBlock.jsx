import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SQLBlock({ sql }) {
  const [copied, setCopied] = useState(false);

  if (!sql) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card/50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated SQL</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent" />
              <span className="text-accent">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-xs font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">{sql}</code>
      </pre>
    </div>
  );
}