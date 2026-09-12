import express from 'express';
import cors from 'cors';
import { generateWithOllama } from './ollama.js';
import { definitionPrompt, translationPrompt } from './prompts.js';
import type { DefineRequest, DefinitionResult, TranslateRequest } from './types.js';

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'http://localhost:5173' || origin.startsWith('chrome-extension://')) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  methods: ['GET', 'POST'],
  credentials: false
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body as Partial<TranslateRequest>;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Empty transcript cannot be translated.' });
  }

  if (!targetLanguage || !targetLanguage.trim()) {
    return res.status(400).json({ error: 'Choose a target language.' });
  }

  try {
    const prompt = translationPrompt(text, targetLanguage);
    const translation = await generateWithOllama(prompt);
    return res.json({ translation: translation.trim() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation unavailable. Check that Ollama is running.';
    return res.status(503).json({ error: message });
  }
});

app.post('/api/define', async (req, res) => {
  const { word, context } = req.body as Partial<DefineRequest>;

  if (!word || !word.trim()) {
    return res.status(400).json({ error: 'Provide a word to define.' });
  }

  if (!context || !context.trim()) {
    return res.status(400).json({ error: 'Context is required to define the word.' });
  }

  try {
    const prompt = definitionPrompt(word, context);
    const aiText = await generateWithOllama(prompt);

    try {
      const parsed = JSON.parse(aiText) as Partial<DefinitionResult>;
      const result: DefinitionResult = {
        word: parsed.word || word,
        definition: parsed.definition || 'No concise definition available.',
        simpleExplanation: parsed.simpleExplanation || 'No simple explanation available.',
        contextMeaning: parsed.contextMeaning || 'No meeting context meaning available.'
      };
      return res.json(result);
    } catch {
      return res.status(502).json({ error: 'AI returned an invalid definition response.' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI service unavailable. Start Ollama and try again.';
    return res.status(503).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`MeetLens backend listening on http://localhost:${port}`);
});
