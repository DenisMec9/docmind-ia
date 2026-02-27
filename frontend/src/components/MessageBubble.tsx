import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string | undefined;
}) {
  const isAssistant = role === "assistant";
  const safeContent = typeof content === "string" ? content : "";

  return (
    <div className={`bubble ${isAssistant ? "bubble-assistant" : "bubble-user"}`}>
      <strong style={{ display: "block", marginBottom: 6, fontSize: "0.85rem" }}>
        {isAssistant ? "Docmind IA" : "Voce"}
      </strong>

      {isAssistant ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{safeContent}</ReactMarkdown>
      ) : (
        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{safeContent}</p>
      )}
    </div>
  );
}
