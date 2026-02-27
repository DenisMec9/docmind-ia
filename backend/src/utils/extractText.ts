import fs from "fs/promises";
import pdfParse from "pdf-parse";

export async function extractTextFromBuffer(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || "";
  }

  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf-8");
  }

  // Fallback para casos em que o browser não envia mimetype corretamente para TXT.
  if (file.originalname.toLowerCase().endsWith(".txt")) {
    return file.buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type. Use PDF or TXT.");
}

export async function readTextFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}