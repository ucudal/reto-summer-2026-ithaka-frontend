'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './ChatBot.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  apiBaseUrl?: string;
  title?: string;
  placeholderText?: string;
}

interface AgUiEvent {
  type: string;
  [key: string]: any;
}

export default function ChatBot({
  apiBaseUrl = 'http://localhost:8000/api/v1',
  title = 'Ithaka AI Compass',
  placeholderText = '¿Listo para postular tu proyecto o conocer más sobre nuestro centro?',
}: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<{ id: string; content: string } | null>(null);

  const isEmpty = messages.length === 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/conversations/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Failed to initialize conversation');
      const { token: newToken } = await res.json();
      setToken(newToken);

      const wsUrl = `${apiBaseUrl.replace('http', 'ws')}/ws?token=${newToken}`;
      const newWs = new WebSocket(wsUrl);

      newWs.onopen = () => {
        console.log('Connected to chat WS');
        setConnected(true);
      };

      newWs.onmessage = (event) => {
        const agEvent: AgUiEvent = JSON.parse(event.data);
        handleAgUiEvent(agEvent);
      };

      newWs.onclose = () => {
        console.log('WS disconnected');
        setConnected(false);
      };

      newWs.onerror = (error) => {
        console.error('WS error:', error);
      };

      wsRef.current = newWs;
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    initializeConversation();
    return () => wsRef.current?.close();
  }, [initializeConversation]);

  const handleAgUiEvent = (event: AgUiEvent) => {
    switch (event.type) {
      case 'RUN_STARTED':
        setLoading(true);
        break;
      case 'TEXT_MESSAGE_START':
        bufferRef.current = { id: event.messageId, content: '' };
        break;
      case 'TEXT_MESSAGE_CONTENT':
        if (bufferRef.current) {
          bufferRef.current.content += event.delta;
        }
        break;
      case 'TEXT_MESSAGE_END':
        if (bufferRef.current) {
          const msg = bufferRef.current;
          setMessages((prev) => [
            ...prev,
            { id: msg.id, role: 'assistant', content: msg.content, timestamp: new Date() },
          ]);
          bufferRef.current = null;
        }
        break;
      case 'RUN_FINISHED':
        setLoading(false);
        break;
      case 'RUN_ERROR':
        console.error('Chat error:', event.message);
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Disculpa, hubo un error al procesar tu mensaje. Por favor, intentá de nuevo.',
            timestamp: new Date(),
          },
        ]);
        break;
      default:
        console.log('Unhandled event:', event);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading || !wsRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    wsRef.current.send(JSON.stringify({ message: input }));
  };

  return (
    <div className={styles.chatbotContainer}>
      {isEmpty ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitleWrapper}>
            <Image
              src="/logoucu.svg"
              alt="UCU Logo"
              width={120}
              height={50}
              className={styles.emptyStateLogo}
              priority
            />
            <h1 className={styles.emptyStateTitle}>{title}</h1>
          </div>

          <form className={styles.emptyStateInputWrapper} onSubmit={sendMessage}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholderText}
                disabled={loading}
                className={styles.input}
                autoFocus
                aria-label="Mensaje para el chatbot"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={styles.sendButton}
                aria-label="Enviar mensaje"
              >
                {loading ? '...' : '→'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <Image
                src="/logoucu.svg"
                alt="UCU Logo"
                width={80}
                height={32}
                className={styles.headerLogo}
              />
              <h1 className={styles.title}>{title}</h1>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            <div className={styles.messagesWrapper}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${styles[message.role]}`}
                >
                  <div className={styles.messageContent}>
                    <p style={{ margin: 0 }}>{message.content}</p>
                  </div>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              {loading && (
                <div className={`${styles.message} ${styles.assistant}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.loadingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form className={styles.inputContainer} onSubmit={sendMessage}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={loading}
                className={styles.input}
                aria-label="Mensaje para el chatbot"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={styles.sendButton}
                aria-label="Enviar mensaje"
              >
                {loading ? '...' : '→'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
