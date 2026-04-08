import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 p-2 rounded-2xl border border-border/60 bg-card shadow-lg focus-within:border-primary/40 focus-within:shadow-xl transition-all duration-200">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask about biotech data..."
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 max-h-32"
          style={{ minHeight: '40px' }}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-all duration-200 disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
        BioQuery AI analyzes biotech industry data. Results are based on sample datasets.
      </p>
    </form>
  );
}