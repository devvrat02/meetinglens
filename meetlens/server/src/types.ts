export interface TranslateRequest {
  text: string;
  targetLanguage: string;
}

export interface DefineRequest {
  word: string;
  context: string;
}

export interface OllamaResponse {
  model?: string;
  created_at?: string;
  response?: string;
  content?: Array<{ text?: string }>;
  message?: { content?: string };
  error?: string;
}

export interface DefinitionResult {
  word: string;
  definition: string;
  simpleExplanation: string;
  contextMeaning: string;
}
