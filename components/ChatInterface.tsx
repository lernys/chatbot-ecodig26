'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const QUICK_QUESTIONS = [
  '¿Qué módulos tiene el curso?',
  '¿Cómo se evalúa?',
  '¿Qué es el conectivismo?',
  '¿Cómo participo en los foros?',
  'Necesito ayuda con mi tarea',
  '¿Qué son las CoPs?',
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Track when conversation starts
  useEffect(() => {
    if (messages.length > 0) setHasStarted(true);
  }, [messages]);

  const handleQuickQuestion = (question: string) => {
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
        <div className="chat-header-avatar">🌿</div>
        <div className="chat-header-info">
          <h1>Eco · Tutor del curso</h1>
          <p>Ecosistemas Digitales en Entornos de Aprendizaje</p>
        </div>
        <div className="chat-header-status" />
      </div>

      {/* Messages or Welcome */}
      {!hasStarted ? (
        <div className="welcome-state">
          <div className="welcome-icon">🌿</div>
          <h2>¡Hola! Soy Eco 👋</h2>
          <p>
            Tu asistente para el curso de Ecosistemas Digitales. 
            Puedo ayudarte con dudas sobre el contenido, las tareas, 
            los plazos y los criterios de evaluación. ¿En qué te puedo orientar?
          </p>
          <div className="quick-actions">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                className="quick-action-btn"
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="msg-avatar bot">🌿</div>
              )}
              {msg.role === 'user' && (
                <div className="msg-avatar user-avatar">Tú</div>
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
              <div className="msg-avatar bot">🌿</div>
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
            placeholder="Escribe tu pregunta..."
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
        Eco puede cometer errores · Verifica la información en el campus
      </div>
    </div>
  );
}
