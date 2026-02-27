import sanitizeHtml from "sanitize-html";

export function sanitizeInput(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}