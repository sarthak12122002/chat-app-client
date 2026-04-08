import { Sparkles } from 'lucide-react';
import { getSuggestedQueries } from '../../lib/biotechService';

export default function SuggestedQueries({ onSelect }) {
  const queries = getSuggestedQueries();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Bio-Tech-Query AI</h2>
          <p className="text-sm text-muted-foreground mt-1">Ask questions about biotech companies, clinical trials, drug pipelines, and more</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-2xl mx-auto">
        {queries.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left px-4 py-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
          >
            <p className="text-sm text-foreground/80 group-hover:text-foreground leading-snug">{q}</p>
          </button>
        ))}
      </div>
    </div>
  );
}