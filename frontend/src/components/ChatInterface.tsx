import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";

export function ChatInterface({ documentId }: { documentId: string }) {
  const { messages, loading, error, ask } = useChat(documentId);
  const [question, setQuestion] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    const value = question;
    setQuestion("");
    await ask(value);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="muted" style={{ textAlign: "center", marginTop: "18%" }}>
            Envie sua primeira pergunta para iniciar a conversa.
          </p>
        )}

        {messages.map((message, idx) => (
          <MessageBubble key={`${message.role}-${idx}`} role={message.role} content={message.content} />
        ))}

        {loading && (
          <div className="bubble bubble-assistant" style={{ maxWidth: 220 }}>
            Docmind IA esta digitando...
          </div>
        )}

        <div ref={endRef} />
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={(e) => void onSubmit(e)} className="chat-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Faca uma pergunta sobre o documento..."
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (question.trim() && !loading) {
                const fakeEvent = { preventDefault: () => undefined } as FormEvent;
                void onSubmit(fakeEvent);
              }
            }
          }}
          style={{ flex: 1, resize: "none", minHeight: 56 }}
        />

        <button type="submit" style={{ width: 124, height: 56 }} disabled={loading || !question.trim()}>
          {loading ? "Enviando" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
