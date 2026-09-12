import type { DefinitionResult, TranslationResponse } from '../types';

const backendUrl = 'http://localhost:8080';

export function createDemoTranscript() {
  return 'We need to optimize the inference pipeline before deployment. The model currently has high latency, so we need to improve the architecture.';
}

export function detectWordCandidates(word: string) {
  const base = word.toLowerCase().replace(/[^a-z-]/g, '');
  return [
    'inference',
    'pipeline',
    'deployment',
    'latency',
    'architecture',
    'model',
    'optimization',
    'training',
    'prompt',
    'token',
    base
  ].filter(Boolean);
}

export async function fetchTranslation(text: string, targetLanguage: string): Promise<TranslationResponse> {
  if (!text.trim()) {
    return { translation: '' };
  }

  try {
    const response = await fetch(`${backendUrl}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return { error: payload.error || 'Translation unavailable. Check that Ollama is running.' };
    }

    const data = await response.json();
    return { translation: data.translation || 'Translation unavailable. Check that Ollama is running.' };
  } catch {
    return { error: 'Translation unavailable. Check that Ollama is running.' };
  }
}

export async function fetchDefinition(word: string, context: string): Promise<DefinitionResult> {
  const cleanedWord = word.toLowerCase().trim();
  if (!cleanedWord) {
    return {
      word: 'word',
      definition: 'No selected word.',
      simpleExplanation: 'Choose a technical term from the transcript.',
      contextMeaning: 'The meeting content will explain the word in context.'
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/define`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: cleanedWord, context })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return {
        word: cleanedWord,
        definition: 'Definition unavailable.',
        simpleExplanation: 'AI service is offline.',
        contextMeaning: 'Check that Ollama is running.',
        error: payload.error || 'AI service unavailable. Start Ollama and try again.'
      };
    }

    const data = await response.json();
    return {
      word: data.word || cleanedWord,
      definition: data.definition || 'No definition available.',
      simpleExplanation: data.simpleExplanation || 'No simple explanation available.',
      contextMeaning: data.contextMeaning || 'No context summary available.'
    };
  } catch {
    return {
      word: cleanedWord,
      definition: 'Definition unavailable.',
      simpleExplanation: 'AI service is offline.',
      contextMeaning: 'Check that Ollama is running.',
      error: 'AI service unavailable. Start Ollama and try again.'
    };
  }
}
