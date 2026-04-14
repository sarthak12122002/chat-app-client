import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchSessions, deleteSession } from '@/lib/biotechService';

/**
 * SessionList Component
 * Displays list of conversation sessions in sidebar
 * 
 * Props:
 * @param {boolean} collapsed - Whether sidebar is collapsed
 * @param {string|null} currentSessionId - Currently active session ID
 */
export default function SessionList({ collapsed, currentSessionId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // ───────────────────────────────────────────────────────────────────────────
  // Load sessions on mount
  // WHY: Display conversation history for quick access
  // ───────────────────────────────────────────────────────────────────────────


  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchSessions();

      console.log(data)
      // Sort by most recent first
     if (Array.isArray(data)) {
      setSessions(data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ));
    } else {
      console.error('Invalid sessions response:', data);
      setSessions([]);
    }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Delete session with confirmation
  // WHY: Allow users to clean up old conversations
  // ───────────────────────────────────────────────────────────────────────────
  const handleDelete = async (sessionId, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!confirm('Delete this conversation?')) return;

    setDeletingId(sessionId);
    try {
      const success = await deleteSession(sessionId);
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        
        // If deleting current session, navigate home
        if (sessionId === currentSessionId) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete conversation');
    } finally {
      setDeletingId(null);
    }
  };

  // Don't show anything when collapsed
  if (collapsed) return null;

  return (
    <div className="space-y-1">
      {/* Section header */}
      <div className="px-3 py-1.5">
        <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          Recent Conversations
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-sidebar-foreground/40" />
        </div>
      )}

      {/* Empty state */}
      {!loading && sessions.length === 0 && (
        <div className="px-3 py-2">
          <p className="text-xs text-sidebar-foreground/40 italic">
            No conversations yet
          </p>
        </div>
      )}

      {/* Session list */}
      {!loading && sessions.slice(0, 10).map((session) => {
        const isActive = session.id === currentSessionId;
        const isDeleting = deletingId === session.id;

        return (
          <Link
            key={session.id}
            to={`/?session=${session.id}`}
            className={cn(
              "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            
            {/* Session title (truncated) */}
            <span className="flex-1 truncate text-xs">
              {session.title || 'Untitled conversation'}
            </span>

            {/* Delete button (shows on hover) */}
            <button
              onClick={(e) => handleDelete(session.id, e)}
              disabled={isDeleting}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "h-6 w-6 rounded flex items-center justify-center",
                "hover:bg-destructive/10 hover:text-destructive",
                isDeleting && "opacity-100"
              )}
              title="Delete conversation"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </button>
          </Link>
        );
      })}

      {/* Show "View All" if more than 10 sessions */}
      {sessions.length > 10 && (
        <Link
          to="/history"
          className="block px-3 py-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          View all {sessions.length} conversations →
        </Link>
      )}
    </div>
  );
}