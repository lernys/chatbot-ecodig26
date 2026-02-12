'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const QUICK_CATEGORIES = [
  {
    icon: '📚',
    label: 'Contenido',
    questions: [
      '¿Qué es el conectivismo y por qué es importante?',
      '¿Qué módulos tiene el curso y qué voy a aprender?',
      '¿Qué son las comunidades de práctica?',
    ],
  },
  {
    icon: '✍️',
    label: 'Prácticas',
    questions: [
      'Necesito orientación para mi tarea',
      '¿Qué diferencia hay entre trabajos obligatorios y optativos?',
      '¿Cómo debo participar en los foros?',
    ],
  },
  {
    icon: '📋',
    label: 'Evaluación',
    questions: [
      '¿Cómo se evalúa el curso?',
      '¿Qué pasa si entrego fuera de plazo?',
      '¿Se usa normas APA en las entregas?',
    ],
  },
];

interface ChatInterfaceProps {
  embedMode?: boolean;
}

export default function ChatInterface({ embedMode = false }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (messages.length > 0) setHasStarted(true);
  }, [messages]);

  const handleQuickQuestion = (question: string) => {
    setActiveCategory(null);
    append({ role: 'user', content: question });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <div className={`chat-wrapper ${embedMode ? 'embed-mode' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-avatar">
          <img src="/ecodig-logo.png" alt="ECODIG26A" width="32" height="32" />
        </div>
        <div className="chat-header-info">
          <h1>ECODIG<span className="header-year">26A</span></h1>
          <p>Ecosistemas Digitales · Virtual Educa 2025</p>
        </div>
        <div className="chat-header-badge">
          <span className="badge-dot" />
          En línea
        </div>
      </div>

      {/* Messages or Welcome */}
      {!hasStarted ? (
        <div className="welcome-state">
          <div className="welcome-hero">
            <div className="welcome-icon-ring">
              <div className="welcome-icon">
                <img src="/ecodig-logo.png" alt="ECODIG26A" width="44" height="44" />
              </div>
            </div>
            <h2>Asistente ECODIG<span className="accent-year">26A</span></h2>
            <p className="welcome-subtitle">Tu tutor virtual para el curso de Ecosistemas Digitales en Entornos de Aprendizaje</p>
          </div>

          <div className="welcome-description">
            <p>
              Soy un asistente de inteligencia artificial diseñado para acompañarte durante el curso. 
              Puedo ayudarte a <strong>comprender los conceptos</strong>, <strong>orientarte en las prácticas</strong> y 
              <strong>resolver tus dudas</strong> sobre contenidos, evaluación y plazos.
            </p>
            <p className="welcome-note">
              💡 No hago las tareas por ti, pero te guío para que las resuelvas con confianza.
            </p>
          </div>

          <div className="quick-categories">
            {QUICK_CATEGORIES.map((cat, i) => (
              <div key={cat.label} className="quick-category">
                <button
                  className={`category-btn ${activeCategory === i ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === i ? null : i)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <svg className={`category-chevron ${activeCategory === i ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {activeCategory === i && (
                  <div className="category-questions">
                    {cat.questions.map((q) => (
                      <button
                        key={q}
                        className="quick-question-btn"
                        onClick={() => handleQuickQuestion(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="welcome-hint">
            También puedes escribir directamente tu pregunta abajo ↓
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="msg-avatar bot">
                  <img src="/ecodig-logo.png" alt="" width="22" height="22" />
                </div>
              )}
              {msg.role === 'user' && (
                <div className="msg-avatar user-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <div className={`msg-bubble ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="typing-indicator">
              <div className="msg-avatar bot">
                <img src="/ecodig-logo.png" alt="" width="22" height="22" />
              </div>
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-input-container">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntame sobre el curso, las prácticas o los contenidos..."
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      <div className="chat-footer">
        ECODIG26A · Asistente IA del curso · Las respuestas son orientativas, consulta siempre el campus
      </div>
    </div>
  );
}
