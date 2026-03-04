"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import styles from "./ChatBot.module.css";

const ACCEPTED_DOC_TYPES = ".pdf,.txt,.md,.csv";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

const SUGGESTIONS = [
  "Postular un proyecto",
  "Preguntas frecuentes",
  "Sobre Ithaka",
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64 ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachmentName?: string;
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
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  title = "Ithaka AI Compass",
  placeholderText = "¿Listo para postular tu proyecto o conocer más sobre nuestro centro?",
}: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<{ id: string; content: string } | null>(null);

  const isEmpty = messages.length === 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/conversations/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to initialize conversation");
      const { token: newToken } = await res.json();
      setToken(newToken);

      const wsUrl = `${apiBaseUrl.replace("http", "ws")}/ws?token=${newToken}`;
      const newWs = new WebSocket(wsUrl);

      newWs.onopen = () => {
        console.log("Connected to chat WS");
        setConnected(true);
      };

      newWs.onmessage = (event) => {
        const agEvent: AgUiEvent = JSON.parse(event.data);
        handleAgUiEvent(agEvent);
      };

      newWs.onclose = () => {
        console.log("WS disconnected");
        setConnected(false);
      };

      newWs.onerror = (error) => {
        console.error("WS error:", error);
      };

      wsRef.current = newWs;
    } catch (error) {
      console.error("Error initializing conversation:", error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    initializeConversation();
    return () => wsRef.current?.close();
  }, [initializeConversation]);

  const handleAgUiEvent = (event: AgUiEvent) => {
    switch (event.type) {
      case "RUN_STARTED":
        setLoading(true);
        break;
      case "TEXT_MESSAGE_START":
        bufferRef.current = { id: event.messageId, content: "" };
        break;
      case "TEXT_MESSAGE_CONTENT":
        if (bufferRef.current) {
          bufferRef.current.content += event.delta;
        }
        break;
      case "TEXT_MESSAGE_END":
        if (bufferRef.current) {
          const msg = bufferRef.current;
          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              role: "assistant",
              content: msg.content,
              timestamp: new Date(),
            },
          ]);
          bufferRef.current = null;
        }
        break;
      case "RUN_FINISHED":
        setLoading(false);
        break;
      case "RUN_ERROR":
        console.error("Chat error:", event.message);
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Disculpa, hubo un error al procesar tu mensaje. Por favor, intentá de nuevo.",
            timestamp: new Date(),
          },
        ]);
        break;
      default:
        console.log("Unhandled event:", event);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if ((!text && !selectedFile) || loading || !wsRef.current) return;

    const displayContent = selectedFile
      ? text
        ? `${text} (archivo: ${selectedFile.name})`
        : `[Archivo adjunto: ${selectedFile.name}]`
      : text;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: displayContent,
      timestamp: new Date(),
      attachmentName: selectedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    type MessagePart =
      | { type: "text"; text: string }
      | { type: "file"; filename: string; data: string; media_type: string };
    let payload: { message: string | MessagePart[] };

    if (selectedFile) {
      try {
        if (selectedFile.size > MAX_FILE_BYTES) {
          setMessages((prev) => [
            ...prev,
            {
              id: "err-" + Date.now(),
              role: "assistant",
              content: "El archivo es demasiado grande (máx. 20 MB).",
              timestamp: new Date(),
            },
          ]);
          setLoading(false);
          setSelectedFile(null);
          return;
        }
        const data = await fileToBase64(selectedFile);
        const parts: MessagePart[] = [];
        if (text.trim()) {
          parts.push({ type: "text", text: text.trim() });
        }
        parts.push({
          type: "file",
          filename: selectedFile.name,
          data,
          media_type: selectedFile.type || "application/octet-stream",
        });
        payload = { message: parts };
        setSelectedFile(null);
      } catch (err) {
        console.error("Error reading file:", err);
        setLoading(false);
        return;
      }
    } else {
      payload = { message: text.trim() };
    }

    const msg = payload.message;
    console.log("[AG-UI FRONT] Enviando payload:", {
      keys: Object.keys(payload),
      messageType: typeof msg,
      messageIsArray: Array.isArray(msg),
      messageLength: typeof msg === "string" ? msg.length : msg.length,
      parts: Array.isArray(msg)
        ? msg.map((p) =>
            p.type === "file"
              ? { type: p.type, filename: p.filename, dataLen: p.data?.length }
              : { type: p.type },
          )
        : undefined,
    });
    wsRef.current.send(JSON.stringify(payload));
  };

  const handleSuggestion = (text: string) => {
    if (loading || !wsRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    wsRef.current.send(JSON.stringify({ message: text }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = "";
  };

  return (
    <div className={styles.chatbotContainer}>
      {isEmpty ? (
        <div className={styles.emptyState}>
          <div className={styles.heroSection}>
            <div className={styles.logoBadge}>
              <Image
                src="/logoucu.svg"
                alt="UCU Logo"
                width={48}
                height={48}
                className={styles.emptyStateLogo}
                priority
              />
            </div>
            <h1 className={styles.emptyStateTitle}>{title}</h1>
            <p className={styles.emptyStateSubtitle}>
              Tu asistente inteligente para el centro de innovación UCU.
              Preguntá lo que necesites o postulá tu proyecto.
            </p>
          </div>

          <div className={styles.suggestionsRow}>
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                className={styles.suggestionChip}
                onClick={() => handleSuggestion(text)}
                disabled={loading}
              >
                {text}
              </button>
            ))}
          </div>

          <form
            className={styles.emptyStateInputWrapper}
            onSubmit={sendMessage}
          >
            {selectedFile && (
              <div className={styles.fileChip}>
                <span className={styles.fileChipName}>{selectedFile.name}</span>
                <button
                  type="button"
                  className={styles.fileChipClear}
                  onClick={() => setSelectedFile(null)}
                  aria-label="Quitar archivo"
                >
                  &times;
                </button>
              </div>
            )}
            <div className={styles.inputRow}>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_DOC_TYPES}
                onChange={onFileChange}
                className={styles.fileInputHidden}
                aria-hidden
              />
              <button
                type="button"
                className={styles.attachButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                title="Adjuntar documento (PDF, TXT, MD, CSV)"
                aria-label="Adjuntar documento"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
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
                disabled={loading || (!input.trim() && !selectedFile)}
                className={styles.sendButton}
                aria-label="Enviar mensaje"
              >
                {loading ? (
                  <span className={styles.sendSpinner} />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
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
                    {message.role === "assistant" ? (
                      <div className={styles.markdown}>
                        <Markdown>{message.content}</Markdown>
                      </div>
                    ) : (
                      <p style={{ margin: 0 }}>{message.content}</p>
                    )}
                  </div>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
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
            {selectedFile && (
              <div className={styles.fileChip}>
                <span className={styles.fileChipName}>{selectedFile.name}</span>
                <button
                  type="button"
                  className={styles.fileChipClear}
                  onClick={() => setSelectedFile(null)}
                  aria-label="Quitar archivo"
                >
                  &times;
                </button>
              </div>
            )}
            <div className={styles.inputRow}>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_DOC_TYPES}
                onChange={onFileChange}
                className={styles.fileInputHidden}
                aria-hidden
              />
              <button
                type="button"
                className={styles.attachButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                title="Adjuntar documento (PDF, TXT, MD, CSV)"
                aria-label="Adjuntar documento"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
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
                disabled={loading || (!input.trim() && !selectedFile)}
                className={styles.sendButton}
                aria-label="Enviar mensaje"
              >
                {loading ? (
                  <span className={styles.sendSpinner} />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
