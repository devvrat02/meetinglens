import type { OllamaResponse } from './types.js';

const OLLAMA_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'qwen3:0.6b';

export async function generateWithOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message = payload?.error || 'AI service unavailable. Start Ollama and try again.';
      throw new Error(message.includes('not found') ? `Model ${OLLAMA_MODEL} is not available. Run: ollama pull ${OLLAMA_MODEL}` : message);
    }

    const data = (await response.json()) as OllamaResponse;
    const value =
      data.response ||
      data.message?.content ||
      data.content?.map((entry: { text?: string }) => entry.text ?? '').join('') ||
      '';
    if (!value.trim()) {
      throw new Error('AI returned an empty response.');
    }

    return value.trim();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI service unavailable. Start Ollama and try again.';
    if (message.includes('fetch') || message.includes('ECONNREFUSED') || message.includes('timed out')) {
      throw new Error('AI service unavailable. Start Ollama and try again.');
    }
    throw new Error(message);
  }
}

export { OLLAMA_URL, OLLAMA_MODEL };
