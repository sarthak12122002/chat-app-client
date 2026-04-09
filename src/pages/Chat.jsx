import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { processQuery } from '../lib/biotechService';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import SuggestedQueries from '../components/chat/SuggestedQueries';
import LoadingSkeleton from '../components/chat/LoadingSkeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ───────────────────────────────────────────────────────────────────────────
  // NEW: Session management state
  // WHY: Track conversation history and enable session persistence
  // ───────────────────────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('New Conversation');
  
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // EXISTING: Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [messages, isLoading]);

  // ───────────────────────────────────────────────────────────────────────────
  // NEW: Load existing session from URL parameter
  // WHY: Enables shareable conversation links and page refresh persistence
  // ENDPOINT: GET /api/sessions/:sessionId
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const sid = searchParams.get('session');
    
    if (sid) {
      setSessionId(sid);
      
      // Load existing messages for this session from backend
      fetch(`${API_BASE_URL}/sessions/${sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Session not found');
          return res.json();
        })
        .then((data) => {
          
          const restored = [];
          
          // Rebuild conversation from queries
          data.queries.forEach((q) => {
            // User message
            restored.push({ 
              role: 'user', 
              content: q.question 
            });
            
            // AI response
            restored.push({
              role: 'assistant',
              content: q.response_text,
              sql: q.generated_sql,
              visualization_type: q.visualization_type,
              result_data: q.result_data ? JSON.parse(q.result_data) : null,
              chart_config: q.chart_config ? JSON.parse(q.chart_config) : null,
              status: q.status,
            });
          });
          
          setMessages(restored);
          
          // Set session title from backend or first question
          if (data.session?.title) {
            setSessionTitle(data.session.title);
          } else if (data.queries.length > 0) {
            setSessionTitle(
              data.queries[0].question.slice(0, 50) + 
              (data.queries[0].question.length > 50 ? '...' : '')
            );
          }
        })
        .catch((error) => {
          console.error('Failed to load session:', error);
          // If session load fails, start fresh
          setMessages([]);
          setSessionTitle('New Conversation');
          // Optionally remove invalid session ID from URL
          navigate('/', { replace: true });
        });
    } else {
      // No session ID in URL = new conversation
      setSessionId(null);
      setMessages([]);
      setSessionTitle('New Conversation');
    }
  }, [searchParams, navigate]);

  // ───────────────────────────────────────────────────────────────────────────
  // UPDATED: Handle sending messages with session support
  // CHANGES:
  // 1. Create session on first message via POST /api/sessions
  // 2. Pass conversation history to backend for context
  // 3. Each query is automatically saved by backend
  // ───────────────────────────────────────────────────────────────────────────
  const handleSend = async (question) => {
    // Add user message to UI immediately
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // ─────────────────────────────────────────────────────────────────────
      // NEW: Build conversation history for context-aware responses
      // WHY: Enables follow-up questions like "show me more" or "compare to X"
      // ─────────────────────────────────────────────────────────────────────
      const history = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      // ─────────────────────────────────────────────────────────────────────
      // NEW: Create session on first message
      // WHY: Groups related queries together, enables conversation history
      // ENDPOINT: POST /api/sessions
      // ─────────────────────────────────────────────────────────────────────
      let currentSessionId = sessionId;
      
      if (!currentSessionId) {
        try {
          const sessionResponse = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add auth header if needed
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              title: question.slice(0, 60), // Use first question as title
            }),
          });
          
          if (sessionResponse.ok) {
            const session = await sessionResponse.json();
            // Expected response: { session: { id, title, created_at } }
            
            currentSessionId = session.session.id;
            setSessionId(session.session.id);
            setSessionTitle(
              question.slice(0, 50) + 
              (question.length > 50 ? '...' : '')
            );
            
            // Update URL with session ID (enables refresh/sharing)
            navigate(`/?session=${session.session.id}`, { replace: true });
          } else {
            console.error('Failed to create session:', await sessionResponse.text());
            // Continue without session if creation fails
          }
        } catch (error) {
          console.error('Session creation error:', error);
          // Continue without session
        }
      }

      // ─────────────────────────────────────────────────────────────────────
      // UPDATED: Call backend API with session ID and history
      // ENDPOINT: POST /api/chat/query
      // BACKEND WILL: Save query automatically with session_id
      // ─────────────────────────────────────────────────────────────────────
      const result = await processQuery(question, history, currentSessionId);

      // Create AI response message
      const aiMsg = {
        role: 'assistant',
        content: result.response_text,
        sql: result.generated_sql,
        visualization_type: result.visualization_type,
        result_data: result.result_data,
        chart_config: result.chart_config,
        status: result.status,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Query processing failed:', error);
      setIsLoading(false);
      
      // Show error message to user
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, an error occurred while processing your query. Please try again.',
        status: 'error',
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b border-border/40 flex items-center px-6 shrink-0 glass">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {/* CHANGE: Display session title instead of static "New Conversation" */}
          <span className="text-sm font-medium text-foreground">{sessionTitle}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {messages.filter(m => m.role === 'user').length} queries
        </span>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <SuggestedQueries onSelect={handleSend} />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isLatest={i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
              {isLoading && <LoadingSkeleton />}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border/30 bg-background/80 backdrop-blur-sm px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}