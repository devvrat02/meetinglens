import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Transcript } from '../components/Transcript';
import { Translation } from '../components/Translation';
import { DefinitionPanel } from '../components/DefinitionPanel';
import { LanguageSelector } from '../components/LanguageSelector';
import { StatusIndicator } from '../components/StatusIndicator';
import { createDemoTranscript, detectWordCandidates, fetchDefinition, fetchTranslation } from '../services/api';
import type { DefinitionResult, TranscriptSegment } from '../types';

const DEMO_TEXT = 'We need to optimize the inference pipeline before deployment. The model currently has high latency, so we need to improve the architecture.';

const initialSegments: TranscriptSegment[] = [
  { id: 'demo-1', speaker: 'Speaker 1', text: DEMO_TEXT, timestamp: Date.now(), final: true }
];

export default function App() {
  const [segments, setSegments] = useState<TranscriptSegment[]>(initialSegments);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [selectedWord, setSelectedWord] = useState<string>('inference');
  const [definition, setDefinition] = useState<DefinitionResult | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [status, setStatus] = useState<'Listening' | 'Processing' | 'AI Ready' | 'AI Offline'>('AI Ready');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentText = useMemo(() => segments.map((s) => s.text).join(' '), [segments]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!currentText.trim()) {
        setTranslation('');
        return;
      }

      setIsTranslating(true);
      setErrorMessage('');

      try {
        const result = await fetchTranslation(currentText, selectedLanguage);
        setTranslation(result.translation || result.error || 'Translation unavailable. Check that Ollama is running.');
        if (result.error) {
          setStatus('AI Offline');
          setErrorMessage(result.error);
        }
      } catch {
        setTranslation('Translation unavailable. Check that Ollama is running.');
        setStatus('AI Offline');
        setErrorMessage('Translation unavailable. Check that Ollama is running.');
      } finally {
        setIsTranslating(false);
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [currentText, selectedLanguage]);

  useEffect(() => {
    if (!selectedWord) return;
    setIsLoadingDefinition(true);
    const word = selectedWord.trim();
    if (!word) {
      setIsLoadingDefinition(false);
      return;
    }

    fetchDefinition(word, currentText)
      .then((result) => {
        setDefinition(result);
        setErrorMessage(result.error || '');
        if (result.error) setStatus('AI Offline');
      })
      .catch(() => {
        setDefinition({ word, definition: 'Definition unavailable.', simpleExplanation: 'AI service is offline.', contextMeaning: 'Check that Ollama is running.', error: 'AI service unavailable. Start Ollama and try again.' });
        setStatus('AI Offline');
      })
      .finally(() => setIsLoadingDefinition(false));
  }, [selectedWord, currentText]);

  const handleDemoMode = () => {
    setStatus('Listening');
    setIsListening(true);
    setSegments([{ id: 'demo-1', speaker: 'You', text: DEMO_TEXT, timestamp: Date.now(), final: true }]);
    setSelectedWord('inference');
    setErrorMessage('');
  };

  const handleWordClick = (word: string) => {
    const cleaned = word.replace(/[^a-zA-Z-]/g, '').toLowerCase();
    const candidates = detectWordCandidates(cleaned);
    if (!candidates.includes(cleaned)) return;
    setSelectedWord(cleaned);
  };

  const handleStartListening = () => {
    setStatus('Listening');
    setIsListening(true);
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setErrorMessage('Speech recognition is not available in this browser. Use Demo Mode instead.');
      setStatus('AI Ready');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalText += `${transcript} `;
        } else {
          interimText += `${transcript} `;
        }
      }

      if (finalText.trim()) {
        const text = finalText.trim();
        setSegments((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, speaker: 'You', text, timestamp: Date.now(), final: true }]);
      }

      setStatus(interimText ? 'Listening' : 'AI Ready');
    };

    recognition.onerror = () => {
      setErrorMessage('Speech recognition is unavailable. Demo Mode is ready as a fallback.');
      setStatus('AI Ready');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('AI Ready');
    };

    (window as any).__meetlens_recognition = recognition;
    recognition.start();
  };

  const handleStopListening = () => {
    const recognition = (window as any).__meetlens_recognition;
    if (recognition && typeof recognition.stop === 'function') {
      recognition.stop();
    }
    setIsListening(false);
    setStatus('AI Ready');
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="toolbar-row">
        <div className="status-wrap">
          <StatusIndicator status={status} />
        </div>
        <div className="language-wrap">
          <LanguageSelector value={selectedLanguage} onChange={setSelectedLanguage} />
        </div>
      </div>

      <div className="controls-row">
        <button className="primary" onClick={handleStartListening}>Start Listening</button>
        <button className="secondary" onClick={handleStopListening}>Stop Listening</button>
        <button className="demo" onClick={handleDemoMode}>Demo Mode</button>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      <div className="section-card">
        <h3>Live Transcript</h3>
        <Transcript segments={segments} onWordClick={handleWordClick} />
      </div>

      <div className="section-card">
        <h3>Translation</h3>
        <Translation text={translation} isLoading={isTranslating} />
      </div>

      <div className="section-card">
        <h3>Selected Word</h3>
        <div className="selected-word">{selectedWord}</div>
      </div>

      <div className="section-card">
        <h3>Definition</h3>
        <DefinitionPanel word={selectedWord} definition={definition} loading={isLoadingDefinition} />
      </div>

      <div className="powered-by">Powered by local Qwen3</div>
    </div>
  );
}
