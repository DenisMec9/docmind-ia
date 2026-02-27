import { useState } from "react";
import { sendMessage } from "../services/chat";
import { getErrorMessage } from "../utils/errors";

export function useChat(documentId: string) {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(question: string) {
    setLoading(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    try {
      const data = await sendMessage(documentId, question);
      const response =
        typeof data?.response === "string" && data.response.trim().length > 0
          ? data.response
          : "Nao foi possivel gerar resposta agora.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError(getErrorMessage(err, "Falha ao enviar mensagem."));
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, ask };
}
