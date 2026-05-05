'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Lane = 'consumer' | 'clinician' | 'counsel';

interface Citation {
  entity_type: 'substance' | 'claim' | 'case' | 'expert';
  entity_id: string;
  display_name: string;
  link: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  confidence?: 'high' | 'medium' | 'low';
}

const SUGGESTED_PROMPTS = [
  'What does Dr. Dahlgren testify about?',
  'Compare PCBs and Dioxin',
  'Who else worked on the Sky Valley case?',
  'What are the certified health effects of TCDD?',
];

export default function AskTheGarden() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lane, setLane] = useState<Lane>('clinician');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide on legacy pages
  const shouldHide = pathname.startsWith('/legacy/');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: trimmedPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedPrompt, lane }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      let assistantText = '';
      let citations: Citation[] = [];
      let confidence: 'high' | 'medium' | 'low' = 'medium';

      // Parse SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');

          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') break;

              try {
                const event = JSON.parse(jsonStr);
                if (event.type === 'text_delta') {
                  assistantText += event.delta;
                } else if (event.type === 'metadata') {
                  citations = event.citations || [];
                  confidence = event.confidence || 'medium';
                } else if (event.type === 'error') {
                  console.error('Stream error:', event.message);
                }
              } catch (e) {
                console.error('Failed to parse event:', jsonStr, e);
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantText,
        citations,
        confidence,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Ask the Garden error:', err);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'An error occurred while processing your question. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (shouldHide) return null;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full border border-[var(--copper-orn-deep)] transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
        style={{
          background: 'linear-gradient(135deg, var(--copper-orn) 0%, var(--paper-warm) 100%)',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          color: 'var(--ink)',
          fontStyle: 'italic',
        }}
      >
        Ask the Garden
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 rounded-xl border border-[var(--paper-line)] bg-[var(--paper)] overflow-hidden flex flex-col"
      style={{
        height: '520px',
        boxShadow: '0 24px 60px -10px rgba(0,0,0,0.18)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[var(--paper-line)]"
        style={{ background: 'var(--paper-warm)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--copper-orn-deep)',
            fontWeight: 700,
          }}
        >
          Ask the Garden
        </span>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-lg font-light text-[var(--ink)] hover:text-[var(--ink-soft)]"
        >
          ✕
        </button>
      </div>

      {/* Messages / Empty State */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--ink-mute)',
                lineHeight: 1.4,
              }}
            >
              Ask about toxicology evidence, cases, or experts in the garden.
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(prompt)}
                  disabled={isLoading}
                  className="block w-full text-left px-3 py-2 rounded-lg border border-[var(--paper-line)] text-sm hover:bg-[var(--paper-warm)] transition-colors disabled:opacity-50"
                  style={{ color: 'var(--ink)' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.role === 'user'
                      ? 'bg-[var(--copper-orn)] text-white'
                      : 'bg-[var(--paper-warm)] text-[var(--ink)]'
                  }`}
                  style={{ lineHeight: 1.5 }}
                >
                  {msg.content}
                </div>

                {/* Citations */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-3 pt-2">
                    {msg.citations.map((cite, cIdx) => {
                      const colorMap = {
                        substance: 'bg-[var(--teal)]',
                        case: 'bg-[var(--crimson)]',
                        expert: 'bg-[var(--copper-orn-deep)]',
                        claim: 'bg-[var(--peach-deep)]',
                      };
                      return (
                        <Link
                          key={cIdx}
                          href={cite.link}
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-80 ${colorMap[cite.entity_type]}`}
                        >
                          {cite.display_name}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Confidence */}
                {msg.role === 'assistant' && msg.confidence && (
                  <div
                    className="text-xs px-3 pt-1"
                    style={{
                      color:
                        msg.confidence === 'high'
                          ? 'var(--teal)'
                          : msg.confidence === 'medium'
                            ? 'var(--peach-deep)'
                            : 'var(--ink-mute)',
                    }}
                  >
                    {msg.confidence === 'high' && 'high · multi-source consensus'}
                    {msg.confidence === 'medium' && 'medium · some uncertainty'}
                    {msg.confidence === 'low' && 'low · sparse grounding'}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-left text-sm text-[var(--ink-mute)] italic">Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Footer: Input + Send */}
      <div className="border-t border-[var(--paper-line)] px-3 py-3 space-y-2">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(input);
              }
            }}
            disabled={isLoading}
            placeholder="Ask something..."
            className="flex-1 px-2 py-2 text-sm border border-[var(--paper-line)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--copper-orn)] resize-none"
            style={{ minHeight: '40px', maxHeight: '80px' }}
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 text-white"
            style={{ background: 'var(--copper-orn)' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
