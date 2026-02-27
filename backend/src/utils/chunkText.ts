export function chunkText(input: string, size = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  const clean = input.trim();

  if (!clean) return chunks;

  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));

    if (end >= clean.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
}