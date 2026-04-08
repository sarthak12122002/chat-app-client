import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/client.js';
import { processQuery } from '../lib/biotechService';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import SuggestedQueries from '../components/chat/SuggestedQueries';
import LoadingSkeleton from '../components/chat/LoadingSkeleton';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (question) => {
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const result = await processQuery(question);

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

    // Save to history
    base44.entities.ChatQuery.create({
      question,
      generated_sql: result.generated_sql || '',
      response_text: result.response_text || '',
      visualization_type: result.visualization_type || '',
      result_data: JSON.stringify(result.result_data || []),
      is_saved: false,
      status: result.status,
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b border-border/40 flex items-center px-6 shrink-0 glass">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-foreground">New Conversation</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{messages.filter(m => m.role === 'user').length} queries</span>
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