import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function StreamingText({ text, speed = 12, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayedText('');
    setIsComplete(false);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        // Add characters in chunks for natural feel
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        setDisplayedText(text.slice(0, i + chunkSize));
        i += chunkSize;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className={!isComplete ? 'cursor-blink' : ''}>
      <ReactMarkdown
        className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed
          [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>li]:mb-0.5
          [&_strong]:text-foreground [&_strong]:font-semibold
          [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono"
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  );
}