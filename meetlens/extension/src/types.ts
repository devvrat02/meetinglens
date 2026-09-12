export interface TranscriptSegment {
  id: string;
  speaker?: string;
  text: string;
  timestamp: number;
  final: boolean;
}

export interface TranslationResponse {
  translation?: string;
  error?: string;
}

export interface DefinitionResult {
  word: string;
  definition: string;
  simpleExplanation: string;
  contextMeaning: string;
  error?: string;
}

export interface ApiError {
  error: string;
}
