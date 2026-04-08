import { useState, useEffect } from 'react';
import { base44 } from '@/api/client.js';
import { Bookmark, Loader2, BookmarkX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';

export default function Saved() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    setLoading(true);
    const data = await base44.entities.ChatQuery.filter({ is_saved: true }, '-created_date', 100);
    setQueries(data);
    setLoading(false);
  };

  const unsave = async (id) => {
    await base44.entities.ChatQuery.update(id, { is_saved: false });
    setQueries(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border/40 flex items-center gap-3 px-6 shrink-0 glass">
        <Bookmark className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-semibold text-foreground">Saved Queries</h1>
        <span className="text-xs text-muted-foreground">({queries.length})</span>
      </header>

      <div className="p-6 overflow-y-auto flex-1">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : queries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <BookmarkX className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No saved queries</p>
              <p className="text-xs text-muted-foreground/60">Bookmark queries from history to save them here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queries.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-border/50 bg-card/50 p-4 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{q.question}</p>
                      {q.generated_sql && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{q.generated_sql}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-accent font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10">{q.visualization_type?.replace('_', ' ') || 'text'}</span>
                        <span className="text-[10px] text-muted-foreground/50">{moment(q.created_date).fromNow()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => unsave(q.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}