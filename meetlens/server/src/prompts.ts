export const translationPrompt = (text: string, targetLanguage: string) => `
You are a professional meeting translator.

Translate the following meeting transcript into the requested language.

Rules:
- Preserve the original meaning.
- Do not add information.
- Keep technical terms understandable.
- Preserve names.
- Do not explain the translation.
- Return only the translated text.

Input language: English
Target language: ${targetLanguage}
Text:
${text}

Return only the translation.
`;

export const definitionPrompt = (word: string, context: string) => `
You are an AI assistant helping someone understand a technical meeting.

Explain the selected word using the meeting context.

Return JSON with:
{
  "word": "...",
  "definition": "...",
  "simpleExplanation": "...",
  "contextMeaning": "..."
}

Rules:
- Give a concise definition.
- Explain it in simple language.
- Use the meeting context.
- If it is a technical term, explain the technical meaning.
- Do not hallucinate unrelated meanings.
- Keep the answer under approximately 100 words.

Word:
${word}

Context:
${context}
`;
