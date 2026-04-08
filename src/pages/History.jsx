import { useState, useEffect } from 'react';
import { getQueryHistory, toggleSaveQuery, deleteQuery } from '@/lib/biotechService';
import { Clock, Search, Bookmark, BookmarkCheck, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function History() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQueryHistory(100);
      setQueries(data);
    } catch (err) {
      console.error('Failed to load query history:', err);
      setError('Failed to load query history. Please try again.');
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (query) => {
    // Optimistic update
    setQueries(prev => prev.map(q => 
      q.id === query.id ? { ...q, is_saved: !q.is_saved } : q
    ));

    try {
      await toggleSaveQuery(query.id, query.is_saved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
      // Revert optimistic update on error
      setQueries(prev => prev.map(q => 
        q.id === query.id ? { ...q, is_saved: query.is_saved } : q
      ));
      alert('Failed to update. Please try again.');
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!confirm('Are you sure you want to delete this query?')) {
      return;
    }

    // Optimistic delete
    const previousQueries = queries;
    setQueries(prev => prev.filter(q => q.id !== id));

    try {
      await deleteQuery(id);
    } catch (err) {
      console.error('Failed to delete query:', err);
      // Revert on error
      setQueries(previousQueries);
      alert('Failed to delete. Please try again.');
    }
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

          {/* ============================================================================
              NEW: Added error state display
             ============================================================================ */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-sm">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={loadQueries}
              >
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No queries found</p>
              <p className="text-xs text-muted-foreground/60">
                {search 
                  ? 'Try a different search term' 
                  : 'Start a conversation to see your history here'
                }
              </p>
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
                          <span className="text-[10px] text-muted-foreground/70">
                            {q.visualization_type.replace('_', ' ')}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground/50">
                          {moment(q.created_date).fromNow()}
                        </span>
                        {/* ============================================================================
                            NEW: Display token usage if available
                           ============================================================================ */}
                        {q.total_tokens > 0 && (
                          <span className="text-[10px] text-muted-foreground/50">
                            {q.total_tokens.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {/* ============================================================================
                          CHANGED: onClick handler
                          OLD: onClick={() => toggleSave(q)}
                          NEW: onClick={() => handleToggleSave(q)}
                         ============================================================================ */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleToggleSave(q)}
                      >
                        {q.is_saved
                          ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                          : <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                      </Button>
                      {/* ============================================================================
                          CHANGED: onClick handler
                          OLD: onClick={() => deleteQuery(q.id)}
                          NEW: onClick={() => handleDeleteQuery(q.id)}
                         ============================================================================ */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => handleDeleteQuery(q.id)}
                      >
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