'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useTotalBalance, useTokenList } from '@/hooks/usePortfolio';
import { useDeFiPositions } from '@/hooks/useDeFiPositions';
import { useApprovals } from '@/hooks/useApprovals';
import MessageBubble from './MessageBubble';
import type { ChatMessage, PortfolioContext } from '@/types';
import { Send, Loader2, Bot, Sparkles } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Analyze my portfolio and suggest improvements',
  'What are the best yield opportunities on BNB Chain right now?',
  'Are any of my token approvals dangerous?',
  'Explain my DeFi positions and their risks',
  'How can I optimize my yield farming strategy?',
  'What DeFi protocols should I consider on BSC?',
];

export default function ChatInterface() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useTotalBalance();
  const { data: tokens } = useTokenList();
  const { data: protocols } = useDeFiPositions();
  const { data: approvals } = useApprovals();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const portfolioContext: PortfolioContext | null =
    isConnected && address
      ? {
          address,
          totalUsdValue: balance?.total_usd_value ?? 0,
          tokens: tokens || [],
          protocols: protocols || [],
          approvals: approvals || [],
        }
      : null;

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          portfolioContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              fullContent += parsed.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: fullContent }
                    : m
                )
              );
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content:
                  'Sorry, I encountered an error. Please make sure the API key is configured and try again.',
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">BNB DeFi AI Advisor</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              {isConnected
                ? 'I can analyze your portfolio, assess risks, and recommend DeFi strategies on BNB Chain. Ask me anything!'
                : 'Connect your wallet for personalized portfolio analysis, or ask me general questions about BNB Chain DeFi.'}
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
              {SUGGESTED_PROMPTS.slice(0, isConnected ? 6 : 2).map(
                (prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-sm p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary inline mr-2" />
                    {prompt}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm pl-12">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? 'Ask about your portfolio, DeFi strategies, or risks...'
                  : 'Ask about BNB Chain DeFi...'
              }
              rows={1}
              className="w-full rounded-xl bg-secondary border border-border px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="rounded-xl bg-primary text-primary-foreground p-3 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI responses are for informational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
