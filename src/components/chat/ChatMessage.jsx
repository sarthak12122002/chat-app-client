import { User, Bot, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StreamingText from './StreamingText';
import SQLBlock from './SQLBlock';
import DataTable from '../visualizations/DataTable';
import ChartRenderer from '../visualizations/ChartRenderer';
import MetricCard from '../visualizations/MetricCard';

export default function ChatMessage({ message, isLatest }) {
  const isUser = message.role === 'user';
  const isRejected = message.status === 'rejected';

  return (
    <div className={cn("animate-fade-in", isUser ? "flex justify-end" : "flex justify-start")}>
      <div className={cn("flex gap-3 max-w-[90%] md:max-w-[85%]", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
          isUser
            ? "bg-primary text-primary-foreground"
            : isRejected
              ? "bg-destructive/10 text-destructive"
              : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
        )}>
          {isUser ? <User className="h-4 w-4" /> : isRejected ? <AlertTriangle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className={cn("space-y-3 flex-1 min-w-0", isUser && "flex flex-col items-end")}>
          {/* Text bubble */}
          {message.content && (
            <div className={cn(
              "rounded-2xl px-4 py-3 max-w-full",
              isUser
                ? "bg-primary text-primary-foreground"
                : isRejected
                  ? "bg-destructive/5 border border-destructive/20 text-foreground"
                  : "bg-card border border-border/50 text-foreground shadow-sm"
            )}>
              {isUser ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : isLatest && !isRejected ? (
                <StreamingText text={message.content} speed={8} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {/* SQL Block */}
          {!isUser && message.sql && <SQLBlock sql={message.sql} />}

          {/* Visualization */}
          {!isUser && message.result_data && message.visualization_type && (
            <div className="w-full max-w-full overflow-hidden">
              {message.visualization_type === 'table' && (
                <DataTable 
                  data={message.result_data} 
                  title={message.chart_config?.title || 'Query Results'} 
                />
              )}
              {(message.visualization_type === 'bar_chart' || 
                message.visualization_type === 'pie_chart' || 
                message.visualization_type === 'line_chart') && (
                <ChartRenderer
                  type={message.visualization_type}
                  data={message.result_data}
                  config={message.chart_config}
                />
              )}
              {message.visualization_type === 'metric' && (
                <MetricCard 
                  data={message.result_data} 
                  title={message.chart_config?.title} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}