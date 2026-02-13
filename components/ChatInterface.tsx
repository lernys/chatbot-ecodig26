'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Mode = 'chat' | 'estudio' | 'reflexion';

const MODES = [
  { key: 'chat' as Mode, label: '💬 Consultas', desc: 'Pregunta sobre el curso' },
  { key: 'estudio' as Mode, label: '📝 Estudio', desc: 'Practica con preguntas' },
  { key: 'reflexion' as Mode, label: '🔍 Reflexión', desc: 'Piensa críticamente' },
];

const QUICK_QUESTIONS: Record<Mode, string[]> = {
  chat: [
    '¿Qué temas cubre el Módulo 1?',
    '¿Cómo se evalúa el curso?',
    '¿Qué son las "pequeñas piezas ligeramente articuladas"?',
    '¿Qué es un EPA/PLE?',
  ],
  estudio: [
    'Quiero practicar sobre conectivismo',
    'Hazme preguntas del Módulo 2',
    'Pregúntame sobre teorías de aprendizaje',
    'Quiero repasar comunidades de práctica',
  ],
  reflexion: [
    '¿Cómo cambia la IA los ecosistemas digitales educativos?',
    'Plantéame un dilema sobre plataformas educativas',
    '¿Qué papel juega el estudiante en el conectivismo?',
    'Dame un caso práctico sobre PLE',
  ],
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <button onClick={handleCopy} className="copy-btn" title="Copiar respuesta">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
      <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
    </button>
  );
}

export default function ChatInterface({ embedded = false }: { embedded?: boolean }) {
  const [mode, setMode] = useState<Mode>('chat');
  const [started, setStarted] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: '/api/chat', body: { mode },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const switchMode = useCallback((m: Mode) => { setMode(m); setMessages([]); setStarted(false); }, [setMessages]);
  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim()) return; if (!started) setStarted(true); handleSubmit(e); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); } };
  const handleQuick = (q: string) => { if (!started) setStarted(true); append({ role: 'user', content: q }); };
  const activeMode = MODES.find(m => m.key === mode)!;

  const placeholders: Record<Mode, string> = {
    chat: 'Pregunta sobre el curso, contenidos, evaluación...',
    estudio: 'Dime qué tema quieres practicar...',
    reflexion: 'Comparte tu reflexión o pide un caso...',
  };

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --teal-50: #f0fdfa; --teal-100: #ccfbf1; --teal-200: #99f6e4;
  --teal-400: #2dd4bf; --teal-500: #14b8a6; --teal-600: #0d9488;
  --teal-700: #0f766e; --teal-800: #115e59; --teal-900: #134e4a;
  --navy: #1b2a3d; --primary: var(--teal-600); --primary-light: var(--teal-50);
  --surface: #fff; --text: #1b2a3d; --text-2: #4b5563; --text-3: #9ca3af; --border: #e5e7eb;
}
body { font-family: 'DM Sans', -apple-system, sans-serif; background: ${embedded ? 'transparent' : 'var(--teal-50)'}; color: var(--text); -webkit-font-smoothing: antialiased; }
.app { width: 100%; max-width: ${embedded ? '100%' : '540px'}; height: ${embedded ? '100vh' : 'min(720px, 94vh)'}; margin: ${embedded ? '0' : '16px auto'}; display: flex; flex-direction: column; background: var(--surface); border-radius: ${embedded ? '0' : '20px'}; box-shadow: ${embedded ? 'none' : '0 4px 24px rgba(0,0,0,.08)'}; overflow: hidden; }
.header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--navy); color: white; flex-shrink: 0; }
.header-logo { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; font-size: 18px; }
.header-logo img { width: 28px; height: 28px; border-radius: 6px; }
.header h1 { font-size: 16px; font-weight: 700; line-height: 1.2; }
.header h1 span { color: var(--teal-400); }
.header small { font-size: 11px; opacity: .7; }
.header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.badge { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,.1); padding: 4px 10px; border-radius: 20px; font-size: 11px; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }
.new-chat-btn { background: rgba(255,255,255,.15); border: none; color: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background .2s; }
.new-chat-btn:hover { background: rgba(255,255,255,.25); }
.tabs { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.tab { flex: 1; padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: none; color: var(--text-3); transition: all .2s; border-bottom: 2px solid transparent; }
.tab.active { color: var(--primary); border-bottom-color: var(--primary); background: var(--primary-light); }
.tab:hover:not(.active) { background: #f9fafb; }
.content { flex: 1; overflow-y: auto; padding: 16px; }
.welcome { text-align: center; padding: 24px 16px; }
.welcome-icon { width: 64px; height: 64px; border-radius: 18px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; border: 2px solid var(--teal-200); }
.welcome h2 { font-size: 18px; margin-bottom: 4px; }
.welcome h2 span { color: var(--primary); }
.welcome p { font-size: 13px; color: var(--text-2); margin-bottom: 20px; line-height: 1.5; }
.quick-grid { display: flex; flex-direction: column; gap: 8px; max-width: 360px; margin: 0 auto; }
.quick-btn { background: var(--primary-light); border: 1px solid var(--teal-200); border-radius: 12px; padding: 10px 14px; font-size: 13px; cursor: pointer; text-align: left; color: var(--text); transition: all .2s; font-family: inherit; }
.quick-btn:hover { background: var(--teal-100); border-color: var(--teal-400); }
.mode-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: var(--primary-light); color: var(--teal-700); margin-bottom: 8px; }
.msg { margin-bottom: 16px; }
.msg-user { display: flex; justify-content: flex-end; }
.msg-user .bubble { background: var(--navy); color: white; border-radius: 16px 16px 4px 16px; padding: 10px 14px; max-width: 85%; font-size: 14px; line-height: 1.5; }
.msg-bot { display: flex; gap: 8px; align-items: flex-start; }
.bot-avatar { width: 28px; height: 28px; border-radius: 8px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; border: 1px solid var(--teal-200); }
.bot-content { flex: 1; min-width: 0; }
.bot-bubble { background: #f9fafb; border: 1px solid var(--border); border-radius: 4px 16px 16px 16px; padding: 10px 14px; font-size: 14px; line-height: 1.6; max-width: 90%; }
.bot-bubble p { margin-bottom: 8px; } .bot-bubble p:last-child { margin-bottom: 0; }
.bot-bubble strong { color: var(--teal-800); }
.bot-bubble ul, .bot-bubble ol { padding-left: 20px; margin-bottom: 8px; }
.bot-bubble li { margin-bottom: 4px; }
.bot-bubble code { background: var(--teal-50); padding: 1px 5px; border-radius: 4px; font-size: 13px; }
.copy-btn { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 3px 8px; border: none; background: none; color: var(--text-3); font-size: 11px; cursor: pointer; border-radius: 6px; font-family: inherit; transition: all .15s; }
.copy-btn:hover { background: #f3f4f6; color: var(--text-2); }
.typing { display: flex; gap: 4px; padding: 12px 14px; }
.typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--teal-400); animation: bounce .6s infinite alternate; }
.typing span:nth-child(2) { animation-delay: .2s; } .typing span:nth-child(3) { animation-delay: .4s; }
@keyframes bounce { to { opacity: .3; transform: translateY(-4px); } }
.input-area { padding: 12px 16px; border-top: 1px solid var(--border); flex-shrink: 0; background: white; }
.input-row { display: flex; gap: 8px; align-items: flex-end; }
.input-row textarea { flex: 1; border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 14px; font-family: inherit; resize: none; outline: none; min-height: 42px; max-height: 120px; line-height: 1.4; transition: border-color .2s; }
.input-row textarea:focus { border-color: var(--primary); }
.send-btn { width: 42px; height: 42px; border-radius: 12px; border: none; background: var(--primary); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; flex-shrink: 0; }
.send-btn:hover { background: var(--teal-700); }
.send-btn:disabled { opacity: .5; cursor: not-allowed; }
.footer { text-align: center; padding: 6px; font-size: 10px; color: var(--text-3); border-top: 1px solid #f3f4f6; flex-shrink: 0; }
      `}</style>

      <div className="app">
        <div className="header">
          <div className="header-logo">🌿</div>
          <div>
            <h1>Eco · ECODIG<span>26A</span></h1>
            <small>Ecosistemas Digitales · Aprende Virtual 2026</small>
          </div>
          <div className="header-right">
            <div className="badge"><div className="badge-dot" /> En línea</div>
            <button className="new-chat-btn" onClick={() => { setMessages([]); setStarted(false); }} title="Nueva conversación">+</button>
          </div>
        </div>

        <div className="tabs">
          {MODES.map(m => (
            <button key={m.key} className={`tab${mode === m.key ? ' active' : ''}`} onClick={() => switchMode(m.key)}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="content">
          {!started ? (
            <div className="welcome">
              <div className="welcome-icon">🌿</div>
              <h2>Eco · <span>ECODIG26A</span></h2>
              <p>{activeMode.desc}. Soy tu asistente para el curso de Ecosistemas Digitales. Te ayudo a entender los contenidos, pero no hago las tareas por ti.</p>
              <div className="quick-grid">
                {QUICK_QUESTIONS[mode].map((q, i) => (
                  <button key={i} className="quick-btn" onClick={() => handleQuick(q)}>{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mode-pill">{activeMode.label}</div>
              {messages.map(m => (
                <div key={m.id} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-bot'}`}>
                  {m.role === 'user' ? (
                    <div className="bubble">{m.content}</div>
                  ) : (
                    <>
                      <div className="bot-avatar">🌿</div>
                      <div className="bot-content">
                        <div className="bot-bubble"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                        <CopyButton text={m.content} />
                      </div>
                    </>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="msg msg-bot">
                  <div className="bot-avatar">🌿</div>
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleFormSubmit} className="input-row">
            <textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholders[mode]} rows={1} />
            <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>

        <div className="footer">Eco puede cometer errores · Verifica la información en el campus</div>
      </div>
    </>
  );
}
