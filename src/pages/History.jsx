import { useState, useEffect } from 'react';
import { base44 } from '@/api/client.js';
import { Clock, Search, Bookmark, BookmarkCheck, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function History() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setLoading(true);
    const data = await base44.entities.ChatQuery.list('-created_date', 100);
    setQueries(data);
    setLoading(false);
  };

  const toggleSave = async (query) => {
    await base44.entities.ChatQuery.update(query.id, { is_saved: !query.is_saved });
    setQueries(prev => prev.map(q => q.id === query.id ? { ...q, is_saved: !q.is_saved } : q));
  };

  const deleteQuery = async (id) => {
    await base44.entities.ChatQuery.delete(id);
    setQueries(prev => prev.filter(q => q.id !== id));
  };

  const filtered = queries.filter(q =>
    q.question?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status) => {
    const styles = {
      completed: 'bg-accent/10 text-accent',
      rejected: 'bg-destructive/10 text-destructive',
      error: 'bg-destructive/10 text-destructive',
      pending: 'bg-muted text-muted-foreground',
    };
    return (
      <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full", styles[status] || styles.pending)}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border/40 flex items-center gap-3 px-6 shrink-0 glass">
        <Clock className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-semibold text-foreground">Query History</h1>
        <span className="text-xs text-muted-foreground">({queries.length})</span>
      </header>

      <div className="p-6 space-y-4 overflow-y-auto flex-1">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries..."
              className="pl-10 bg-card border-border/50"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No queries found</p>
              <p className="text-xs text-muted-foreground/60">Start a conversation to see your history here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-border/50 bg-card/50 p-4 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{q.question}</p>
                      {q.generated_sql && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{q.generated_sql}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {statusBadge(q.status)}
                        {q.visualization_type && (
                          <span className="text-[10px] text-muted-foreground/70">{q.visualization_type.replace('_', ' ')}</span>
                        )}
                        <span className="text-[10px] text-muted-foreground/50">{moment(q.created_date).fromNow()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(q)}>
                        {q.is_saved
                          ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                          : <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteQuery(q.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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