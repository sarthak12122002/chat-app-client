import { Bot } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 mt-1 animate-pulse-glow">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-3 flex-1">
        <div className="rounded-2xl px-4 py-4 bg-card border border-border/50 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-muted-foreground">Analyzing your question...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded-full w-1/2 animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="h-3 bg-muted rounded-full w-5/6 animate-pulse" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}