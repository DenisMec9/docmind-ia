export interface SessionUser {
  id: string;
  email?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  document_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
