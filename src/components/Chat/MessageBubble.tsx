'use client';

import type { ChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-primary/10 text-primary'
            : 'bg-secondary text-muted-foreground'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-secondary rounded-tl-md'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-0.5 [&_code]:bg-background/30 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-background/30 [&_pre]:p-3 [&_pre]:rounded-lg [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-primary">
            {message.content ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <span className="inline-block w-2 h-4 bg-muted-foreground/50 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
